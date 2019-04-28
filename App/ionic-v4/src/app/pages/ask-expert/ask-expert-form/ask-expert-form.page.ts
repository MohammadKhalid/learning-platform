import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, ModalController } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { RestApiService } from '../../../services/http/rest-api.service';

// modal
import { MediaComponent } from '../../../components/media/media.component';

@Component({
  selector: 'app-ask-expert-form',
  templateUrl: './ask-expert-form.page.html',
  styleUrls: ['./ask-expert-form.page.scss'],
})
export class AskExpertFormPage implements OnInit {

	form: FormGroup;
	submitted: boolean = false;
	action: string;

	item: any;
	paramData: any;

	medias: any = [];
	coaches: any = [];

	constructor(
  		private restApi: RestApiService,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private navCtrl: NavController,
        private modalCtrl: ModalController
	) {
		// get coaches
        this.restApi.get('form-input-data', {}).then((resp: any) => {
            if(resp.data.coaches) this.coaches = resp.data.coaches;
        });
	}

	ngOnInit() {
		this.form = this.formBuilder.group({
			id: null,
			subject: new FormControl('', Validators.required),
			question: new FormControl('', Validators.required),
            submittedTo: new FormControl('', Validators.required)
        });

		this.activatedRoute.params.subscribe((data) => {
			this.paramData = data;

			// load item
			if(this.paramData.id) {
				this.restApi.get('ask-question/' + this.paramData.id, {}).then((res: any) => {
					if(res.success === true) {
						this.item = res.item;

						// set form value
						this.form.setValue({
							id: null,
							subject: this.item.subject,
							question: this.item.question,
							submittedTo: this.item.submittedTo
						});
					} else {
						// navigate back to list
						this.restApi.showMsg('Not found!').then(() => {
							this.navCtrl.navigateRoot('/dashboard');
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

	addMedia() {
		this.modalCtrl.create({
			component: MediaComponent,
			backdropDismiss: false
		}).then((modal) => {
			modal.onWillDismiss().then((data) => {
				if(data && data.data && data.data.items) this.medias = data.data.items;
			});

			modal.present();
		});
	}

	removeMedia(index: any) {
		this.medias.splice(index, 1);
	}

	save() {
		if(this.form.valid) {
			this.submitted = true;

			// append media
			this.form.value.medias = [];

			for (var i = this.medias.length - 1; i >= 0; i--) {
				this.form.value.medias.push(this.medias[i].id);
			}

			this.restApi.showMsg('Saving...', 0).then(() => {
				if(this.action === 'new') this.restApi.post('ask-expert', this.form.value).then((res: any) => this.saveCallback(res));
				else this.restApi.put('ask-expert/' + this.item.id, this.form.value).then((res: any) => this.saveCallback(res));
			});
		}
	}

	saveCallback(res: any) {
		this.restApi.toast.dismiss();

		if(res.success === true) {
			// navigate to
			this.restApi.showMsg('Question / challenge  has been saved!').then(() => {
				// add this to topic question
				this.navCtrl.navigateRoot('/ask-expert');
			});
		} else {
			this.submitted = false;

			// show error message
			this.restApi.showMsg(res.error);
		}
	}

	selectableCoachChange(event: {
        component: IonicSelectableComponent,
        value: any
    }) {
        if(event.value && event.value.id) {
            this.form.controls.submittedTo.setValue(event.value.id);
        } else {
            this.form.controls.submittedTo.setValue('');
        }
    }

}