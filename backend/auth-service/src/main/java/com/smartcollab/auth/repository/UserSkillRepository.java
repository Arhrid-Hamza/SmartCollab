package com.smartcollab.auth.repository;

import com.smartcollab.auth.model.UserSkill;
import com.smartcollab.auth.model.UserSkillId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, UserSkillId> {
    List<UserSkill> findByUserId(UUID userId);
}
