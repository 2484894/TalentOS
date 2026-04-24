import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StudentService } from '../../../services/student.service';
import { StudentProfile } from '../../../models/student-profile.model';
import { Application } from '../../../models/application.model';
import { Job } from '../../../models/job.model';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html'
})
export class StudentDashboardComponent implements OnInit {

  profile: StudentProfile | null = null;
  applications: Application[] = [];
  topJobs: Job[] = [];
  loading = true;
  greeting = '';
  today    = '';
  userName = '';

  get totalApplied()  { return this.applications.length; }
  get shortlisted()   { return this.applications.filter(a => a.status === 'SHORTLISTED').length; }
  get interviews()    { return this.applications.filter(a => a.status === 'INTERVIEW_SCHEDULED').length; }
  get selected()      { return this.applications.filter(a => a.status === 'SELECTED').length; }
  get avgMatchScore() {
    const scored = this.applications.filter(a => a.aiMatchScore);
    if (!scored.length) return 0;
    return Math.round(scored.reduce((s, a) => s + a.aiMatchScore, 0) / scored.length);
  }

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name.split(' ')[0] || 'there';
    this.greeting = this.getGreeting();
    this.today = new Date().toLocaleDateString('en-US',
      { weekday: 'long', month: 'long', day: 'numeric' });

    this.loadAll();
  }

  loadAll(): void {
    this.studentService.getMyProfile().subscribe({
      next: res => { if (res.success) this.profile = res.data; },
      error: () => {}
    });

    this.studentService.getMyApplications().subscribe({
      next: res => {
        if (res.success) this.applications = res.data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    this.studentService.searchJobs().subscribe({
      next: res => {
        if (res.success) this.topJobs = res.data.slice(0, 3);
      },
      error: () => {}
    });
  }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  viewJob(id: number)       { this.router.navigate(['/student/jobs', id]); }
  viewApp(id: number)       { this.router.navigate(['/student/applications', id]); }
  goToJobs()                { this.router.navigate(['/student/jobs']); }
  goToApplications()        { this.router.navigate(['/student/applications']); }
  goToProfile()             { this.router.navigate(['/student/profile']); }
  goToResume()              { this.router.navigate(['/student/resume']); }
}
