import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonContent } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../services/user/authentication.service';
import { RestApiService } from '../../../services/http/rest-api.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-admin-category-form',
  templateUrl: './admin-category-form.component.html',
  styleUrls: ['./admin-category-form.component.scss'],
})
export class AdminCategoryFormComponent implements OnInit {
	@ViewChild(IonContent) content: IonContent;

	sessionData: any;

	form: FormGroup;
	submitted: boolean = false;
	action: string;

	item: any;
	paramData: any;
	inputData: any;

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
		this.form = this.formBuilder.group({
			parents: new FormControl([]),
      title: new FormControl('', Validators.required),
			description: new FormControl(''),
			clients: this.formBuilder.array([], Validators.required)
    });

    // get input data
	this.restApi.get('categories/form-input-data', {}).subscribe((res: any) => {
      this.inputData = res;
      
      for (let index = 0; index < this.inputData.clients.length; index++) {
        const client = this.inputData.clients[index];
        
        let companyForm = this.formBuilder.array([], Validators.required);

        for (let index_c = 0; index_c < client.companies.length; index_c++) {
          const company = client.companies[index_c];

          companyForm.push(this.formBuilder.group({
            id: company.id,
            name: company.name,
            checked: true
          }));                    
        }

        this.clientForms.push(this.formBuilder.group({
          id: client.id,
          name: client.firstName + ' ' + client.lastName,
          companies: companyForm
        }));
      }
	});

	this.activatedRoute.params.subscribe((data) => {
		this.paramData = data;

		// load item
		if(this.paramData.id) {
			this.restApi.get('categories/' + this.paramData.id, {}).subscribe((res: any) => {
				if(res.success === true) {
					this.item = res.item;

					// set form value
					this.form.controls.title.setValue(this.item.title);
					this.form.controls.description.setValue(this.item.description);

					if(this.item.parents.length > 0) {
						let parentIds: Array<number> = [];
						
						for (let index = 0; index < this.item.parents.length; index++) {
							parentIds.push(this.item.parents[index].id);
						}

						this.form.controls.parents.setValue(parentIds);
		      }
		
		      // set companies
		      setTimeout(() => { this.setFormCompanies() });
				} else {
					// navigate back to list
					this.notificationService.showMsg('Category not found!').then(() => {
						this.navCtrl.navigateRoot('/category');
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
    console.log('FORM ', this.form);
    // return;
		this.submitted = true;

		if(this.form.valid) {
			this.notificationService.showMsg('Saving...', 0).then(() => {
				if(this.action === 'new') this.restApi.post('categories', this.form.value).subscribe((res: any) => this.saveCallback(res));
				else this.restApi.put('categories/' + this.item.id, this.form.value).subscribe((res: any) => this.saveCallback(res));
			});
		}
	}

	saveCallback(res: any) {
		this.notificationService.toast.dismiss();

		if(res.success === true) {
			// set response data
			this.item = res.item;

			// navigate to
			this.notificationService.showMsg('Category ' + this.form.value.title + ' has been saved!').then(() => {
				// go to detail page
				this.navCtrl.navigateRoot('/category');
			});
		} else {
			// show error message
			this.notificationService.showMsg(res.error);

			// reenable button
			this.submitted = false;
		}
	}

	get clientForms() {
		return this.form.get('clients') as FormArray;
  }

  setFormCompanies() {
    let controls = this.clientForms.controls;

    for (let index = 0; index < controls.length; index++) {
      let client = <FormGroup>controls[index];
      let companyControls = <FormArray>client.controls.companies;

      for (let index_ = 0; index_ < companyControls.controls.length; index_++) {
        let company = <FormGroup>companyControls.controls[index_];
        company.controls.checked.setValue(this.hasCompany(company.value.id));
      }
    }
  }

  hasCompany(id: number) {
    for (let index = 0; index < this.item.companies.length; index++) {
      const company = this.item.companies[index];
      if(company.id === id) return true;
    }
  }

  removeCategory(index: number) {
    this.inputData.categories.splice(index, 1);
  }

  debugCompanyControl(item) {
    console.log('DEBUG ITEM', item);
  }
}