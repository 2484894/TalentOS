import { Component } from '@angular/core';
import { StudentService } from '../../../services/student.service';
import { ResumeParseResult } from '../../../models/student-profile.model';

@Component({
  selector: 'app-student-resume',
  templateUrl: './student-resume.component.html'
})
export class StudentResumeComponent {

  selectedFile: File | null = null;
  uploading   = false;
  errorMsg    = '';
  parseResult: ResumeParseResult | null = null;

  constructor(private studentService: StudentService) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (!file.name.endsWith('.pdf')) {
        this.errorMsg = 'Only PDF files are allowed.';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.errorMsg = 'File size must be under 5MB.';
        return;
      }
      this.selectedFile = file;
      this.errorMsg = '';
    }
  }

  upload(): void {
    if (!this.selectedFile) return;
    this.uploading   = true;
    this.errorMsg    = '';
    this.parseResult = null;

    this.studentService.uploadResume(this.selectedFile).subscribe({
      next: res => {
        this.uploading = false;
        if (res.success) this.parseResult = res.data;
        else this.errorMsg = res.message;
      },
      error: err => {
        this.uploading = false;
        this.errorMsg  = err.message || 'Upload failed.';
      }
    });
  }
}
