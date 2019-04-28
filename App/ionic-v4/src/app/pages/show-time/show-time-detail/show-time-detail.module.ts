import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { ComponentsModule } from '../../../components/components.module';

import { ShowTimeDetailPage } from './show-time-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ShowTimeDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule
  ],
  declarations: [ShowTimeDetailPage]
})
export class ShowTimeDetailPageModule {}
