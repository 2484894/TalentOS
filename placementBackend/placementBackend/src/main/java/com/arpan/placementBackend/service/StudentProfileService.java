package com.arpan.placementBackend.service;
import com.arpan.placementBackend.dto.request.StudentProfileRequest;
import com.arpan.placementBackend.dto.response.StudentProfileResponse;
import com.arpan.placementBackend.exception.ResourceNotFoundException;
import com.arpan.placementBackend.model.StudentProfile;
import com.arpan.placementBackend.model.User;
import com.arpan.placementBackend.repository.StudentProfileRepository;
import com.arpan.placementBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class StudentProfileService {

    private final StudentProfileRepository profileRepository;
    private final UserRepository userRepository;

    public StudentProfileResponse getProfile(Long userId) {
        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));
        return mapToResponse(profile);
    }

    public StudentProfileResponse createOrUpdateProfile(Long userId, StudentProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElse(StudentProfile.builder().user(user).build());

        if (request.getCollege() != null) profile.setCollege(request.getCollege());           // NEW
        if (request.getDepartment() != null) profile.setDepartment(request.getDepartment());
        if (request.getBatch() != null) profile.setBatch(request.getBatch());
        if (request.getCgpa() != null) profile.setCgpa(request.getCgpa());
        if (request.getSkills() != null) profile.setSkills(request.getSkills());
        if (request.getProjects() != null) profile.setProjects(request.getProjects());
        if (request.getCertifications() != null) profile.setCertifications(request.getCertifications());
        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getGithubUrl() != null) profile.setGithubUrl(request.getGithubUrl());

        profile.setProfileCompletePct(calculateCompletion(profile));
        profileRepository.save(profile);

        return mapToResponse(profile);
    }

    public void updateResumeUrl(Long userId, String resumeUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElse(StudentProfile.builder().user(user).skills(new ArrayList<>()).build());

        profile.setResumeUrl(resumeUrl);
        profile.setProfileCompletePct(calculateCompletion(profile));
        profileRepository.save(profile);
    }

    private int calculateCompletion(StudentProfile p) {
        int score = 0;
        if (p.getCollege()    != null && !p.getCollege().isBlank())    score += 10;   // NEW (10)
        if (p.getDepartment() != null && !p.getDepartment().isBlank()) score += 10;   // was 15, redistributed
        if (p.getCgpa() != null) score += 15;
        if (p.getSkills() != null && !p.getSkills().isEmpty()) score += 20;
        if (p.getResumeUrl() != null && !p.getResumeUrl().isBlank()) score += 20;
        if (p.getProjects()  != null && !p.getProjects().isBlank())  score += 10;     // was 15
        if (p.getLinkedinUrl() != null && !p.getLinkedinUrl().isBlank()) score += 8;
        if (p.getGithubUrl()   != null && !p.getGithubUrl().isBlank())   score += 7;
        return score;   // total: 100
    }

    public StudentProfileResponse mapToResponse(StudentProfile p) {
        return StudentProfileResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .name(p.getUser().getName())
                .email(p.getUser().getEmail())
                .college(p.getCollege())        // NEW
                .department(p.getDepartment())
                .batch(p.getBatch())
                .cgpa(p.getCgpa())
                .skills(p.getSkills())
                .resumeUrl(p.getResumeUrl())
                .linkedinUrl(p.getLinkedinUrl())
                .githubUrl(p.getGithubUrl())
                .projects(p.getProjects())
                .certifications(p.getCertifications())
                .phone(p.getPhone())
                .profileCompletePct(p.getProfileCompletePct())
                .build();
    }
}