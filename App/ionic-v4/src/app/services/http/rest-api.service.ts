import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../user/authentication.service';

import { SERVER_URL } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject, observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../notification/notification.service';

@Injectable({
	providedIn: 'root'
})
export class RestApiService {
	private sectionMenuData = new BehaviorSubject(null);
	private sectionMenuDataResource = new BehaviorSubject(null);
	private sectionConcept = new BehaviorSubject(null);
	private sectionConceptSaveButton = new BehaviorSubject(null);
	private sectionConceptBackNavigate = new BehaviorSubject(null);
	private sectionResourceSaveButton = new BehaviorSubject(null);

	private sectionMenuDataStudent = new BehaviorSubject(null);
	private sectionMenuDataResourceStudent = new BehaviorSubject(null);
	sessionData: any;
	url: string = SERVER_URL;
	_sectionId: any;

	constructor(
		private authService: AuthenticationService,
		private http: HttpClient,
		public loadingController: LoadingController,
		private actroute: ActivatedRoute,
		private noti: NotificationService,
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
			{ id: 0, value: 'Video' },
			{ id: 1, value: 'Text' },
			{ id: 2, value: 'Quiz' },
			// { id: 3, value: 'Recources' },
		]
	}
	getConceptsOptionsByname(value: string) {
		switch (value) {
			case "Lesson":
				return 0
				break;
			case "Text":
				return 1
				break;
			case "Quiz":
				return 2
				break;
			case "Recources":
				return 3
				break;
			default:
				return null
				break;
		}
	}
	set sectionId(id: any) {
		this._sectionId = id;
	}
	get sectionId() {
		return this._sectionId;
	}
	// concept click start
	getSectionConcept(): Observable<any> {
		return this.sectionConcept.asObservable();
	}
	populateSectionConcept(val: boolean) {
		this.setSectionConcept(val);
	}
	setSectionConcept(val: boolean) {
		this.sectionConcept.next(val);
	}
	setSectionConceptUnsub() {
		this.sectionConcept.next(false);
	}
	//concept click end

	// concept save button visible start
	getSectionConceptSaveButton(): Observable<any> {
		return this.sectionConceptSaveButton.asObservable();
	}
	populateSectionConceptSaveButton() {
		this.setSectionConceptSaveButton(true);
	}
	setSectionConceptSaveButton(val: boolean) {
		this.sectionConceptSaveButton.next(val);
	}
	//concept save button visible end


	// concepts coach
	getSectionMenuData(): Observable<any> {
		return this.sectionMenuData.asObservable();
	}
	populateSectionSubMenu(id) {
		this.getPromise(`section-page/get-section-pages`, id).then(resSec => {
			this.setSectionMenuData(resSec);
		}).catch(err => {
			this.noti.showMsg(err);
		})
	}
	setSectionMenuData(val: any) {
		this.sectionMenuData.next(val);
	}
	// concepts student
	getSectionMenuDataStudent(): Observable<any> {
		return this.sectionMenuDataStudent.asObservable();
	}
	populateSectionSubMenuStudent(id) {
		this.getPromise(`section/get-section-details-for-student`, id).then(resSec => {
			this.setSectionMenuDataStudent(resSec);
		}).catch(err => {
			this.noti.showMsg(err);
		})
	}
	setSectionMenuDataStudent(val: any) {
		this.sectionMenuDataStudent.next(val);
	}


	// concept back navigate  click start
	getSectionConceptBackNavigate(): Observable<any> {
		return this.sectionConceptBackNavigate.asObservable();
	}
	populateSectionConceptBackNavigate() {
		this.setSectionConceptBackNavigate(true);
	}
	setSectionConceptBackNavigate(val: boolean) {
		this.sectionConceptBackNavigate.next(val);
	}
	//concept  back navigate click end


	// concept save button visible start
	getSectionResourceSaveButton(): Observable<any> {
		return this.sectionResourceSaveButton.asObservable();
	}
	populateSectionResourceSaveButton() {
		this.setSectionConceptSaveButton(true);
	}
	setSectionResourceSaveButton(val: boolean) {
		this.sectionResourceSaveButton.next(val);
	}
	//concept save button visible end
}