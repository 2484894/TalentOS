package com.arpan.placementBackend.service.ai;

import com.arpan.placementBackend.exception.AIServiceException;
import com.arpan.placementBackend.model.JobListing;
import com.arpan.placementBackend.model.StudentProfile;
import com.arpan.placementBackend.service.ai.dto.AIMatchResult;
import com.arpan.placementBackend.service.ai.dto.AIResumeParseResult;
import com.arpan.placementBackend.service.ai.dto.AISkillExtractResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIServiceImpl implements AIService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.api-url}")
    private String apiUrl;

    // ── Core Gemini Caller ────────────────────────────────────────────────

    private String callGemini(String prompt) {
        String url = apiUrl + "?key=" + apiKey;

        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", List.of(textPart));
        Map<String, Object> requestBody = Map.of("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            throw new AIServiceException("Gemini API call failed", e);
        }
    }

    // Strips markdown code fences that Gemini sometimes wraps around JSON
    private String cleanJson(String raw) {
        return raw.replaceAll("(?s)```json\\s*", "")
                .replaceAll("(?s)```\\s*", "")
                .trim();
    }

    // ── 1. Resume Parser ─────────────────────────────────────────────────

    @Override
    public AIResumeParseResult parseResume(String resumeText) {
        String prompt = """
                You are a resume parser. Analyze the following resume text and extract information.
                Respond ONLY with a valid JSON object — no extra text, no markdown, no explanation.
                JSON format:
                {
                  "name": "Full name of the candidate",
                  "skills": ["skill1", "skill2", "skill3"],
                  "education": "Highest education qualification as a single string",
                  "experience": "Total experience summary as a single string"
                }
                Resume Text:
                """ + resumeText;

        try {
            String raw = callGemini(prompt);
            String json = cleanJson(raw);
            return objectMapper.readValue(json, AIResumeParseResult.class);
        } catch (AIServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Resume parse failed: {}", e.getMessage());
            return AIResumeParseResult.builder()
                    .name("")
                    .skills(new ArrayList<>())
                    .education("")
                    .experience("")
                    .build();
        }
    }

    // ── 2. Job Skill Extractor ───────────────────────────────────────────

    @Override
    public AISkillExtractResult extractSkillsFromJD(String jobTitle, String jobDescription) {
        String prompt = """
                You are a technical job description analyzer.
                Given the job title and description below, extract skills.
                Respond ONLY with a valid JSON object — no extra text, no markdown, no explanation.
                JSON format:
                {
                  "requiredSkills": ["skill1", "skill2"],
                  "niceToHaveSkills": ["skill3", "skill4"]
                }
                Job Title: """ + jobTitle + """
                
                Job Description:
                """ + jobDescription;

        try {
            String raw = callGemini(prompt);
            String json = cleanJson(raw);
            return objectMapper.readValue(json, AISkillExtractResult.class);
        } catch (AIServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Skill extract failed: {}", e.getMessage());
            return AISkillExtractResult.builder()
                    .requiredSkills(new ArrayList<>())
                    .niceToHaveSkills(new ArrayList<>())
                    .build();
        }
    }

    // ── 3. Candidate-Job Match Scorer ────────────────────────────────────

    @Override
    public AIMatchResult matchCandidateToJob(StudentProfile profile, JobListing job) {
        String studentSkills = profile.getSkills() != null
                ? String.join(", ", profile.getSkills()) : "None";
        String jobSkills = job.getRequiredSkills() != null
                ? String.join(", ", job.getRequiredSkills()) : "None";

        String prompt = """
                You are a recruitment AI. Evaluate the match between a student and a job opening.
                Respond ONLY with a valid JSON object — no extra text, no markdown, no explanation.
                JSON format:
                {
                  "matchScore": <integer 0-100>,
                  "matchedSkills": ["skill1", "skill2"],
                  "missingSkills": ["skill3", "skill4"],
                  "summary": "<one sentence summary max 30 words>"
                }
                Student Profile:
                - Name: """ + profile.getUser().getName() + """
                
                - CGPA: """ + profile.getCgpa() + """
                
                - Skills: """ + studentSkills + """
                
                - Projects: """ + (profile.getProjects() != null ? profile.getProjects() : "None") + """
                
                Job Details:
                - Title: """ + job.getTitle() + """
                
                - Required Skills: """ + jobSkills + """
                
                - Description: """ + job.getDescription();

        try {
            String raw = callGemini(prompt);
            String json = cleanJson(raw);
            return objectMapper.readValue(json, AIMatchResult.class);
        } catch (AIServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Match scoring failed: {}", e.getMessage());
            return AIMatchResult.builder()
                    .matchScore(0)
                    .matchedSkills(new ArrayList<>())
                    .missingSkills(new ArrayList<>())
                    .summary("AI scoring unavailable. Please review manually.")
                    .build();
        }
    }
}
