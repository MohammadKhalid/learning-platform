import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, CanDeactivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../user/authentication.service';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})

export class CoachStudentRoleGuard implements CanActivate, CanDeactivate<boolean> {

  constructor(public authService: AuthenticationService,
    private router: Router) { }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.authService.authenticationState.subscribe((state) => {
        if (this.authService.authDidCheck && (this.authService.getSessionData().user.type == "coach" || this.authService.getSessionData().user.type == "student")) {
          resolve(state);
        }
        else {
          this.router.navigate(['/dashboard']);
          return false;
        }
      });
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return false;
  }
}