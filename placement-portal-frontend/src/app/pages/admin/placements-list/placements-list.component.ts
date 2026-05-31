import { Component, OnInit } from '@angular/core';
import { AdminService, PlacementRecord } from '../../../services/admin.service';

@Component({
  selector: 'app-placements-list',
  templateUrl: './placements-list.component.html',
  styleUrls: ['./placements-list.component.scss']
})
export class PlacementsListComponent implements OnInit {

  placements: PlacementRecord[] = [];
  loading = true;
  errorMsg = '';

  // Filters
  search = '';
  collegeFilter = '';
  departmentFilter = '';
  companyFilter = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getPlacements().subscribe({
      next: res => {
        this.loading = false;
        if (res.success) this.placements = res.data;
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err.message || 'Failed to load placements.';
      }
    });
  }

  get colleges(): string[] {
    return [...new Set(
      this.placements.map(p => p.college || 'Unspecified')
    )].sort();
  }

  get departments(): string[] {
    return [...new Set(
      this.placements.map(p => p.department || 'Unspecified')
    )].sort();
  }

  get companies(): string[] {
    return [...new Set(this.placements.map(p => p.companyName))].sort();
  }

  get filtered(): PlacementRecord[] {
    const q = this.search.trim().toLowerCase();
    return this.placements.filter(p => {
      if (this.collegeFilter && (p.college || 'Unspecified') !== this.collegeFilter) return false;
      if (this.departmentFilter && (p.department || 'Unspecified') !== this.departmentFilter) return false;
      if (this.companyFilter && p.companyName !== this.companyFilter) return false;
      if (!q) return true;
      return (
        p.studentName.toLowerCase().includes(q) ||
        p.studentEmail.toLowerCase().includes(q) ||
        p.companyName.toLowerCase().includes(q) ||
        p.jobTitle.toLowerCase().includes(q)
      );
    });
  }

  /** Group filtered results by college for the "by college" view. */
  get grouped(): { college: string; rows: PlacementRecord[] }[] {
    const map = new Map<string, PlacementRecord[]>();
    for (const r of this.filtered) {
      const key = r.college || 'Unspecified';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return [...map.entries()]
      .map(([college, rows]) => ({ college, rows }))
      .sort((a, b) => a.college.localeCompare(b.college));
  }

  resetFilters(): void {
    this.search = '';
    this.collegeFilter = '';
    this.departmentFilter = '';
    this.companyFilter = '';
  }

  exportCsv(): void {
    this.adminService.downloadCsvReport().subscribe({
      next: csv => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'placement_report.csv';
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }
}
