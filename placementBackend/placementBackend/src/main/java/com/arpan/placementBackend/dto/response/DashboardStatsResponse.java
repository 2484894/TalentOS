package com.arpan.placementBackend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    // Summary cards
    private long totalStudents;
    private long totalRecruiters;
    private long totalJobsActive;
    private long totalJobsClosed;
    private long totalApplications;
    private long studentsPlaced;
    private double placementPercentage;

    // Chart data
    private Map<String, Long> applicationsByStatus;      // e.g. { "APPLIED": 40, "SELECTED": 10 }
    private Map<String, Long> placementsByDepartment;    // e.g. { "CSE": 12, "ECE": 8 }
    private List<Map<String, Object>> topCompanies;      // [ { company: "TCS", count: 5 }, ... ]
}
