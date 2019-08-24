import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[pointer]'
})
export class PointerDirective {

  constructor(el: ElementRef) {
    el.nativeElement.style.cursor = 'pointer';
  }
}
