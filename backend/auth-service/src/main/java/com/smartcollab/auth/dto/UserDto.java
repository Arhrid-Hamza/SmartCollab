package com.smartcollab.auth.dto;

import com.smartcollab.auth.model.Role;
import java.util.List;
import java.util.UUID;

public record UserDto(
    UUID id,
    String email,
    String firstName,
    String lastName,
    Role role,
    String studentIdentifier,
    String filiere,
    String niveau,
    String classeGroup,
    String campus,
    String matricule,
    String academicYear,
    String bio,
    List<UserSkillDto> skills
) {}
