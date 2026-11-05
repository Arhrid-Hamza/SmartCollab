package com.smartcollab.auth.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateApplicationRequest(
    @NotNull(message = "Subject ID is required")
    UUID subjectId,

    UUID groupId,
    int priorityOrder,
    String motivation
) {}
