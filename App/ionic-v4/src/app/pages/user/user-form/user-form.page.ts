import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonContent } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { NotificationService } from '../../../services/notification/notification.service';

import * as moment from 'moment';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.scss'],
})
export class UserFormPage implements OnInit {
	@ViewChild(IonContent) content: IonContent;

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

	userCanAdd = ['admin', 'company'];

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
			email: new FormControl('', [Validators.required, Validators.email]),
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
					case 'company':
						this.subscriptionForm = this.formBuilder.group({
							subscriptionPackageId: new FormControl('1', Validators.required),
							expireAt: new FormControl(moment().add(1, 'year').toISOString(), Validators.required)
						});
						this.updateSubscriptionEnd();

						this.companyForm = this.formBuilder.array([]);

						this.form.addControl('companies', this.companyForm);
						this.form.addControl('subscription', this.subscriptionForm);

						break;
					case 'student':
					case 'coach':
						this.form.addControl('companyId', new FormControl());
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
					if(this.sessionData.user.type !== 'company') this.addCompany();
				}
			});
		});
	}

	save() {
		console.log('FORM', this.form);
		console.log('TELECOM FORM', this.telecomForm.pristine);

		// return;

		this.submitted = true;
		
		if(this.form.valid) {
			this.notificationService.showMsg('Saving...', 0).then(() => {
				if(this.action === 'new') this.restApi.post(this.routeData.apiEndPoint, this.form.value).subscribe((res: any) => this.saveCallback(res), (err) => this.saveCallback(err));
				else this.restApi.put(this.routeData.apiEndPoint + this.id, this.form.value).subscribe((res: any) => this.saveCallback(res), (err) => this.saveCallback(err));
			});
		}
	}

	saveCallback(res: any) {
		this.notificationService.toast.dismiss();

		if(res.success === true) {
			// set response data
			this.item = res.item;

			// navigate to
			this.notificationService.showMsg(this.routeData.singular + ' ' + this.form.value.firstName + ' ' + this.form.value.lastName + ' has been saved!').then(() => {
				// go to detail page
				this.navCtrl.navigateRoot('/' + this.routeData.appUrl);
			});
		} else {
			// show error message
			console.log(res.error);
			this.notificationService.showMsg(res.error, 50000);

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
		this.restApi.get('form-input-data/user', { type: this.routeData.type }).subscribe((res: any) => {
			this.formFieldData = res.data;
		});
	}

	updateSubscriptionEnd() {
		console.log('UPDATE EXP');
		this.expireAt = moment(this.subscriptionForm.value.expireAt).fromNow(true);
	}
}