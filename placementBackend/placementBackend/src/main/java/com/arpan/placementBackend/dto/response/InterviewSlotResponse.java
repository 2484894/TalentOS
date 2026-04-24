package com.arpan.placementBackend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewSlotResponse {

    private Long id;
    private Long applicationId;
    private List<String> proposedTimes;
    private LocalDateTime confirmedTime;
    private boolean confirmed;
    private boolean cancelled;
}
