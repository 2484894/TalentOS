package com.arpan.placementBackend.dto.request;

import com.arpan.placementBackend.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationStatusRequest {

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    private String recruiterNote;
}