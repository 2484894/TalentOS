import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { Job } from '../../../models/job.model';
import { Application } from '../../../models/application.model';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {

  jobs: Job[] = [];
  loading  = true;
  keyword  = '';
  jobType  = '';
  tab: 'ALL' | 'APPLIED' = 'ALL';

  /** Selected job for the right-pane detail view. */
  selectedJob: Job | null = null;
  selectedJobLoading = false;

  /** AI match preview for the selected job (auto-loaded). */
  preview: Application | null = null;
  previewing = false;
  previewError = '';

  /** Application status messages. */
  applying = false;
  applied = false;
  errorMsg = '';
  successMsg = '';

  /** IDs of jobs the student has already applied to (so we can mark them in the list). */
  appliedJobIds = new Set<number>();

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppliedIds();
    this.loadJobs();
  }

  /** Pull the student's applications once so we can flag applied-to jobs in the list. */
  loadAppliedIds(): void {
    this.studentService.getMyApplications().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.appliedJobIds = new Set(res.data.map(a => a.jobId));
        }
      }
    });
  }

  loadJobs(): void {
    this.loading = true;
    this.studentService.searchJobs(
      this.keyword || undefined,
      this.jobType || undefined,
      undefined
    ).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.jobs = res.data;
          // Auto-select first job on load so the right pane has content
          if (!this.selectedJob && this.filteredJobs.length > 0) {
            this.selectJob(this.filteredJobs[0]);
          }
        }
      },
      error: () => { this.loading = false; }
    });
  }

  get filteredJobs(): Job[] {
    if (this.tab === 'APPLIED') {
      return this.jobs.filter(j => this.appliedJobIds.has(j.id));
    }
    return this.jobs;
  }

  onSearch(): void {
    this.selectedJob = null;
    this.loadJobs();
  }

  clearFilters(): void {
    this.keyword = '';
    this.jobType = '';
    this.selectedJob = null;
    this.loadJobs();
  }

  /** When user clicks a job in the left list, load its details + AI match in the right pane. */
  selectJob(job: Job): void {
    this.selectedJob = job;
    this.preview = null;
    this.previewError = '';
    this.applied = this.appliedJobIds.has(job.id);
    this.errorMsg = '';
    this.successMsg = '';

    // Auto-fetch the AI match score
    this.previewing = true;
    this.studentService.previewMatch(job.id).subscribe({
      next: res => {
        this.previewing = false;
        if (res.success) this.preview = res.data;
      },
      error: err => {
        this.previewing = false;
        this.previewError = err?.message || 'Could not compute match score.';
      }
    });
  }

  apply(): void {
    if (!this.selectedJob) return;
    this.applying = true;
    this.errorMsg = '';

    this.studentService.applyForJob(this.selectedJob.id).subscribe({
      next: res => {
        this.applying = false;
        if (res.success) {
          this.applied = true;
          this.appliedJobIds.add(this.selectedJob!.id);
          this.successMsg = 'Application submitted!';
        } else {
          this.errorMsg = res.message;
        }
      },
      error: err => {
        this.applying = false;
        this.errorMsg = err?.message || 'Application failed.';
      }
    });
  }

  isApplied(jobId: number): boolean {
    return this.appliedJobIds.has(jobId);
  }

  getDaysLeft(deadline: string | null | undefined): number {
    if (!deadline) return 0;
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  isDeadlineUrgent(deadline: string | null | undefined): boolean {
    const d = this.getDaysLeft(deadline);
    return d > 0 && d <= 3;
  }

  /** For the right-pane "open in dedicated page" link. */
  openFullDetail(): void {
    if (this.selectedJob) {
      this.router.navigate(['/student/jobs', this.selectedJob.id]);
    }
  }
}
