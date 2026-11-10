package com.smartcollab.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AuthRequest(
    @NotBlank(message = "L'adresse email est requise")
    @Email(message = "Format d'adresse email invalide")
    @Size(max = 100, message = "Email trop long")
    @Pattern(
        regexp = "^[A-Za-z0-9._%+-]+@emsi-edu\\.ma$",
        message = "L'adresse email doit obligatoirement se terminer par @emsi-edu.ma"
    )
    String email,

    @NotBlank(message = "Le mot de passe est requis")
    @Size(max = 128, message = "Mot de passe trop long")
    String password
) {}
