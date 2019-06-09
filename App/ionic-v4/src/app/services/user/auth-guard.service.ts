import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs/Observable';
 
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanDeactivate<boolean> {
 
  constructor(public authService: AuthenticationService) {}
	
	canActivate(): Promise<boolean> {
		return new Promise((resolve) => {
  		this.authService.authenticationState.subscribe((state) => {
				console.log('GUARD STATE', state);

				if(this.authService.authDidCheck) resolve(state);
			});
		});
	}

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return false;
  }
}