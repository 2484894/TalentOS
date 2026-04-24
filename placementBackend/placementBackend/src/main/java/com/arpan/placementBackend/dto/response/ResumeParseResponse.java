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
public class ResumeParseResponse {

    private String resumeUrl;
    private String parsedName;
    private List<String> parsedSkills;
    private String parsedEducation;
    private String parsedExperience;
}
