import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole: string = route.data['role'];
    const userRole = this.authService.getRole();

    if (userRole === expectedRole) {
      return true;
    }

    // Redirect to their correct dashboard
    if (userRole === 'STUDENT')   this.router.navigate(['/student/dashboard']);
    else if (userRole === 'RECRUITER') this.router.navigate(['/recruiter/dashboard']);
    else if (userRole === 'ADMIN')     this.router.navigate(['/admin/dashboard']);
    else this.router.navigate(['/login']);

    return false;
  }
}

