package com.arpan.placementBackend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileResponse {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String college;        // NEW
    private String department;
    private String batch;
    private Double cgpa;
    private List<String> skills;
    private String resumeUrl;
    private String linkedinUrl;
    private String githubUrl;
    private String projects;
    private String certifications;
    private String phone;
    private Integer profileCompletePct;
}