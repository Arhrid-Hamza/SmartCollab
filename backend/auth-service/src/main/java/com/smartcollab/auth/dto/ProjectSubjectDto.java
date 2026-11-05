package com.smartcollab.auth.dto;

import com.smartcollab.auth.model.ProjectType;
import com.smartcollab.auth.model.SubjectStatus;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ProjectSubjectDto(
    UUID id,
    String title,
    ProjectType type,
    String filiere,
    String niveau,
    String description,
    String objectives,
    String technologies,
    UUID professorId,
    String professorName,
    String professorEmail,
    int maxStudentsPerGroup,
    int maxGroups,
    int assignedGroupsCount,
    SubjectStatus status,
    LocalDate deadline,
    OffsetDateTime createdAt
) {}
