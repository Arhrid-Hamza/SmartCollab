package com.smartcollab.auth.service;

import com.smartcollab.auth.dto.CreateApplicationRequest;
import com.smartcollab.auth.dto.SubjectApplicationDto;
import com.smartcollab.auth.dto.UpdateApplicationStatusRequest;
import com.smartcollab.auth.model.*;
import com.smartcollab.auth.repository.ProjectSubjectRepository;
import com.smartcollab.auth.repository.StudentGroupRepository;
import com.smartcollab.auth.repository.SubjectApplicationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SubjectApplicationService {

    private final SubjectApplicationRepository applicationRepository;
    private final ProjectSubjectRepository subjectRepository;
    private final StudentGroupRepository groupRepository;

    public SubjectApplicationService(SubjectApplicationRepository applicationRepository,
                                     ProjectSubjectRepository subjectRepository,
                                     StudentGroupRepository groupRepository) {
        this.applicationRepository = applicationRepository;
        this.subjectRepository = subjectRepository;
        this.groupRepository = groupRepository;
    }

    public List<SubjectApplicationDto> getAllApplications() {
        return applicationRepository.findAllByOrderBySubmittedAtDesc()
                .stream().map(this::toDto).toList();
    }

    public List<SubjectApplicationDto> getApplicationsByStudent(UUID studentId) {
        return applicationRepository.findByStudentIdOrderBySubmittedAtDesc(studentId)
                .stream().map(this::toDto).toList();
    }

    public List<SubjectApplicationDto> getApplicationsBySubject(UUID subjectId) {
        return applicationRepository.findBySubjectIdOrderBySubmittedAtDesc(subjectId)
                .stream().map(this::toDto).toList();
    }

    public SubjectApplicationDto submitApplication(CreateApplicationRequest request, User student) {
        ProjectSubject subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sujet non trouvé"));

        if (applicationRepository.existsBySubjectIdAndStudentId(request.subjectId(), student.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vous avez déjà postulé à ce sujet");
        }

        String groupName = null;
        if (request.groupId() != null) {
            StudentGroup group = groupRepository.findById(request.groupId()).orElse(null);
            if (group != null) {
                groupName = group.getName();
            }
        }

        SubjectApplication app = new SubjectApplication();
        app.setSubjectId(subject.getId());
        app.setSubjectTitle(subject.getTitle());
        app.setStudentId(student.getId());
        app.setStudentName(student.getFirstName() + " " + student.getLastName());
        app.setStudentEmail(student.getEmail());
        app.setGroupId(request.groupId());
        app.setGroupName(groupName);
        app.setPriorityOrder(request.priorityOrder() > 0 ? request.priorityOrder() : 1);
        app.setMotivation(request.motivation());
        app.setStatus(ApplicationStatus.EN_ATTENTE);

        SubjectApplication saved = applicationRepository.save(app);
        return toDto(saved);
    }

    public SubjectApplicationDto updateStatus(UUID id, UpdateApplicationStatusRequest request, User currentUser) {
        SubjectApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Candidature non trouvée"));

        app.setStatus(request.status());
        if (request.feedback() != null) {
            app.setProfessorFeedback(request.feedback());
        }
        app.setReviewedAt(OffsetDateTime.now());

        // If approved, update subject assigned count
        if (request.status() == ApplicationStatus.ACCEPTE) {
            ProjectSubject subject = subjectRepository.findById(app.getSubjectId()).orElse(null);
            if (subject != null) {
                subject.setAssignedGroupsCount(subject.getAssignedGroupsCount() + 1);
                if (subject.getAssignedGroupsCount() >= subject.getMaxGroups()) {
                    subject.setStatus(SubjectStatus.AFFECTE);
                }
                subjectRepository.save(subject);
            }
        }

        return toDto(applicationRepository.save(app));
    }

    public SubjectApplicationDto toDto(SubjectApplication a) {
        return new SubjectApplicationDto(
                a.getId(),
                a.getSubjectId(),
                a.getSubjectTitle(),
                a.getStudentId(),
                a.getStudentName(),
                a.getStudentEmail(),
                a.getGroupId(),
                a.getGroupName(),
                a.getPriorityOrder(),
                a.getMotivation(),
                a.getStatus(),
                a.getProfessorFeedback(),
                a.getSubmittedAt(),
                a.getReviewedAt()
        );
    }
}
