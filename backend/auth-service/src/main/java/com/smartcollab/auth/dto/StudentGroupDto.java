package com.smartcollab.auth.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record StudentGroupDto(
    UUID id,
    String name,
    String filiere,
    String niveau,
    UUID leaderId,
    String leaderName,
    String leaderEmail,
    String membersJson,
    OffsetDateTime createdAt
) {}
