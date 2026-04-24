package com.arpan.placementBackend.service;

import com.arpan.placementBackend.dto.request.ApplicationStatusRequest;
import com.arpan.placementBackend.dto.response.ApplicationResponse;
import com.arpan.placementBackend.enums.ApplicationStatus;
import com.arpan.placementBackend.exception.BadRequestException;
import com.arpan.placementBackend.exception.ResourceNotFoundException;
import com.arpan.placementBackend.exception.UnauthorizedException;
import com.arpan.placementBackend.model.JobApplication;
import com.arpan.placementBackend.model.JobListing;
import com.arpan.placementBackend.model.StudentProfile;
import com.arpan.placementBackend.model.User;
import com.arpan.placementBackend.repository.JobApplicationRepository;
import com.arpan.placementBackend.repository.StudentProfileRepository;
import com.arpan.placementBackend.repository.UserRepository;
import com.arpan.placementBackend.service.ai.AIService;
import com.arpan.placementBackend.service.ai.dto.AIMatchResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final JobListingService jobListingService;
    private final NotificationService notificationService;
    private final AIService aiService;

    public ApplicationResponse applyForJob(Long studentId, Long jobId) {
        if (applicationRepository.existsByStudentIdAndJobId(studentId, jobId)) {
            throw new BadRequestException("You have already applied for this job.");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", studentId));

        JobListing job = jobListingService.getJobOrThrow(jobId);

        if (!job.isActive()) {
            throw new BadRequestException("This job listing is no longer active.");
        }
        if (job.getDeadline() != null && job.getDeadline().isBefore(LocalDate.now())) {
            throw new BadRequestException("The application deadline for this job has passed.");
        }

        JobApplication application = JobApplication.builder()
                .student(student)
                .job(job)
                .status(ApplicationStatus.APPLIED)
                .build();

        // AI Match Score — graceful fallback if AI fails
        StudentProfile profile = studentProfileRepository.findByUserId(studentId).orElse(null);
        if (profile != null) {
            try {
                AIMatchResult result = aiService.matchCandidateToJob(profile, job);
                application.setAiMatchScore(result.getMatchScore());
                application.setMatchedSkills(result.getMatchedSkills());
                application.setMissingSkills(result.getMissingSkills());
                application.setAiSuggestion(result.getSummary());
            } catch (Exception e) {
                log.warn("AI match scoring failed for student {} job {}: {}", studentId, jobId, e.getMessage());
            }
        }

        applicationRepository.save(application);

        // Notify recruiter
        notificationService.createNotification(
                job.getRecruiter().getId(),
                "New application received for \"" + job.getTitle() + "\" from " + student.getName()
        );

        // Notify student
        notificationService.createNotification(
                studentId,
                "Your application for \"" + job.getTitle() + "\" at " + job.getRecruiter().getName() + " has been submitted."
        );

        return mapToResponse(application);
    }

    public ApplicationResponse previewMatch(Long studentId, Long jobId) {
        StudentProfile profile = studentProfileRepository.findByUserId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found."));
        JobListing job = jobListingService.getJobOrThrow(jobId);

        AIMatchResult result = aiService.matchCandidateToJob(profile, job);

        // Return a preview without saving
        return ApplicationResponse.builder()
                .jobId(jobId)
                .jobTitle(job.getTitle())
                .companyName(job.getRecruiter().getName())
                .aiMatchScore(result.getMatchScore())
                .matchedSkills(result.getMatchedSkills())
                .missingSkills(result.getMissingSkills())
                .aiSuggestion(result.getSummary())
                .build();
    }

    public List<ApplicationResponse> getMyApplications(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", studentId));
        return applicationRepository.findByStudentOrderByAppliedAtDesc(student)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicantsForJob(Long recruiterId, Long jobId) {
        JobListing job = jobListingService.getJobOrThrow(jobId);
        if (!job.getRecruiter().getId().equals(recruiterId)) {
            throw new UnauthorizedException("You do not own this job listing.");
        }
        return applicationRepository.findByJobIdOrderByAiMatchScoreDesc(jobId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ApplicationResponse getApplicationById(Long applicationId) {
        return mapToResponse(getApplicationOrThrow(applicationId));
    }

    public ApplicationResponse updateApplicationStatus(Long recruiterId,
                                                       Long applicationId,
                                                       ApplicationStatusRequest request) {
        JobApplication application = getApplicationOrThrow(applicationId);
        JobListing job = application.getJob();

        if (!job.getRecruiter().getId().equals(recruiterId)) {
            throw new UnauthorizedException("You do not have permission to update this application.");
        }

        application.setStatus(request.getStatus());
        if (request.getRecruiterNote() != null) {
            application.setRecruiterNote(request.getRecruiterNote());
        }

        applicationRepository.save(application);

        notificationService.createNotification(
                application.getStudent().getId(),
                "Your application for \"" + job.getTitle() + "\" has been updated to: "
                        + request.getStatus().name()
        );

        return mapToResponse(application);
    }

    public JobApplication getApplicationOrThrow(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", id));
    }

    public ApplicationResponse mapToResponse(JobApplication a) {
        StudentProfile profile = studentProfileRepository.findByUserId(a.getStudent().getId()).orElse(null);
        return ApplicationResponse.builder()
                .id(a.getId())
                .studentId(a.getStudent().getId())
                .studentName(a.getStudent().getName())
                .studentEmail(a.getStudent().getEmail())
                .studentDepartment(profile != null ? profile.getDepartment() : null)
                .studentCgpa(profile != null ? profile.getCgpa() : null)
                .jobId(a.getJob().getId())
                .jobTitle(a.getJob().getTitle())
                .companyName(a.getJob().getRecruiter().getName())
                .status(a.getStatus())
                .aiMatchScore(a.getAiMatchScore())
                .matchedSkills(a.getMatchedSkills() != null ? a.getMatchedSkills() : new ArrayList<>())
                .missingSkills(a.getMissingSkills() != null ? a.getMissingSkills() : new ArrayList<>())
                .aiSuggestion(a.getAiSuggestion())
                .recruiterNote(a.getRecruiterNote())
                .appliedAt(a.getAppliedAt())
                .build();
    }
}
