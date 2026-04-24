import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecruiterService } from '../../../services/recruiter.service';
import { Application } from '../../../models/application.model';
import { Job } from '../../../models/job.model';

@Component({
  selector: 'app-applicant-list',
  templateUrl: './applicant-list.component.html'
})
export class ApplicantListComponent implements OnInit {

  applications: Application[] = [];
  job: Job | null = null;
  jobId = 0;
  loading  = true;
  filter   = 'ALL';

  constructor(
    private recruiterService: RecruiterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.jobId = Number(this.route.snapshot.paramMap.get('id'));
    this.recruiterService.getJobById(this.jobId).subscribe({
      next: res => { if (res.success) this.job = res.data; }
    });
    this.recruiterService.getApplicants(this.jobId).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) this.applications = res.data;
      },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): Application[] {
    if (this.filter === 'ALL') return this.applications;
    return this.applications.filter(a => a.status === this.filter);
  }

  viewDetail(id: number): void {
    this.router.navigate(['/recruiter/applicants', id]);
  }

  getScoreClass(score: number): string {
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-medium';
    return 'score-low';
  }

  goBack(): void { this.router.navigate(['/recruiter/jobs']); }
}
