import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShowTimeFormPage } from './show-time-form.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { CountdownModule } from 'ngx-countdown';

const routes: Routes = [
  {
    path: '',
    component: ShowTimeFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule,
    CountdownModule
  ],
  declarations: [ShowTimeFormPage]
})
export class ShowTimeFormPageModule {}
