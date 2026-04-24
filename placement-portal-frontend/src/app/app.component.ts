import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'TalentOS';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Apply theme once on load
    this.applyTheme();

    // Re-apply only on navigation end (not on user change — that causes loops)
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.applyTheme());
  }

  private applyTheme(): void {
  const body = document.body;
  body.classList.remove('theme-student', 'theme-recruiter', 'theme-admin');

  const user = this.authService.getCurrentUser();

  // If on an auth page, don't apply theme
  const onAuthPage = this.router.url.includes('/login') ||
                     this.router.url.includes('/register');
  if (!user || onAuthPage) return;

  if (user.role === 'STUDENT')   body.classList.add('theme-student');
  if (user.role === 'RECRUITER') body.classList.add('theme-recruiter');
  if (user.role === 'ADMIN')     body.classList.add('theme-admin');
}
}
