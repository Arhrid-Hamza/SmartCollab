package com.smartcollab.auth.service;

import com.smartcollab.auth.dto.AuthRequest;
import com.smartcollab.auth.dto.AuthResponse;
import com.smartcollab.auth.dto.RegisterRequest;
import com.smartcollab.auth.dto.UserDto;
import com.smartcollab.auth.dto.UserSkillDto;
import com.smartcollab.auth.model.User;
import com.smartcollab.auth.repository.UserRepository;
import com.smartcollab.auth.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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

        User user = new User(
                cleanEmail,
                passwordEncoder.encode(request.password()),
                request.firstName(),
                request.lastName(),
                request.role(),
                request.campus()
        );
        user.setStudentIdentifier(request.studentIdentifier());
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
                user.getStudentIdentifier(),
                user.getBio(),
                skillDtos
        );
    }
}
