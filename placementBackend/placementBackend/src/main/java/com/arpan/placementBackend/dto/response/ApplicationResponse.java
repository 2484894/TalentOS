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

    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentDepartment;
    private Double studentCgpa;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private ApplicationStatus status;
    private Integer aiMatchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String aiSuggestion;
    private String recruiterNote;
    private LocalDateTime appliedAt;
}
