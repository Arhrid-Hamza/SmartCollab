package com.smartcollab.auth.dto;

import java.util.UUID;

public record SkillDto(
    UUID id,
    String name,
    String category,
    String description
) {}
