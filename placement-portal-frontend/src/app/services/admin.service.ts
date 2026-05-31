import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { StudentProfile } from '../models/student-profile.model';

export interface DashboardStats {
  totalStudents: number;
  totalRecruiters: number;
  totalJobsActive: number;
  totalJobsClosed: number;
  totalApplications: number;
  studentsPlaced: number;
  placementPercentage: number;
  applicationsByStatus: { [key: string]: number };
  placementsByDepartment: { [key: string]: number };
  topCompanies: { company: string; count: number }[];
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

/** One row in the Selected Candidates report. Mirrors PlacementRecord on the backend. */
export interface PlacementRecord {
  applicationId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  college: string | null;
  department: string | null;
  batch: string | null;
  cgpa: number | null;
  jobId: number;
  jobTitle: string;
  companyName: string;
  ctc: string | null;
  location: string | null;
  appliedAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.api}/admin/dashboard`);
  }

  getAllUsers(): Observable<ApiResponse<AdminUser[]>> {
    return this.http.get<ApiResponse<AdminUser[]>>(`${this.api}/admin/users`);
  }

  toggleUserStatus(userId: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(
      `${this.api}/admin/users/${userId}/toggle-status`, {});
  }

  getAllStudents(): Observable<ApiResponse<StudentProfile[]>> {
    return this.http.get<ApiResponse<StudentProfile[]>>(`${this.api}/admin/students`);
  }

  /** NEW — flat list of all selected candidates with company info. */
  getPlacements(): Observable<ApiResponse<PlacementRecord[]>> {
    return this.http.get<ApiResponse<PlacementRecord[]>>(`${this.api}/admin/placements`);
  }

  downloadCsvReport(): Observable<string> {
    return this.http.get(`${this.api}/admin/report/csv`, { responseType: 'text' });
  }
}
