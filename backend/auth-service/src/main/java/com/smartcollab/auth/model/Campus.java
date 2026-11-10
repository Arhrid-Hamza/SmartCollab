package com.smartcollab.auth.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Campus {
    ALL("ALL", "Tous les campus EMSI (Supervision Globale)"),
    ORANGERS("Orangers", "EMSI Les Orangers (Casablanca)"),
    CFC("CFC", "EMSI Casa Finance City (Casablanca)"),
    ROUDANI("Roudani", "EMSI Roudani (Casablanca)"),
    MAARIF("Maârif", "EMSI Maârif (Casablanca)"),
    MOULAY_YOUSSEF("Moulay Youssef", "EMSI Moulay Youssef (Casablanca)");

    private final String code;
    private final String displayName;

    Campus(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static Campus fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        String clean = value.trim().toUpperCase().replace("-", "_").replace(" ", "_");

        for (Campus c : Campus.values()) {
            if (c.name().equalsIgnoreCase(clean) || c.code.equalsIgnoreCase(value.trim())) {
                return c;
            }
        }

        // Fuzzy match for common inputs
        if (clean.equals("ALL") || clean.contains("TOUS") || clean.contains("GLOBAL") || clean.contains("NATIONAL")) return ALL;
        if (clean.contains("ORANGER")) return ORANGERS;
        if (clean.contains("CFC") || clean.contains("FINANCE")) return CFC;
        if (clean.contains("ROUDANI")) return ROUDANI;
        if (clean.contains("MAARIF")) return MAARIF;
        if (clean.contains("YOUSSEF")) return MOULAY_YOUSSEF;

        throw new IllegalArgumentException(
                "Campus EMSI invalide : '" + value + "'. Les campus disponibles sont : ALL, ORANGERS, CFC, ROUDANI, MAARIF, MOULAY_YOUSSEF."
        );
    }
}
