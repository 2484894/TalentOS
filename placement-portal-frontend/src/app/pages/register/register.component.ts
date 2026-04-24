import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  form: FormGroup;
  loading  = false;
  errorMsg = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) this.router.navigate(['/login']);

    this.form = this.fb.group({
      name:     ['', [Validators.required, Validators.minLength(2)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role:     ['STUDENT', Validators.required]
    });
  }

  get name()     { return this.form.get('name')!; }
  get email()    { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }
  get role()     { return this.form.get('role')!; }

  selectRole(role: 'STUDENT' | 'RECRUITER'): void {
    this.form.patchValue({ role });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading  = true;
    this.errorMsg = '';

    this.authService.register(this.form.value).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          const userRole = res.data.role;
          if (userRole === 'STUDENT')   this.router.navigate(['/student/dashboard']);
          if (userRole === 'RECRUITER') this.router.navigate(['/recruiter/dashboard']);
          if (userRole === 'ADMIN')     this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMsg = res.message;
        }
      },
      error: err => {
        this.loading  = false;
        this.errorMsg = err.message || 'Registration failed. Please try again.';
      }
    });
  }
}
