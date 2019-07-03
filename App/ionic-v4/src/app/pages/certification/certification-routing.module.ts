import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './certification/certification.module#CertificationPageModule' },
  { path: 'detail/:id', loadChildren: './certification-detail/certification-detail.module#CertificationDetailPageModule' },
  // { path: 'add', loadChildren: './certification-form/certification-form.module#CertificationFormPageModule' },
  { path: 'edit/:id', loadChildren: './certification-form/certification-form.module#CertificationFormPageModule' },
  { path: 'add', loadChildren: './add/add.module#AddPageModule' },  { path: 'addmodule', loadChildren: './addmodule/addmodule.module#AddmodulePageModule' },
  { path: 'moduledetail', loadChildren: './moduledetail/moduledetail.module#ModuledetailPageModule' },


];

@NgModule({
  declarations: [],
  imports: [
  	RouterModule.forChild(routes)
  ]
})
export class CertificationRoutingModule { }
