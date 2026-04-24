package com.arpan.placementBackend.repository;


import com.arpan.placementBackend.model.StudentProfile;
import com.arpan.placementBackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByUser(User user);

    Optional<StudentProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
