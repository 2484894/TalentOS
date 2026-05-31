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

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = environment.apiUrl;   // FIX — was hardcoded localhost

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private loadUserFromStorage(): User | null {
    try {
      const stored = localStorage.getItem('currentUser');
      if (!stored) return null;
      const user = JSON.parse(stored);
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

  register(request: RegisterRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${this.apiUrl}/auth/register`, request
    ).pipe(
      tap(res => { if (res.success) this.saveUser(res.data); })
    );
  }

  login(request: LoginRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${this.apiUrl}/auth/login`, request
    ).pipe(
      tap(res => { if (res.success) this.saveUser(res.data); })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.clear();
    document.body.classList.remove('theme-student', 'theme-recruiter', 'theme-admin');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']).then(() => window.location.reload());
  }

  private saveUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null { return this.currentUserSubject.value; }
  getToken(): string | null     { return this.getCurrentUser()?.token ?? null; }
  isLoggedIn(): boolean         { return !!this.getCurrentUser(); }
  getRole(): string | null      { return this.getCurrentUser()?.role ?? null; }

  isStudent(): boolean   { return this.getRole() === 'STUDENT'; }
  isRecruiter(): boolean { return this.getRole() === 'RECRUITER'; }
  isAdmin(): boolean     { return this.getRole() === 'ADMIN'; }
}
