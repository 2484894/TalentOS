import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecruiterService } from '../../../services/recruiter.service';
import { Job } from '../../../models/job.model';

@Component({
  selector: 'app-my-jobs',
  templateUrl: './my-jobs.component.html'
})
export class MyJobsComponent implements OnInit {

  jobs: Job[] = [];
  loading  = true;
  errorMsg = '';

  constructor(
    private recruiterService: RecruiterService,
    private router: Router
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.recruiterService.getMyJobs().subscribe({
      next: res => {
        this.loading = false;
        if (res.success) this.jobs = res.data;
      },
      error: () => { this.loading = false; }
    });
  }

  postNew()             { this.router.navigate(['/recruiter/jobs/new']); }
  editJob(id: number)   { this.router.navigate(['/recruiter/jobs', id, 'edit']); }
  viewApplicants(id: number) {
    this.router.navigate(['/recruiter/jobs', id, 'applicants']);
  }

  toggleStatus(job: Job): void {
    this.recruiterService.toggleJobStatus(job.id).subscribe({
      next: res => { if (res.success) job.active = res.data.active; }
    });
  }

  deleteJob(job: Job): void {
    if (!confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    this.recruiterService.deleteJob(job.id).subscribe({
      next: res => {
        if (res.success) this.jobs = this.jobs.filter(j => j.id !== job.id);
      }
    });
  }
}
