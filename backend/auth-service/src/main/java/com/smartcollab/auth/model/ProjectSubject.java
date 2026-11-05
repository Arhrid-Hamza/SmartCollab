package com.smartcollab.auth.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "project_subjects")
public class ProjectSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProjectType type;

    @Column(length = 100)
    private String filiere;

    @Column(length = 50)
    private String niveau;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String objectives;

    @Column(name = "technologies", length = 300)
    private String technologies;

    @Column(name = "professor_id")
    private UUID professorId;

    @Column(name = "professor_name", length = 150)
    private String professorName;

    @Column(name = "professor_email", length = 180)
    private String professorEmail;

    @Column(name = "max_students_per_group")
    private int maxStudentsPerGroup = 1;

    @Column(name = "max_groups")
    private int maxGroups = 1;

    @Column(name = "assigned_groups_count")
    private int assignedGroupsCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SubjectStatus status = SubjectStatus.OUVERT;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public ProjectSubject() {
    }

    public ProjectSubject(String title, ProjectType type, String filiere, String niveau, String description,
                          String technologies, UUID professorId, String professorName, String professorEmail,
                          int maxStudentsPerGroup, LocalDate deadline) {
        this.title = title;
        this.type = type;
        this.filiere = filiere;
        this.niveau = niveau;
        this.description = description;
        this.technologies = technologies;
        this.professorId = professorId;
        this.professorName = professorName;
        this.professorEmail = professorEmail;
        this.maxStudentsPerGroup = maxStudentsPerGroup;
        this.deadline = deadline;
        this.status = SubjectStatus.OUVERT;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
        if (this.status == null) {
            this.status = SubjectStatus.OUVERT;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ProjectType getType() {
        return type;
    }

    public void setType(ProjectType type) {
        this.type = type;
    }

    public String getFiliere() {
        return filiere;
    }

    public void setFiliere(String filiere) {
        this.filiere = filiere;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getObjectives() {
        return objectives;
    }

    public void setObjectives(String objectives) {
        this.objectives = objectives;
    }

    public String getTechnologies() {
        return technologies;
    }

    public void setTechnologies(String technologies) {
        this.technologies = technologies;
    }

    public UUID getProfessorId() {
        return professorId;
    }

    public void setProfessorId(UUID professorId) {
        this.professorId = professorId;
    }

    public String getProfessorName() {
        return professorName;
    }

    public void setProfessorName(String professorName) {
        this.professorName = professorName;
    }

    public String getProfessorEmail() {
        return professorEmail;
    }

    public void setProfessorEmail(String professorEmail) {
        this.professorEmail = professorEmail;
    }

    public int getMaxStudentsPerGroup() {
        return maxStudentsPerGroup;
    }

    public void setMaxStudentsPerGroup(int maxStudentsPerGroup) {
        this.maxStudentsPerGroup = maxStudentsPerGroup;
    }

    public int getMaxGroups() {
        return maxGroups;
    }

    public void setMaxGroups(int maxGroups) {
        this.maxGroups = maxGroups;
    }

    public int getAssignedGroupsCount() {
        return assignedGroupsCount;
    }

    public void setAssignedGroupsCount(int assignedGroupsCount) {
        this.assignedGroupsCount = assignedGroupsCount;
    }

    public SubjectStatus getStatus() {
        return status;
    }

    public void setStatus(SubjectStatus status) {
        this.status = status;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}
