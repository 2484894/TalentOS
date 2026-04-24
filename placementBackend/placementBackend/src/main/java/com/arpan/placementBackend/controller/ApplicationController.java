package com.arpan.placementBackend.controller;

import com.arpan.placementBackend.dto.request.ApplicationStatusRequest;
import com.arpan.placementBackend.dto.response.ApiResponse;
import com.arpan.placementBackend.dto.response.ApplicationResponse;
import com.arpan.placementBackend.model.User;
import com.arpan.placementBackend.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // ── Student routes ────────────────────────────────────────────────────

    // POST /api/v1/student/applications/{jobId}  — apply for a job
    @PostMapping("/api/v1/student/applications/{jobId}")
    public ResponseEntity<ApiResponse<ApplicationResponse>> applyForJob(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long jobId) {
        ApplicationResponse response = applicationService.applyForJob(
                currentUser.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.success("Application submitted successfully.", response));
    }

    // GET /api/v1/student/applications  — student's own applications
    @GetMapping("/api/v1/student/applications")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getMyApplications(
            @AuthenticationPrincipal User currentUser) {
        List<ApplicationResponse> apps = applicationService.getMyApplications(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Applications fetched.", apps));
    }

    // GET /api/v1/student/applications/{applicationId}  — single application detail
    @GetMapping("/api/v1/student/applications/{applicationId}")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getApplicationById(
            @PathVariable Long applicationId) {
        return ResponseEntity.ok(
                ApiResponse.success("Application fetched.",
                        applicationService.getApplicationById(applicationId)));
    }

    // GET /api/v1/student/jobs/{jobId}/preview  — AI match preview before applying
    @GetMapping("/api/v1/student/jobs/{jobId}/preview")
    public ResponseEntity<ApiResponse<ApplicationResponse>> previewMatch(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long jobId) {
        ApplicationResponse preview = applicationService.previewMatch(
                currentUser.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.success("Match preview generated.", preview));
    }

    // ── Recruiter routes ──────────────────────────────────────────────────

    // GET /api/v1/recruiter/jobs/{jobId}/applicants  — list applicants sorted by AI score
    @GetMapping("/api/v1/recruiter/jobs/{jobId}/applicants")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getApplicantsForJob(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long jobId) {
        List<ApplicationResponse> apps = applicationService.getApplicantsForJob(
                currentUser.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.success("Applicants fetched.", apps));
    }

    // PATCH /api/v1/recruiter/applications/{applicationId}/status  — update status
    @PatchMapping("/api/v1/recruiter/applications/{applicationId}/status")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationStatusRequest request) {
        ApplicationResponse updated = applicationService.updateApplicationStatus(
                currentUser.getId(), applicationId, request);
        return ResponseEntity.ok(ApiResponse.success("Application status updated.", updated));
    }
}
