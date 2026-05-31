import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Application } from '../../models/application.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-applicant-compare-modal',
  templateUrl: './applicant-compare-modal.component.html',
  styleUrls: ['./applicant-compare-modal.component.scss']
})
export class ApplicantCompareModalComponent {

  @Input() applicants: Application[] = [];
  @Output() closed = new EventEmitter<void>();

  private fileHost = environment.apiUrl.replace(/\/api\/v1\/?$/, '');

  close(): void { this.closed.emit(); }

  matchClass(score: number | null | undefined): string {
    if (!score) return 'cmp-low';
    if (score >= 70) return 'cmp-high';
    if (score >= 40) return 'cmp-medium';
    return 'cmp-low';
  }

  get allSkillsUnion(): string[] {
    const set = new Set<string>();
    for (const a of this.applicants) {
      for (const s of a.studentSkills || []) set.add(s);
    }
    return [...set].sort((x, y) => x.localeCompare(y));
  }

  applicantHasSkill(app: Application, skill: string): boolean {
    return (app.studentSkills || []).some(s => s.toLowerCase() === skill.toLowerCase());
  }

  openResume(app: Application): void {
    if (!app.studentResumeUrl) return;
    const url = app.studentResumeUrl.startsWith('http')
      ? app.studentResumeUrl
      : `${this.fileHost}${app.studentResumeUrl}`;
    window.open(url, '_blank', 'noopener');
  }

  get skillsToShow(): string[] {
    return this.allSkillsUnion.slice(0, 25);
  }

  get hasMoreSkills(): boolean {
    return this.allSkillsUnion.length > 25;
  }
}
