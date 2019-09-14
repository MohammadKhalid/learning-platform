import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './user/user.module#UserPageModule' },
  { path: 'add', loadChildren: './user-form/user-form.module#UserFormPageModule' },
  { path: 'edit/:id', loadChildren: './user-form/user-form.module#UserFormPageModule' },
  { path: 'detail/:id', loadChildren: './user-detail/user-detail.module#UserDetailPageModule' },
  { path: 'detail/:id/practice-time', loadChildren: './user-show-time/user-show-time.module#UserShowTimePageModule', data: { type: 'practice', title: 'Practice Time' } },
  { path: 'detail/:id/show-time', loadChildren: './user-show-time/user-show-time.module#UserShowTimePageModule', data: { type: 'show', title: 'Show Time' } },
  { path: 'detail/:id/student', loadChildren: './user/user.module#UserPageModule', data: { type: 'student', singular: 'student', plural: 'students', apiEndPoint: 'students', appUrl: 'student' }},
  { path: 'detail/:id/coach', loadChildren: './user/user.module#UserPageModule', data: { type: 'coach', singular: 'coach', plural: 'coaches', apiEndPoint: 'coaches', appUrl: 'coach' }},
  { path: 'detail/:userId/coach/:id', loadChildren: './user-detail/user-detail.module#UserDetailPageModule', data: { type: 'coach', singular: 'coach', plural: 'coaches', apiEndPoint: 'coaches', appUrl: 'coach' }},
  { path: 'detail/:userId/student/:id', loadChildren: './user-detail/user-detail.module#UserDetailPageModule', data: { type: 'student', singular: 'student', plural: 'students', apiEndPoint: 'students', appUrl: 'student' }},
  { path: 'detail/:userId/student/:id/practice-time', loadChildren: './user-show-time/user-show-time.module#UserShowTimePageModule', data: { type: 'practice', title: 'Practice Time' } },
  { path: 'detail/:userId/student/:id/show-time', loadChildren: './user-show-time/user-show-time.module#UserShowTimePageModule', data: { type: 'show', title: 'Show Time' } },
  { path: 'detail/:userId/coach/:id/practice-time', loadChildren: './user-show-time/user-show-time.module#UserShowTimePageModule', data: { type: 'practice', title: 'Practice Time' } },
  { path: 'detail/:userId/coach/:id/show-time', loadChildren: './user-show-time/user-show-time.module#UserShowTimePageModule', data: { type: 'show', title: 'Show Time' } }
];

@NgModule({
  declarations: [],
  imports: [
  	RouterModule.forChild(routes)
  ]
})
export class UserRoutingModule { }
