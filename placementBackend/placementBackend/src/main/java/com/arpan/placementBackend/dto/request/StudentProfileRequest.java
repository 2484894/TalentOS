package com.arpan.placementBackend.dto.request;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.util.List;

@Data
public class StudentProfileRequest {

    private String department;
    private String batch;

    @DecimalMin(value = "0.0", message = "CGPA must be at least 0.0")
    @DecimalMax(value = "10.0", message = "CGPA must be at most 10.0")
    private Double cgpa;

    private List<String> skills;
    private String projects;
    private String certifications;
    private String phone;
    private String linkedinUrl;
    private String githubUrl;
}