import { GaugeComponent } from './shared/gauge/gauge.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

// Shared Components
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { StatusBadgeComponent } from './shared/status-badge/status-badge.component';

// Auth Pages
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

// Student Pages
import { StudentDashboardComponent } from './pages/student/student-dashboard/student-dashboard.component';
import { StudentProfileComponent } from './pages/student/student-profile/student-profile.component';
import { StudentResumeComponent } from './pages/student/student-resume/student-resume.component';
import { JobListComponent } from './pages/student/job-list/job-list.component';
import { JobDetailComponent } from './pages/student/job-detail/job-detail.component';
import { MyApplicationsComponent } from './pages/student/my-applications/my-applications.component';
import { ApplicationDetailComponent } from './pages/student/application-detail/application-detail.component';
import { StudentNotificationsComponent } from './pages/student/student-notifications/student-notifications.component';

// Recruiter Pages
import { RecruiterDashboardComponent } from './pages/recruiter/recruiter-dashboard/recruiter-dashboard.component';
import { MyJobsComponent } from './pages/recruiter/my-jobs/my-jobs.component';
import { JobFormComponent } from './pages/recruiter/job-form/job-form.component';
import { ApplicantListComponent } from './pages/recruiter/applicant-list/applicant-list.component';
import { ApplicantDetailComponent } from './pages/recruiter/applicant-detail/applicant-detail.component';
import { RecruiterNotificationsComponent } from './pages/recruiter/recruiter-notifications/recruiter-notifications.component';

// Admin Pages
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { PlacementReportComponent } from './pages/admin/placement-report/placement-report.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    LoaderComponent,
    StatusBadgeComponent,
    GaugeComponent,
    LoginComponent,
    RegisterComponent,
    StudentDashboardComponent,
    StudentProfileComponent,
    StudentResumeComponent,
    JobListComponent,
    JobDetailComponent,
    MyApplicationsComponent,
    ApplicationDetailComponent,
    StudentNotificationsComponent,
    RecruiterDashboardComponent,
    MyJobsComponent,
    JobFormComponent,
    ApplicantListComponent,
    ApplicantDetailComponent,
    RecruiterNotificationsComponent,
    AdminDashboardComponent,
    UserListComponent,
    PlacementReportComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
