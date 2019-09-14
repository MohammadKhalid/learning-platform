import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: './course-list/course-list.module#CourseListPageModule' },
  { path: 'edit/:id', loadChildren: './cource-catogary.module#CourceCatogaryPageModule' },
  { path: 'add', loadChildren: './cource-catogary.module#CourceCatogaryPageModule' },
];
@NgModule({

  declarations: [],
  imports: 
  [
    
    RouterModule.forChild(routes)
  ]
})
export class CourceCatogaryRoutingModule { }
