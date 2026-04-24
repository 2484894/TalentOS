package com.arpan.placementBackend.controller;
import com.arpan.placementBackend.dto.request.StudentProfileRequest;
import com.arpan.placementBackend.dto.response.ApiResponse;
import com.arpan.placementBackend.dto.response.StudentProfileResponse;
import com.arpan.placementBackend.model.User;
import com.arpan.placementBackend.service.StudentProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/student/profile")
@RequiredArgsConstructor
public class StudentProfileController {

    private final StudentProfileService profileService;

    // GET /api/v1/student/profile
    @GetMapping
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getMyProfile(
            @AuthenticationPrincipal User currentUser) {
        System.out.println("Done");
        StudentProfileResponse profile = profileService.getProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully.", profile));
    }

    // GET /api/v1/student/profile/{userId}  — recruiters/admin viewing a student
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getProfileByUserId(
            @PathVariable Long userId) {
        StudentProfileResponse profile = profileService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully.", profile));
    }

    // PUT /api/v1/student/profile
    @PutMapping
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody StudentProfileRequest request) {
        StudentProfileResponse updated = profileService.createOrUpdateProfile(
                currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully.", updated));
    }
}