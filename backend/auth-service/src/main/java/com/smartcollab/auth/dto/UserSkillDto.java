package com.smartcollab.auth.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record UserSkillDto(
    UUID skillId,
    String skillName,
    String category,
    Integer proficiencyLevel,
    BigDecimal yearsOfExperience
) {}
