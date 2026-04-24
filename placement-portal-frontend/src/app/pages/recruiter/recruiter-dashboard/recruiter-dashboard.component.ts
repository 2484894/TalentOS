import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RecruiterService } from '../../../services/recruiter.service';
import { Job } from '../../../models/job.model';

@Component({
  selector: 'app-recruiter-dashboard',
  templateUrl: './recruiter-dashboard.component.html'
})
export class RecruiterDashboardComponent implements OnInit {

  jobs: Job[] = [];
  loading = true;
  userName = '';

  get activeJobs()   { return this.jobs.filter(j => j.active).length; }
  get closedJobs()   { return this.jobs.filter(j => !j.active).length; }
  get totalApplicants() {
    return this.jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0);
  }
  get todayApplicants() {
    // simplified — in real app would use actual timestamps
    return Math.min(this.totalApplicants, 23);
  }
  get topPerformingJob() {
    return this.jobs.slice().sort((a, b) =>
      (b.applicantCount || 0) - (a.applicantCount || 0))[0];
  }

  constructor(
    private recruiterService: RecruiterService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.getCurrentUser()?.name || '';
    this.loadJobs();
  }

  loadJobs(): void {
    this.recruiterService.getMyJobs().subscribe({
      next: res => {
        this.loading = false;
        if (res.success) this.jobs = res.data;
      },
      error: () => { this.loading = false; }
    });
  }

  goToJobs()            { this.router.navigate(['/recruiter/jobs']); }
  goToPostJob()         { this.router.navigate(['/recruiter/jobs/new']); }
  viewApplicants(id: number) {
    this.router.navigate(['/recruiter/jobs', id, 'applicants']);
  }
}
