package com.smartcollab.auth.service;

import com.smartcollab.auth.dto.ProfessorCreatedResponse;
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
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Création d'un compte professeur par l'administrateur :
 *  - rôle PROFESSOR automatique
 *  - email    prenom.nom@emsi-edu.ma (numéroté en cas de doublon)
 *  - mot de passe aléatoire (BCrypt en base, en clair uniquement dans .env/prof et dans la réponse)
 *  - matière + PLUSIEURS groupes (table user_groupes)
 *  - photo PNG enregistrée dans le sous-dossier uploads/avatars/prof
 */
@Service
public class ProfessorProvisioningService {

    private static final Logger log = LoggerFactory.getLogger(ProfessorProvisioningService.class);

    private static final String EMAIL_DOMAIN = "@emsi-edu.ma";
    private static final long MAX_PHOTO_BYTES = 2L * 1024 * 1024; // 2 Mo
    private static final byte[] PNG_MAGIC = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A};
    private static final int MAX_GROUPES = 20;
    private static final int MAX_GROUPE_LENGTH = 50;
    private static final Pattern AVATAR_FILE = Pattern.compile("^[0-9a-fA-F\\-]{36}\\.png$");
    private static final Pattern SAFE_LOCAL_PART = Pattern.compile("^[a-z0-9.]{3,120}$");

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

    public ProfessorProvisioningService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthService authService,
            @Value("${app.upload-dir:uploads}") String uploadDir,
            @Value("${app.credentials-dir:.env}") String credentialsDir
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
        this.avatarDir = Paths.get(uploadDir, "avatars", "prof").toAbsolutePath().normalize();
        this.credentialsDir = Paths.get(credentialsDir, "prof").toAbsolutePath().normalize();
    }

    @Transactional
    public ProfessorCreatedResponse createProfessor(
            String lastName,
            String firstName,
            String sexe,
            String campusValue,
            String matiere,
            List<String> groupes,
            MultipartFile photo
    ) {
        // ---------- Validation ----------
        String last = cleanPersonName(lastName, "Le nom");
        String first = cleanPersonName(firstName, "Le prénom");
        String gender = cleanGender(sexe);
        Campus campus = cleanCampus(campusValue);
        String matiereClean = cleanFreeText(matiere, "La matière");
        Set<String> groupesClean = cleanGroupes(groupes);
        byte[] photoBytes = readPng(photo);

        // ---------- Valeurs générées ----------
        String email = uniqueEmail(first, last);
        String rawPassword = generatePassword();

        // ---------- Photo -> uploads/avatars/prof ----------
        String filename = storeAvatar(photoBytes);
        Path avatarFile = avatarDir.resolve(filename);
        String avatarUrl = "/uploads/avatars/prof/" + filename;

        // ---------- Compte ----------
        User professor = new User(
                email,
                passwordEncoder.encode(rawPassword),
                first,
                last,
                Role.PROFESSOR,
                campus
        );
        professor.setSexe(gender);
        professor.setMatiere(matiereClean);
        professor.setGroupes(groupesClean);
        professor.setAvatarUrl(avatarUrl);

        User saved;
        try {
            saved = userRepository.saveAndFlush(professor);
        } catch (RuntimeException ex) {
            deleteQuietly(avatarFile); // pas de photo orpheline si l'insertion échoue
            throw ex;
        }

        // ---------- Dossier .env/prof (mot de passe en clair, pour transmission au professeur) ----------
        writeCredentialsFile(last, first, email, rawPassword);

        log.info("Professeur créé : {} ({} groupe(s))", email, groupesClean.size()); // jamais le mot de passe dans les logs
        return new ProfessorCreatedResponse(authService.toDto(saved), email, rawPassword, avatarUrl);
    }


    // ------------------------------------------------------------------ modification / suppression

    /**
     * Modifie un professeur (nom, prénom, matière, groupes, campus) ; mot de passe et photo sont optionnels.
     * L'email ne change jamais.
     */
    @Transactional
    public UserDto updateProfessor(
            UUID id,
            String lastName,
            String firstName,
            String matiere,
            List<String> groupes,
            String campusValue,
            String newPassword,
            MultipartFile photo
    ) {
        User professor = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professeur introuvable."));
        if (professor.getRole() != Role.PROFESSOR) {
            throw bad("Seul un compte professeur peut être modifié ici.");
        }

        String last = cleanPersonName(lastName, "Le nom");
        String first = cleanPersonName(firstName, "Le prénom");
        String matiereClean = cleanFreeText(matiere, "La matière");
        Set<String> groupesClean = cleanGroupes(groupes);
        Campus campus = (campusValue == null || campusValue.isBlank()) ? professor.getCampus() : cleanCampus(campusValue);

        String rawPassword = newPassword == null ? "" : newPassword.trim();
        if (!rawPassword.isEmpty() && rawPassword.length() < 8) {
            throw bad("Le mot de passe doit contenir au moins 8 caractères.");
        }
        if (rawPassword.length() > 64) {
            throw bad("Le mot de passe est trop long (64 caractères maximum).");
        }

        boolean replacePhoto = photo != null && !photo.isEmpty();
        byte[] photoBytes = replacePhoto ? readPng(photo) : null;
        String oldAvatarUrl = professor.getAvatarUrl();
        String newAvatarUrl = replacePhoto ? "/uploads/avatars/prof/" + storeAvatar(photoBytes) : null;

        professor.setLastName(last);
        professor.setFirstName(first);
        professor.setMatiere(matiereClean);
        professor.setGroupes(groupesClean);
        professor.setCampus(campus);
        if (!rawPassword.isEmpty()) {
            professor.setPasswordHash(passwordEncoder.encode(rawPassword));
        }
        if (newAvatarUrl != null) {
            professor.setAvatarUrl(newAvatarUrl);
        }

        User saved;
        try {
            saved = userRepository.saveAndFlush(professor);
        } catch (RuntimeException ex) {
            if (newAvatarUrl != null) {
                deleteQuietly(avatarDir.resolve(newAvatarUrl.substring(newAvatarUrl.lastIndexOf('/') + 1)));
            }
            throw ex;
        }

        // L'ancienne photo n'est supprimée qu'une fois la base à jour
        deleteAvatarFile(newAvatarUrl != null ? oldAvatarUrl : null);
        updateCredentialsFile(saved.getEmail(), last, first, rawPassword.isEmpty() ? null : rawPassword);

        log.info("Professeur modifié : {}", saved.getEmail()); // jamais le mot de passe dans les logs
        return authService.toDto(saved);
    }

    /**
     * Modifie la matière, les groupes et/ou le campus de plusieurs professeurs en une seule opération (tout ou rien).
     * Un champ vide n'est pas modifié ; au moins un des trois doit être renseigné.
     */
    @Transactional
    public List<UserDto> updateProfessorsBulk(List<UUID> ids, String matiere, List<String> groupes, String groupesMode, String campusValue) {
        if (ids == null || ids.isEmpty()) {
            throw bad("Sélectionnez au moins un professeur.");
        }
        if (ids.size() > 500) {
            throw bad("Trop de professeurs sélectionnés (500 maximum).");
        }
        boolean changeMatiere = matiere != null && !matiere.isBlank();
        boolean changeGroupes = groupes != null && groupes.stream().anyMatch(g -> g != null && !g.isBlank());
        boolean changeCampus = campusValue != null && !campusValue.isBlank();
        if (!changeMatiere && !changeGroupes && !changeCampus) {
            throw bad("Renseignez la matière, les groupes et/ou le campus à appliquer.");
        }
        String matiereClean = changeMatiere ? cleanFreeText(matiere, "La matière") : null;
        Set<String> groupesClean = changeGroupes ? cleanGroupes(groupes) : null;
        Campus campusClean = changeCampus ? cleanCampus(campusValue) : null;
        boolean addMode = groupesMode != null && groupesMode.trim().equalsIgnoreCase("ADD");

        List<User> users = userRepository.findAllById(new HashSet<>(ids));
        if (users.size() != new HashSet<>(ids).size()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Un ou plusieurs professeurs sont introuvables.");
        }
        for (User user : users) {
            if (user.getRole() != Role.PROFESSOR) {
                throw bad("Seuls des comptes professeurs peuvent être modifiés ici.");
            }
        }
        for (User user : users) {
            if (matiereClean != null) {
                user.setMatiere(matiereClean);
            }
            if (groupesClean != null) {
                if (addMode) {
                    LinkedHashMap<String, String> merged = new LinkedHashMap<>();
                    for (String g : user.getGroupes()) {
                        merged.putIfAbsent(g.toLowerCase(Locale.ROOT), g);
                    }
                    for (String g : groupesClean) {
                        merged.putIfAbsent(g.toLowerCase(Locale.ROOT), g);
                    }
                    if (merged.size() > MAX_GROUPES) {
                        throw bad("Maximum " + MAX_GROUPES + " groupes par professeur (" + user.getFirstName() + " " + user.getLastName() + ").");
                    }
                    user.setGroupes(new LinkedHashSet<>(merged.values()));
                } else {
                    user.setGroupes(new LinkedHashSet<>(groupesClean));
                }
            }
            if (campusClean != null) {
                user.setCampus(campusClean);
            }
        }
        List<User> saved = userRepository.saveAll(users);
        log.info("{} professeur(s) modifié(s) en groupe (matière={}, groupes={}, campus={})",
                saved.size(), matiereClean, groupesClean == null ? null : (addMode ? "ajout" : "remplacement"), campusClean);
        return saved.stream().map(authService::toDto).toList();
    }

    /** Supprime un compte professeur ainsi que sa photo (uploads/avatars/prof) et son fichier d'identifiants (.env/prof). */
    @Transactional
    public void deleteProfessor(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professeur introuvable."));
        if (user.getRole() != Role.PROFESSOR) {
            throw bad("Seul un compte professeur peut être supprimé ici.");
        }
        String avatarUrl = user.getAvatarUrl();
        String email = user.getEmail();

        userRepository.delete(user);
        userRepository.flush();

        deleteAvatarFile(avatarUrl);
        String localPart = email.substring(0, email.indexOf('@'));
        if (SAFE_LOCAL_PART.matcher(localPart).matches()) {
            deleteQuietly(credentialsDir.resolve(localPart + ".env"));
        }
        log.info("Professeur supprimé : {}", email);
    }

    /** Supprime le fichier photo d'après son URL (jamais de chemin fourni par l'extérieur). */
    private void deleteAvatarFile(String avatarUrl) {
        if (avatarUrl == null || !avatarUrl.startsWith("/uploads/avatars/prof/")) {
            return;
        }
        String filename = avatarUrl.substring(avatarUrl.lastIndexOf('/') + 1);
        if (AVATAR_FILE.matcher(filename).matches()) {
            deleteQuietly(avatarDir.resolve(filename));
        }
    }

    /** Garde le fichier .env/prof cohérent (nom, prénom, et mot de passe s'il a été changé). Sans effet si le fichier n'existe pas. */
    private void updateCredentialsFile(String email, String lastName, String firstName, String newPassword) {
        String localPart = email.substring(0, email.indexOf('@'));
        if (!SAFE_LOCAL_PART.matcher(localPart).matches()) {
            return;
        }
        Path file = credentialsDir.resolve(localPart + ".env");
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
            log.warn("Mise à jour du fichier .env/prof impossible pour {}", email, ex);
        }
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

    /** Un professeur peut avoir plusieurs groupes : on accepte une liste (et aussi "G1, G2" séparés par des virgules). */
    private Set<String> cleanGroupes(List<String> raw) {
        LinkedHashMap<String, String> unique = new LinkedHashMap<>();
        if (raw != null) {
            for (String item : raw) {
                if (item == null) {
                    continue;
                }
                for (String part : item.split(",")) {
                    if (part.isBlank()) {
                        continue;
                    }
                    String g = cleanFreeText(part, "Le groupe");
                    if (g.length() > MAX_GROUPE_LENGTH) {
                        throw bad("Un nom de groupe ne doit pas dépasser " + MAX_GROUPE_LENGTH + " caractères.");
                    }
                    unique.putIfAbsent(g.toLowerCase(Locale.ROOT), g); // pas de doublon (majuscules/minuscules ignorées)
                }
            }
        }
        if (unique.isEmpty()) {
            throw bad("Ajoutez au moins un groupe.");
        }
        if (unique.size() > MAX_GROUPES) {
            throw bad("Maximum " + MAX_GROUPES + " groupes par professeur.");
        }
        return new LinkedHashSet<>(unique.values());
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

    /** Enregistre la photo sous un nom aléatoire (jamais le nom envoyé par le client) et renvoie ce nom de fichier. */
    private String storeAvatar(byte[] bytes) {
        try {
            Files.createDirectories(avatarDir);
            String filename = UUID.randomUUID() + ".png";
            Files.write(avatarDir.resolve(filename), bytes, StandardOpenOption.CREATE_NEW);
            return filename;
        } catch (IOException ex) {
            log.error("Enregistrement de la photo impossible", ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Impossible d'enregistrer la photo.");
        }
    }

    private void writeCredentialsFile(String lastName, String firstName, String email, String password) {
        try {
            Files.createDirectories(credentialsDir);
            String localPart = email.substring(0, email.indexOf('@')); // prenom.nom : sans risque pour un nom de fichier
            Path file = credentialsDir.resolve(localPart + ".env");
            String content = "NOM=" + lastName + "\n"
                    + "PRENOM=" + firstName + "\n"
                    + "EMAIL=" + email + "\n"
                    + "PASSWORD=" + password + "\n";
            Files.writeString(file, content, StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.WRITE);
            try {
                Files.setPosixFilePermissions(file, PosixFilePermissions.fromString("rw-------"));
            } catch (UnsupportedOperationException | IOException ignored) {
                // Windows : pas de permissions POSIX
            }
        } catch (IOException ex) {
            // Le compte est déjà créé : on ne bloque pas, le mot de passe est de toute façon renvoyé à l'admin
            log.error("Écriture du fichier .env/prof impossible pour {}", email, ex);
        }
    }

    private void deleteQuietly(Path file) {
        try {
            Files.deleteIfExists(file);
        } catch (IOException ignored) {
            // rien à faire
        }
    }
}
