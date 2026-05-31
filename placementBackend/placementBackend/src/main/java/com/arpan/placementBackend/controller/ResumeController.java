package com.arpan.placementBackend.controller;

import com.arpan.placementBackend.dto.response.ApiResponse;
import com.arpan.placementBackend.dto.response.ResumeParseResponse;
import com.arpan.placementBackend.model.StudentProfile;
import com.arpan.placementBackend.model.User;
import com.arpan.placementBackend.repository.StudentProfileRepository;
import com.arpan.placementBackend.service.FileStorageService;
import com.arpan.placementBackend.service.StudentProfileService;
import com.arpan.placementBackend.service.ai.AIService;
import com.arpan.placementBackend.service.ai.dto.AIResumeParseResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/student/resume")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final FileStorageService fileStorageService;

    private final StudentProfileService profileService;
    private final AIService aiService;
    private final StudentProfileService studentProfileService;
    private final StudentProfileRepository profileRepository;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ResumeParseResponse>> uploadResume(
            @AuthenticationPrincipal User currentUser,
            @RequestParam("file") MultipartFile file) {

        // 1. Store file and get URL
        String resumeUrl = fileStorageService.storeResume(file);

        // 2. Update profile resume URL
        profileService.updateResumeUrl(currentUser.getId(), resumeUrl);

        // 3. Extract text from PDF and call AI parser
        AIResumeParseResult parseResult = null;
        try {
            // PDFBox 3.x uses Loader.loadPDF(byte[]) instead of PDDocument.load(InputStream)
            byte[] pdfBytes = file.getBytes();
            PDDocument document = Loader.loadPDF(pdfBytes);  // ← fixed line
            PDFTextStripper stripper = new PDFTextStripper();
            String resumeText = stripper.getText(document);
            document.close();

            if (resumeText != null && !resumeText.isBlank()) {
                parseResult = aiService.parseResume(resumeText);
            }
        } catch (Exception e) {
            log.warn("PDF text extraction or AI parsing failed: {}", e.getMessage());
        }

        ResumeParseResponse response = ResumeParseResponse.builder()
                .resumeUrl(resumeUrl)
                .parsedName(parseResult != null ? parseResult.getName() : null)
                .parsedSkills(parseResult != null ? parseResult.getSkills() : new ArrayList<>())
                .parsedEducation(parseResult != null ? parseResult.getEducation() : null)
                .parsedExperience(parseResult != null ? parseResult.getExperience() : null)
                .build();

        List<String> sk = parseResult != null ? parseResult.getSkills() : new ArrayList<>();
        StudentProfile profile = profileRepository.findByUserId(currentUser.getId())
                .orElse(StudentProfile.builder().user(currentUser).build());
        profile.setSkills(sk);
        profileRepository.save(profile);

        return ResponseEntity.ok(ApiResponse.success(
                "Resume uploaded and parsed successfully.", response));
    }
};
