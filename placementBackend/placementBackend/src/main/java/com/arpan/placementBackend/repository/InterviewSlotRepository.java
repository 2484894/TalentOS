package com.arpan.placementBackend.repository;

import com.arpan.placementBackend.model.InterviewSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterviewSlotRepository extends JpaRepository<InterviewSlot, Long> {

    Optional<InterviewSlot> findByApplicationId(Long applicationId);

    boolean existsByApplicationId(Long applicationId);
}
