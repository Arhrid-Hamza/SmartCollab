package com.smartcollab.auth.dto;

/**
 * Réponse renvoyée UNE SEULE FOIS à l'administrateur après la création d'un étudiant.
 * Contient le mot de passe généré en clair (le même que dans le dossier .env) : en base, seul le hash BCrypt est stocké.
 */
public record StudentCreatedResponse(
    UserDto user,
    String matricule,
    String email,
    String password,
    String avatarUrl
) {}
