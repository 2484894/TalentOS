import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecruiterService } from '../../../services/recruiter.service';
import { Application, ApplicationStatus } from '../../../models/application.model';
import { Job } from '../../../models/job.model';
import { environment } from '../../../../environments/environment';

type SortKey =
  | 'match-desc' | 'match-asc'
  | 'cgpa-desc'  | 'cgpa-asc'
  | 'date-desc'  | 'date-asc'
  | 'name-asc';

@Component({
  selector: 'app-applicant-list',
  templateUrl: './applicant-list.component.html',
  styleUrls: ['./applicant-list.component.scss']
})
export class ApplicantListComponent implements OnInit {

  applications: Application[] = [];
  job: Job | null = null;
  jobId = 0;
  loading = true;

  // Filter state
  statusFilter: ApplicationStatus | 'ALL' = 'ALL';
  search = '';
  minAiScore = 0;
  activeSkillFilters = new Set<string>();
  sortKey: SortKey = 'match-desc';

  // Expanded rows
  expandedIds = new Set<number>();

  // Comparison selection
  selectedForCompare = new Set<number>();
  compareMode = false;
  showCompareModal = false;
  readonly maxCompare = 4;

  // Per-row state
  pendingId: number | null = null;
  scheduleAppId: number | null = null;
  scheduleCandidateName = '';

  // Banners
  successMsg = '';
  errorMsg = '';

  private fileHost = environment.apiUrl.replace(/\/api\/v1\/?$/, '');

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
    this.loadApplicants();
  }

  loadApplicants(): void {
    this.loading = true;
    this.recruiterService.getApplicants(this.jobId).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) this.applications = res.data;
      },
      error: () => { this.loading = false; }
    });
  }

  get skillPool(): { skill: string; count: number }[] {
    const map = new Map<string, number>();
    for (const a of this.applications) {
      for (const s of a.studentSkills || []) {
        map.set(s, (map.get(s) || 0) + 1);
      }
    }
    return [...map.entries()]
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }

  get filtered(): Application[] {
    const q = this.search.trim().toLowerCase();

    let out = this.applications.filter(a => {
      if (this.statusFilter !== 'ALL' && a.status !== this.statusFilter) return false;
      if (this.minAiScore > 0 && (a.aiMatchScore || 0) < this.minAiScore) return false;

      if (this.activeSkillFilters.size > 0) {
        const have = new Set((a.studentSkills || []).map(s => s.toLowerCase()));
        for (const wanted of this.activeSkillFilters) {
          if (!have.has(wanted.toLowerCase())) return false;
        }
      }

      if (q) {
        const hay = [
          a.studentName,
          a.studentEmail,
          a.studentCollege,
          a.studentDepartment,
          ...(a.studentSkills || [])
        ].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });

    out = [...out].sort((a, b) => {
      switch (this.sortKey) {
        case 'match-desc': return (b.aiMatchScore || 0) - (a.aiMatchScore || 0);
        case 'match-asc':  return (a.aiMatchScore || 0) - (b.aiMatchScore || 0);
        case 'cgpa-desc':  return (b.studentCgpa || 0)  - (a.studentCgpa || 0);
        case 'cgpa-asc':   return (a.studentCgpa || 0)  - (b.studentCgpa || 0);
        case 'date-desc':  return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
        case 'date-asc':   return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
        case 'name-asc':   return a.studentName.localeCompare(b.studentName);
        default:           return 0;
      }
    });

    return out;
  }

  countOf(status: ApplicationStatus | 'ALL'): number {
    if (status === 'ALL') return this.applications.length;
    return this.applications.filter(a => a.status === status).length;
  }

  toggleSkillFilter(skill: string): void {
    if (this.activeSkillFilters.has(skill)) this.activeSkillFilters.delete(skill);
    else this.activeSkillFilters.add(skill);
  }

  isSkillActive(skill: string): boolean {
    return this.activeSkillFilters.has(skill);
  }

  clearFilters(): void {
    this.search = '';
    this.minAiScore = 0;
    this.activeSkillFilters.clear();
    this.statusFilter = 'ALL';
  }

  get hasActiveFilters(): boolean {
    return !!this.search ||
           this.minAiScore > 0 ||
           this.activeSkillFilters.size > 0 ||
           this.statusFilter !== 'ALL';
  }

  toggleExpand(id: number, ev?: Event): void {
    if (ev) ev.stopPropagation();
    if (this.expandedIds.has(id)) this.expandedIds.delete(id);
    else this.expandedIds.add(id);
  }

  isExpanded(id: number): boolean {
    return this.expandedIds.has(id);
  }

  setStatus(app: Application, newStatus: ApplicationStatus, ev?: Event): void {
    if (ev) ev.stopPropagation();
    if (this.pendingId !== null) return;
    if (app.status === newStatus) return;

    this.pendingId = app.id;
    this.errorMsg = '';
    this.successMsg = '';

    this.recruiterService.updateApplicationStatus(app.id, { status: newStatus }).subscribe({
      next: res => {
        this.pendingId = null;
        if (res.success && res.data) {
          const idx = this.applications.findIndex(a => a.id === app.id);
          if (idx !== -1) this.applications[idx] = res.data;
          this.flashSuccess(this.statusVerb(newStatus, res.data.studentName));
        } else {
          this.errorMsg = res.message || 'Update failed.';
        }
      },
      error: err => {
        this.pendingId = null;
        this.errorMsg = err?.message || 'Update failed.';
      }
    });
  }
  recomputeMatch(app: Application, ev?: Event): void {
  if (ev) ev.stopPropagation();
  if (this.pendingId !== null) return;

  this.pendingId = app.id;
  this.errorMsg = '';
  this.successMsg = '';

  this.recruiterService.recomputeAiMatch(app.id).subscribe({
    next: res => {
      this.pendingId = null;
      if (res.success && res.data) {
        const idx = this.applications.findIndex(a => a.id === app.id);
        if (idx !== -1) this.applications[idx] = res.data;
        this.flashSuccess(`AI match computed: ${res.data.aiMatchScore || 0}%`);
      } else {
        this.errorMsg = res.message || 'Could not compute AI match.';
      }
    },
    error: err => {
      this.pendingId = null;
      this.errorMsg = err?.message || 'Could not compute AI match.';
    }
  });
}

  openSchedule(app: Application, ev?: Event): void {
    if (ev) ev.stopPropagation();
    this.scheduleAppId = app.id;
    this.scheduleCandidateName = app.studentName;
  }

  closeSchedule(): void {
    this.scheduleAppId = null;
    this.scheduleCandidateName = '';
  }

  onScheduled(): void {
    this.closeSchedule();
    this.flashSuccess('Interview slots sent to candidate.');
    this.loadApplicants();
  }

  openResume(app: Application, ev?: Event): void {
    if (ev) ev.stopPropagation();
    if (!app.studentResumeUrl) return;
    const fullUrl = app.studentResumeUrl.startsWith('http')
      ? app.studentResumeUrl
      : `${this.fileHost}${app.studentResumeUrl}`;
    window.open(fullUrl, '_blank', 'noopener');
  }

  toggleCompareMode(): void {
    this.compareMode = !this.compareMode;
    if (!this.compareMode) this.selectedForCompare.clear();
  }

  toggleCompareSelection(id: number, ev?: Event): void {
    if (ev) ev.stopPropagation();
    if (this.selectedForCompare.has(id)) {
      this.selectedForCompare.delete(id);
    } else {
      if (this.selectedForCompare.size >= this.maxCompare) {
        this.errorMsg = `You can compare at most ${this.maxCompare} candidates at a time.`;
        setTimeout(() => this.errorMsg = '', 2500);
        return;
      }
      this.selectedForCompare.add(id);
    }
  }

  isInCompare(id: number): boolean {
    return this.selectedForCompare.has(id);
  }

  openCompare(): void {
    if (this.selectedForCompare.size < 2) {
      this.errorMsg = 'Select at least 2 candidates to compare.';
      setTimeout(() => this.errorMsg = '', 2500);
      return;
    }
    this.showCompareModal = true;
  }

  get compareApplicants(): Application[] {
    return this.applications.filter(a => this.selectedForCompare.has(a.id));
  }

  closeCompare(): void {
    this.showCompareModal = false;
  }

  exportCsv(): void {
    const rows = this.filtered;
    if (rows.length === 0) {
      this.errorMsg = 'No applicants to export.';
      setTimeout(() => this.errorMsg = '', 2000);
      return;
    }

    const header = [
      'Name', 'Email', 'Phone', 'College', 'Department', 'Batch', 'CGPA',
      'AI Match', 'Status', 'Applied On',
      'Skills', 'Matched Skills', 'Missing Skills',
      'LinkedIn', 'GitHub', 'Resume'
    ];

    const escape = (v: any): string => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const body = rows.map(a => [
      a.studentName,
      a.studentEmail,
      a.studentPhone || '',
      a.studentCollege || '',
      a.studentDepartment || '',
      a.studentBatch || '',
      a.studentCgpa ?? '',
      a.aiMatchScore ?? '',
      a.status,
      new Date(a.appliedAt).toLocaleString(),
      (a.studentSkills || []).join('; '),
      (a.matchedSkills || []).join('; '),
      (a.missingSkills || []).join('; '),
      a.studentLinkedinUrl || '',
      a.studentGithubUrl || '',
      a.studentResumeUrl ? `${this.fileHost}${a.studentResumeUrl}` : ''
    ].map(escape).join(','));

    const csv = [header.join(','), ...body].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.job?.title || 'applicants'}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  viewDetail(id: number, ev?: Event): void {
    if (ev) ev.stopPropagation();
    this.router.navigate(['/recruiter/applicants', id]);
  }

  goBack(): void {
    this.router.navigate(['/recruiter/jobs']);
  }

  matchClass(score: number | null | undefined): string {
    if (!score) return 'match-low';
    if (score >= 70) return 'match-high';
    if (score >= 40) return 'match-medium';
    return 'match-low';
  }

  private statusVerb(status: ApplicationStatus, name: string): string {
    switch (status) {
      case 'SHORTLISTED': return `${name} shortlisted.`;
      case 'SELECTED':    return `${name} selected — they've been notified.`;
      case 'REJECTED':    return `${name} rejected.`;
      case 'APPLIED':     return `${name} moved back to new.`;
      default:            return 'Status updated.';
    }
  }

  flashSuccess(msg: string): void {
    this.successMsg = msg;
    setTimeout(() => { this.successMsg = ''; }, 2500);
  }
}
