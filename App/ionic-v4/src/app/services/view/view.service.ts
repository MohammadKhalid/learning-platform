import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ViewService {
 
  state = new BehaviorSubject(true);
 
  constructor() {}
 
}