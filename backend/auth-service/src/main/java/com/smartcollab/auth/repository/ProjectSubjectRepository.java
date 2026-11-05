package com.smartcollab.auth.repository;

import com.smartcollab.auth.model.ProjectSubject;
import com.smartcollab.auth.model.ProjectType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectSubjectRepository extends JpaRepository<ProjectSubject, UUID> {
    List<ProjectSubject> findAllByOrderByCreatedAtDesc();
    List<ProjectSubject> findByProfessorIdOrderByCreatedAtDesc(UUID professorId);
    List<ProjectSubject> findByTypeOrderByCreatedAtDesc(ProjectType type);
}
