package com.smartcollab.auth.controller;

import com.smartcollab.auth.dto.BulkAcademicUpdateRequest;
import com.smartcollab.auth.dto.StudentCreatedResponse;
import com.smartcollab.auth.dto.UserDto;
import com.smartcollab.auth.service.StudentProvisioningService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

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

    /** Modification d'un étudiant (multipart) : nom, prénom, filière, niveau, groupe, campus ; mot de passe et photo optionnels. */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDto> updateStudent(
            @PathVariable UUID id,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "filiere", required = false) String filiere,
            @RequestParam(value = "niveau", required = false) String niveau,
            @RequestParam(value = "groupe", required = false) String groupe,
            @RequestParam(value = "campus", required = false) String campus,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) {
        return ResponseEntity.ok(provisioningService.updateStudent(
                id, lastName, firstName, filiere, niveau, groupe, campus, password, photo));
    }

    /** Modification groupée de la filière, du niveau et/ou du campus d'étudiants sélectionnés. */
    @PutMapping(value = "/bulk", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<UserDto>> updateStudentsAcademic(@RequestBody BulkAcademicUpdateRequest request) {
        return ResponseEntity.ok(provisioningService.updateStudentsAcademic(request.ids(), request.filiere(), request.niveau(), request.campus()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable UUID id) {
        provisioningService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    /** Renvoie les messages d'erreur métier au frontend ({"message": "..."}). */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleStatus(ResponseStatusException ex) {
        String message = ex.getReason() != null ? ex.getReason() : "Erreur lors de la création de l'étudiant.";
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message", message));
    }
}
