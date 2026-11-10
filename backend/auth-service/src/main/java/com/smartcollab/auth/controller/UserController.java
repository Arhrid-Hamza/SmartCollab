package com.smartcollab.auth.controller;

import com.smartcollab.auth.dto.UserDto;
import com.smartcollab.auth.dto.UserManagementRequest;
import com.smartcollab.auth.model.Role;
import com.smartcollab.auth.model.User;
import com.smartcollab.auth.repository.UserRepository;
import com.smartcollab.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;
    private final AuthService authService;

    public UserController(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        User refreshed = userRepository.findById(currentUser.getId())
                .orElse(currentUser);
        return ResponseEntity.ok(authService.toDto(refreshed));
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
        return ResponseEntity.ok(authService.toDto(user));
    }

    @GetMapping("/students")
    public ResponseEntity<List<UserDto>> getStudents() {
        return ResponseEntity.ok(authService.getUsersByRole(Role.STUDENT));
    }

    @GetMapping("/professors")
    public ResponseEntity<List<UserDto>> getProfessors() {
        return ResponseEntity.ok(authService.getUsersByRole(Role.PROFESSOR));
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserManagementRequest request) {
        UserDto created = authService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UserManagementRequest request
    ) {
        UserDto updated = authService.updateUser(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        authService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
