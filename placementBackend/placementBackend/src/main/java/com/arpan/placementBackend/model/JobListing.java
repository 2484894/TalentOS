package com.arpan.placementBackend.model;

import com.arpan.placementBackend.enums.JobType;
import com.arpan.placementBackend.model.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job_listings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private User recruiter;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Convert(converter = StringListConverter.class)
    @Column(name = "required_skills", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> requiredSkills = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(name = "nice_to_have_skills", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> niceToHaveSkills = new ArrayList<>();

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type")
    private JobType jobType;

    private String ctc;

    @Column(name = "min_cgpa")
    @Builder.Default
    private Double minCgpa = 0.0;

    private LocalDate deadline;

    @Column(name = "is_active")
    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}