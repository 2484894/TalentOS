import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { Job } from '../../../models/job.model';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html'
})
export class JobListComponent implements OnInit {

  jobs: Job[] = [];
  loading  = true;
  keyword  = '';
  jobType  = '';
  minCgpa: number | undefined;

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void { this.loadJobs(); }

  loadJobs(): void {
    this.loading = true;
    this.studentService.searchJobs(
      this.keyword || undefined,
      this.jobType || undefined,
      this.minCgpa
    ).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) this.jobs = res.data;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearch(): void { this.loadJobs(); }

  clearFilters(): void {
    this.keyword = '';
    this.jobType = '';
    this.minCgpa = undefined;
    this.loadJobs();
  }

  viewJob(id: number): void {
    this.router.navigate(['/student/jobs', id]);
  }

  getDaysLeft(deadline: string): number {
    if (!deadline) return 0;
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
