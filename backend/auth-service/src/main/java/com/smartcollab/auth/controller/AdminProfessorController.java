package com.smartcollab.auth.controller;

import com.smartcollab.auth.dto.BulkProfessorUpdateRequest;
import com.smartcollab.auth.dto.ProfessorCreatedResponse;
import com.smartcollab.auth.dto.UserDto;
import com.smartcollab.auth.service.ProfessorProvisioningService;
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

/** /api/v1/admin/professors : création (POST), modification (PUT /{id}), modification groupée (PUT /bulk) et suppression (DELETE /{id}) d'un professeur. */
@RestController
@RequestMapping("/api/v1/admin/professors")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProfessorController {

    private final ProfessorProvisioningService provisioningService;

    public AdminProfessorController(ProfessorProvisioningService provisioningService) {
        this.provisioningService = provisioningService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfessorCreatedResponse> createProfessor(
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "sexe", required = false) String sexe,
            @RequestParam(value = "campus", required = false) String campus,
            @RequestParam(value = "matiere", required = false) String matiere,
            @RequestParam(value = "groupes", required = false) List<String> groupes,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) {
        ProfessorCreatedResponse created = provisioningService.createProfessor(
                lastName, firstName, sexe, campus, matiere, groupes, photo);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /** Modification d'un professeur (multipart) : nom, prénom, matière, groupes, campus ; mot de passe et photo optionnels. */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDto> updateProfessor(
            @PathVariable UUID id,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "matiere", required = false) String matiere,
            @RequestParam(value = "groupes", required = false) List<String> groupes,
            @RequestParam(value = "campus", required = false) String campus,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) {
        return ResponseEntity.ok(provisioningService.updateProfessor(
                id, lastName, firstName, matiere, groupes, campus, password, photo));
    }

    /** Modification groupée de la matière, des groupes et/ou du campus de professeurs sélectionnés. */
    @PutMapping(value = "/bulk", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<UserDto>> updateProfessorsBulk(@RequestBody BulkProfessorUpdateRequest request) {
        return ResponseEntity.ok(provisioningService.updateProfessorsBulk(
                request.ids(), request.matiere(), request.groupes(), request.groupesMode(), request.campus()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfessor(@PathVariable UUID id) {
        provisioningService.deleteProfessor(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleStatus(ResponseStatusException ex) {
        String message = ex.getReason() != null ? ex.getReason() : "Erreur lors de l'opération sur le professeur.";
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message", message));
    }
}
