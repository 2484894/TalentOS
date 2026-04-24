package com.arpan.placementBackend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class InterviewSlotRequest {

    @NotEmpty(message = "At least one proposed time slot is required")
    private List<String> proposedTimes; // ISO datetime strings e.g. "2025-05-10T10:00"
}
