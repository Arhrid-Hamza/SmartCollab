package com.smartcollab.auth.service;

import com.smartcollab.auth.dto.*;
import com.smartcollab.auth.model.Role;
import com.smartcollab.auth.model.User;
import com.smartcollab.auth.repository.UserRepository;
import com.smartcollab.auth.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AuthService {

    private static final String REQUIRED_EMAIL_DOMAIN = "@emsi-edu.ma";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        String cleanEmail = request.email() != null ? request.email().trim().toLowerCase() : "";
        if (!cleanEmail.endsWith(REQUIRED_EMAIL_DOMAIN)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'adresse email doit obligatoirement se terminer par " + REQUIRED_EMAIL_DOMAIN);
        }

        if (userRepository.existsByEmail(cleanEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already registered");
        }

        String matricule = request.matricule() != null && !request.matricule().isBlank() ? request.matricule() : request.studentIdentifier();

        User user = new User(
                cleanEmail,
                passwordEncoder.encode(request.password()),
                request.firstName(),
                request.lastName(),
                request.role(),
                request.campus()
        );
        user.setMatricule(matricule);
        user.setFiliere(request.filiere());
        user.setNiveau(request.niveau());
        user.setGroupe(request.groupe());
        user.setMatiere(request.matiere());
        user.setAvatarUrl(request.avatarUrl());
        user.setBio(request.bio());

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);
        return new AuthResponse(token, toDto(savedUser));
    }

    public AuthResponse login(AuthRequest request) {
        String cleanEmail = request.email() != null ? request.email().trim().toLowerCase() : "";
        if (!cleanEmail.endsWith(REQUIRED_EMAIL_DOMAIN)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'adresse email doit obligatoirement se terminer par " + REQUIRED_EMAIL_DOMAIN);
        }

        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, toDto(user));
    }

    public UserDto createUser(UserManagementRequest request) {
        String cleanEmail = request.email() != null ? request.email().trim().toLowerCase() : "";
        if (!cleanEmail.endsWith(REQUIRED_EMAIL_DOMAIN)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'adresse email doit obligatoirement se terminer par " + REQUIRED_EMAIL_DOMAIN);
        }

        if (userRepository.existsByEmail(cleanEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Un compte avec cette adresse email existe déjà");
        }

        String rawPassword = (request.password() != null && !request.password().isBlank()) ? request.password() : "emsi1234";

        User user = new User(
                cleanEmail,
                passwordEncoder.encode(rawPassword),
                request.firstName().trim(),
                request.lastName().trim(),
                request.role(),
                request.campus()
        );
        user.setMatricule(request.matricule());
        user.setFiliere(request.filiere());
        user.setNiveau(request.niveau());
        user.setGroupe(request.groupe());
        user.setMatiere(request.matiere());
        user.setAvatarUrl(request.avatarUrl());
        user.setBio(request.bio());

        User saved = userRepository.save(user);
        return toDto(saved);
    }

    public UserDto updateUser(UUID id, UserManagementRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé"));

        String cleanEmail = request.email() != null ? request.email().trim().toLowerCase() : "";
        if (!cleanEmail.endsWith(REQUIRED_EMAIL_DOMAIN)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'adresse email doit obligatoirement se terminer par " + REQUIRED_EMAIL_DOMAIN);
        }

        if (!cleanEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(cleanEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cette adresse email est déjà utilisée par un autre compte");
        }

        user.setEmail(cleanEmail);
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setRole(request.role());
        user.setCampus(request.campus());
        user.setMatricule(request.matricule());
        user.setFiliere(request.filiere());
        user.setNiveau(request.niveau());
        user.setGroupe(request.groupe());
        user.setMatiere(request.matiere());
        user.setAvatarUrl(request.avatarUrl());
        user.setBio(request.bio());

        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
        }

        User updated = userRepository.save(user);
        return toDto(updated);
    }

    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé"));
        userRepository.delete(user);
    }

    public List<UserDto> getUsersByRole(Role role) {
        return userRepository.findByRole(role).stream()
                .map(this::toDto)
                .toList();
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public UserDto toDto(User user) {
        List<UserSkillDto> skillDtos = user.getSkills() == null ? List.of() :
                user.getSkills().stream()
                        .map(us -> new UserSkillDto(
                                us.getSkill().getId(),
                                us.getSkill().getName(),
                                us.getSkill().getCategory(),
                                us.getProficiencyLevel(),
                                us.getYearsOfExperience()
                        ))
                        .toList();

        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getCampus(),
                user.getMatricule(),
                user.getFiliere(),
                user.getNiveau(),
                user.getGroupe(),
                user.getMatiere(),
                user.getAvatarUrl(),
                user.getStudentIdentifier(),
                user.getBio(),
                user.getCreatedAt(),
                skillDtos
        );
    }
}
