package com.arpan.placementBackend.service;

import com.arpan.placementBackend.dto.response.DashboardStatsResponse;
import com.arpan.placementBackend.enums.ApplicationStatus;
import com.arpan.placementBackend.enums.Role;
import com.arpan.placementBackend.repository.JobApplicationRepository;
import com.arpan.placementBackend.repository.JobListingRepository;
import com.arpan.placementBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final JobListingRepository jobListingRepository;
    private final JobApplicationRepository applicationRepository;

    public DashboardStatsResponse getDashboardStats() {
        long totalStudents = userRepository.findAllByRole(Role.STUDENT).size();
        long totalRecruiters = userRepository.findAllByRole(Role.RECRUITER).size();
        long totalJobsActive = jobListingRepository.countByActiveTrue();
        long totalJobsClosed = jobListingRepository.countByActiveFalse();
        long totalApplications = applicationRepository.count();
        long studentsPlaced = applicationRepository.countDistinctStudentsPlaced();
        double placementPct = totalStudents > 0
                ? Math.round((studentsPlaced * 100.0 / totalStudents) * 10.0) / 10.0
                : 0.0;

        // Applications by status
        Map<String, Long> appsByStatus = new LinkedHashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            appsByStatus.put(status.name(), applicationRepository.countByStatus(status));
        }

        // Placements by department
        Map<String, Long> byDept = new LinkedHashMap<>();
        List<Object[]> deptRows = applicationRepository.placementsByDepartment();
        for (Object[] row : deptRows) {
            String dept = row[1] != null ? row[1].toString() : "Unknown";
            long count = ((Number) row[2]).longValue();
            byDept.put(dept, count);
        }

        // Top companies
        List<Map<String, Object>> topCompanies = new ArrayList<>();
        List<Object[]> companyRows = applicationRepository.topCompaniesByPlacements();
        for (int i = 0; i < Math.min(5, companyRows.size()); i++) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("company", companyRows.get(i)[0]);
            entry.put("count", ((Number) companyRows.get(i)[1]).longValue());
            topCompanies.add(entry);
        }

        return DashboardStatsResponse.builder()
                .totalStudents(totalStudents)
                .totalRecruiters(totalRecruiters)
                .totalJobsActive(totalJobsActive)
                .totalJobsClosed(totalJobsClosed)
                .totalApplications(totalApplications)
                .studentsPlaced(studentsPlaced)
                .placementPercentage(placementPct)
                .applicationsByStatus(appsByStatus)
                .placementsByDepartment(byDept)
                .topCompanies(topCompanies)
                .build();
    }
}
