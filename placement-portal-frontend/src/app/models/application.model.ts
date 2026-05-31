export type ApplicationStatus =
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'SELECTED'
  | 'REJECTED';

export interface Application {
  // Identity
  id: number;
  appliedAt: string;
  status: ApplicationStatus;

  // Student core
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentDepartment: string;
  studentCgpa: number;

  // Student rich profile
  studentCollege?: string;
  studentBatch?: string;
  studentSkills?: string[];
  studentResumeUrl?: string;
  studentLinkedinUrl?: string;
  studentGithubUrl?: string;
  studentPhone?: string;
  studentProjects?: string;
  studentCertifications?: string;
  studentProfileCompletePct?: number;

  // Job
  jobId: number;
  jobTitle: string;
  companyName: string;

  // AI match
  aiMatchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  aiSuggestion: string;

  // Recruiter
  recruiterNote: string;
}

export interface ApplicationStatusRequest {
  status: ApplicationStatus;
  recruiterNote?: string;
}
