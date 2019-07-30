import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../user/authentication.service';

import { SERVER_URL } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class RestApiService {
	private sectionMenuData = new BehaviorSubject(null);
	sessionData: any;
	url: string = SERVER_URL;

	constructor(
		private authService: AuthenticationService,
		private http: HttpClient,
		public loadingController: LoadingController
	) {
		this.authService.authenticationState.subscribe((state) => {
			if (state) {
				this.sessionData = this.authService.getSessionData();
				this.url = this.url + this.sessionData.user.type + '/';
			} else {
				this.sessionData = null;
				this.url = SERVER_URL;
			}
		});
	}

	get(endpoint: string, params?: any, reqOpts?: any): Observable<ArrayBuffer> {
		if (!reqOpts) reqOpts = { headers: {} };

		// append token
		if (this.sessionData && this.sessionData.token) reqOpts.headers.Authorization = this.sessionData.token;

		// Support easy query params for GET requests
		reqOpts.params = new HttpParams();

		if (params) {
			reqOpts.params = new HttpParams();
			for (let k in params) {
				reqOpts.params = reqOpts.params.set(k, params[k]);
			}
		}

		let req = this.http.get(this.url + endpoint, reqOpts);

		// return req.catch((err: any) => {
		// 	this.httpError(err);
		// 	return err;
		// });
		return req;
	}

	post(endpoint: string, body: any, reqOpts?: any): Observable<ArrayBuffer> {
		if (!reqOpts) reqOpts = { headers: {} };

		// append token
		if (this.sessionData && this.sessionData.token) reqOpts.headers.Authorization = this.sessionData.token;

		let req = this.http.post(this.url + endpoint, body, reqOpts);

		// return req.catch((err: any) => {
		// 	this.httpError(err);
		// 	return err;
		// });
		return req;
	}


	postPromise(endpoint: string, body: any, reqOpts?: any): Promise<any> {

		if (!reqOpts) reqOpts = { headers: {} };
		if (this.sessionData && this.sessionData.token) reqOpts.headers.Authorization = this.sessionData.token;

		return new Promise((resolve, reject) => {

			this.http.post(this.url + endpoint, body, reqOpts)
				.toPromise()
				.then(
					res => { // Success
						resolve(res);
					}
				).catch(onreject => {
					reject(onreject);
				});
		});

	}


	putPromise(endpoint: string, body: any, reqOpts?: any): Promise<any> {

		if (!reqOpts) reqOpts = { headers: {} };
		if (this.sessionData && this.sessionData.token) reqOpts.headers.Authorization = this.sessionData.token;

		return new Promise((resolve, reject) => {

			this.http.put(this.url + endpoint, body, reqOpts)
				.toPromise()
				.then(
					res => { // Success
						resolve(res);
					}
				).catch(onreject => {
					reject(onreject);
				});
		});

	}

	async presentLoading() {
		const loading = await this.loadingController.create({
			message: 'Please wait...',
			duration: 2000
		});
		await loading.present();

		const { role, data } = await loading.onDidDismiss();

	}


	getPromise(endpoint: string, params?: any, reqOpts?: any): Promise<any> {
		if (!reqOpts) reqOpts = { headers: {} };
		if (this.sessionData && this.sessionData.token) reqOpts.headers.Authorization = this.sessionData.token;

		return new Promise((resolve, reject) => {
			let url = params ? `${this.url}${endpoint}/${params}` : `${this.url}${endpoint}`;
			this.http.get(url, reqOpts)
				.toPromise()
				.then(
					res => { // Success
						resolve(res);
					}
				).catch(onreject => {
					reject(onreject);
				});
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
		if (!reqOpts) reqOpts = { headers: {} };

		// append token
		if (this.sessionData && this.sessionData.token) reqOpts.headers.Authorization = this.sessionData.token;

		// appent header option
		//reqOpts.headers['Content-Type'] = 'application/json';
		//reqOpts.headers.Accept = 'application/json';
		reqOpts.responseType = 'blob';

		let req = this.http.post<Blob>(this.url + endpoint, body, reqOpts);

		// return req.catch((err: any) => {
		// 	this.httpError(err);
		// 	return err;
		// });
		return req;
	}

	put(endpoint: string, body: any, reqOpts?: any): Observable<ArrayBuffer> {
		if (!reqOpts) reqOpts = { headers: {} };

		// append token
		if (this.sessionData && this.sessionData.token) reqOpts.headers.Authorization = this.sessionData.token;

		let req = this.http.put(this.url + endpoint, body, reqOpts);

		// return req.catch((err: any) => {
		// 	this.httpError(err);
		// 	return err;
		// });
		return req;
	}

	delete(endpoint: string, reqOpts?: any): Observable<ArrayBuffer> {
		if (!reqOpts) reqOpts = { headers: {} };

		// append token
		if (this.sessionData && this.sessionData.token) reqOpts.headers.Authorization = this.sessionData.token;

		let req = this.http.delete(this.url + endpoint, reqOpts);

		// return req.catch((err: any) => {
		// 	this.httpError(err);
		// 	return err;
		// });
		return req;
	}

	setSessionData(data) {
		this.sessionData = data;
	}

	getConceptsOptins() {
		return [
			{ id: 0, value: 'video' },
			{ id: 1, value: 'Text' },
			{ id: 2, value: 'Quiz' },
			{ id: 3, value: 'Recources' },
		]
	}
	getSectionMenuData(): Observable<any> {
		return this.sectionMenuData.asObservable();
	  }
	
	  setSectionMenuData(val: any) {
		this.sectionMenuData.next(val);
	  }
}