import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: './ask-expert/ask-expert.module#AskExpertPageModule' },
  { path: ':contactid', loadChildren: './ask-expert/ask-expert.module#AskExpertPageModule' },
  { path: 'detail/:id', loadChildren: './ask-expert-detail/ask-expert-detail.module#AskExpertDetailPageModule' },
  { path: 'add', loadChildren: './ask-expert-form/ask-expert-form.module#AskExpertFormPageModule' },
  { path: 'edit/:id', loadChildren: './ask-expert-form/ask-expert-form.module#AskExpertFormPageModule' },
  // { path: 'contact-add-modal', loadChildren: './ask-expert/contact-add-modal/contact-add-modal.module#ContactAddModalPageModule' }

];

@NgModule({
  declarations: [],
  imports: [
  	RouterModule.forChild(routes)
  ]
})
export class AskExpertRoutingModule { }
