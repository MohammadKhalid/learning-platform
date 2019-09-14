import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QuizesAwnserPage } from './quizes-awnser.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatExpansionModule, MatFormField } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: QuizesAwnserPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [QuizesAwnserPage]
})
export class QuizesAwnserPageModule {}
