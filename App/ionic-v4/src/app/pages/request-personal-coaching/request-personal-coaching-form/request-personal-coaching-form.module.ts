import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RequestPersonalCoachingFormPage } from './request-personal-coaching-form.page';

const routes: Routes = [
  {
    path: '',
    component: RequestPersonalCoachingFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RequestPersonalCoachingFormPage]
})
export class RequestPersonalCoachingFormPageModule {}
