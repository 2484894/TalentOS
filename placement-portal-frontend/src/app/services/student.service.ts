import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { StudentProfile, ResumeParseResult } from '../models/student-profile.model';
import { Job, SkillExtractResult } from '../models/job.model';
import { Application } from '../models/application.model';
import { InterviewSlot, ConfirmSlotRequest } from '../models/interview-slot.model';

@Injectable({ providedIn: 'root' })
export class StudentService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Profile ──────────────────────────────────────────────
  getMyProfile(): Observable<ApiResponse<StudentProfile>> {
    return this.http.get<ApiResponse<StudentProfile>>(`${this.api}/student/profile`);
  }

  updateProfile(data: Partial<StudentProfile>): Observable<ApiResponse<StudentProfile>> {
    return this.http.put<ApiResponse<StudentProfile>>(`${this.api}/student/profile`, data);
  }

  // ── Resume ───────────────────────────────────────────────
  uploadResume(file: File): Observable<ApiResponse<ResumeParseResult>> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<ApiResponse<ResumeParseResult>>(
      `${this.api}/student/resume/upload`, fd);
  }

  // ── Jobs ─────────────────────────────────────────────────
  searchJobs(keyword?: string, jobType?: string, minCgpa?: number):
      Observable<ApiResponse<Job[]>> {
    let params: any = {};
    if (keyword)  params['keyword']  = keyword;
    if (jobType)  params['jobType']  = jobType;
    if (minCgpa)  params['minCgpa']  = minCgpa;
    return this.http.get<ApiResponse<Job[]>>(`${this.api}/jobs`, { params });
  }

  getJobById(id: number): Observable<ApiResponse<Job>> {
    return this.http.get<ApiResponse<Job>>(`${this.api}/jobs/${id}`);
  }

  previewMatch(jobId: number): Observable<ApiResponse<Application>> {
    return this.http.get<ApiResponse<Application>>(
      `${this.api}/student/jobs/${jobId}/preview`);
  }

  // ── Applications ─────────────────────────────────────────
  applyForJob(jobId: number): Observable<ApiResponse<Application>> {
    return this.http.post<ApiResponse<Application>>(
      `${this.api}/student/applications/${jobId}`, {});
  }

  getMyApplications(): Observable<ApiResponse<Application[]>> {
    return this.http.get<ApiResponse<Application[]>>(
      `${this.api}/student/applications`);
  }

  getApplicationById(id: number): Observable<ApiResponse<Application>> {
    return this.http.get<ApiResponse<Application>>(
      `${this.api}/student/applications/${id}`);
  }

  // ── Interview Slots ──────────────────────────────────────
  getInterviewSlot(applicationId: number): Observable<ApiResponse<InterviewSlot>> {
    return this.http.get<ApiResponse<InterviewSlot>>(
      `${this.api}/interviews/${applicationId}`);
  }

  confirmSlot(applicationId: number, req: ConfirmSlotRequest):
      Observable<ApiResponse<InterviewSlot>> {
    return this.http.patch<ApiResponse<InterviewSlot>>(
      `${this.api}/student/interviews/${applicationId}/confirm`, req);
  }
}
