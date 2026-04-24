package com.arpan.placementBackend.service;
import com.arpan.placementBackend.dto.request.JobListingRequest;
import com.arpan.placementBackend.dto.response.JobListingResponse;
import com.arpan.placementBackend.enums.JobType;
import com.arpan.placementBackend.exception.ResourceNotFoundException;
import com.arpan.placementBackend.exception.UnauthorizedException;
import com.arpan.placementBackend.model.JobListing;
import com.arpan.placementBackend.model.User;
import com.arpan.placementBackend.repository.JobApplicationRepository;
import com.arpan.placementBackend.repository.JobListingRepository;
import com.arpan.placementBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobListingService {

    private final JobListingRepository jobListingRepository;
    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public JobListingResponse createJob(Long recruiterId, JobListingRequest request) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", recruiterId));

        JobListing job = JobListing.builder()
                .recruiter(recruiter)
                .title(request.getTitle())
                .description(request.getDescription())
                .requiredSkills(request.getRequiredSkills() != null
                        ? request.getRequiredSkills() : new ArrayList<>())
                .niceToHaveSkills(request.getNiceToHaveSkills() != null
                        ? request.getNiceToHaveSkills() : new ArrayList<>())
                .location(request.getLocation())
                .jobType(request.getJobType())
                .ctc(request.getCtc())
                .minCgpa(request.getMinCgpa() != null ? request.getMinCgpa() : 0.0)
                .deadline(request.getDeadline())
                .build();

        return mapToResponse(jobListingRepository.save(job));
    }

    public JobListingResponse updateJob(Long recruiterId, Long jobId, JobListingRequest request) {
        JobListing job = getJobOrThrow(jobId);
        verifyOwnership(job, recruiterId);

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        if (request.getRequiredSkills() != null) job.setRequiredSkills(request.getRequiredSkills());
        if (request.getNiceToHaveSkills() != null) job.setNiceToHaveSkills(request.getNiceToHaveSkills());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setCtc(request.getCtc());
        if (request.getMinCgpa() != null) job.setMinCgpa(request.getMinCgpa());
        job.setDeadline(request.getDeadline());

        return mapToResponse(jobListingRepository.save(job));
    }

    public void deleteJob(Long recruiterId, Long jobId) {
        JobListing job = getJobOrThrow(jobId);
        verifyOwnership(job, recruiterId);
        jobListingRepository.delete(job);
    }

    public JobListingResponse toggleJobStatus(Long recruiterId, Long jobId) {
        JobListing job = getJobOrThrow(jobId);
        verifyOwnership(job, recruiterId);
        job.setActive(!job.isActive());
        return mapToResponse(jobListingRepository.save(job));
    }

    public List<JobListingResponse> searchJobs(String keyword, JobType jobType, Double minCgpa) {
        return jobListingRepository
                .searchJobs(keyword, jobType, minCgpa, LocalDate.now())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<JobListingResponse> getMyJobs(Long recruiterId) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", recruiterId));
        return jobListingRepository.findByRecruiter(recruiter)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public JobListingResponse getJobById(Long jobId) {
        return mapToResponse(getJobOrThrow(jobId));
    }

    public JobListing getJobOrThrow(Long jobId) {
        return jobListingRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("JobListing", jobId));
    }

    private void verifyOwnership(JobListing job, Long recruiterId) {
        if (!job.getRecruiter().getId().equals(recruiterId)) {
            throw new UnauthorizedException("You do not own this job listing.");
        }
    }

    public JobListingResponse mapToResponse(JobListing job) {
        long count = applicationRepository.findByJobIdOrderByAiMatchScoreDesc(job.getId()).size();
        return JobListingResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .companyName(job.getRecruiter().getName())
                .recruiterId(job.getRecruiter().getId())
                .requiredSkills(job.getRequiredSkills())
                .niceToHaveSkills(job.getNiceToHaveSkills())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .ctc(job.getCtc())
                .minCgpa(job.getMinCgpa())
                .deadline(job.getDeadline())
                .active(job.isActive())
                .createdAt(job.getCreatedAt())
                .applicantCount(count)
                .build();
    }
}
