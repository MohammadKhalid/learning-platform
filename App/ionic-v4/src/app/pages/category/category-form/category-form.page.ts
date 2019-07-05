import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList, Input } from '@angular/core';
import { NavController, ToastController, ModalController, AlertController, IonContent } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../../../services/http/rest-api.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';

@Component({
	selector: 'app-category-form',
	templateUrl: './category-form.page.html',
	styleUrls: ['./category-form.page.scss'],
})
export class CategoryFormPage implements OnInit {
	@ViewChild(IonContent) content: IonContent;
	@ViewChildren('questionElem') questions: QueryList<ElementRef>;
	user: any = {};

	form: FormGroup;
	submitted: boolean = false;
	action: string;

	item: any;
	paramData: any;

	categories: [];
	parentCategory: any;

	constructor(
		private notificationService: NotificationService,
		private restApi: RestApiService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private navCtrl: NavController,
		private modalCtrl: ModalController,
		private authService: AuthenticationService,
		private alertCtrl: AlertController
	) {
		// get categories
		this.restApi.get('categories', {}).subscribe((res: any) => {
			this.categories = res.items;
		});
	}

	ngOnInit() {
		this.form = this.formBuilder.group({
			title: new FormControl('', Validators.required),
			description: new FormControl(''),
			userId: this.authService.getSessionData().user.id
		});

		this.activatedRoute.params.subscribe((data) => {
			this.paramData = data;

			// load item
			if (this.paramData.id) {
				this.restApi.getPromise('category/'+this.paramData.id)
				.then(res => {
			
					this.form.controls['title'].setValue(res.data[0].title);
					this.form.controls['description'].setValue(res.data[0].description);
					
				
					
					console.log(this.item);
				}).catch(onreject => {
					console.log(onreject);
				})
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
		if (this.form.valid) {

			this.notificationService.showMsg('Saving...', 0).then(() => {
				//	if (this.action === 'new') this.restApi.post('categories', this.form.value).subscribe((res: any) => this.saveCallback(res));
				//	else this.restApi.put('categories/' + this.item.id, this.form.value).subscribe((res: any) => this.saveCallback(res));
				this.restApi.postPromise('categories', this.form.value)
					.then(res => {
						this.notificationService.toast.dismiss();

						console.log(res);
					}).catch(onreject => {
						this.notificationService.toast.dismiss();

						alert(onreject);
						console.log(onreject);
					})
			});
		}

	}

	saveCallback(res: any) {
		this.notificationService.toast.dismiss();

		if (res.success === true) {
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
}