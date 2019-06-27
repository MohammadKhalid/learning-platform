import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {MatTabsModule} from '@angular/material/tabs';

import { CertificationPage } from './certification.page';
import { FilterComponent } from '../filter/filter.component';

const routes: Routes = [
  {
    path: '',
    component: CertificationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatTabsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CertificationPage,
  FilterComponent]
})
export class CertificationPageModule {}
