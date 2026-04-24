import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecruiterService } from '../../../services/recruiter.service';
import { Application, ApplicationStatus } from '../../../models/application.model';
import { InterviewSlot } from '../../../models/interview-slot.model';

@Component({
  selector: 'app-applicant-detail',
  templateUrl: './applicant-detail.component.html'
})
export class ApplicantDetailComponent implements OnInit {

  application: Application | null = null;
  slot: InterviewSlot | null = null;
  loading      = true;
  updatingStatus = false;
  proposingSlots = false;
  errorMsg     = '';
  successMsg   = '';
  selectedStatus: ApplicationStatus = 'APPLIED';
  recruiterNote  = '';
  newSlots: string[] = ['', ''];

  statuses: ApplicationStatus[] = [
    'APPLIED','SHORTLISTED','INTERVIEW_SCHEDULED','SELECTED','REJECTED'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recruiterService: RecruiterService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.recruiterService.getApplicationById(id).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.application    = res.data;
          this.selectedStatus = res.data.status;
          this.recruiterNote  = res.data.recruiterNote || '';
          if (res.data.status === 'INTERVIEW_SCHEDULED') {
            this.loadSlot(res.data.id);
          }
        }
      },
      error: () => { this.loading = false; }
    });
  }

  loadSlot(appId: number): void {
    this.recruiterService.getSlot(appId).subscribe({
      next: res => { if (res.success) this.slot = res.data; },
      error: () => {}
    });
  }

  updateStatus(): void {
    if (!this.application) return;
    this.updatingStatus = true;
    this.errorMsg = '';

    this.recruiterService.updateApplicationStatus(this.application.id, {
      status: this.selectedStatus,
      recruiterNote: this.recruiterNote
    }).subscribe({
      next: res => {
        this.updatingStatus = false;
        if (res.success) {
          this.application   = res.data;
          this.successMsg    = 'Status updated successfully!';
          setTimeout(() => this.successMsg = '', 3000);
        }
      },
      error: err => {
        this.updatingStatus = false;
        this.errorMsg = err.message || 'Update failed.';
      }
    });
  }

  proposeSlots(): void {
    if (!this.application) return;
    const valid = this.newSlots.filter(s => s.trim() !== '');
    if (valid.length === 0) {
      this.errorMsg = 'Add at least one time slot.';
      return;
    }
    this.proposingSlots = true;
    this.recruiterService.proposeSlots(this.application.id,
      { proposedTimes: valid }).subscribe({
      next: res => {
        this.proposingSlots = false;
        if (res.success) {
          this.slot       = res.data;
          this.successMsg = 'Interview slots proposed!';
          setTimeout(() => this.successMsg = '', 3000);
        }
      },
      error: err => {
        this.proposingSlots = false;
        this.errorMsg = err.message || 'Failed to propose slots.';
      }
    });
  }

  addSlotField(): void  { this.newSlots.push(''); }
  removeSlot(i: number) { this.newSlots.splice(i, 1); }

  getScoreClass(score: number): string {
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-medium';
    return 'score-low';
  }

  goBack(): void { this.router.navigate(['/recruiter/jobs']); }
}
