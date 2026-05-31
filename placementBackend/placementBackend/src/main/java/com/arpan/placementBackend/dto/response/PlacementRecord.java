package com.arpan.placementBackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * One row in the admin "Selected Candidates" report.
 * Each row = one student who has been SELECTED for a job.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacementRecord {

    private Long applicationId;

    // Student
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String college;
    private String department;
    private String batch;
    private Double cgpa;

    // Job / Company
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String ctc;
    private String location;

    // Selection metadata
    private LocalDateTime appliedAt;
}