package com.smartcollab.auth.dto;

/**
 * Réponse renvoyée UNE SEULE FOIS à l'administrateur après la création d'un professeur.
 * Le mot de passe est en clair ici (et dans .env/prof) ; en base, seul le hash BCrypt est stocké.
 */
public record ProfessorCreatedResponse(
    UserDto user,
    String email,
    String password,
    String avatarUrl
) {}
