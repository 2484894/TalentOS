import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { StudentDashboardComponent } from './pages/student/student-dashboard/student-dashboard.component';
import { StudentProfileComponent } from './pages/student/student-profile/student-profile.component';
import { StudentResumeComponent } from './pages/student/student-resume/student-resume.component';
import { JobListComponent } from './pages/student/job-list/job-list.component';
import { JobDetailComponent } from './pages/student/job-detail/job-detail.component';
import { MyApplicationsComponent } from './pages/student/my-applications/my-applications.component';
import { ApplicationDetailComponent } from './pages/student/application-detail/application-detail.component';
import { StudentNotificationsComponent } from './pages/student/student-notifications/student-notifications.component';
import { RecruiterDashboardComponent } from './pages/recruiter/recruiter-dashboard/recruiter-dashboard.component';
import { MyJobsComponent } from './pages/recruiter/my-jobs/my-jobs.component';
import { JobFormComponent } from './pages/recruiter/job-form/job-form.component';
import { ApplicantListComponent } from './pages/recruiter/applicant-list/applicant-list.component';
import { ApplicantDetailComponent } from './pages/recruiter/applicant-detail/applicant-detail.component';
import { RecruiterNotificationsComponent } from './pages/recruiter/recruiter-notifications/recruiter-notifications.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { PlacementReportComponent } from './pages/admin/placement-report/placement-report.component';

const routes: Routes = [
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'STUDENT' },
    children: [
      { path: '',                  redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',         component: StudentDashboardComponent },
      { path: 'profile',           component: StudentProfileComponent },
      { path: 'resume',            component: StudentResumeComponent },
      { path: 'jobs',              component: JobListComponent },
      { path: 'jobs/:id',          component: JobDetailComponent },
      { path: 'applications',      component: MyApplicationsComponent },
      { path: 'applications/:id',  component: ApplicationDetailComponent },
      { path: 'notifications',     component: StudentNotificationsComponent }
    ]
  },

  {
    path: 'recruiter',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'RECRUITER' },
    children: [
      { path: '',                    redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',           component: RecruiterDashboardComponent },
      { path: 'jobs',                component: MyJobsComponent },
      { path: 'jobs/new',            component: JobFormComponent },
      { path: 'jobs/:id/edit',       component: JobFormComponent },
      { path: 'jobs/:id/applicants', component: ApplicantListComponent },
      { path: 'applicants/:id',      component: ApplicantDetailComponent },
      { path: 'notifications',       component: RecruiterNotificationsComponent }
    ]
  },

  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: '',          redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users',     component: UserListComponent },
      { path: 'report',    component: PlacementReportComponent }
    ]
  },

  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
