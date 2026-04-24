package com.arpan.placementBackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConfirmSlotRequest {

    @NotBlank(message = "Confirmed time is required")
    private String confirmedTime; // ISO datetime string
}
