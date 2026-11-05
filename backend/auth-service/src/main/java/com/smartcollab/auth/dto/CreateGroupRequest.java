package com.smartcollab.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateGroupRequest(
    @NotBlank(message = "Group name is required")
    String name,
    String filiere,
    String niveau,
    String membersJson
) {}
