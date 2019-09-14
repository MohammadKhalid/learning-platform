import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ngfModule, ngf } from "angular-file";

import { IonicModule } from '@ionic/angular';
import { MatTabsModule } from '@angular/material/tabs';

import { CertificationPage } from './certification.page';
import { ComponentsModule } from 'src/app/components/components.module';
// import { MDBBootstrapModule } from 'angular-bootstrap-md';



const routes: Routes = [
  {
    path: '',
    component: CertificationPage
  }
];

@NgModule({
  imports: [
    ngfModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    MatFormFieldModule,
    IonicModule,
    MatSelectModule,
    MatTabsModule,
    RouterModule.forChild(routes),
    // MDBBootstrapModule.forRoot(),
    
  ],
  declarations: [
    CertificationPage
  ]
})
export class CertificationPageModule { }
