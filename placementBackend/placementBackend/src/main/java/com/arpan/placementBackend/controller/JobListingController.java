package com.arpan.placementBackend.controller;

import com.arpan.placementBackend.dto.request.JobListingRequest;
import com.arpan.placementBackend.dto.response.ApiResponse;
import com.arpan.placementBackend.dto.response.JobListingResponse;
import com.arpan.placementBackend.enums.JobType;
import com.arpan.placementBackend.model.User;
import com.arpan.placementBackend.service.JobListingService;
import com.arpan.placementBackend.service.ai.AIService;
import com.arpan.placementBackend.service.ai.dto.AISkillExtractResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class JobListingController {

    private final JobListingService jobListingService;
    private final AIService aiService;

    // ── Student-accessible routes ─────────────────────────────────────────

    // GET /api/v1/jobs  (all active jobs, with optional filters)
    @GetMapping("/api/v1/jobs")
    public ResponseEntity<ApiResponse<List<JobListingResponse>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) Double minCgpa) {
        List<JobListingResponse> jobs = jobListingService.searchJobs(keyword, jobType, minCgpa);
        return ResponseEntity.ok(ApiResponse.success("Jobs fetched successfully.", jobs));
    }

    // GET /api/v1/jobs/{jobId}
    @GetMapping("/api/v1/jobs/{jobId}")
    public ResponseEntity<ApiResponse<JobListingResponse>> getJob(
            @PathVariable Long jobId) {
        return ResponseEntity.ok(
                ApiResponse.success("Job fetched.", jobListingService.getJobById(jobId)));
    }

    // ── Recruiter routes ──────────────────────────────────────────────────

    // GET /api/v1/recruiter/jobs  (recruiter's own job listings)
    @GetMapping("/api/v1/recruiter/jobs")
    public ResponseEntity<ApiResponse<List<JobListingResponse>>> getMyJobs(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                ApiResponse.success("Your jobs fetched.", jobListingService.getMyJobs(currentUser.getId())));
    }

    // POST /api/v1/recruiter/jobs  (create new job — optionally with AI skill suggestion)
    @PostMapping("/api/v1/recruiter/jobs")
    public ResponseEntity<ApiResponse<JobListingResponse>> createJob(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody JobListingRequest request) {

        // Auto-extract skills if none provided
        if ((request.getRequiredSkills() == null || request.getRequiredSkills().isEmpty())
                && request.getDescription() != null) {
            try {
                AISkillExtractResult aiResult = aiService.extractSkillsFromJD(
                        request.getTitle(), request.getDescription());
                request.setRequiredSkills(aiResult.getRequiredSkills());
                request.setNiceToHaveSkills(aiResult.getNiceToHaveSkills());
            } catch (Exception e) {
                // AI failed — continue without skill extraction
            }
        }

        JobListingResponse created = jobListingService.createJob(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Job created successfully.", created));
    }

    // POST /api/v1/recruiter/jobs/extract-skills  (standalone AI skill suggestion)
    @PostMapping("/api/v1/recruiter/jobs/extract-skills")
    public ResponseEntity<ApiResponse<AISkillExtractResult>> extractSkills(
            @RequestParam String jobTitle,
            @RequestParam String jobDescription) {
        AISkillExtractResult result = aiService.extractSkillsFromJD(jobTitle, jobDescription);
        return ResponseEntity.ok(ApiResponse.success("Skills extracted.", result));
    }

    // PUT /api/v1/recruiter/jobs/{jobId}
    @PutMapping("/api/v1/recruiter/jobs/{jobId}")
    public ResponseEntity<ApiResponse<JobListingResponse>> updateJob(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long jobId,
            @Valid @RequestBody JobListingRequest request) {
        JobListingResponse updated = jobListingService.updateJob(
                currentUser.getId(), jobId, request);
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully.", updated));
    }

    // DELETE /api/v1/recruiter/jobs/{jobId}
    @DeleteMapping("/api/v1/recruiter/jobs/{jobId}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long jobId) {
        jobListingService.deleteJob(currentUser.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully."));
    }

    // PATCH /api/v1/recruiter/jobs/{jobId}/toggle
    @PatchMapping("/api/v1/recruiter/jobs/{jobId}/toggle")
    public ResponseEntity<ApiResponse<JobListingResponse>> toggleJobStatus(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long jobId) {
        JobListingResponse updated = jobListingService.toggleJobStatus(
                currentUser.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.success("Job status toggled.", updated));
    }
}