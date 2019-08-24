import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointerDirective } from './pointer.directive';

@NgModule({
  declarations: [PointerDirective],
  imports: [
    CommonModule
  ],
  exports: [PointerDirective]
})
export class DirectivesModule { }
