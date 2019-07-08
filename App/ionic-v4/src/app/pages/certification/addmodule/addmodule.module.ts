import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {MatCardModule} from '@angular/material/card';


import { IonicModule } from '@ionic/angular';

import { AddmodulePage } from './addmodule.page';

const routes: Routes = [
  {
    path: '',
    component: AddmodulePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddmodulePage]
})
export class AddmodulePageModule {}
