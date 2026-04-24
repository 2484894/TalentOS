import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecruiterService } from '../../../services/recruiter.service';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html'
})
export class JobFormComponent implements OnInit {

  form: FormGroup;
  isEdit       = false;
  jobId: number | null = null;
  saving       = false;
  extracting   = false;
  errorMsg     = '';
  skillInput   = '';
  niceSkillInput = '';
  requiredSkills: string[]    = [];
  niceToHaveSkills: string[]  = [];

  constructor(
    private fb: FormBuilder,
    private recruiterService: RecruiterService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title:       ['', Validators.required],
      description: ['', Validators.required],
      location:    [''],
      jobType:     ['FULLTIME', Validators.required],
      ctc:         [''],
      minCgpa:     [0],
      deadline:    ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.jobId  = Number(id);
      this.recruiterService.getJobById(this.jobId).subscribe({
        next: res => {
          if (res.success) {
            this.form.patchValue(res.data);
            this.requiredSkills   = res.data.requiredSkills   || [];
            this.niceToHaveSkills = res.data.niceToHaveSkills || [];
          }
        }
      });
    }
  }

  get title()       { return this.form.get('title')!; }
  get description() { return this.form.get('description')!; }

  // ── Skill helpers ─────────────────────────────────────────
  addRequiredSkill(): void {
    const s = this.skillInput.trim();
    if (s && !this.requiredSkills.includes(s)) {
      this.requiredSkills.push(s);
    }
    this.skillInput = '';
  }

  removeRequiredSkill(s: string): void {
    this.requiredSkills = this.requiredSkills.filter(x => x !== s);
  }

  addNiceSkill(): void {
    const s = this.niceSkillInput.trim();
    if (s && !this.niceToHaveSkills.includes(s)) {
      this.niceToHaveSkills.push(s);
    }
    this.niceSkillInput = '';
  }

  removeNiceSkill(s: string): void {
    this.niceToHaveSkills = this.niceToHaveSkills.filter(x => x !== s);
  }

  onKeydown(e: KeyboardEvent, type: 'required' | 'nice'): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      type === 'required' ? this.addRequiredSkill() : this.addNiceSkill();
    }
  }

  // ── AI Skill Extraction ───────────────────────────────────
  extractSkills(): void {
    const t = this.title.value;
    const d = this.description.value;
    if (!t || !d) {
      this.errorMsg = 'Enter job title and description first.';
      return;
    }
    this.extracting = true;
    this.errorMsg   = '';

    this.recruiterService.extractSkills(t, d).subscribe({
      next: res => {
        this.extracting = false;
        if (res.success) {
          this.requiredSkills   = res.data.requiredSkills   || [];
          this.niceToHaveSkills = res.data.niceToHaveSkills || [];
        }
      },
      error: err => {
        this.extracting = false;
        this.errorMsg   = err.message || 'AI extraction failed.';
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving   = true;
    this.errorMsg = '';

    const payload = {
      ...this.form.value,
      requiredSkills:   this.requiredSkills,
      niceToHaveSkills: this.niceToHaveSkills
    };

    const req = this.isEdit && this.jobId
      ? this.recruiterService.updateJob(this.jobId, payload)
      : this.recruiterService.createJob(payload);

    req.subscribe({
      next: res => {
        this.saving = false;
        if (res.success) this.router.navigate(['/recruiter/jobs']);
        else this.errorMsg = res.message;
      },
      error: err => {
        this.saving   = false;
        this.errorMsg = err.message || 'Failed to save job.';
      }
    });
  }

  goBack(): void { this.router.navigate(['/recruiter/jobs']); }
}
