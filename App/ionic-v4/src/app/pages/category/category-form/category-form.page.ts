import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, ToastController, ModalController, AlertController, IonContent } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../../../services/http/rest-api.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.page.html',
  styleUrls: ['./category-form.page.scss'],
})
export class CategoryFormPage implements OnInit {
	@ViewChild(IonContent) content: IonContent;
	@ViewChildren('questionElem') questions: QueryList<ElementRef>;

	form: FormGroup;
	submitted: boolean = false;
	action: string;

	item: any;
	paramData: any;

	categories: [];
	parentCategory: any;

	constructor(
  		private restApi: RestApiService,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController
	) {
		// get categories
		this.restApi.get('categories', {}).then((res: any) => {
			this.categories = res.items;
		});
	}

	ngOnInit() {
		this.form = this.formBuilder.group({
            title: new FormControl('', Validators.required),
            description: new FormControl('')
        });

		this.activatedRoute.params.subscribe((data) => {
			this.paramData = data;

			// load item
			if(this.paramData.id) {
				this.restApi.get('categories/' + this.paramData.id, {}).then((res: any) => {
					if(res.success === true) {
						this.item = res.item;

						// set form value
						this.form.controls.title.setValue(this.item.title);
						this.form.controls.description.setValue(this.item.description);
					} else {
						// navigate back to list
						this.restApi.showMsg('Category not found!').then(() => {
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
		this.submitted = true;

		if(this.form.valid) {
			this.restApi.showMsg('Saving...', 0).then(() => {
				if(this.action === 'new') this.restApi.post('categories', this.form.value).then((res: any) => this.saveCallback(res));
				else this.restApi.put('categories/' + this.item.id, this.form.value).then((res: any) => this.saveCallback(res));
			});
		}
	}

	saveCallback(res: any) {
		this.restApi.toast.dismiss();

		if(res.success === true) {
			// set response data
			this.item = res.item;

			// navigate to
			this.restApi.showMsg('Category ' + this.form.value.title + ' has been saved!').then(() => {
				// go to detail page
				this.navCtrl.navigateRoot('/category');
			});
		} else {
			// show error message
			this.restApi.showMsg(res.error);

			// reenable button
			this.submitted = false;
		}
	}
}