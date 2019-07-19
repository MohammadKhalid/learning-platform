import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonContent, IonSelect, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.page.html',
  styleUrls: ['./company-form.page.scss'],
})
export class CompanyFormPage implements OnInit {
	@ViewChild(IonContent) content: IonContent;
	@ViewChild('companiesInput', { read: IonSelect }) companiesInput: any;

  apiEndPoint: string = 'companies';
	form: FormGroup;

	submitted: boolean = false;
	action: string;
	sessionData: any;

	id: string;
	item: any;
	paramData: any;

	formFieldData: any;
	clientDepartments: any = [];

	userCanAdd = ['admin', 'client'];

	constructor(
		private notificationService: NotificationService,
		private restApi: RestApiService,
		private authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private navCtrl: NavController,
		private alertCtrl: AlertController
	) {
		this.sessionData = this.authService.getSessionData();

		// load input field data
		this.loadFormFieldData();
	}

	ngOnInit() {
		let formGroup: any = {
			id: new FormControl(null),
			name: new FormControl('', Validators.required),
			description: new FormControl(''),
			address: new FormControl(''),
			country: new FormControl(''),
			email: new FormControl(''),
			phone: new FormControl(''),
			fax: new FormControl(''),
			departmentIds: new FormControl([]),
			departments: this.formBuilder.array([])
		};
		
		if(this.sessionData.user.type === 'admin') formGroup.clientId = new FormControl('', Validators.required);

		this.form = this.formBuilder.group(formGroup);

		this.activatedRoute.params.subscribe((data) => {
			this.paramData = data;
			if(this.paramData.id) this.id = this.paramData.id;

			console.log('PARAM DATA', this.paramData);

			if(this.id) { // load item
				this.restApi.get(this.apiEndPoint + '/' + this.id, {}).subscribe((res: any) => {
					if(res.success === true) {
						this.item = res.item;

						// set form value
						if(this.sessionData.user.type === 'admin') {
							this.form.controls.clientId.setValue(this.item.owner.id);
							this.setClientDepartment(this.item.owner.id);
						}

						this.form.controls.id.setValue(this.item.id);
						this.form.controls.name.setValue(this.item.name);
						this.form.controls.description.setValue(this.item.description);
						this.form.controls.address.setValue(this.item.address);
						this.form.controls.country.setValue(this.item.country);
						this.form.controls.email.setValue(this.item.email);
						this.form.controls.phone.setValue(this.item.phone);
						this.form.controls.fax.setValue(this.item.fax);

						// department
						for (let index = 0; index < this.item.departments.length; index++) {
							const department = this.item.departments[index];
							this.form.controls.departmentIds.value.push(department.id);
						}
						
						console.log('FORM VAL', this.form.value);
					} else {
						// navigate back to list
						this.notificationService.showMsg('Company not found!').then(() => {
							this.navCtrl.navigateRoot('/company');
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
	}

	save() {
		console.log('FORM', this.form);
		// return;

		this.submitted = true;
		
		if(this.form.valid) {
			this.notificationService.showMsg('Saving...', 0).then(() => {
				if(this.action === 'new') this.restApi.post(this.apiEndPoint, this.form.value).subscribe((res: any) => this.saveCallback(res), (err) => this.saveCallback(err.error));
				else this.restApi.put(this.apiEndPoint + '/' + this.id, this.form.value).subscribe((res: any) => this.saveCallback(res), (err) => this.saveCallback(err.error));
			});
		}
	}

	saveCallback(res: any) {
		this.notificationService.toast.dismiss();

		if(res.success === true) {
			// navigate to
			const messageAction: string = this.action === 'new' ? 'saved' : 'updated';
			this.notificationService.showMsg('Company ' + this.form.value.name + ' has been ' + messageAction + '!').then(() => {
				// go to detail page
				this.navCtrl.navigateRoot('/company/detail/' + res.item.id);
			});
		} else {
			// show error message
			console.log(res.error);
			this.notificationService.showMsg(res.error);

			// reenable button
			this.submitted = false;
		}
	}

	loadFormFieldData() {
		this.restApi.get('companies/form-input-data', {}).subscribe((res: any) => {
			this.formFieldData = res;

			// set departments
			if(this.formFieldData.departments) this.clientDepartments = this.formFieldData.departments;

			// add department field
			if(this.clientDepartments.length < 1) this.addDepartment();
		});
	}

	addDepartment() {
		const item = this.formBuilder.group({
			name: new FormControl('', Validators.required)
		});

		this.departmentForms.push(item);
	}

	get departmentForms() {
		return this.form.get('departments') as FormArray;
	}

    removeDepartment(index: number) {
    	// confirmation
    	this.alertCtrl.create({
    		header: 'Confirmation Message',
    		message: 'Are you sure you want to remove this department?',
    		buttons: [
    			{
		          text: 'Cancel',
		          role: 'cancel',
		          cssClass: 'secondary',
		          handler: () => {}
		        }, {
		          text: 'Yes',
		          handler: () => {
		          	// remove
		          	this.departmentForms.removeAt(index);
		          }
		        }
    		]
    	}).then((alert) => {
    		alert.present();
    	});
	}
	
	clientChanged(e: any) {
		console.log('CL CHENGED', e);

		const value: string = e.detail.value;

		// reset form department ids
		this.form.controls.departmentIds.setValue([]);

		// set client departments
		this.setClientDepartment(value);
	}

	setClientDepartment(id: string) {
		for (let index = 0; index < this.formFieldData.clients.length; index++) {
			const client = this.formFieldData.clients[index];
			
			console.log('C ID', client.id);
			console.log('ID', id);

			if(client.id === id) this.clientDepartments = client.departments;
		}
	}

	clientDepartmentChanged(e: any) {
		const value: number = parseInt(e.detail.value);
		const departmentIndex = this.form.controls.departmentIds.value.indexOf(value);

		if(e.detail.checked) {
			if(departmentIndex < 0) this.form.controls.departmentIds.value.push(value);
		} else {
			if(departmentIndex > -1) this.form.controls.departmentIds.value.splice(departmentIndex, 1);
		}
	}
}