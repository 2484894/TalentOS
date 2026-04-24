import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { StudentProfile } from '../../../models/student-profile.model';

@Component({
  selector: 'app-placement-report',
  templateUrl: './placement-report.component.html'
})
export class PlacementReportComponent implements OnInit {

  students: StudentProfile[] = [];
  loading      = false;
  downloading  = false;
  errorMsg     = '';
  searchText   = '';
  filterDept   = '';

  departments: string[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loading = true;
    this.adminService.getAllStudents().subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.students    = res.data;
          this.departments = [
            ...new Set(
              res.data
                .map(s => s.department)
                .filter(d => !!d)
            )
          ];
        }
      },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): StudentProfile[] {
    return this.students.filter(s => {
      const matchSearch = !this.searchText ||
        s.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        s.email?.toLowerCase().includes(this.searchText.toLowerCase());
      const matchDept = !this.filterDept || s.department === this.filterDept;
      return matchSearch && matchDept;
    });
  }

  downloadCsv(): void {
    this.downloading = true;
    this.adminService.downloadCsvReport().subscribe({
      next: csvData => {
        this.downloading = false;
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url  = window.URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = 'placement_report.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.downloading = false;
        this.errorMsg = 'Failed to download report.';
      }
    });
  }

  getCompletionColor(pct: number): string {
    if (pct >= 80) return 'var(--success)';
    if (pct >= 50) return 'var(--warning)';
    return 'var(--danger)';
  }
}
