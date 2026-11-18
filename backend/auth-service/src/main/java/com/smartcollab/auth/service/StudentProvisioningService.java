package com.smartcollab.auth.service;

import com.smartcollab.auth.dto.StudentCreatedResponse;
import com.smartcollab.auth.dto.UserDto;
import com.smartcollab.auth.model.Campus;
import com.smartcollab.auth.model.Role;
import com.smartcollab.auth.model.User;
import com.smartcollab.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.SecureRandom;
import java.text.Normalizer;
import java.time.Year;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Création d'un compte étudiant par l'administrateur :
 *  - rôle STUDENT automatique
 *  - matricule  C-<année>-<6 chiffres aléatoires>   (ex. C-2026-004817)
 *  - email      prenom.nom@emsi-edu.ma
 *  - mot de passe aléatoire (hashé en BCrypt en base, en clair uniquement dans le dossier .env et dans la réponse)
 *  - photo PNG enregistrée dans uploads/avatars, son lien est stocké dans users.avatar_url
 */
@Service
public class StudentProvisioningService {

    private static final Logger log = LoggerFactory.getLogger(StudentProvisioningService.class);

    private static final String EMAIL_DOMAIN = "@emsi-edu.ma";
    private static final long MAX_PHOTO_BYTES = 2L * 1024 * 1024; // 2 Mo
    private static final byte[] PNG_MAGIC = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A};

    private static final Pattern PERSON_NAME = Pattern.compile("^\\p{L}[\\p{L} '\\-]{0,49}$");
    private static final Pattern FREE_TEXT = Pattern.compile("^[\\p{L}\\p{N}][\\p{L}\\p{N} .,'/()&+\\-_\u00B7]{0,99}$");

    private static final String UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijkmnpqrstuvwxyz";
    private static final String DIGITS = "23456789";
    private static final String SYMBOLS = "!@%*?+_-";
    private static final int PASSWORD_LENGTH = 12;

    private final SecureRandom random = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;
    private final Path avatarDir;
    private final Path credentialsDir;

    public StudentProvisioningService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthService authService,
            @Value("${app.upload-dir:uploads}") String uploadDir,
            @Value("${app.credentials-dir:.env}") String credentialsDir
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
        this.avatarDir = Paths.get(uploadDir, "avatars").toAbsolutePath().normalize();
        this.credentialsDir = Paths.get(credentialsDir).toAbsolutePath().normalize();
    }

    @Transactional
    public StudentCreatedResponse createStudent(
            String lastName,
            String firstName,
            String sexe,
            String campusValue,
            String filiere,
            String niveau,
            String groupe,
            MultipartFile photo
    ) {
        // ---------- Validation ----------
        String last = cleanPersonName(lastName, "Le nom");
        String first = cleanPersonName(firstName, "Le prénom");
        String gender = cleanGender(sexe);
        Campus campus = cleanCampus(campusValue);
        String filiereClean = cleanFreeText(filiere, "La filière");
        String niveauClean = cleanFreeText(niveau, "Le niveau");
        String groupeClean = cleanFreeText(groupe, "Le groupe");
        byte[] photoBytes = readPng(photo);

        // ---------- Valeurs générées ----------
        String email = uniqueEmail(first, last);
        String matricule = uniqueMatricule();
        String rawPassword = generatePassword();

        // ---------- Photo -> dossier uploads/avatars ----------
        String avatarUrl = storeAvatar(photoBytes);
        Path avatarFile = avatarDir.resolve(avatarUrl.substring(avatarUrl.lastIndexOf('/') + 1));

        // ---------- Compte ----------
        User student = new User(
                email,
                passwordEncoder.encode(rawPassword),
                first,
                last,
                Role.STUDENT,
                campus
        );
        student.setSexe(gender);
        student.setMatricule(matricule);
        student.setFiliere(filiereClean);
        student.setNiveau(niveauClean);
        student.setGroupe(groupeClean);
        student.setAvatarUrl(avatarUrl);

        User saved;
        try {
            saved = userRepository.saveAndFlush(student);
        } catch (RuntimeException ex) {
            deleteQuietly(avatarFile); // pas de photo orpheline si l'insertion échoue
            throw ex;
        }

        // ---------- Dossier .env (mot de passe en clair, pour transmission à l'étudiant) ----------
        writeCredentialsFile(matricule, last, first, email, rawPassword);

        log.info("Étudiant créé : {} ({})", email, matricule); // jamais le mot de passe dans les logs
        return new StudentCreatedResponse(authService.toDto(saved), matricule, email, rawPassword, avatarUrl);
    }

    // ------------------------------------------------------------------ validation

    private String cleanPersonName(String value, String label) {
        String v = value == null ? "" : value.trim().replaceAll("\\s+", " ");
        if (v.isEmpty()) {
            throw bad(label + " est requis.");
        }
        if (!PERSON_NAME.matcher(v).matches()) {
            throw bad(label + " contient des caractères non autorisés.");
        }
        return v;
    }

    private String cleanGender(String value) {
        String v = value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
        if (!v.equals("HOMME") && !v.equals("FEMME")) {
            throw bad("Le sexe doit être HOMME ou FEMME.");
        }
        return v;
    }

    private Campus cleanCampus(String value) {
        if (value == null || value.isBlank()) {
            throw bad("Le campus est requis.");
        }
        Campus campus;
        try {
            campus = Campus.fromString(value);
        } catch (IllegalArgumentException ex) {
            throw bad("Campus invalide.");
        }
        if (campus == null || campus == Campus.ALL) {
            throw bad("Campus invalide.");
        }
        return campus;
    }

    private String cleanFreeText(String value, String label) {
        String v = value == null ? "" : value.trim().replaceAll("\\s+", " ");
        if (v.isEmpty()) {
            throw bad(label + " est requis.");
        }
        if (!FREE_TEXT.matcher(v).matches()) {
            throw bad(label + " contient des caractères non autorisés.");
        }
        return v;
    }

    private byte[] readPng(MultipartFile photo) {
        if (photo == null || photo.isEmpty()) {
            throw bad("La photo (PNG) est obligatoire.");
        }
        if (photo.getSize() > MAX_PHOTO_BYTES) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "La photo dépasse 2 Mo.");
        }
        byte[] bytes;
        try {
            bytes = photo.getBytes();
        } catch (IOException ex) {
            throw bad("Impossible de lire la photo.");
        }
        boolean isPng = bytes.length > PNG_MAGIC.length;
        for (int i = 0; isPng && i < PNG_MAGIC.length; i++) {
            if (bytes[i] != PNG_MAGIC[i]) {
                isPng = false;
            }
        }
        if (!isPng) {
            throw bad("La photo doit être au format PNG.");
        }
        try {
            if (ImageIO.read(new ByteArrayInputStream(bytes)) == null) {
                throw bad("Le fichier PNG est invalide.");
            }
        } catch (IOException ex) {
            throw bad("Le fichier PNG est invalide.");
        }
        return bytes;
    }

    private ResponseStatusException bad(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    // ------------------------------------------------------------------ génération

    private String uniqueEmail(String firstName, String lastName) {
        String base = slug(firstName) + "." + slug(lastName);
        String email = base + EMAIL_DOMAIN;
        int suffix = 2;
        while (userRepository.existsByEmail(email)) {
            email = base + suffix + EMAIL_DOMAIN;
            suffix++;
        }
        return email;
    }

    /** "Éléonore" -> "eleonore" ; "El Amrani" -> "elamrani" */
    private String slug(String value) {
        String s = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]", "");
        if (s.isEmpty()) {
            throw bad("Le nom et le prénom doivent contenir des lettres latines pour générer l'adresse email.");
        }
        return s;
    }

    private String uniqueMatricule() {
        String prefix = "C-" + Year.now().getValue() + "-";
        for (int attempt = 0; attempt < 100; attempt++) {
            String candidate = prefix + String.format("%06d", random.nextInt(1_000_000));
            if (!userRepository.existsByMatricule(candidate)) {
                return candidate;
            }
        }
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Impossible de générer un matricule unique.");
    }

    private String generatePassword() {
        String all = UPPER + LOWER + DIGITS + SYMBOLS;
        List<Character> chars = new ArrayList<>();
        chars.add(pick(UPPER));
        chars.add(pick(LOWER));
        chars.add(pick(DIGITS));
        chars.add(pick(SYMBOLS));
        while (chars.size() < PASSWORD_LENGTH) {
            chars.add(pick(all));
        }
        Collections.shuffle(chars, random);
        StringBuilder sb = new StringBuilder();
        chars.forEach(sb::append);
        return sb.toString();
    }

    private char pick(String alphabet) {
        return alphabet.charAt(random.nextInt(alphabet.length()));
    }

    // ------------------------------------------------------------------ fichiers

    /** Enregistre la photo sous un nom aléatoire (jamais le nom envoyé par le client) et renvoie son lien. */
    private String storeAvatar(byte[] bytes) {
        try {
            Files.createDirectories(avatarDir);
            String filename = UUID.randomUUID() + ".png";
            Files.write(avatarDir.resolve(filename), bytes, StandardOpenOption.CREATE_NEW);
            return "/uploads/avatars/" + filename;
        } catch (IOException ex) {
            log.error("Enregistrement de la photo impossible", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Impossible d'enregistrer la photo.");
        }
    }

    private void writeCredentialsFile(String matricule, String lastName, String firstName, String email, String password) {
        try {
            Files.createDirectories(credentialsDir);
            Path file = credentialsDir.resolve(matricule + ".env");
            String content = "MATRICULE=" + matricule + "\n"
                    + "NOM=" + lastName + "\n"
                    + "PRENOM=" + firstName + "\n"
                    + "EMAIL=" + email + "\n"
                    + "PASSWORD=" + password + "\n";
            Files.writeString(file, content, StandardCharsets.UTF_8, StandardOpenOption.CREATE_NEW);
            try {
                Files.setPosixFilePermissions(file, PosixFilePermissions.fromString("rw-------"));
            } catch (UnsupportedOperationException | IOException ignored) {
                // Windows : pas de permissions POSIX
            }
        } catch (IOException ex) {
            // Le compte est déjà créé : on ne bloque pas, le mot de passe est de toute façon renvoyé à l'admin
            log.error("Écriture du fichier .env impossible pour {}", matricule, ex);
        }
    }

    // ------------------------------------------------------------------ suppression

    private static final Pattern AVATAR_FILE = Pattern.compile("^[0-9a-fA-F\\-]{36}\\.png$");
    private static final Pattern SAFE_MATRICULE = Pattern.compile("^[A-Za-z0-9\\-]{3,40}$");

    /**
     * Modifie un étudiant (nom, prénom, filière, niveau, groupe, campus) ; mot de passe et photo sont optionnels.
     * Le matricule et l'email ne changent jamais.
     */
    @Transactional
    public UserDto updateStudent(
            UUID id,
            String lastName,
            String firstName,
            String filiere,
            String niveau,
            String groupe,
            String campusValue,
            String newPassword,
            MultipartFile photo
    ) {
        User student = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant introuvable."));
        if (student.getRole() != Role.STUDENT) {
            throw bad("Seul un compte étudiant peut être modifié ici.");
        }

        // ---------- Validation ----------
        String last = cleanPersonName(lastName, "Le nom");
        String first = cleanPersonName(firstName, "Le prénom");
        String filiereClean = cleanFreeText(filiere, "La filière");
        String niveauClean = cleanFreeText(niveau, "Le niveau");
        String groupeClean = cleanFreeText(groupe, "Le groupe");
        Campus campus = (campusValue == null || campusValue.isBlank()) ? student.getCampus() : cleanCampus(campusValue);

        String rawPassword = newPassword == null ? "" : newPassword.trim();
        if (!rawPassword.isEmpty() && rawPassword.length() < 8) {
            throw bad("Le mot de passe doit contenir au moins 8 caractères.");
        }
        if (rawPassword.length() > 64) {
            throw bad("Le mot de passe est trop long (64 caractères maximum).");
        }

        boolean replacePhoto = photo != null && !photo.isEmpty();
        byte[] photoBytes = replacePhoto ? readPng(photo) : null;
        String oldAvatarUrl = student.getAvatarUrl();
        String newAvatarUrl = replacePhoto ? storeAvatar(photoBytes) : null;

        // ---------- Mise à jour ----------
        student.setLastName(last);
        student.setFirstName(first);
        student.setFiliere(filiereClean);
        student.setNiveau(niveauClean);
        student.setGroupe(groupeClean);
        student.setCampus(campus);
        if (!rawPassword.isEmpty()) {
            student.setPasswordHash(passwordEncoder.encode(rawPassword));
        }
        if (newAvatarUrl != null) {
            student.setAvatarUrl(newAvatarUrl);
        }

        User saved;
        try {
            saved = userRepository.saveAndFlush(student);
        } catch (RuntimeException ex) {
            if (newAvatarUrl != null) {
                deleteQuietly(avatarDir.resolve(newAvatarUrl.substring(newAvatarUrl.lastIndexOf('/') + 1)));
            }
            throw ex;
        }

        // L'ancienne photo n'est supprimée qu'une fois la base à jour
        if (newAvatarUrl != null && oldAvatarUrl != null && oldAvatarUrl.startsWith("/uploads/avatars/")) {
            String oldName = oldAvatarUrl.substring(oldAvatarUrl.lastIndexOf('/') + 1);
            if (AVATAR_FILE.matcher(oldName).matches()) {
                deleteQuietly(avatarDir.resolve(oldName));
            }
        }
        updateCredentialsFile(saved.getMatricule(), last, first, rawPassword.isEmpty() ? null : rawPassword);

        log.info("Étudiant modifié : {} ({})", saved.getEmail(), saved.getMatricule()); // jamais le mot de passe dans les logs
        return authService.toDto(saved);
    }

    /** Garde le fichier .env cohérent (nom, prénom, et mot de passe s'il a été changé). Sans effet si le fichier n'existe pas. */
    private void updateCredentialsFile(String matricule, String lastName, String firstName, String newPassword) {
        if (matricule == null || !SAFE_MATRICULE.matcher(matricule).matches()) {
            return;
        }
        Path file = credentialsDir.resolve(matricule + ".env");
        if (!Files.isRegularFile(file)) {
            return;
        }
        try {
            List<String> lines = new ArrayList<>();
            for (String line : Files.readAllLines(file, StandardCharsets.UTF_8)) {
                if (line.startsWith("NOM=")) {
                    lines.add("NOM=" + lastName);
                } else if (line.startsWith("PRENOM=")) {
                    lines.add("PRENOM=" + firstName);
                } else if (newPassword != null && line.startsWith("PASSWORD=")) {
                    lines.add("PASSWORD=" + newPassword);
                } else {
                    lines.add(line);
                }
            }
            Files.writeString(file, String.join("\n", lines) + "\n", StandardCharsets.UTF_8);
        } catch (IOException ex) {
            log.warn("Mise à jour du fichier .env impossible pour {}", matricule, ex);
        }
    }

    /**
     * Modifie la filière, le niveau et/ou le campus de plusieurs étudiants en une seule opération (tout ou rien).
     * Un champ vide n'est pas modifié ; au moins un des trois doit être renseigné.
     */
    @Transactional
    public List<UserDto> updateStudentsAcademic(List<UUID> ids, String filiere, String niveau, String campusValue) {
        if (ids == null || ids.isEmpty()) {
            throw bad("Sélectionnez au moins un étudiant.");
        }
        if (ids.size() > 500) {
            throw bad("Trop d'étudiants sélectionnés (500 maximum).");
        }
        boolean changeFiliere = filiere != null && !filiere.isBlank();
        boolean changeNiveau = niveau != null && !niveau.isBlank();
        boolean changeCampus = campusValue != null && !campusValue.isBlank();
        if (!changeFiliere && !changeNiveau && !changeCampus) {
            throw bad("Renseignez la filière, le niveau et/ou le campus à appliquer.");
        }
        String filiereClean = changeFiliere ? cleanFreeText(filiere, "La filière") : null;
        String niveauClean = changeNiveau ? cleanFreeText(niveau, "Le niveau") : null;
        Campus campusClean = changeCampus ? cleanCampus(campusValue) : null;

        List<User> users = userRepository.findAllById(new HashSet<>(ids));
        if (users.size() != new HashSet<>(ids).size()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Un ou plusieurs étudiants sont introuvables.");
        }
        for (User user : users) {
            if (user.getRole() != Role.STUDENT) {
                throw bad("Seuls des comptes étudiants peuvent être modifiés ici.");
            }
        }
        for (User user : users) {
            if (filiereClean != null) {
                user.setFiliere(filiereClean);
            }
            if (niveauClean != null) {
                user.setNiveau(niveauClean);
            }
            if (campusClean != null) {
                user.setCampus(campusClean);
            }
        }
        List<User> saved = userRepository.saveAll(users);
        log.info("{} étudiant(s) modifié(s) en groupe (filière={}, niveau={}, campus={})", saved.size(), filiereClean, niveauClean, campusClean);
        return saved.stream().map(authService::toDto).toList();
    }

    /**
     * Supprime un compte étudiant ainsi que sa photo (uploads/avatars) et son fichier d'identifiants (.env/<matricule>.env).
     * Seuls les comptes STUDENT sont concernés : un admin ne peut pas effacer un autre admin ni un professeur par ici.
     */
    @Transactional
    public void deleteStudent(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant introuvable."));
        if (user.getRole() != Role.STUDENT) {
            throw bad("Seul un compte étudiant peut être supprimé ici.");
        }
        String avatarUrl = user.getAvatarUrl();
        String matricule = user.getMatricule();
        String email = user.getEmail();

        userRepository.delete(user);
        userRepository.flush();

        // Fichiers supprimés seulement après la suppression en base
        if (avatarUrl != null && avatarUrl.startsWith("/uploads/avatars/")) {
            String filename = avatarUrl.substring(avatarUrl.lastIndexOf('/') + 1);
            if (AVATAR_FILE.matcher(filename).matches()) { // jamais de chemin fourni par l'extérieur
                deleteQuietly(avatarDir.resolve(filename));
            }
        }
        if (matricule != null && SAFE_MATRICULE.matcher(matricule).matches()) {
            deleteQuietly(credentialsDir.resolve(matricule + ".env"));
        }
        log.info("Étudiant supprimé : {} ({})", email, matricule);
    }

    private void deleteQuietly(Path file) {
        try {
            Files.deleteIfExists(file);
        } catch (IOException ignored) {
            // rien à faire
        }
    }
}
