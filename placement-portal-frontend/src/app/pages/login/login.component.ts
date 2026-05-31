import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loading = false;
  errorMsg = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) this.redirectByRole();

    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Defense in depth: even if the browser tried to autofill, blank the form
    // after the view initializes. setTimeout(0) lets the browser finish its
    // autofill pass first, then we wipe it.
    setTimeout(() => this.form.reset({ email: '', password: '' }), 0);
  }

  get email()    { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading  = true;
    this.errorMsg = '';

    this.authService.login(this.form.value).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) this.redirectByRole();
        else this.errorMsg = res.message;
      },
      error: err => {
        this.loading  = false;
        this.errorMsg = err.message || 'Invalid email or password.';
      }
    });
  }

  private redirectByRole(): void {
    const role = this.authService.getRole();
    if (role === 'STUDENT')   this.router.navigate(['/student/dashboard']);
    if (role === 'RECRUITER') this.router.navigate(['/recruiter/dashboard']);
    if (role === 'ADMIN')     this.router.navigate(['/admin/dashboard']);
  }
}
