package com.arpan.placementBackend.controller;

import com.arpan.placementBackend.dto.response.ApiResponse;
import com.arpan.placementBackend.dto.response.DashboardStatsResponse;
import com.arpan.placementBackend.dto.response.StudentProfileResponse;
import com.arpan.placementBackend.enums.Role;
import com.arpan.placementBackend.exception.ResourceNotFoundException;
import com.arpan.placementBackend.model.User;
import com.arpan.placementBackend.repository.UserRepository;
import com.arpan.placementBackend.service.DashboardService;
import com.arpan.placementBackend.service.StudentProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;
    private final StudentProfileService profileService;

    // GET /api/v1/admin/dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboard() {
        DashboardStatsResponse stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched.", stats));
    }

    // GET /api/v1/admin/users  — list all users
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Users fetched.", users));
    }

    // PATCH /api/v1/admin/users/{userId}/toggle-status  — activate/deactivate a user
    @PatchMapping("/users/{userId}/toggle-status")
    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        user.setActive(!user.isActive());
        userRepository.save(user);
        String status = user.isActive() ? "activated" : "deactivated";
        return ResponseEntity.ok(ApiResponse.success("User " + status + " successfully."));
    }

    // GET /api/v1/admin/students  — list all student profiles
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<StudentProfileResponse>>> getAllStudents() {
        List<User> students = userRepository.findAllByRole(Role.STUDENT);
        List<StudentProfileResponse> profiles = students.stream()
                .map(u -> {
                    try {
                        return profileService.getProfile(u.getId());
                    } catch (ResourceNotFoundException e) {
                        return StudentProfileResponse.builder()
                                .userId(u.getId())
                                .name(u.getName())
                                .email(u.getEmail())
                                .profileCompletePct(0)
                                .build();
                    }
                })
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Students fetched.", profiles));
    }

    // GET /api/v1/admin/report/csv  — export placement report as CSV
    @GetMapping(value = "/report/csv", produces = "text/csv")
    public ResponseEntity<String> exportCsvReport() {
        List<User> students = userRepository.findAllByRole(Role.STUDENT);

        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        pw.println("Student Name,Email,Department,CGPA,Company,Job Title,Status");

        for (User student : students) {
            try {
                StudentProfileResponse profile = profileService.getProfile(student.getId());
                pw.printf("%s,%s,%s,%s,%s,%s,%s%n",
                        escCsv(student.getName()),
                        escCsv(student.getEmail()),
                        escCsv(profile.getDepartment()),
                        profile.getCgpa() != null ? profile.getCgpa() : "",
                        "", "", "");
            } catch (Exception ignored) {
                pw.printf("%s,%s,,,,,%n",
                        escCsv(student.getName()),
                        escCsv(student.getEmail()));
            }
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=placement_report.csv")
                .body(sw.toString());
    }

    private String escCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}