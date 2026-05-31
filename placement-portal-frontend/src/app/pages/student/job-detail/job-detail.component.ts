import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { Job } from '../../../models/job.model';
import { Application } from '../../../models/application.model';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html'
})
export class JobDetailComponent implements OnInit {

  job: Job | null = null;
  loading       = true;
  applying      = false;
  previewing    = false;
  applied       = false;
  errorMsg      = '';
  successMsg    = '';
  previewResult: Application | null = null;
  previewError  = '';   // separate error so a preview failure doesn't block apply

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.studentService.getJobById(id).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.job = res.data;
          // CHANGE — auto-fetch AI match as soon as job loads, no button needed
          this.previewMatch();
        }
      },
      error: () => { this.loading = false; }
    });
  }

  previewMatch(): void {
    if (!this.job) return;
    this.previewing   = true;
    this.previewError = '';
    this.previewResult = null;
    this.studentService.previewMatch(this.job.id).subscribe({
      next: res => {
        this.previewing = false;
        if (res.success) this.previewResult = res.data;
      },
      error: err => {
        this.previewing  = false;
        this.previewError = err?.message || 'Could not compute match score. You can still apply.';
      }
    });
  }

  apply(): void {
    if (!this.job) return;
    this.applying  = true;
    this.errorMsg  = '';
    this.successMsg = '';
    this.studentService.applyForJob(this.job.id).subscribe({
      next: res => {
        this.applying = false;
        if (res.success) {
          this.applied    = true;
          this.successMsg = 'Application submitted!';
        } else {
          this.errorMsg = res.message;
        }
      },
      error: err => {
        this.applying = false;
        this.errorMsg = err.message || 'Application failed.';
      }
    });
  }

  getScoreClass(score: number): string {
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-medium';
    return 'score-low';
  }

  goBack(): void { this.router.navigate(['/student/jobs']); }
}
