package com.arpan.placementBackend.service.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AISkillExtractResult {

    private List<String> requiredSkills;
    private List<String> niceToHaveSkills;
}
