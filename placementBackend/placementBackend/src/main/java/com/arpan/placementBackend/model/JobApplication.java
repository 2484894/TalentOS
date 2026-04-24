package com.arpan.placementBackend.model;

import com.arpan.placementBackend.enums.ApplicationStatus;
import com.arpan.placementBackend.model.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "applications",
        uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "job_id"}))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private JobListing job;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(name = "ai_match_score")
    private Integer aiMatchScore;

    @Convert(converter = StringListConverter.class)
    @Column(name = "matched_skills", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> matchedSkills = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(name = "missing_skills", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> missingSkills = new ArrayList<>();

    @Column(name = "ai_suggestion", columnDefinition = "TEXT")
    private String aiSuggestion;

    @Column(name = "recruiter_note", columnDefinition = "TEXT")
    private String recruiterNote;

    @CreationTimestamp
    @Column(name = "applied_at", updatable = false)
    private LocalDateTime appliedAt;
}
