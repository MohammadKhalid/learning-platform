import { ViewGuardService } from '../../services/view/view-guard.service';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './show-time/show-time.module#ShowTimePageModule' },
  { path: 'detail/:id', loadChildren: './show-time-detail/show-time-detail.module#ShowTimeDetailPageModule' },
  { path: 'add', canDeactivate: [ViewGuardService], loadChildren: './show-time-form/show-time-form.module#ShowTimeFormPageModule' },
  { path: 'edit/:id', loadChildren: './show-time-form/show-time-form.module#ShowTimeFormPageModule' },
];

@NgModule({
  declarations: [],
  imports: [
  	RouterModule.forChild(routes)
  ]
})
export class ShowTimeRoutingModule { }
