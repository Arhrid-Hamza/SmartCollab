package com.smartcollab.auth.dto;

import com.smartcollab.auth.model.Campus;
import com.smartcollab.auth.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record UserManagementRequest(
    @NotBlank(message = "L'adresse email est requise")
    @Email(message = "Format d'adresse email invalide")
    @Pattern(
        regexp = "^[A-Za-z0-9._%+-]+@emsi-edu\\.ma$",
        message = "L'adresse email doit obligatoirement se terminer par @emsi-edu.ma"
    )
    String email,

    String password,

    @NotBlank(message = "Le prénom est requis")
    String firstName,

    @NotBlank(message = "Le nom est requis")
    String lastName,

    @NotNull(message = "Le rôle est requis")
    Role role,

    String sexe,

    Campus campus,

    String matricule,
    String filiere,
    String niveau,
    String groupe,
    String matiere,
    String avatarUrl,
    String bio
) {}
