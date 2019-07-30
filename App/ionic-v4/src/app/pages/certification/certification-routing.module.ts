import { NgModule } from '@angular/core';
import { Routes, RouterModule, ChildrenOutletContexts } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './certification/certification.module#CertificationPageModule' },
  { path: 'detail/:id', loadChildren: './certification-detail/certification-detail.module#CertificationDetailPageModule' },
  { path: 'edit/:id', loadChildren: './certification-form/certification-form.module#CertificationFormPageModule' },
  { path: 'add', loadChildren: './add/add.module#AddPageModule' },
  { path: 'addmodule/:id', loadChildren: './addmodule/addmodule.module#AddmodulePageModule' },
  { path: 'moduledetail', loadChildren: './moduledetail/moduledetail.module#ModuledetailPageModule' },
  { path: 'sections', loadChildren: './sections/sections.module#SectionsPageModule' },

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class CertificationRoutingModule { }
