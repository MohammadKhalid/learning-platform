import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AskExpertDetailPage } from './ask-expert-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AskExpertDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AskExpertDetailPage]
})
export class AskExpertDetailPageModule {}
