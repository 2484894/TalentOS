import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8085/api/v1';

  // BehaviorSubject holds the current logged-in user
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ── Load user from localStorage on page refresh ────────────
  private loadUserFromStorage(): User | null {
  try {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return null;
    const user = JSON.parse(stored);
    // Validate the stored user has a token
    if (!user.token) {
      localStorage.clear();
      return null;
    }
    return user;
  } catch {
    localStorage.clear();
    return null;
  }
}

  // ── Register ───────────────────────────────────────────────
  register(request: RegisterRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${this.apiUrl}/auth/register`, request
    ).pipe(
      tap(res => {
        if (res.success) this.saveUser(res.data);
      })
    );
  }

  // ── Login ──────────────────────────────────────────────────
  login(request: LoginRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${this.apiUrl}/auth/login`, request
    ).pipe(
      tap(res => {
        if (res.success) this.saveUser(res.data);
      })
    );
  }

  // ── Logout ─────────────────────────────────────────────────
logout(): void {
  // Clear storage completely
  localStorage.removeItem('currentUser');
  localStorage.clear();

  // Clear theme classes
  document.body.classList.remove('theme-student', 'theme-recruiter', 'theme-admin');

  // Clear subject
  this.currentUserSubject.next(null);

  // Force navigate with reload to reset all state
  this.router.navigate(['/login']).then(() => {
    window.location.reload();
  });
}

  // ── Helpers ────────────────────────────────────────────────
  private saveUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.getCurrentUser()?.token ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  getRole(): string | null {
    return this.getCurrentUser()?.role ?? null;
  }

  isStudent(): boolean   { return this.getRole() === 'STUDENT'; }
  isRecruiter(): boolean { return this.getRole() === 'RECRUITER'; }
  isAdmin(): boolean     { return this.getRole() === 'ADMIN'; }
}

