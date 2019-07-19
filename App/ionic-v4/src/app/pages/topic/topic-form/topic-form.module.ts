import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../../components/components.module';
import { IonicSelectableModule } from 'ionic-selectable';

import { TopicFormPage } from './topic-form.page';

const routes: Routes = [
  {
    path: '',
    component: TopicFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    IonicSelectableModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TopicFormPage]
})
export class TopicFormPageModule {}
