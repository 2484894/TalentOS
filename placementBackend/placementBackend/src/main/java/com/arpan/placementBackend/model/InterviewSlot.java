package com.arpan.placementBackend.model;


import com.arpan.placementBackend.model.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interview_slots")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private JobApplication application;

    // Stored as JSON array of ISO datetime strings e.g. ["2025-05-10T10:00", "2025-05-10T14:00"]
    @Convert(converter = StringListConverter.class)
    @Column(name = "proposed_times", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> proposedTimes = new ArrayList<>();

    @Column(name = "confirmed_time")
    private LocalDateTime confirmedTime;

    @Column(name = "is_confirmed")
    @Builder.Default
    private boolean confirmed = false;

    @Column(name = "is_cancelled")
    @Builder.Default
    private boolean cancelled = false;
}
