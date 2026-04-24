package com.arpan.placementBackend.dto.request;


import com.arpan.placementBackend.enums.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class JobListingRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private List<String> requiredSkills;
    private List<String> niceToHaveSkills;
    private String location;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    private String ctc;
    private Double minCgpa;
    private LocalDate deadline;
}
