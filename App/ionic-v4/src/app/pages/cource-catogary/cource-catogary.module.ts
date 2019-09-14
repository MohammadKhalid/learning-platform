import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CourceCatogaryPage } from '../cource-catogary/cource-catogary.page';
import { CourseListPage } from './course-list/course-list.page';
const routes: Routes = [
  {
    path: '',
    component: CourceCatogaryPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CourceCatogaryPage]
})
export class CourceCatogaryPageModule { }
