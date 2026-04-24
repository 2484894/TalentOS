import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  role         = '';
  userName     = '';
  userEmail    = '';
  userInitials = '';
  currentUrl   = '';

  // Role-based brand sub-label (shows in sidebar logo)
  brandSubLabel = '';

  navItems: NavItem[] = [];

  studentNav: NavItem[] = [
    { label: 'Dashboard',     icon: 'bi-grid-1x2-fill',   route: '/student/dashboard'     },
    { label: 'Jobs',          icon: 'bi-briefcase-fill',  route: '/student/jobs'          },
    { label: 'Applications',  icon: 'bi-send-fill',       route: '/student/applications'  },
    { label: 'Profile',       icon: 'bi-person-circle',   route: '/student/profile'       },
    { label: 'Resume',        icon: 'bi-file-earmark-text-fill', route: '/student/resume'},
    { label: 'Notifications', icon: 'bi-bell-fill',       route: '/student/notifications' }
  ];

  recruiterNav: NavItem[] = [
    { label: 'Overview',       icon: 'bi-grid-1x2-fill',      route: '/recruiter/dashboard'     },
    { label: 'My Jobs',        icon: 'bi-briefcase-fill',     route: '/recruiter/jobs'          },
    { label: 'Post a Job',     icon: 'bi-plus-square-fill',   route: '/recruiter/jobs/new'      },
    { label: 'Notifications',  icon: 'bi-bell-fill',          route: '/recruiter/notifications' }
  ];

  adminNav: NavItem[] = [
    { label: 'Overview',       icon: 'bi-grid-1x2-fill',         route: '/admin/dashboard' },
    { label: 'Users',          icon: 'bi-people-fill',           route: '/admin/users'     },
    { label: 'Placement Report', icon: 'bi-file-earmark-bar-graph-fill', route: '/admin/report' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.role         = user.role;
      this.userName     = user.name;
      this.userEmail    = user.email;
      this.userInitials = this.getInitials(user.name);
    }

    if (this.role === 'STUDENT') {
      this.navItems      = this.studentNav;
      this.brandSubLabel = 'Student';
    }
    if (this.role === 'RECRUITER') {
      this.navItems      = this.recruiterNav;
      this.brandSubLabel = 'Recruiter';
    }
    if (this.role === 'ADMIN') {
      this.navItems      = this.adminNav;
      this.brandSubLabel = 'Placement Officer';
    }

    this.currentUrl = this.router.url;
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => this.currentUrl = e.urlAfterRedirects);
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  isActive(route: string): boolean {
    if (route.includes('/new')) return this.currentUrl === route;
    return this.currentUrl === route || this.currentUrl.startsWith(route + '/');
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
  }
}
