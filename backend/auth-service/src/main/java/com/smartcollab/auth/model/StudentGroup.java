package com.smartcollab.auth.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "student_groups")
public class StudentGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 100)
    private String filiere;

    @Column(length = 50)
    private String niveau;

    @Column(name = "leader_id")
    private UUID leaderId;

    @Column(name = "leader_name", length = 150)
    private String leaderName;

    @Column(name = "leader_email", length = 180)
    private String leaderEmail;

    @Column(name = "members_json", columnDefinition = "TEXT")
    private String membersJson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    public StudentGroup() {
    }

    public StudentGroup(String name, String filiere, String niveau, UUID leaderId, String leaderName, String leaderEmail, String membersJson) {
        this.name = name;
        this.filiere = filiere;
        this.niveau = niveau;
        this.leaderId = leaderId;
        this.leaderName = leaderName;
        this.leaderEmail = leaderEmail;
        this.membersJson = membersJson;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public UUID getLeaderId() {
        return leaderId;
    }

    public void setLeaderId(UUID leaderId) {
        this.leaderId = leaderId;
    }

    public String getLeaderName() {
        return leaderName;
    }

    public void setLeaderName(String leaderName) {
        this.leaderName = leaderName;
    }

    public String getLeaderEmail() {
        return leaderEmail;
    }

    public void setLeaderEmail(String leaderEmail) {
        this.leaderEmail = leaderEmail;
    }

    public String getMembersJson() {
        return membersJson;
    }

    public void setMembersJson(String membersJson) {
        this.membersJson = membersJson;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}
