package com.smartcollab.auth.dto;

import com.smartcollab.auth.model.Campus;
import com.smartcollab.auth.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "L'adresse email est requise")
    @Email(message = "Format d'adresse email invalide")
    @Pattern(
        regexp = "^[A-Za-z0-9._%+-]+@emsi-edu\\.ma$",
        message = "L'adresse email doit obligatoirement se terminer par @emsi-edu.ma"
    )
    String email,

    @NotBlank(message = "Le mot de passe est requis")
    @Size(min = 4, message = "Le mot de passe doit comporter au moins 4 caractères")
    String password,

    @NotBlank(message = "Le prénom est requis")
    String firstName,

    @NotBlank(message = "Le nom est requis")
    String lastName,

    @NotNull(message = "Le rôle est requis")
    Role role,

    Campus campus,

    String matricule,
    String filiere,
    String niveau,
    String groupe,
    String matiere,
    String avatarUrl,
    String studentIdentifier,
    String bio
) {}
