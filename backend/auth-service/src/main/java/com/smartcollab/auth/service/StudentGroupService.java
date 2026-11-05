package com.smartcollab.auth.service;

import com.smartcollab.auth.dto.CreateGroupRequest;
import com.smartcollab.auth.dto.StudentGroupDto;
import com.smartcollab.auth.model.StudentGroup;
import com.smartcollab.auth.model.User;
import com.smartcollab.auth.repository.StudentGroupRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class StudentGroupService {

    private final StudentGroupRepository groupRepository;

    public StudentGroupService(StudentGroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public List<StudentGroupDto> getAllGroups() {
        return groupRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toDto).toList();
    }

    public StudentGroupDto getGroupById(UUID id) {
        StudentGroup group = groupRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Groupe non trouvé"));
        return toDto(group);
    }

    public StudentGroupDto createGroup(CreateGroupRequest request, User leader) {
        StudentGroup group = new StudentGroup();
        group.setName(request.name());
        group.setFiliere(request.filiere() != null ? request.filiere() : leader.getFiliere());
        group.setNiveau(request.niveau() != null ? request.niveau() : leader.getNiveau());
        group.setLeaderId(leader.getId());
        group.setLeaderName(leader.getFirstName() + " " + leader.getLastName());
        group.setLeaderEmail(leader.getEmail());
        group.setMembersJson(request.membersJson());

        StudentGroup saved = groupRepository.save(group);
        return toDto(saved);
    }

    public StudentGroupDto toDto(StudentGroup g) {
        return new StudentGroupDto(
                g.getId(),
                g.getName(),
                g.getFiliere(),
                g.getNiveau(),
                g.getLeaderId(),
                g.getLeaderName(),
                g.getLeaderEmail(),
                g.getMembersJson(),
                g.getCreatedAt()
        );
    }
}
