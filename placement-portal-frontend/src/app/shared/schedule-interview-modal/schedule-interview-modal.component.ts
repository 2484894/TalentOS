import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RecruiterService } from '../../services/recruiter.service';

@Component({
  selector: 'app-schedule-interview-modal',
  templateUrl: './schedule-interview-modal.component.html',
  styleUrls: ['./schedule-interview-modal.component.scss']
})
export class ScheduleInterviewModalComponent {

  /** Application ID to schedule interview for. Setting this opens the modal. */
  @Input() applicationId: number | null = null;

  /** Candidate name shown in the header. */
  @Input() candidateName = '';

  /** Emits when user closes (cancel). */
  @Output() closed = new EventEmitter<void>();

  /** Emits when slots are successfully proposed; parent should refresh data. */
  @Output() scheduled = new EventEmitter<void>();

  slots: string[] = ['', '', ''];   // up to 3 datetime-local values
  saving = false;
  errorMsg = '';

  constructor(private recruiterService: RecruiterService) {}

  /** Returns true if at least one slot has a value. */
  get hasAnySlot(): boolean {
    return this.slots.some(s => !!s && s.trim() !== '');
  }

  /** Get min datetime-local value (now, rounded up to next 15 min). */
  get minDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    now.setSeconds(0);
    now.setMilliseconds(0);
    // Format as YYYY-MM-DDTHH:mm in local time
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  cancel(): void {
    if (this.saving) return;
    this.reset();
    this.closed.emit();
  }

  send(): void {
    if (!this.applicationId) return;
    const valid = this.slots.filter(s => s && s.trim() !== '');
    if (valid.length === 0) {
      this.errorMsg = 'Add at least one time slot.';
      return;
    }

    this.saving = true;
    this.errorMsg = '';

    this.recruiterService.proposeSlots(this.applicationId, { proposedTimes: valid }).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) {
          // Also bump status to INTERVIEW_SCHEDULED so it shows up in the right filter
          this.recruiterService.updateApplicationStatus(this.applicationId!, {
            status: 'INTERVIEW_SCHEDULED'
          }).subscribe({
            next: () => {
              this.reset();
              this.scheduled.emit();
            },
            // Even if status update fails, slots were sent — still treat as success
            error: () => {
              this.reset();
              this.scheduled.emit();
            }
          });
        } else {
          this.errorMsg = res.message || 'Could not propose slots.';
        }
      },
      error: err => {
        this.saving = false;
        this.errorMsg = err?.message || 'Could not propose slots.';
      }
    });
  }

  private reset(): void {
    this.slots = ['', '', ''];
    this.errorMsg = '';
    this.saving = false;
  }
}
