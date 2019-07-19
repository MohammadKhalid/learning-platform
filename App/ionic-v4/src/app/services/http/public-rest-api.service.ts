import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpHeaders } from '@angular/common/http';

import { SERVER_URL } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class PublicRestApiService {


	url: string = SERVER_URL;

	constructor(
		private http: HttpClient
	) {}

	get(endpoint: string, params?: any, reqOpts?: any): Observable<ArrayBuffer> {
		if(!reqOpts) reqOpts = { headers: {} };

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
		if(!reqOpts) reqOpts = { headers: {} };

		let req = this.http.post(this.url + endpoint, body, reqOpts);

		// return req.catch((err: any) => {
		// 	this.httpError(err);
		// 	return err;
		// });
		return req;
	}

	postFormData(endpoint: string, body: any, reqOpts?: any) {
		const reqOption = new HttpRequest('POST', this.url + endpoint, body, {
	        reportProgress: true
	    });

	    return this.http.request(reqOption);
	}

	postBlob(endpoint: string, body: any, reqOpts?: any) {
		if(!reqOpts) reqOpts = { headers: {} };

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
		if(!reqOpts) reqOpts = { headers: {} };

		let req = this.http.put(this.url + endpoint, body, reqOpts);

		// return req.catch((err: any) => {
		// 	this.httpError(err);
		// 	return err;
		// });
		return req;
	}

	delete(endpoint: string, reqOpts?: any): Observable<ArrayBuffer> {
		if(!reqOpts) reqOpts = { headers: {} };

		let req = this.http.delete(this.url + endpoint, reqOpts);

		// return req.catch((err: any) => {
		// 	this.httpError(err);
		// 	return err;
		// });
		return req;
 	}
}