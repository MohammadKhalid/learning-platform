import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter.pipe';
import { OrderByDatePipe } from './order-by-date.pipe';

@NgModule({
  declarations: [FilterPipe,
    OrderByDatePipe],
  imports: [
    CommonModule
  ],
  exports: [
    FilterPipe,
    OrderByDatePipe
  ]
})
export class PipesModule { }