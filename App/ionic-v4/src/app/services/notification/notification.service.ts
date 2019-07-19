import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthenticationService } from '../user/authentication.service';

import 'rxjs/add/operator/publish';
import { from } from 'rxjs';


@Injectable()
export class NotificationService {

  toast: any;
  private _notification: BehaviorSubject<string> = new BehaviorSubject(null);
  readonly notification$: Observable<string> = this._notification.asObservable().publish().refCount();

  constructor(
    private toastController: ToastController,
    private authService: AuthenticationService
  ) {}

  notify(message) {
    console.log('NOTIFICATION MSG', message);
    this._notification.next(message);
    setTimeout(() => this._notification.next(null), 3000);
  }

  showMsg(msg: string, duration: number = 2000) {
		return this.toastController.create({
			message: msg,
			position: 'bottom',
			closeButtonText: 'Close',
			duration: duration,
			cssClass: 'toast-fullwidth toast-danger toast-text-center'
		}).then((toast) => {
			this.toast = toast;
      this.toast.present();
      
      if(msg === 'Unauthorized') this.authService.logout();
		});
	}

}