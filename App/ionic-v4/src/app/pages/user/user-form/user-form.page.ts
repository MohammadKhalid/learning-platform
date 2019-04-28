import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonContent } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.scss'],
})
export class UserFormPage implements OnInit {
	@ViewChild(IonContent) content: IonContent;

	form: FormGroup;
	submitted: boolean = false;
	action: string;
	sessionData: any;

	id: string;
	item: any;
	paramData: any;
	routeData: any;

	constructor(
			private restApi: RestApiService,
			private authService: AuthenticationService,
			private formBuilder: FormBuilder,
			private activatedRoute: ActivatedRoute,
			private navCtrl: NavController
	) {
		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		this.form = this.formBuilder.group({
				id: new FormControl(null),
				firstName: new FormControl('', Validators.required),
				lastName: new FormControl('', Validators.required),
				description: new FormControl(''),
				email: new FormControl('', [Validators.required, Validators.email]),
				password: new FormControl('', [Validators.required, Validators.minLength(8)]),
				passwordRepeat: new FormControl('', [Validators.required, Validators.minLength(8)])
		});

		this.activatedRoute.data.subscribe((data) => {
			this.routeData = data;

			this.activatedRoute.params.subscribe((data) => {
				this.paramData = data;

				// set id
				switch (this.routeData.type) {
					case 'profile':
						this.id = '/';
						break;
					default:
						if(this.paramData.id) this.id = '/' + this.paramData.id;
						break;
				}
	
				// validate permission
				// @TODO. user service
				if(this.sessionData.user.type !== 'admin' && this.sessionData.user.id !== this.paramData.id && this.routeData.type !== 'profile') {
					this.navCtrl.navigateRoot('/dashboard');
				} else if(this.id) { // load item
					this.restApi.get(this.routeData.apiEndPoint + this.id, {}).then((res: any) => {
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
							this.restApi.showMsg(this.routeData.singular + ' not found!').then(() => {
								this.navCtrl.navigateRoot('/' + this.routeData.appUrl);
							});
						}
					});
	
					// set action
					this.action = 'edit';
				} else {
					// set action
					this.action = 'new';
				}
			});
		});
	}

	save() {
		this.submitted = true;

		if(this.form.valid) {
			this.restApi.showMsg('Saving...', 0).then(() => {
				if(this.action === 'new') this.restApi.post(this.routeData.apiEndPoint, this.form.value).then((res: any) => this.saveCallback(res), (err) => this.saveCallback(err));
				else this.restApi.put(this.routeData.apiEndPoint + this.id, this.form.value).then((res: any) => this.saveCallback(res), (err) => this.saveCallback(err));
			});
		}
	}

	saveCallback(res: any) {
		this.restApi.toast.dismiss();

		if(res.success === true) {
			// set response data
			this.item = res.item;

			// navigate to
			this.restApi.showMsg(this.routeData.singular + ' ' + this.form.value.firstName + ' ' + this.form.value.lastName + ' has been saved!').then(() => {
				// go to detail page
				this.navCtrl.navigateRoot('/' + this.routeData.appUrl);
			});
		} else {
			// show error message
			console.log(res.error);
			this.restApi.showMsg(res.error, 50000);

			// reenable button
			this.submitted = false;
		}
	}
}