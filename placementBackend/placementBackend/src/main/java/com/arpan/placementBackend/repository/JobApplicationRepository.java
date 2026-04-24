package com.arpan.placementBackend.repository;


import com.arpan.placementBackend.enums.ApplicationStatus;
import com.arpan.placementBackend.model.JobApplication;
import com.arpan.placementBackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByStudentOrderByAppliedAtDesc(User student);

    List<JobApplication> findByJobIdOrderByAiMatchScoreDesc(Long jobId);

    Optional<JobApplication> findByStudentIdAndJobId(Long studentId, Long jobId);

    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);

    long countByStatus(ApplicationStatus status);

    @Query("SELECT COUNT(DISTINCT a.student.id) FROM JobApplication a WHERE a.status = 'SELECTED'")
    long countDistinctStudentsPlaced();

    @Query("SELECT a.job.recruiter.name, COUNT(a) FROM JobApplication a " +
            "WHERE a.status = 'SELECTED' GROUP BY a.job.recruiter.name ORDER BY COUNT(a) DESC")
    List<Object[]> topCompaniesByPlacements();

    @Query("SELECT a.student.id, sp.department, COUNT(a) FROM JobApplication a " +
            "JOIN StudentProfile sp ON sp.user.id = a.student.id " +
            "WHERE a.status = 'SELECTED' GROUP BY sp.department")
    List<Object[]> placementsByDepartment();

    List<JobApplication> findByJobRecruiterIdOrderByAppliedAtDesc(Long recruiterId);
}
