import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { IonicModule } from '@ionic/angular';
import { MatTabsModule } from '@angular/material/tabs';

import { CertificationPage } from './certification.page';
import { FilterComponent } from 'src/app/components/common/filter/filter.component';

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
    MatFormFieldModule,
    IonicModule,
    MatSelectModule,
    MatTabsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CertificationPage,
    FilterComponent
  ]
})
export class CertificationPageModule { }
