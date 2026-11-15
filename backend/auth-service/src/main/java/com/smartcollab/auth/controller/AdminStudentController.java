package com.smartcollab.auth.controller;

import com.smartcollab.auth.dto.StudentCreatedResponse;
import com.smartcollab.auth.service.StudentProvisioningService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/students")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStudentController {

    private final StudentProvisioningService provisioningService;

    public AdminStudentController(StudentProvisioningService provisioningService) {
        this.provisioningService = provisioningService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StudentCreatedResponse> createStudent(
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "sexe", required = false) String sexe,
            @RequestParam(value = "campus", required = false) String campus,
            @RequestParam(value = "filiere", required = false) String filiere,
            @RequestParam(value = "niveau", required = false) String niveau,
            @RequestParam(value = "groupe", required = false) String groupe,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) {
        StudentCreatedResponse created = provisioningService.createStudent(
                lastName, firstName, sexe, campus, filiere, niveau, groupe, photo);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /** Renvoie les messages d'erreur métier au frontend ({"message": "..."}). */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleStatus(ResponseStatusException ex) {
        String message = ex.getReason() != null ? ex.getReason() : "Erreur lors de la création de l'étudiant.";
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message", message));
    }
}
