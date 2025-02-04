import { AuthGuardService } from './services/user/auth-guard.service';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoachStudentRoleGuard } from './services/coach-student-role/coach-student-role.guard';

const routes: Routes = [
  { path: 'setup', loadChildren: './setup/setup.module#SetupPageModule' },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'dashboard', canActivate: [AuthGuardService], loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule' },
  { path: 'test', canActivate: [AuthGuardService], loadChildren: './pages/test/test.module#TestPageModule' },
  {
    path: 'ask-expert',
    canActivate: [AuthGuardService],
    loadChildren: './pages/ask-expert/ask-expert-routing.module#AskExpertRoutingModule'
  },
  {
    path: 'certification',
    canActivate: [CoachStudentRoleGuard],
    loadChildren: './pages/certification/certification-routing.module#CertificationRoutingModule'
  },

  {
    path: 'Course-Category',
    canActivate: [AuthGuardService],
    loadChildren: './pages/cource-catogary/cource-catogary-routing.module#CourceCatogaryRoutingModule'
  },

  {
    path: 'level-setting',
    canActivate: [AuthGuardService],
    loadChildren: './pages/level-setting/level-setting-routing.module#LevelSettingRoutingModule'
  },
  {
    path: 'company',
    canActivate: [AuthGuardService],
    loadChildren: './pages/company/company-routing.module#CompanyRoutingModule'
  },
  {
    path: 'client',
    canActivate: [AuthGuardService],
    loadChildren: './pages/user/user-routing.module#UserRoutingModule',
    data: { type: 'client', singular: 'client', plural: 'clients', apiEndPoint: 'clients', appUrl: 'client', rootUrl: 'client', rootApiEndPoint: 'clients' }
  },
  {
    path: 'coach',
    canActivate: [AuthGuardService],
    loadChildren: './pages/user/user-routing.module#UserRoutingModule',
    data: { type: 'coach', singular: 'coach', plural: 'coaches', apiEndPoint: 'coaches', appUrl: 'coach', rootUrl: 'coach', rootApiEndPoint: 'coaches' }
  },
  {
    path: 'student',
    canActivate: [AuthGuardService],
    loadChildren: './pages/user/user-routing.module#UserRoutingModule',
    data: { type: 'student', singular: 'student', plural: 'students', apiEndPoint: 'students', appUrl: 'student', rootUrl: 'student', rootApiEndPoint: 'students' }
  },
  {
    path: 'live-group-training',
    canActivate: [AuthGuardService],
    loadChildren: './pages/live-group-training/live-group-training-routing.module#LiveGroupTrainingRoutingModule'
  },
  {
    path: 'show-time',
    canActivate: [AuthGuardService],
    loadChildren: './pages/show-time/show-time-routing.module#ShowTimeRoutingModule',
    data: { type: 'show' }
  },
  {
    path: 'practice-time',
    canActivate: [AuthGuardService],
    loadChildren: './pages/show-time/show-time-routing.module#ShowTimeRoutingModule',
    data: { type: 'practice' }
  },
  {
    path: 'profile',
    canActivate: [AuthGuardService],
    loadChildren: './pages/user/user-detail/user-detail.module#UserDetailPageModule',
    data: { type: 'profile', singular: 'profile', plural: 'profiles', apiEndPoint: 'profile', appUrl: 'profile' }
  },
  {
    path: 'profile/edit',
    canActivate: [AuthGuardService],
    loadChildren: './pages/user/user-form/user-form.module#UserFormPageModule',
    data: { type: 'profile', singular: 'profile', plural: 'profiles', apiEndPoint: 'profile', appUrl: 'profile' }
  },
  {
    path: 'request-personal-coaching',
    canActivate: [AuthGuardService],
    loadChildren: './pages/request-personal-coaching/request-personal-coaching-routing.module#RequestPersonalCoachingRoutingModule'
  },
  {
    path: 'report',
    canActivate: [AuthGuardService],
    loadChildren: './pages/report/report-routing.module#ReportRoutingModule'
  },
  {
    path: 'topic',
    canActivate: [AuthGuardService],
    loadChildren: './pages/topic/topic-routing.module#TopicRoutingModule'
  },
  {
    path: 'category',
    canActivate: [AuthGuardService],
    loadChildren: './pages/category/category-routing.module#CategoryRoutingModule'
  },
  {
    path: 'public',
    loadChildren: './pages/public/public-routing.module#PublicRoutingModule'
  },
  { path: 'media', canActivate: [AuthGuardService], loadChildren: './pages/media/media/media.module#MediaPageModule' },
  { path: 'media/add', canActivate: [AuthGuardService], loadChildren: './pages/media/media-form/media-form.module#MediaFormPageModule' },
  { path: 'media/edit/:id', canActivate: [AuthGuardService], loadChildren: './pages/media/media-form/media-form.module#MediaFormPageModule' },
  { path: 'media/detail/:id', canActivate: [AuthGuardService], loadChildren: './pages/media/media-detail/media-detail.module#MediaDetailPageModule' },

  { path: 'error', loadChildren: './pages/public/error/error.module#ErrorPageModule' },
  { path: '**', loadChildren: './pages/public/error/error.module#ErrorPageModule', data: { error: 404 } },
  { path: 'course-category', loadChildren: './pages/cource-catogary/cource-catogary.module#CourceCatogaryPageModule' },
  { path: 'course-list', loadChildren: './pages/cource-catogary/course-list/course-list.module#CourseListPageModule' },
  { path: 'level-setting', loadChildren: './pages/level-setting/level-setting.module#LevelSettingPageModule' },
  { path: 'level-list', loadChildren: './pages/level-setting/level-list/level-list.module#LevelListPageModule' },
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
