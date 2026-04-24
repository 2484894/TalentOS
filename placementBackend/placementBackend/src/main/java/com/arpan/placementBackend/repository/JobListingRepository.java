package com.arpan.placementBackend.repository;


import com.arpan.placementBackend.enums.JobType;
import com.arpan.placementBackend.model.JobListing;
import com.arpan.placementBackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobListingRepository extends JpaRepository<JobListing, Long> {

    List<JobListing> findByRecruiter(User recruiter);

    List<JobListing> findByActiveTrue();

    @Query("SELECT j FROM JobListing j WHERE j.active = true " +
            "AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(j.recruiter.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:jobType IS NULL OR j.jobType = :jobType) " +
            "AND (:minCgpa IS NULL OR j.minCgpa <= :minCgpa) " +
            "AND (j.deadline IS NULL OR j.deadline >= :today)")
    List<JobListing> searchJobs(@Param("keyword") String keyword,
                                @Param("jobType") JobType jobType,
                                @Param("minCgpa") Double minCgpa,
                                @Param("today") LocalDate today);

    long countByActiveTrue();

    long countByActiveFalse();
}