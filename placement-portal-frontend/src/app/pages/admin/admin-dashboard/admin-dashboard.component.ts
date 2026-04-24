import { Component, OnInit, AfterViewInit,
         ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { AdminService, DashboardStats } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('statusChart')  statusChartRef!: ElementRef;
  @ViewChild('deptChart')    deptChartRef!: ElementRef;
  @ViewChild('companyChart') companyChartRef!: ElementRef;

  stats: DashboardStats | null = null;
  loading     = true;
  chartsReady = false;

  private statusChart:  any = null;
  private deptChart:    any = null;
  private companyChart: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getDashboardStats().subscribe({
      next: res => {
        this.loading = false;
        if (res.success) {
          this.stats = res.data;
          this.chartsReady = true;
          setTimeout(() => this.buildCharts(), 150);
        }
      },
      error: () => { this.loading = false; }
    });
  }

  ngAfterViewInit(): void {}

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  getStatusEntries(): { key: string; value: number }[] {
    if (!this.stats?.applicationsByStatus) return [];
    return Object.entries(this.stats.applicationsByStatus)
      .map(([key, value]) => ({ key, value }));
  }

  buildCharts(): void {
    if (!this.stats) return;
    this.buildStatusChart();
    this.buildDeptChart();
    this.buildCompanyChart();
  }

  // Dark mode chart defaults
  private darkOptions(): any {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#CBD5E1',
            font: { size: 11, family: "'IBM Plex Sans'" }
          }
        }
      }
    };
  }

  buildStatusChart(): void {
    if (!this.statusChartRef) return;
    if (this.statusChart) this.statusChart.destroy();

    const labels = Object.keys(this.stats!.applicationsByStatus);
    const data   = Object.values(this.stats!.applicationsByStatus);

    this.statusChart = new Chart(this.statusChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#A78BFA','#F59E0B','#38BDF8','#10B981','#F43F5E'],
          borderColor: '#0B1120',
          borderWidth: 3
        }]
      },
      options: this.darkOptions()
    });
  }

  buildDeptChart(): void {
    if (!this.deptChartRef) return;
    if (this.deptChart) this.deptChart.destroy();

    const labels = Object.keys(this.stats!.placementsByDepartment);
    const data   = Object.values(this.stats!.placementsByDepartment);

    this.deptChart = new Chart(this.deptChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Students Placed',
          data,
          backgroundColor: '#10B981',
          borderColor: '#34D399',
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 28
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: { color: '#94A3B8' },
            grid:  { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#94A3B8', stepSize: 1 },
            grid:  { color: 'rgba(148,163,184,0.08)' }
          }
        }
      }
    });
  }

  buildCompanyChart(): void {
    if (!this.companyChartRef) return;
    if (this.companyChart) this.companyChart.destroy();

    const companies = this.stats!.topCompanies || [];
    const labels    = companies.map((c: any) => c.company);
    const data      = companies.map((c: any) => c.count);

    this.companyChart = new Chart(this.companyChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Placements',
          data,
          backgroundColor: '#F59E0B',
          borderColor: '#FBBF24',
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 22
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { color: '#94A3B8', stepSize: 1 },
            grid:  { color: 'rgba(148,163,184,0.08)' }
          },
          y: {
            ticks: { color: '#94A3B8' },
            grid:  { display: false }
          }
        }
      }
    });
  }
}
