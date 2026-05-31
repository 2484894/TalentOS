//package com.arpan.placementBackend.service;
//
//import com.arpan.placementBackend.dto.response.DashboardStatsResponse;
//import com.arpan.placementBackend.enums.ApplicationStatus;
//import com.arpan.placementBackend.enums.Role;
//import com.arpan.placementBackend.repository.JobApplicationRepository;
//import com.arpan.placementBackend.repository.JobListingRepository;
//import com.arpan.placementBackend.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.*;
//
//@Service
//@RequiredArgsConstructor
//public class DashboardService {
//
//    private final UserRepository userRepository;
//    private final JobListingRepository jobListingRepository;
//    private final JobApplicationRepository applicationRepository;
//
//    public DashboardStatsResponse getDashboardStats() {
//        long totalStudents = userRepository.findAllByRole(Role.STUDENT).size();
//        long totalRecruiters = userRepository.findAllByRole(Role.RECRUITER).size();
//        long totalJobsActive = jobListingRepository.countByActiveTrue();
//        long totalJobsClosed = jobListingRepository.countByActiveFalse();
//        long totalApplications = applicationRepository.count();
//        long studentsPlaced = applicationRepository.countDistinctStudentsPlaced();
//        double placementPct = totalStudents > 0
//                ? Math.round((studentsPlaced * 100.0 / totalStudents) * 10.0) / 10.0
//                : 0.0;
//
//        // Applications by status
//        Map<String, Long> appsByStatus = new LinkedHashMap<>();
//        for (ApplicationStatus status : ApplicationStatus.values()) {
//            appsByStatus.put(status.name(), applicationRepository.countByStatus(status));
//        }
//
//        // Placements by department
//        Map<String, Long> byDept = new LinkedHashMap<>();
//        List<Object[]> deptRows = applicationRepository.placementsByDepartment();
//        for (Object[] row : deptRows) {
//            String dept = row[0] != null ? row[0].toString() : "Unknown";
//            long count = ((Number) row[1]).longValue();
//            byDept.put(dept, count);
//        }
//
//        // Top companies
//        List<Map<String, Object>> topCompanies = new ArrayList<>();
//        List<Object[]> companyRows = applicationRepository.topCompaniesByPlacements();
//        for (int i = 0; i < Math.min(5, companyRows.size()); i++) {
//            Map<String, Object> entry = new LinkedHashMap<>();
//            entry.put("company", companyRows.get(i)[0]);
//            entry.put("count", ((Number) companyRows.get(i)[1]).longValue());
//            topCompanies.add(entry);
//        }
//
//        return DashboardStatsResponse.builder()
//                .totalStudents(totalStudents)
//                .totalRecruiters(totalRecruiters)
//                .totalJobsActive(totalJobsActive)
//                .totalJobsClosed(totalJobsClosed)
//                .totalApplications(totalApplications)
//                .studentsPlaced(studentsPlaced)
//                .placementPercentage(placementPct)
//                .applicationsByStatus(appsByStatus)
//                .placementsByDepartment(byDept)
//                .topCompanies(topCompanies)
//                .build();
//    }
//}
package com.arpan.placementBackend.service;

import com.arpan.placementBackend.dto.response.DashboardStatsResponse;
import com.arpan.placementBackend.dto.response.PlacementRecord;
import com.arpan.placementBackend.enums.ApplicationStatus;
import com.arpan.placementBackend.enums.Role;
import com.arpan.placementBackend.model.JobApplication;
import com.arpan.placementBackend.model.StudentProfile;
import com.arpan.placementBackend.repository.JobApplicationRepository;
import com.arpan.placementBackend.repository.JobListingRepository;
import com.arpan.placementBackend.repository.StudentProfileRepository;
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
    private final StudentProfileRepository studentProfileRepository;

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

        Map<String, Long> appsByStatus = new LinkedHashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            appsByStatus.put(status.name(), applicationRepository.countByStatus(status));
        }

        Map<String, Long> byDept = new LinkedHashMap<>();
        List<Object[]> deptRows = applicationRepository.placementsByDepartment();
        for (Object[] row : deptRows) {
            String dept = row[1] != null ? row[1].toString() : "Unknown";
            long count = ((Number) row[2]).longValue();
            byDept.put(dept, count);
        }

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

    /**
     * NEW — every selected application enriched with student profile (college, dept, cgpa).
     * Used by the admin "Selected Candidates" page and the CSV export.
     */
    public List<PlacementRecord> getAllPlacements() {
        List<JobApplication> selected = applicationRepository.findAllSelected();

        List<PlacementRecord> out = new ArrayList<>(selected.size());
        for (JobApplication a : selected) {
            StudentProfile profile = studentProfileRepository
                    .findByUserId(a.getStudent().getId()).orElse(null);

            out.add(PlacementRecord.builder()
                    .applicationId(a.getId())
                    .studentId(a.getStudent().getId())
                    .studentName(a.getStudent().getName())
                    .studentEmail(a.getStudent().getEmail())
                    .college(profile != null ? profile.getCollege() : null)
                    .department(profile != null ? profile.getDepartment() : null)
                    .batch(profile != null ? profile.getBatch() : null)
                    .cgpa(profile != null ? profile.getCgpa() : null)
                    .jobId(a.getJob().getId())
                    .jobTitle(a.getJob().getTitle())
                    .companyName(a.getJob().getRecruiter().getName())
                    .ctc(a.getJob().getCtc())
                    .location(a.getJob().getLocation())
                    .appliedAt(a.getAppliedAt())
                    .build());
        }
        return out;
    }
}
