package com.smartcollab.auth.dto;

import java.util.List;
import java.util.UUID;

/**
 * Modification groupée de professeurs (matière, groupes, campus) :
 * les champs laissés vides ne sont pas modifiés.
 * groupesMode : "REPLACE" (par défaut, remplace les groupes actuels) ou "ADD" (ajoute aux groupes actuels).
 */
public record BulkProfessorUpdateRequest(
        List<UUID> ids,
        String matiere,
        List<String> groupes,
        String groupesMode,
        String campus
) {}
