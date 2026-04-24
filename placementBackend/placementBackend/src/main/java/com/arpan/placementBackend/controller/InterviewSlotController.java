package com.arpan.placementBackend.controller;

import com.arpan.placementBackend.dto.request.ConfirmSlotRequest;
import com.arpan.placementBackend.dto.request.InterviewSlotRequest;
import com.arpan.placementBackend.dto.response.ApiResponse;
import com.arpan.placementBackend.dto.response.InterviewSlotResponse;
import com.arpan.placementBackend.model.User;
import com.arpan.placementBackend.service.InterviewSlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class InterviewSlotController {

    private final InterviewSlotService interviewSlotService;

    // GET /api/v1/interviews/{applicationId}  — view slots for an application
    @GetMapping("/api/v1/interviews/{applicationId}")
    public ResponseEntity<ApiResponse<InterviewSlotResponse>> getSlot(
            @PathVariable Long applicationId) {
        InterviewSlotResponse slot = interviewSlotService.getSlotByApplication(applicationId);
        return ResponseEntity.ok(ApiResponse.success("Interview slot fetched.", slot));
    }

    // POST /api/v1/recruiter/interviews/{applicationId}/propose  — recruiter proposes slots
    @PostMapping("/api/v1/recruiter/interviews/{applicationId}/propose")
    public ResponseEntity<ApiResponse<InterviewSlotResponse>> proposeSlots(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long applicationId,
            @Valid @RequestBody InterviewSlotRequest request) {
        InterviewSlotResponse slot = interviewSlotService.proposeSlots(
                currentUser.getId(), applicationId, request);
        return ResponseEntity.ok(ApiResponse.success("Interview slots proposed.", slot));
    }

    // PATCH /api/v1/student/interviews/{applicationId}/confirm  — student confirms a slot
    @PatchMapping("/api/v1/student/interviews/{applicationId}/confirm")
    public ResponseEntity<ApiResponse<InterviewSlotResponse>> confirmSlot(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long applicationId,
            @Valid @RequestBody ConfirmSlotRequest request) {
        InterviewSlotResponse slot = interviewSlotService.confirmSlot(
                currentUser.getId(), applicationId, request);
        return ResponseEntity.ok(ApiResponse.success("Interview slot confirmed.", slot));
    }

    // PATCH /api/v1/recruiter/interviews/{applicationId}/cancel  — recruiter cancels
    @PatchMapping("/api/v1/recruiter/interviews/{applicationId}/cancel")
    public ResponseEntity<ApiResponse<InterviewSlotResponse>> cancelSlot(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long applicationId) {
        InterviewSlotResponse slot = interviewSlotService.cancelSlot(
                currentUser.getId(), applicationId);
        return ResponseEntity.ok(ApiResponse.success("Interview slot cancelled.", slot));
    }
}
