//package com.arpan.placementBackend.controller;
//
//import com.arpan.placementBackend.dto.response.ApiResponse;
//import com.arpan.placementBackend.dto.response.DashboardStatsResponse;
//import com.arpan.placementBackend.dto.response.StudentProfileResponse;
//import com.arpan.placementBackend.enums.Role;
//import com.arpan.placementBackend.exception.ResourceNotFoundException;
//import com.arpan.placementBackend.model.User;
//import com.arpan.placementBackend.repository.UserRepository;
//import com.arpan.placementBackend.service.DashboardService;
//import com.arpan.placementBackend.service.StudentProfileService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.io.PrintWriter;
//import java.io.StringWriter;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/v1/admin")
//@RequiredArgsConstructor
//public class DashboardController {
//
//    private final DashboardService dashboardService;
//    private final UserRepository userRepository;
//    private final StudentProfileService profileService;
//
//    // GET /api/v1/admin/dashboard
//    @GetMapping("/dashboard")
//    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboard() {
//        DashboardStatsResponse stats = dashboardService.getDashboardStats();
//        return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched.", stats));
//    }
//
//    // GET /api/v1/admin/users  — list all users
//    @GetMapping("/users")
//    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
//        List<User> users = userRepository.findAll();
//        return ResponseEntity.ok(ApiResponse.success("Users fetched.", users));
//    }
//
//    // PATCH /api/v1/admin/users/{userId}/toggle-status  — activate/deactivate a user
//    @PatchMapping("/users/{userId}/toggle-status")
//    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(@PathVariable Long userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
//        user.setActive(!user.isActive());
//        userRepository.save(user);
//        String status = user.isActive() ? "activated" : "deactivated";
//        return ResponseEntity.ok(ApiResponse.success("User " + status + " successfully."));
//    }
//
//    // GET /api/v1/admin/students  — list all student profiles
//    @GetMapping("/students")
//    public ResponseEntity<ApiResponse<List<StudentProfileResponse>>> getAllStudents() {
//        List<User> students = userRepository.findAllByRole(Role.STUDENT);
//        List<StudentProfileResponse> profiles = students.stream()
//                .map(u -> {
//                    try {
//                        return profileService.getProfile(u.getId());
//                    } catch (ResourceNotFoundException e) {
//                        return StudentProfileResponse.builder()
//                                .userId(u.getId())
//                                .name(u.getName())
//                                .email(u.getEmail())
//                                .profileCompletePct(0)
//                                .build();
//                    }
//                })
//                .toList();
//        return ResponseEntity.ok(ApiResponse.success("Students fetched.", profiles));
//    }
//
//    // GET /api/v1/admin/report/csv  — export placement report as CSV
//    @GetMapping(value = "/report/csv", produces = "text/csv")
//    public ResponseEntity<String> exportCsvReport() {
//        List<User> students = userRepository.findAllByRole(Role.STUDENT);
//
//        StringWriter sw = new StringWriter();
//        PrintWriter pw = new PrintWriter(sw);
//
//        pw.println("Student Name,Email,Department,CGPA,Company,Job Title,Status");
//
//        for (User student : students) {
//            try {
//                StudentProfileResponse profile = profileService.getProfile(student.getId());
//                pw.printf("%s,%s,%s,%s,%s,%s,%s%n",
//                        escCsv(student.getName()),
//                        escCsv(student.getEmail()),
//                        escCsv(profile.getDepartment()),
//                        profile.getCgpa() != null ? profile.getCgpa() : "",
//                        "", "", "");
//            } catch (Exception ignored) {
//                pw.printf("%s,%s,,,,,%n",
//                        escCsv(student.getName()),
//                        escCsv(student.getEmail()));
//            }
//        }
//
//        return ResponseEntity.ok()
//                .header("Content-Disposition", "attachment; filename=placement_report.csv")
//                .body(sw.toString());
//    }
//
//    private String escCsv(String value) {
//        if (value == null) return "";
//        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
//            return "\"" + value.replace("\"", "\"\"") + "\"";
//        }
//        return value;
//    }
//}
package com.arpan.placementBackend.controller;

import com.arpan.placementBackend.dto.response.ApiResponse;
import com.arpan.placementBackend.dto.response.DashboardStatsResponse;
import com.arpan.placementBackend.dto.response.PlacementRecord;
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
import java.util.Map;

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
        return ResponseEntity.ok(ApiResponse.success(
                "Dashboard data fetched.", dashboardService.getDashboardStats()));
    }

    // GET /api/v1/admin/users
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(
                "Users fetched.", userRepository.findAll()));
    }

    // PATCH /api/v1/admin/users/{userId}/toggle-status
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

    // ─── NEW: Selected Candidates ────────────────────────────────────────

    /**
     * GET /api/v1/admin/placements
     * Returns every SELECTED application with full student + company info.
     * Frontend filters by college / department / company on the client side.
     */
    @GetMapping("/placements")
    public ResponseEntity<ApiResponse<List<PlacementRecord>>> getPlacements() {
        return ResponseEntity.ok(ApiResponse.success(
                "Placement records fetched.", dashboardService.getAllPlacements()));
    }

    /**
     * GET /api/v1/admin/placements/by-college
     * Same data grouped by college, e.g. {"IIT Bombay": [...records], ...}
     */
    @GetMapping("/placements/by-college")
    public ResponseEntity<ApiResponse<Map<String, List<PlacementRecord>>>> getPlacementsByCollege() {
        Map<String, List<PlacementRecord>> grouped =
                dashboardService.getAllPlacements().stream()
                        .collect(java.util.stream.Collectors.groupingBy(
                                r -> r.getCollege() != null && !r.getCollege().isBlank()
                                        ? r.getCollege() : "Unspecified",
                                java.util.LinkedHashMap::new,
                                java.util.stream.Collectors.toList()
                        ));
        return ResponseEntity.ok(ApiResponse.success("Grouped placements fetched.", grouped));
    }

    // ─── CSV export — FIXED ──────────────────────────────────────────────
    // Previously this iterated over ALL students with empty company/job columns.
    // Now it exports the actual selected-candidates report with company info.
    @GetMapping(value = "/report/csv", produces = "text/csv")
    public ResponseEntity<String> exportCsvReport() {
        List<PlacementRecord> records = dashboardService.getAllPlacements();

        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        pw.println("Student Name,Email,College,Department,Batch,CGPA,Company,Job Title,CTC,Location,Selected On");

        for (PlacementRecord r : records) {
            pw.printf("%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s%n",
                    escCsv(r.getStudentName()),
                    escCsv(r.getStudentEmail()),
                    escCsv(r.getCollege()),
                    escCsv(r.getDepartment()),
                    escCsv(r.getBatch()),
                    r.getCgpa() != null ? r.getCgpa() : "",
                    escCsv(r.getCompanyName()),
                    escCsv(r.getJobTitle()),
                    escCsv(r.getCtc()),
                    escCsv(r.getLocation()),
                    r.getAppliedAt() != null ? r.getAppliedAt().toLocalDate() : "");
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