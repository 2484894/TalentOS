export type ApplicationStatus =
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'SELECTED'
  | 'REJECTED';

export interface Application {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentDepartment: string;
  studentCgpa: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  aiMatchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  aiSuggestion: string;
  recruiterNote: string;
  appliedAt: string;
}

export interface ApplicationStatusRequest {
  status: ApplicationStatus;
  recruiterNote?: string;
}

