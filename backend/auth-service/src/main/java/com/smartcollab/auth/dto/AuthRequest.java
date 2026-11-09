package com.smartcollab.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AuthRequest(
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email is too long")
    @Pattern(regexp = "^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+$", message = "Email contains invalid characters")
    String email,

    @NotBlank(message = "Password is required")
    @Size(max = 128, message = "Password is too long")
    String password
) {}
