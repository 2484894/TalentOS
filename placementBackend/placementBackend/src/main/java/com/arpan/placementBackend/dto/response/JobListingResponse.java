package com.arpan.placementBackend.dto.response;

import com.arpan.placementBackend.enums.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobListingResponse {

    private Long id;
    private String title;
    private String description;
    private String companyName;
    private Long recruiterId;
    private List<String> requiredSkills;
    private List<String> niceToHaveSkills;
    private String location;
    private JobType jobType;
    private String ctc;
    private Double minCgpa;
    private LocalDate deadline;
    private boolean active;
    private LocalDateTime createdAt;
    private long applicantCount;
}
