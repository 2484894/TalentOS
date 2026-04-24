import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { Application } from '../../../models/application.model';
import { InterviewSlot } from '../../../models/interview-slot.model';

@Component({
  selector: 'app-application-detail',
  templateUrl: './application-detail.component.html'
})
export class ApplicationDetailComponent implements OnInit {

  application: Application | null = null;
  slot: InterviewSlot | null = null;
  loading       = true;
  confirming    = false;
  selectedSlot  = '';
  successMsg    = '';
  errorMsg      = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.studentService.getApplicationById(id).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.application = res.data;
          if (res.data.status === 'INTERVIEW_SCHEDULED') {
            this.loadSlot(res.data.id);
          }
        }
      },
      error: () => { this.loading = false; }
    });
  }

  loadSlot(applicationId: number): void {
    this.studentService.getInterviewSlot(applicationId).subscribe({
      next: res => { if (res.success) this.slot = res.data; },
      error: () => {}
    });
  }

  confirmSlot(): void {
    if (!this.selectedSlot || !this.application) return;
    this.confirming = true;
    this.studentService.confirmSlot(this.application.id,
      { confirmedTime: this.selectedSlot }).subscribe({
      next: res => {
        this.confirming = false;
        if (res.success) {
          this.slot       = res.data;
          this.successMsg = 'Interview slot confirmed!';
        }
      },
      error: err => {
        this.confirming = false;
        this.errorMsg   = err.message || 'Failed to confirm slot.';
      }
    });
  }

  getScoreClass(score: number): string {
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-medium';
    return 'score-low';
  }

  goBack(): void { this.router.navigate(['/student/applications']); }
}
