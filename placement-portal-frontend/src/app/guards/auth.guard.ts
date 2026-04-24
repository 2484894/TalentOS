import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();
    const token = this.authService.getToken();

    // Must have BOTH user and token
    if (user && token) {
      return true;
    }

    // Clear any broken state
    localStorage.clear();
    this.router.navigate(['/login']);
    return false;
  }
}
