//package com.arpan.placementBackend.dto.response;
//
//import com.arpan.placementBackend.enums.ApplicationStatus;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class ApplicationResponse {
//
//    private Long id;
//    private Long studentId;
//    private String studentName;
//    private String studentEmail;
//    private String studentDepartment;
//    private Double studentCgpa;
//    private Long jobId;
//    private String jobTitle;
//    private String companyName;
//    private ApplicationStatus status;
//    private Integer aiMatchScore;
//    private List<String> matchedSkills;
//    private List<String> missingSkills;
//    private String aiSuggestion;
//    private String recruiterNote;
//    private LocalDateTime appliedAt;
//}
package com.arpan.placementBackend.dto.response;

import com.arpan.placementBackend.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {

    // ── Application identity ───────────────────────────────────────
    private Long id;
    private LocalDateTime appliedAt;
    private ApplicationStatus status;

    // ── Student core (already existed) ─────────────────────────────
    private Long   studentId;
    private String studentName;
    private String studentEmail;
    private String studentDepartment;
    private Double studentCgpa;

    // ── Student rich profile (NEW — recruiter view) ────────────────
    private String       studentCollege;
    private String       studentBatch;
    private List<String> studentSkills;
    private String       studentResumeUrl;
    private String       studentLinkedinUrl;
    private String       studentGithubUrl;
    private String       studentPhone;
    private String       studentProjects;
    private String       studentCertifications;
    private Integer      studentProfileCompletePct;

    // ── Job (unchanged) ────────────────────────────────────────────
    private Long   jobId;
    private String jobTitle;
    private String companyName;

    // ── AI match (unchanged) ───────────────────────────────────────
    private Integer      aiMatchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String       aiSuggestion;

    // ── Recruiter note (unchanged) ─────────────────────────────────
    private String recruiterNote;
}
