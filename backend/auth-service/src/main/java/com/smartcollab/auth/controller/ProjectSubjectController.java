package com.smartcollab.auth.controller;

import com.smartcollab.auth.dto.CreateSubjectRequest;
import com.smartcollab.auth.dto.ProjectSubjectDto;
import com.smartcollab.auth.model.ProjectType;
import com.smartcollab.auth.model.Role;
import com.smartcollab.auth.model.User;
import com.smartcollab.auth.service.ProjectSubjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/subjects")
public class ProjectSubjectController {

    private final ProjectSubjectService subjectService;

    public ProjectSubjectController(ProjectSubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectSubjectDto>> getAllSubjects(
            @RequestParam(required = false) ProjectType type,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID professorId) {
        if (professorId != null) {
            return ResponseEntity.ok(subjectService.getSubjectsByProfessor(professorId));
        }
        return ResponseEntity.ok(subjectService.getAllSubjects(type, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectSubjectDto> getSubjectById(@PathVariable UUID id) {
        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectSubjectDto> createSubject(
            @Valid @RequestBody CreateSubjectRequest request,
            @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Non authentifié");
        }
        if (currentUser.getRole() != Role.PROFESSOR && currentUser.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seuls les professeurs peuvent publier des sujets");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(subjectService.createSubject(request, currentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectSubjectDto> updateSubject(
            @PathVariable UUID id,
            @Valid @RequestBody CreateSubjectRequest request,
            @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Non authentifié");
        }
        return ResponseEntity.ok(subjectService.updateSubject(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {
        if (currentUser == null || (currentUser.getRole() != Role.PROFESSOR && currentUser.getRole() != Role.ADMIN)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Action non autorisée");
        }
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }
}
