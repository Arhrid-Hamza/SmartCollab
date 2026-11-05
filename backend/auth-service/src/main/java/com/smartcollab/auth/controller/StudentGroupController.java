package com.smartcollab.auth.controller;

import com.smartcollab.auth.dto.CreateGroupRequest;
import com.smartcollab.auth.dto.StudentGroupDto;
import com.smartcollab.auth.model.User;
import com.smartcollab.auth.service.StudentGroupService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/groups")
public class StudentGroupController {

    private final StudentGroupService groupService;

    public StudentGroupController(StudentGroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping
    public ResponseEntity<List<StudentGroupDto>> getAllGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentGroupDto> getGroupById(@PathVariable UUID id) {
        return ResponseEntity.ok(groupService.getGroupById(id));
    }

    @PostMapping
    public ResponseEntity<StudentGroupDto> createGroup(
            @Valid @RequestBody CreateGroupRequest request,
            @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Non authentifié");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(groupService.createGroup(request, currentUser));
    }
}
