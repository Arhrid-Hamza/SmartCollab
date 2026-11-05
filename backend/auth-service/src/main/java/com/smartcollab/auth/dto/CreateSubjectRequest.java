package com.smartcollab.auth.dto;

import com.smartcollab.auth.model.ProjectType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CreateSubjectRequest(
    @NotBlank(message = "Title is required")
    String title,

    @NotNull(message = "Project type is required")
    ProjectType type,

    String filiere,
    String niveau,

    @NotBlank(message = "Description is required")
    String description,

    String objectives,
    String technologies,
    int maxStudentsPerGroup,
    int maxGroups,
    LocalDate deadline
) {}
