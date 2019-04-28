import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ViewService } from './view.service';
 
@Injectable({
  providedIn: 'root'
})
export class ViewGuardService implements CanDeactivate<boolean> {
 
  constructor(public view: ViewService) {}

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.view.state.value;
  }
}