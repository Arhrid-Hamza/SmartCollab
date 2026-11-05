package com.smartcollab.auth.dto;

import com.smartcollab.auth.model.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateApplicationStatusRequest(
    @NotNull(message = "Status is required")
    ApplicationStatus status,
    String feedback
) {}
