import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './request-personal-coaching/request-personal-coaching.module#RequestPersonalCoachingPageModule' },
  { path: 'detail/:id', loadChildren: './request-personal-coaching-detail/request-personal-coaching-detail.module#RequestPersonalCoachingDetailPageModule' },
  { path: 'add', loadChildren: './request-personal-coaching-form/request-personal-coaching-form.module#RequestPersonalCoachingFormPageModule' },
  { path: 'edit/:id', loadChildren: './request-personal-coaching-form/request-personal-coaching-form.module#RequestPersonalCoachingFormPageModule' },
];

@NgModule({
  declarations: [],
  imports: [
  	RouterModule.forChild(routes)
  ]
})
export class RequestPersonalCoachingRoutingModule { }
