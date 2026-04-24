import { Component, OnInit } from '@angular/core';
import { AdminService, AdminUser } from '../../../services/admin.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {

  users: AdminUser[] = [];
  loading    = true;
  searchText = '';
  filterRole = '';
  errorMsg   = '';
  successMsg = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAllUsers().subscribe({
      next: res => {
        this.loading = false;
        if (res.success) this.users = res.data;
      },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): AdminUser[] {
    return this.users.filter(u => {
      const matchSearch = !this.searchText ||
        u.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchText.toLowerCase());
      const matchRole = !this.filterRole || u.role === this.filterRole;
      return matchSearch && matchRole;
    });
  }

  toggleStatus(user: AdminUser): void {
    const action = user.active ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} ${user.name}?`)) return;

    this.adminService.toggleUserStatus(user.id).subscribe({
      next: res => {
        if (res.success) {
          user.active    = !user.active;
          this.successMsg = `User ${action}d successfully.`;
          setTimeout(() => this.successMsg = '', 3000);
        }
      },
      error: err => {
        this.errorMsg = err.message || 'Failed to update user.';
      }
    });
  }

  getRoleBadgeStyle(role: string): string {
    if (role === 'STUDENT')   return 'background:#dbeafe; color:#1e40af;';
    if (role === 'RECRUITER') return 'background:#fef3c7; color:#92400e;';
    if (role === 'ADMIN')     return 'background:#ede9fe; color:#5b21b6;';
    return '';
  }
}
