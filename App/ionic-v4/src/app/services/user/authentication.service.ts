import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

const SESSION_KEY = 'session';
 
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 
  sessionData: any;
  authenticationState = new BehaviorSubject(false);
  authDidCheck: boolean = false;
 
  constructor(
    private storage: Storage
  ) { 
      this.checkToken();
  }
 
  checkToken() {
    this.storage.get(SESSION_KEY).then((res) => {
      console.log('STORAGE', res);

      this.authDidCheck = true;
      if(res) this.setSessionData(res);
      else this.logout();
    });
  }
 
  login(data) {
    return this.storage.set(SESSION_KEY, data).then(() => {
      this.setSessionData(data);
    });
  }
 
  logout() {
    return this.storage.remove(SESSION_KEY).then(() => {
      this.sessionData = null;
      this.authenticationState.next(false);
    });
  }
 
  isAuthenticated() {
    return this.authenticationState.value;
  }

  setSessionData(data) {
    this.sessionData = data;
    this.authenticationState.next(true);
  }

  getSessionData() {
    return this.sessionData;
  }
}