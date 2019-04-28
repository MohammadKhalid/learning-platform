import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs/Observable';
 
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanDeactivate<boolean> {
 
  constructor(public auth: AuthenticationService) {}
 
  canActivate(): Promise<boolean> {
  	return new Promise((res) => {
  		if(this.auth.authDidCheck === false) {
  			this.auth.checkToken().then(() => {
  				res(this.resolve());
  			});
  		} else {
  			res(this.resolve());
  		}
  	});
  }

  resolve(): boolean {
  	let state = this.auth.authenticationState.value;

  	if(state === false) this.auth.authenticationState.next(state);

  	return state;
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return false;
  }
}