import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Job, JobRequest, SkillExtractResult } from '../models/job.model';
import { Application, ApplicationStatusRequest } from '../models/application.model';
import { InterviewSlot, ProposeSlotRequest } from '../models/interview-slot.model';

@Injectable({ providedIn: 'root' })
export class RecruiterService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Jobs ─────────────────────────────────────────────────
  getMyJobs(): Observable<ApiResponse<Job[]>> {
    return this.http.get<ApiResponse<Job[]>>(`${this.api}/recruiter/jobs`);
  }

  getJobById(id: number): Observable<ApiResponse<Job>> {
    return this.http.get<ApiResponse<Job>>(`${this.api}/jobs/${id}`);
  }

  createJob(data: JobRequest): Observable<ApiResponse<Job>> {
    return this.http.post<ApiResponse<Job>>(`${this.api}/recruiter/jobs`, data);
  }

  updateJob(id: number, data: JobRequest): Observable<ApiResponse<Job>> {
    return this.http.put<ApiResponse<Job>>(`${this.api}/recruiter/jobs/${id}`, data);
  }

  deleteJob(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/recruiter/jobs/${id}`);
  }

  toggleJobStatus(id: number): Observable<ApiResponse<Job>> {
    return this.http.patch<ApiResponse<Job>>(
      `${this.api}/recruiter/jobs/${id}/toggle`, {});
  }

  extractSkills(title: string, description: string):
      Observable<ApiResponse<SkillExtractResult>> {
    return this.http.post<ApiResponse<SkillExtractResult>>(
      `${this.api}/recruiter/jobs/extract-skills?jobTitle=${encodeURIComponent(title)}&jobDescription=${encodeURIComponent(description)}`,
      {}
    );
  }

  // ── Applicants ───────────────────────────────────────────
  getApplicants(jobId: number): Observable<ApiResponse<Application[]>> {
    return this.http.get<ApiResponse<Application[]>>(
      `${this.api}/recruiter/jobs/${jobId}/applicants`);
  }

  getApplicationById(id: number): Observable<ApiResponse<Application>> {
    return this.http.get<ApiResponse<Application>>(
      `${this.api}/student/applications/${id}`);
  }

  updateApplicationStatus(applicationId: number,
      req: ApplicationStatusRequest): Observable<ApiResponse<Application>> {
    return this.http.patch<ApiResponse<Application>>(
      `${this.api}/recruiter/applications/${applicationId}/status`, req);
  }

  // ── Interview Slots ──────────────────────────────────────
  proposeSlots(applicationId: number,
      req: ProposeSlotRequest): Observable<ApiResponse<InterviewSlot>> {
    return this.http.post<ApiResponse<InterviewSlot>>(
      `${this.api}/recruiter/interviews/${applicationId}/propose`, req);
  }

  getSlot(applicationId: number): Observable<ApiResponse<InterviewSlot>> {
    return this.http.get<ApiResponse<InterviewSlot>>(
      `${this.api}/interviews/${applicationId}`);
  }

  cancelSlot(applicationId: number): Observable<ApiResponse<InterviewSlot>> {
    return this.http.patch<ApiResponse<InterviewSlot>>(
      `${this.api}/recruiter/interviews/${applicationId}/cancel`, {});
  }
}
