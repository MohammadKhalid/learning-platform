import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { RestApiService } from '../services/http/rest-api.service';

@Injectable()
export class PageResolver implements Resolve<any> {

  constructor(
    private httpService: RestApiService,
  ) {}
 
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.httpService.get('');
  }
}