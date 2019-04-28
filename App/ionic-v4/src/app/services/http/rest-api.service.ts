import { Injectable } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { HttpClient, HttpParams, HttpRequest, HttpHeaders } from '@angular/common/http';

import { SERVER_URL } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

	toast: any;
	sessionData: any;
	url: string = SERVER_URL;

	constructor(
		private http: HttpClient, 
		private toastController: ToastController,
		private navCtrl: NavController
	) {}

	get(endpoint: string, params?: any, reqOpts?: any) {
		if(!reqOpts) reqOpts = { headers: {} };

		// append token
		if(this.sessionData && this.sessionData.token) reqOpts.headers.Authorization = this.sessionData.token;

		// Support easy query params for GET requests
		reqOpts.params = new HttpParams();

		if (params) {
			reqOpts.params = new HttpParams();
		  	for (let k in params) {
				reqOpts.params = reqOpts.params.set(k, params[k]);
		  	}
		}

		let req = this.http.get(this.url + endpoint, reqOpts).toPromise();

		return req.catch((err: any) => {
			this.httpError(err);
			return err;
		});
	}

	post(endpoint: string, body: any, reqOpts?: any) {
		if(!reqOpts) reqOpts = { headers: {} };

		// append token
		if(this.sessionData && this.sessionData.token) reqOpts.headers.Authorization = this.sessionData.token;

		let req = this.http.post(this.url + endpoint, body, reqOpts).toPromise();

		return req.catch((err: any) => {
			this.httpError(err);
			return err;
		});
	}

	postFormData(endpoint: string, body: any, reqOpts?: any) {
		const httpHeaders = new HttpHeaders({
			Authorization: this.sessionData.token
		});

		const reqOption = new HttpRequest('POST', this.url + endpoint, body, {
	        reportProgress: true,
	        headers: httpHeaders
	    });

	    return this.http.request(reqOption);
	}

	postBlob(endpoint: string, body: any, reqOpts?: any) {
		if(!reqOpts) reqOpts = { headers: {} };

		// append token
		if(this.sessionData && this.sessionData.token) reqOpts.headers.Authorization = this.sessionData.token;

		// appent header option
		//reqOpts.headers['Content-Type'] = 'application/json';
		//reqOpts.headers.Accept = 'application/json';
		reqOpts.responseType = 'blob';

		let req = this.http.post<Blob>(this.url + endpoint, body, reqOpts).toPromise();

		return req.catch((err: any) => {
			this.httpError(err);
			return err;
		});
	}

	put(endpoint: string, body: any, reqOpts?: any) {
		if(!reqOpts) reqOpts = { headers: {} };

		// append token
		if(this.sessionData && this.sessionData.token) reqOpts.headers.Authorization = this.sessionData.token;

		let req = this.http.put(this.url + endpoint, body, reqOpts).toPromise();

		return req.catch((err: any) => {
			this.httpError(err);
			return err;
		});
	}

	delete(endpoint: string, reqOpts?: any) {
		if(!reqOpts) reqOpts = { headers: {} };

		// append token
		if(this.sessionData && this.sessionData.token) reqOpts.headers.Authorization = this.sessionData.token;

		let req = this.http.delete(this.url + endpoint, reqOpts).toPromise();

		return req.catch((err: any) => {
			this.httpError(err);
			return err;
		});
 	}

	setSessionData(data) {
		this.sessionData = data;
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
		});
	}

	httpError(err: any) {
		this.showMsg(err.error.error || err.error).then(() => {
			if(err.status === 401) {
				this.navCtrl.navigateRoot('login');
			}
		});
	}

}