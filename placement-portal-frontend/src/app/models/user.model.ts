export type Role = 'STUDENT' | 'RECRUITER' | 'ADMIN';

export interface User {
  userId: number;
  name: string;
  email: string;
  role: Role;
  token: string;
}

