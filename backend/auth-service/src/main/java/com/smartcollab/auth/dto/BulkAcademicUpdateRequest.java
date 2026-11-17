package com.smartcollab.auth.dto;

import java.util.List;
import java.util.UUID;

/**
 * Modification groupée du cursus d'étudiants (filière, niveau, campus) :
 * les champs laissés vides ne sont pas modifiés.
 */
public record BulkAcademicUpdateRequest(
        List<UUID> ids,
        String filiere,
        String niveau,
        String campus
) {}
