import { Component, Input } from '@angular/core';
import { ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html'
})
export class StatusBadgeComponent {
  @Input() status: ApplicationStatus | string = 'APPLIED';

  getLabel(): string {
    const map: Record<string, string> = {
      'APPLIED':              'Applied',
      'SHORTLISTED':          'Shortlisted',
      'INTERVIEW_SCHEDULED':  'Interview',
      'SELECTED':             'Selected',
      'REJECTED':             'Rejected'
    };
    return map[this.status] || this.status;
  }
}
