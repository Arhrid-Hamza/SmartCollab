package com.smartcollab.auth.dto;

import com.smartcollab.auth.model.Campus;
import com.smartcollab.auth.model.Role;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record UserDto(
    UUID id,
    String email,
    String firstName,
    String lastName,
    Role role,
    String sexe,
    Campus campus,
    String matricule,
    String filiere,
    String niveau,
    String groupe,
    String matiere,
    String avatarUrl,
    String studentIdentifier,
    String bio,
    OffsetDateTime createdAt,
    List<UserSkillDto> skills
) {}
