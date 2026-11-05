package com.smartcollab.auth.dto;

import com.smartcollab.auth.model.ApplicationStatus;
import java.time.OffsetDateTime;
import java.util.UUID;

public record SubjectApplicationDto(
    UUID id,
    UUID subjectId,
    String subjectTitle,
    UUID studentId,
    String studentName,
    String studentEmail,
    UUID groupId,
    String groupName,
    int priorityOrder,
    String motivation,
    ApplicationStatus status,
    String professorFeedback,
    OffsetDateTime submittedAt,
    OffsetDateTime reviewedAt
) {}
