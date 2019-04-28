import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './live-group-training/live-group-training.module#LiveGroupTrainingPageModule' },
  { path: 'session', loadChildren: './live-group-training-session/live-group-training-session.module#LiveGroupTrainingSessionPageModule' },
  { path: 'detail/:id', loadChildren: './live-group-training-detail/live-group-training-detail.module#LiveGroupTrainingDetailPageModule' },
  { path: 'add', loadChildren: './live-group-training-form/live-group-training-form.module#LiveGroupTrainingFormPageModule' },
  { path: 'edit/:id', loadChildren: './live-group-training-form/live-group-training-form.module#LiveGroupTrainingFormPageModule' },
];

@NgModule({
  declarations: [],
  imports: [
  	RouterModule.forChild(routes)
  ]
})
export class LiveGroupTrainingRoutingModule { }
