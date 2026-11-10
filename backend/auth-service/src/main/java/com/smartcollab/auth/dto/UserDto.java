package com.smartcollab.auth.dto;

import com.smartcollab.auth.model.Campus;
import com.smartcollab.auth.model.Role;
import java.util.List;
import java.util.UUID;

public record UserDto(
    UUID id,
    String email,
    String firstName,
    String lastName,
    Role role,
    Campus campus,
    String studentIdentifier,
    String bio,
    List<UserSkillDto> skills
) {}
