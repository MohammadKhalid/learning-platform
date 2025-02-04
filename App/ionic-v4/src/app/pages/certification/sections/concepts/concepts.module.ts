import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConceptsPage } from './concepts.page';
import { MatSelectModule } from '@angular/material';
import { ComponentsModule } from 'src/app/components/components.module';
import { AddModalComponent } from './add-modal/add-modal.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { QuizEditModalComponent } from 'src/app/components/quiz-edit-modal/quiz-edit-modal.component';

const routes: Routes = [
  {
    path: '',
    component: ConceptsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    MatSelectModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConceptsPage, AddModalComponent, QuizEditModalComponent],
  entryComponents: [AddModalComponent, QuizEditModalComponent],

})
export class ConceptsPageModule { }