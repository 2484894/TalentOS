import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../models/notification.model';

@Component({
  selector: 'app-student-notifications',
  templateUrl: './student-notifications.component.html'
})
export class StudentNotificationsComponent implements OnInit {

  notifications: Notification[] = [];
  loading = true;

  constructor(private notifService: NotificationService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.notifService.getMyNotifications().subscribe({
      next: res => {
        this.loading = false;
        if (res.success) this.notifications = res.data;
      },
      error: () => { this.loading = false; }
    });
  }

  markRead(id: number): void {
    this.notifService.markAsRead(id).subscribe({
      next: () => {
        const n = this.notifications.find(n => n.id === id);
        if (n) n.read = true;
      }
    });
  }

  markAllRead(): void {
    this.notifService.markAllAsRead().subscribe({
      next: () => this.notifications.forEach(n => n.read = true)
    });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}
