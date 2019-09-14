import { Injectable, Injector} from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, Event, NavigationError } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import * as StackTraceParser from 'error-stack-parser';

@Injectable()
export class ErrorsService {

  constructor(
    private injector: Injector,
    private router: Router,
  ) {
    // Subscribe to the NavigationError
    this.router.events.subscribe((event: Event) => { 
      if (event instanceof NavigationError) {
        // Redirect to the ErrorComponent
        this.log(event.error).subscribe((errorWithContext) => { 
          // this.router.navigate(['/error'], { queryParams: errorWithContext })
          this.router.navigate(['/error']);
        });
      }
    });
  }

  log(error) {
    // Log the error to the console
    // console.error(error);
    // Send error to server
    const errorToSend = this.addContextInfo(error);
    return fakeHttpService.post(errorToSend);
  }

  addContextInfo(error) {
    // All the context details that you want (usually coming from other services; Constants, UserService...)
    const name = error.name || null;
    const appId = 'thrive19.com';
    const user = 'user';
    const time = new Date().getTime();
    const id = `${appId}-${user}-${time}`;
    const location = this.injector.get(LocationStrategy);
    const url = location instanceof PathLocationStrategy ? location.path() : '';
    const status = error.status || null;
    const message = error.message || error.toString();
    const stack = error instanceof HttpErrorResponse ? null : StackTraceParser.parse(error);
    const errorToSend = {name, appId, user, time, id, url, status, message, stack};
    
    return errorToSend;
  }

}

class fakeHttpService {
  static post(error): Observable<any> {
    return Observable.of(error);
  }
}