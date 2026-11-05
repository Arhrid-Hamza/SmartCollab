package com.smartcollab.auth.repository;

import com.smartcollab.auth.model.StudentGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentGroupRepository extends JpaRepository<StudentGroup, UUID> {
    List<StudentGroup> findAllByOrderByCreatedAtDesc();
    List<StudentGroup> findByLeaderId(UUID leaderId);
}
