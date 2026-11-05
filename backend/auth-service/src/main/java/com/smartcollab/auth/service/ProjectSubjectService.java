package com.smartcollab.auth.service;

import com.smartcollab.auth.dto.CreateSubjectRequest;
import com.smartcollab.auth.dto.ProjectSubjectDto;
import com.smartcollab.auth.model.ProjectSubject;
import com.smartcollab.auth.model.ProjectType;
import com.smartcollab.auth.model.SubjectStatus;
import com.smartcollab.auth.model.User;
import com.smartcollab.auth.repository.ProjectSubjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectSubjectService {

    private final ProjectSubjectRepository subjectRepository;

    public ProjectSubjectService(ProjectSubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public List<ProjectSubjectDto> getAllSubjects(ProjectType type, String search) {
        List<ProjectSubject> list = type != null 
                ? subjectRepository.findByTypeOrderByCreatedAtDesc(type)
                : subjectRepository.findAllByOrderByCreatedAtDesc();

        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            return list.stream()
                    .filter(s -> (s.getTitle() != null && s.getTitle().toLowerCase().contains(q)) ||
                                 (s.getDescription() != null && s.getDescription().toLowerCase().contains(q)) ||
                                 (s.getTechnologies() != null && s.getTechnologies().toLowerCase().contains(q)) ||
                                 (s.getFiliere() != null && s.getFiliere().toLowerCase().contains(q)))
                    .map(this::toDto)
                    .toList();
        }

        return list.stream().map(this::toDto).toList();
    }

    public List<ProjectSubjectDto> getSubjectsByProfessor(UUID professorId) {
        return subjectRepository.findByProfessorIdOrderByCreatedAtDesc(professorId)
                .stream().map(this::toDto).toList();
    }

    public ProjectSubjectDto getSubjectById(UUID id) {
        ProjectSubject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sujet non trouvé"));
        return toDto(subject);
    }

    public ProjectSubjectDto createSubject(CreateSubjectRequest request, User currentUser) {
        ProjectSubject subject = new ProjectSubject();
        subject.setTitle(request.title());
        subject.setType(request.type());
        subject.setFiliere(request.filiere() != null ? request.filiere() : currentUser.getFiliere());
        subject.setNiveau(request.niveau() != null ? request.niveau() : "5ème année");
        subject.setDescription(request.description());
        subject.setObjectives(request.objectives());
        subject.setTechnologies(request.technologies());
        subject.setMaxStudentsPerGroup(request.maxStudentsPerGroup() > 0 ? request.maxStudentsPerGroup() : 1);
        subject.setMaxGroups(request.maxGroups() > 0 ? request.maxGroups() : 1);
        subject.setDeadline(request.deadline());
        subject.setStatus(SubjectStatus.OUVERT);

        subject.setProfessorId(currentUser.getId());
        subject.setProfessorName(currentUser.getFirstName() + " " + currentUser.getLastName());
        subject.setProfessorEmail(currentUser.getEmail());

        ProjectSubject saved = subjectRepository.save(subject);
        return toDto(saved);
    }

    public ProjectSubjectDto updateSubject(UUID id, CreateSubjectRequest request, User currentUser) {
        ProjectSubject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sujet non trouvé"));

        subject.setTitle(request.title());
        subject.setType(request.type());
        if (request.filiere() != null) subject.setFiliere(request.filiere());
        if (request.niveau() != null) subject.setNiveau(request.niveau());
        subject.setDescription(request.description());
        subject.setObjectives(request.objectives());
        subject.setTechnologies(request.technologies());
        if (request.maxStudentsPerGroup() > 0) subject.setMaxStudentsPerGroup(request.maxStudentsPerGroup());
        if (request.maxGroups() > 0) subject.setMaxGroups(request.maxGroups());
        if (request.deadline() != null) subject.setDeadline(request.deadline());

        return toDto(subjectRepository.save(subject));
    }

    public void deleteSubject(UUID id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sujet non trouvé");
        }
        subjectRepository.deleteById(id);
    }

    public ProjectSubjectDto toDto(ProjectSubject s) {
        return new ProjectSubjectDto(
                s.getId(),
                s.getTitle(),
                s.getType(),
                s.getFiliere(),
                s.getNiveau(),
                s.getDescription(),
                s.getObjectives(),
                s.getTechnologies(),
                s.getProfessorId(),
                s.getProfessorName(),
                s.getProfessorEmail(),
                s.getMaxStudentsPerGroup(),
                s.getMaxGroups(),
                s.getAssignedGroupsCount(),
                s.getStatus(),
                s.getDeadline(),
                s.getCreatedAt()
        );
    }
}
