package com.smartcollab.auth.repository;

import com.smartcollab.auth.model.SubjectApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubjectApplicationRepository extends JpaRepository<SubjectApplication, UUID> {
    List<SubjectApplication> findAllByOrderBySubmittedAtDesc();
    List<SubjectApplication> findByStudentIdOrderBySubmittedAtDesc(UUID studentId);
    List<SubjectApplication> findBySubjectIdOrderBySubmittedAtDesc(UUID subjectId);
    boolean existsBySubjectIdAndStudentId(UUID subjectId, UUID studentId);
}
