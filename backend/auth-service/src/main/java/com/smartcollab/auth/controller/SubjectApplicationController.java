package com.smartcollab.auth.controller;

import com.smartcollab.auth.dto.CreateApplicationRequest;
import com.smartcollab.auth.dto.SubjectApplicationDto;
import com.smartcollab.auth.dto.UpdateApplicationStatusRequest;
import com.smartcollab.auth.model.Role;
import com.smartcollab.auth.model.User;
import com.smartcollab.auth.service.SubjectApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
public class SubjectApplicationController {

    private final SubjectApplicationService applicationService;

    public SubjectApplicationController(SubjectApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public ResponseEntity<List<SubjectApplicationDto>> getApplications(
            @RequestParam(required = false) UUID studentId,
            @RequestParam(required = false) UUID subjectId,
            @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Non authentifié");
        }
        if (subjectId != null) {
            return ResponseEntity.ok(applicationService.getApplicationsBySubject(subjectId));
        }
        if (studentId != null) {
            return ResponseEntity.ok(applicationService.getApplicationsByStudent(studentId));
        }
        if (currentUser.getRole() == Role.STUDENT) {
            return ResponseEntity.ok(applicationService.getApplicationsByStudent(currentUser.getId()));
        }
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @PostMapping
    public ResponseEntity<SubjectApplicationDto> submitApplication(
            @Valid @RequestBody CreateApplicationRequest request,
            @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Non authentifié");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.submitApplication(request, currentUser));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SubjectApplicationDto> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateApplicationStatusRequest request,
            @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Non authentifié");
        }
        if (currentUser.getRole() != Role.PROFESSOR && currentUser.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seuls les professeurs peuvent valider une candidature");
        }
        return ResponseEntity.ok(applicationService.updateStatus(id, request, currentUser));
    }
}
