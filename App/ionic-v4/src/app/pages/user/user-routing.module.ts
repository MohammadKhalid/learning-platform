import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './user/user.module#UserPageModule' },
  { path: 'add', loadChildren: './user-form/user-form.module#UserFormPageModule' },
  { path: 'edit/:id', loadChildren: './user-form/user-form.module#UserFormPageModule' },
  { path: 'detail/:id', loadChildren: './user-detail/user-detail.module#UserDetailPageModule' },
  { path: 'detail/:id/practice-time', loadChildren: './user-show-time/user-show-time.module#UserShowTimePageModule', data: { type: 'practice', title: 'Practice Time' } },
  { path: 'detail/:id/show-time', loadChildren: './user-show-time/user-show-time.module#UserShowTimePageModule', data: { type: 'show', title: 'Show Time' } }
];

@NgModule({
  declarations: [],
  imports: [
  	RouterModule.forChild(routes)
  ]
})
export class UserRoutingModule { }
