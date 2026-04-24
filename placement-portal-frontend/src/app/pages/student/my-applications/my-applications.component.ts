import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { Application } from '../../../models/application.model';

@Component({
  selector: 'app-my-applications',
  templateUrl: './my-applications.component.html'
})
export class MyApplicationsComponent implements OnInit {

  applications: Application[] = [];
  loading = true;
  filter  = 'ALL';

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studentService.getMyApplications().subscribe({
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
    this.router.navigate(['/student/applications', id]);
  }

  getScoreClass(score: number): string {
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-medium';
    return 'score-low';
  }
}
