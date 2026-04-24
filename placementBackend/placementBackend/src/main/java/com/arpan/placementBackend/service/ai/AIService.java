package com.arpan.placementBackend.service.ai;

import com.arpan.placementBackend.model.JobListing;
import com.arpan.placementBackend.model.StudentProfile;
import com.arpan.placementBackend.service.ai.dto.AIMatchResult;
import com.arpan.placementBackend.service.ai.dto.AIResumeParseResult;
import com.arpan.placementBackend.service.ai.dto.AISkillExtractResult;

public interface AIService {

    AIResumeParseResult parseResume(String resumeText);

    AISkillExtractResult extractSkillsFromJD(String jobTitle, String jobDescription);

    AIMatchResult matchCandidateToJob(StudentProfile profile, JobListing job);
}