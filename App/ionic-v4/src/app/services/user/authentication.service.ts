import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
 
import { RestApiService } from '../http/rest-api.service';
import { RtcService } from '../rtc/rtc.service';

const SESSION_KEY = 'session';
 
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 
  sessionData: any;
  authenticationState = new BehaviorSubject(false);
  authDidCheck: boolean = false;
 
  constructor(
    private storage: Storage, 
    private plt: Platform,
    private restService: RestApiService,
    private rtcService: RtcService
  ) { 
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }
 
  checkToken() {
    return this.storage.get(SESSION_KEY).then(res => {
      this.authDidCheck = true;
      if (res && !this.sessionData) this.setSessionData(res);      
    });
  }
 
  login(data) {
    return this.storage.set(SESSION_KEY, data).then(() => {
      this.setSessionData(data);
    });
  }
 
  logout() {
    return this.storage.remove(SESSION_KEY).then(() => {
      this.restService.setSessionData(null);
      this.sessionData = null;
      /// this.rtcService.disconnect();
      this.authenticationState.next(false);
    });
  }
 
  isAuthenticated() {
    return this.authenticationState.value;
  }

  setSessionData(data) {
    this.restService.setSessionData(data);
    this.sessionData = data;
    this.rtcService.initConnection(data.user);
    this.authenticationState.next(true);
  }

  getSessionData() {
    return this.sessionData;
  }
 
}