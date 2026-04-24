export type JobType = 'FULLTIME' | 'INTERNSHIP' | 'CONTRACT';

export interface Job {
  id: number;
  title: string;
  description: string;
  companyName: string;
  recruiterId: number;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  location: string;
  jobType: JobType;
  ctc: string;
  minCgpa: number;
  deadline: string;
  active: boolean;
  createdAt: string;
  applicantCount: number;
}

export interface JobRequest {
  title: string;
  description: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  location: string;
  jobType: JobType;
  ctc: string;
  minCgpa: number;
  deadline: string;
}

export interface SkillExtractResult {
  requiredSkills: string[];
  niceToHaveSkills: string[];
}

