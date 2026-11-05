package com.smartcollab.auth.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "subject_applications")
public class SubjectApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "subject_id", nullable = false)
    private UUID subjectId;

    @Column(name = "subject_title", nullable = false, length = 200)
    private String subjectTitle;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "student_email", nullable = false, length = 180)
    private String studentEmail;

    @Column(name = "group_id")
    private UUID groupId;

    @Column(name = "group_name", length = 150)
    private String groupName;

    @Column(name = "priority_order")
    private int priorityOrder = 1;

    @Column(columnDefinition = "TEXT")
    private String motivation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationStatus status = ApplicationStatus.EN_ATTENTE;

    @Column(name = "professor_feedback", columnDefinition = "TEXT")
    private String professorFeedback;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private OffsetDateTime submittedAt;

    @Column(name = "reviewed_at")
    private OffsetDateTime reviewedAt;

    public SubjectApplication() {
    }

    public SubjectApplication(UUID subjectId, String subjectTitle, UUID studentId, String studentName,
                              String studentEmail, UUID groupId, String groupName, int priorityOrder, String motivation) {
        this.subjectId = subjectId;
        this.subjectTitle = subjectTitle;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.groupId = groupId;
        this.groupName = groupName;
        this.priorityOrder = priorityOrder;
        this.motivation = motivation;
        this.status = ApplicationStatus.EN_ATTENTE;
    }

    @PrePersist
    protected void onCreate() {
        this.submittedAt = OffsetDateTime.now();
        if (this.status == null) {
            this.status = ApplicationStatus.EN_ATTENTE;
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(UUID subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectTitle() {
        return subjectTitle;
    }

    public void setSubjectTitle(String subjectTitle) {
        this.subjectTitle = subjectTitle;
    }

    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public UUID getGroupId() {
        return groupId;
    }

    public void setGroupId(UUID groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public int getPriorityOrder() {
        return priorityOrder;
    }

    public void setPriorityOrder(int priorityOrder) {
        this.priorityOrder = priorityOrder;
    }

    public String getMotivation() {
        return motivation;
    }

    public void setMotivation(String motivation) {
        this.motivation = motivation;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getProfessorFeedback() {
        return professorFeedback;
    }

    public void setProfessorFeedback(String professorFeedback) {
        this.professorFeedback = professorFeedback;
    }

    public OffsetDateTime getSubmittedAt() {
        return submittedAt;
    }

    public OffsetDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(OffsetDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
}
