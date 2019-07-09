import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
//  import { ngfModule, ngf } from "angular-file";
 import { MDBBootstrapModule } from 'angular-bootstrap-md';

//  import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { AddPage } from './add.page';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
// import { FileSelectDirective } from 'ng2-file-upload';


const routes: Routes = [
  {
    path: '',
    component: AddPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forChild(routes),
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    // ngfModule
    
    

  ],
  declarations: [AddPage,
    // FileSelectDirective
  ]
  
})
export class AddPageModule {}
