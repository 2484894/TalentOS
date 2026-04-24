import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  @Input() pageTitle: string = 'Dashboard';
  @Input() pageSubtitle: string = '';

  userName: string = '';
  userRole: string = '';
  userInitials: string = '';
  unreadCount: number = 0;
  today: string = '';

  constructor(
    private authService: AuthService,
    private notifService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName     = user.name;
      this.userRole     = user.role;
      this.userInitials = user.name
        .split(' ')
        .map(n => n.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    this.today = new Date().toLocaleDateString('en-US', {
      weekday: 'long', month: 'short', day: 'numeric'
    });
    this.loadUnreadCount();
  }

  loadUnreadCount(): void {
    this.notifService.getUnreadCount().subscribe({
      next: res => {
        if (res.success) this.unreadCount = res.data.unreadCount;
      },
      error: () => {}
    });
  }

  goToNotifications(): void {
    const role = this.userRole.toLowerCase();
    if (role === 'student')   this.router.navigate(['/student/notifications']);
    if (role === 'recruiter') this.router.navigate(['/recruiter/notifications']);
    if (role === 'admin')     this.router.navigate(['/admin/dashboard']);
  }
}
