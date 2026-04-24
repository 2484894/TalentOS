export interface StudentProfile {
  id: number;
  userId: number;
  name: string;
  email: string;
  department: string;
  batch: string;
  cgpa: number;
  skills: string[];
  resumeUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  projects: string;
  certifications: string;
  phone: string;
  profileCompletePct: number;
}

export interface ResumeParseResult {
  resumeUrl: string;
  parsedName: string;
  parsedSkills: string[];
  parsedEducation: string;
  parsedExperience: string;
}

