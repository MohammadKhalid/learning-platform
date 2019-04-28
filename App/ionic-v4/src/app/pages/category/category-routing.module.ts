import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './category/category.module#CategoryPageModule' },

  { path: 'add', loadChildren: './category-form/category-form.module#CategoryFormPageModule' },
  { path: 'edit/:id', loadChildren: './category-form/category-form.module#CategoryFormPageModule' }
];

@NgModule({
  declarations: [],
  imports: [
  	RouterModule.forChild(routes)
  ]
})
export class CategoryRoutingModule { }
