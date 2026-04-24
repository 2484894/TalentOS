import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../../services/student.service';
import { StudentProfile } from '../../../models/student-profile.model';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html'
})
export class StudentProfileComponent implements OnInit {

  form: FormGroup;
  loading    = false;
  saving     = false;
  success    = false;
  errorMsg   = '';
  profile: StudentProfile | null = null;
  skillInput = '';

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) {
    this.form = this.fb.group({
      department:     [''],
      batch:          [''],
      cgpa:           ['', [Validators.min(0), Validators.max(10)]],
      phone:          [''],
      projects:       [''],
      certifications: [''],
      linkedinUrl:    [''],
      githubUrl:      ['']
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.studentService.getMyProfile().subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.profile = res.data;
          this.form.patchValue(res.data);
        }
      },
      error: () => { this.loading = false; }
    });
  }

  get skills(): string[] {
    return this.profile?.skills || [];
  }

  addSkill(): void {
    const s = this.skillInput.trim();
    if (s && !this.skills.includes(s)) {
      if (!this.profile) this.profile = {} as StudentProfile;
      this.profile.skills = [...this.skills, s];
    }
    this.skillInput = '';
  }

  removeSkill(skill: string): void {
    if (this.profile) {
      this.profile.skills = this.skills.filter(s => s !== skill);
    }
  }

  onSkillKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') { e.preventDefault(); this.addSkill(); }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving   = true;
    this.success  = false;
    this.errorMsg = '';

    const payload = { ...this.form.value, skills: this.skills };

    this.studentService.updateProfile(payload).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) {
          this.profile = res.data;
          this.success = true;
          setTimeout(() => this.success = false, 3000);
        }
      },
      error: err => {
        this.saving   = false;
        this.errorMsg = err.message || 'Failed to save profile.';
      }
    });
  }
}
