import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonContent, IonSelect } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { NotificationService } from '../../../services/notification/notification.service';

import * as moment from 'moment';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
selector: 'app-user-form',
templateUrl: './user-form.page.html',
styleUrls: ['./user-form.page.scss'],
})
export class UserFormPage implements OnInit {
	@ViewChild(IonContent) content: IonContent;
	@ViewChild('companiesInput', { read: IonSelect }) companiesInput: any;

	form: FormGroup;
	subscriptionForm: FormGroup;
	telecomForm: any;
	addressForm: any;
	companyForm: any;

	submitted: boolean = false;
	action: string;
	sessionData: any;

	id: string;
	item: any;
	paramData: any;
	routeData: any;

	formFieldData: any;
	maxYearPicker = moment().add(10, 'year').format('YYYY-MM-DD');
	expireAt: any;

	userCanAdd = ['admin', 'client'];

	constructor(
		private notificationService: NotificationService,
		private restApi: RestApiService,
		private authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private navCtrl: NavController
	) {
		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		this.telecomForm = this.formBuilder.array([]);
		this.addressForm = this.formBuilder.array([]);

		this.form = this.formBuilder.group({
			id: new FormControl(null),
			firstName: new FormControl('', Validators.required),
			lastName: new FormControl('', Validators.required),
			description: new FormControl(''),
			// email: new FormControl('', [Validators.required, Validators.email]),
			email: new FormControl(''),
			username: new FormControl('', [Validators.required, Validators.minLength(4)]),
			password: new FormControl('', [Validators.required, Validators.minLength(8)]),
			passwordRepeat: new FormControl('', [Validators.required, Validators.minLength(8)]),
			telecoms: this.telecomForm,
			addresses: this.addressForm
		});

		this.activatedRoute.data.subscribe((data) => {
			this.routeData = data;

			// load input field data
			this.loadFormFieldData();

			this.activatedRoute.params.subscribe((data) => {
				this.paramData = data;

				// set id
				switch (this.routeData.type) {
					case 'profile':
						this.id = '/';
						break;
					case 'client':
						this.subscriptionForm = this.formBuilder.group({
							subscriptionPackageId: new FormControl('1', Validators.required),
							expireAt: new FormControl(moment().add(1, 'year').toISOString(), Validators.required)
						});
						this.updateSubscriptionEnd();

						// this.companyForm = this.formBuilder.array([]);
						// this.form.addControl('companies', this.companyForm);

						this.form.addControl('subscription', this.subscriptionForm);

						break;
					case 'student':
					case 'coach':
						this.form.addControl('departments', new FormControl([], Validators.required));
						this.form.addControl('companies', new FormControl([], Validators.required));
					case 'client_admin':
						if(this.sessionData.user.type === 'admin') this.form.addControl('clientId', new FormControl('', Validators.required));
						else this.form.addControl('clientId', new FormControl(''));
						break;
					default:
						if(this.paramData.id) this.id = '/' + this.paramData.id;
						break;
				}
	
				// validate permission
				// @TODO. user service
				if(!this.userCanAdd.includes(this.sessionData.user.type) && this.sessionData.user.id !== this.paramData.id && this.routeData.type !== 'profile') {
					this.navCtrl.navigateRoot('/dashboard');
				} else if(this.id) { // load item
					this.restApi.get(this.routeData.apiEndPoint + this.id, {}).subscribe((res: any) => {
						if(res.success === true) {
							this.item = res.item;
	
							// exclude control
							this.form.removeControl('email');
							this.form.removeControl('username');
							this.form.removeControl('password');
							this.form.removeControl('passwordRepeat');

							// set form value
							this.form.controls.id.setValue(this.item.id);
							this.form.controls.firstName.setValue(this.item.firstName);
							this.form.controls.lastName.setValue(this.item.lastName);
							this.form.controls.description.setValue(this.item.description);
						} else {
							// navigate back to list
							this.notificationService.showMsg(this.routeData.singular + ' not found!').then(() => {
								this.navCtrl.navigateRoot('/' + this.routeData.appUrl);
							});
						}
					});
	
					// set action
					this.action = 'edit';
				} else {
					// set action
					this.action = 'new';

					// default telecom
					this.addTelecom();

					// default address
					this.addAddress();

					// company
					// if(this.sessionData.user.type === 'admin') this.addCompany();
				}
			});
		});
	}

	save() {
		// set client select value
		if(this.form.controls.clientId && this.sessionData.user.type === 'admin') this.form.value.clientId = this.formFieldData.clients_with_companies[this.form.value.clientId].id;
		
		// console.log('FORM', this.form);
		// return;

		this.submitted = true;
		
		if(this.form.valid) {
			// set departments
			if(this.form.controls.companies && this.form.controls.companies.value.length > 1) { 
				let itemIds: Array<string> = [];
				for (let index = 0; index < this.form.controls.departments.value.length; index++) {
					const val = this.form.controls.departments.value[index];
					itemIds.push(val.DepartmentTag.taggableId + '-' + val.id);
				}
				this.form.value.departments = itemIds;
			}

			this.notificationService.showMsg('Saving...', 0).then(() => {
				if(this.action === 'new') this.restApi.post(this.routeData.apiEndPoint, this.form.value).subscribe((res: any) => this.saveCallback(res), (err) => this.saveCallback(err.error));
				else this.restApi.put(this.routeData.apiEndPoint + this.id, this.form.value).subscribe((res: any) => this.saveCallback(res), (err) => this.saveCallback(err.error));
			});
		}
	}

	saveCallback(res: any) {
		this.notificationService.toast.dismiss();

		if(res.success === true) {
			// navigate to
			this.notificationService.showMsg(this.routeData.singular + ' ' + this.form.value.firstName + ' ' + this.form.value.lastName + ' has been saved!').then(() => {
				// go to detail page
				this.navCtrl.navigateRoot('/' + this.routeData.appUrl + '/detail/' + res.id);
			});
		} else {
			// show error message
			console.log(res.error);
			this.notificationService.showMsg(res.error);

			// reenable button
			this.submitted = false;
		}
	}

	addCompany() {
		const company = this.formBuilder.group({
			name: new FormControl('', Validators.required)
		});

		this.companyForms.push(company);
	}

	get companyForms() {
		return this.form.get('companies') as FormArray;
	}

	addTelecom() {
		const telecom = this.formBuilder.group({
			name: new FormControl('primary'),
			telephone: new FormControl(''),
			mobile: new FormControl(''),
			fax: new FormControl('')
		});

		this.telecomForms.push(telecom);
	}

	get telecomForms() {
		return this.form.get('telecoms') as FormArray;
	}

	addAddress() {
		const address = this.formBuilder.group({
			name: new FormControl('primary'),
			street: new FormControl(''),
			cityName: new FormControl(''),
			provinceName: new FormControl(''),
			zip: new FormControl(''),
			country: new FormControl('')
		});

		this.addressForms.push(address);
	}

	get addressForms() {
		return this.form.get('addresses') as FormArray;
	}

	loadFormFieldData() {
		const fields: Array<string> = [];

		switch (this.routeData.type) {
			case 'student':
			case 'coach':
				fields.push('client_with_company');

				// company
				if(this.action === 'new') this.addCompany();
				break;
			case 'company':
				fields.push('client');
				break;
			case 'client':
				fields.push('subsription_packages');
				break;
			default:
				break;
		}

		this.restApi.get(this.routeData.apiEndPoint + '/form-input-data', { fields: fields }).subscribe((res: any) => {
			this.formFieldData = res;
		});
	}

	updateSubscriptionEnd() {
		this.expireAt = moment(this.subscriptionForm.value.expireAt).fromNow(true);
	}

	clientChanged(e: any) {
		if(this.form.controls.companies) this.form.controls.companies.reset();
		this.formFieldData.companies = this.formFieldData.clients_with_companies[e.detail.value].companies;
	}

	companyChanged(e: any) {
		// reset
		if(this.form.controls.departments) this.form.controls.departments.reset();

		// contruct departments
		let departments: Array<object> = [];

		for (let index = 0; index < e.detail.value.length; index++) {
			const id = parseInt(e.detail.value[index]);
			
			if(this.formFieldData.companies && this.formFieldData.companies.length > 0) {
				for (let index_ = 0; index_ < this.formFieldData.companies.length; index_++) {
					const company = this.formFieldData.companies[index_];

					// merge
					if(company.id === id) departments = departments.concat(company.departments);
				}
			}
		}

		// attach
		this.formFieldData.departments = departments;
	}

	selectableDepartmentChange(event: {
        component: IonicSelectableComponent,
        value: any
    }) {
        // if(event.value && event.value.id) this.form.controls.categories.setValue(event.value.id);
		// else this.form.controls.categories.setValue(null);
		
		console.log('GROUP DEBUG', event.value);
	}

	getCompany(itemId: string) {
		const id: number = parseInt(itemId);

		for (let index = 0; index < this.formFieldData.companies.length; index++) {
			const company = this.formFieldData.companies[index];

			if(company.id === id) return company.name;
		}
	}
}