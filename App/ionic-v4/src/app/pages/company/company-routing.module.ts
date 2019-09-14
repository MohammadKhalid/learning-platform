import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './company/company.module#CompanyPageModule' },
  { path: 'detail/:id', loadChildren: './company-detail/company-detail.module#CompanyDetailPageModule' },
  { path: 'edit/:id', loadChildren: './company-form/company-form.module#CompanyFormPageModule' },
  { path: 'add', loadChildren: './company-form/company-form.module#CompanyFormPageModule' }
];

@NgModule({
  declarations: [],
  imports: [
  	RouterModule.forChild(routes)
  ]
})
export class CompanyRoutingModule { }