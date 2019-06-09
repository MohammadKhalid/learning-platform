import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, ModalController } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { RestApiService } from '../../../services/http/rest-api.service';
import { NotificationService } from '../../../services/notification/notification.service';

// modal
import { MediaComponent } from '../../../components/media/media.component';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.page.html',
  styleUrls: ['./question-form.page.scss'],
})
export class QuestionFormPage implements OnInit {

	form: FormGroup;
	action: string;

	item: any;
	paramData: any;

	topic: any;
	medias: any = [];

	constructor(
		private notificationService: NotificationService,
  		private restApi: RestApiService,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private navCtrl: NavController,
        private modalCtrl: ModalController
	) {}

	ngOnInit() {
		this.form = this.formBuilder.group({
			id: null,
            question: new FormControl('', Validators.required),
            script: new FormControl(''),
            answerLimit: new FormControl(true),
            answerLimitTime: new FormControl(30)
        });

		this.activatedRoute.params.subscribe((data) => {
			this.paramData = data;

			// load topic
			if(this.paramData.topic_id) {
				this.restApi.get('topics/' + this.paramData.topic_id, {}).subscribe((res: any) => {
					if(res.success === true) {
						this.topic = res.item;
					}
				});
			}

			// load item
			if(this.paramData.id) {
				this.restApi.get('medias/' + this.paramData.id, {}).subscribe((res: any) => {
					if(res.success === true) {
						this.item = res.item;

						// set form value
						this.form.setValue({
							question: this.item.question,
				            script: this.item.script,
				            answerLimit: this.item.answerLimit,
				            answerLimitTime: this.item.answerLimitTime
						});

						this.medias = this.item.mediaItems;
					} else {
						// navigate back to list
						this.notificationService.showMsg('Not found!').then(() => {
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

	removeMedia(item: any) {
		this.medias.splice(item, 1);
	}

	save() {
		if(this.form.valid) {
			// append topic
			if(this.topic) this.form.value.topic = this.topic.id;

			// append media
			this.form.value.medias = [];

			for (var i = this.medias.length - 1; i >= 0; i--) {
				this.form.value.medias.push(this.medias[i].id);
			}

			this.notificationService.showMsg('Saving...', 0).then(() => {
				if(this.action === 'new') this.restApi.post('questions', this.form.value).subscribe((res: any) => this.saveCallback(res));
				else this.restApi.put('questions/' + this.item.id, this.form.value).subscribe((res: any) => this.saveCallback(res));
			});
		}
	}

	saveCallback(res: any) {
		this.notificationService.toast.dismiss();

		if(res.success === true) {
			// navigate to
			this.notificationService.showMsg('Question / challenge  has been saved!').then(() => {
				// add this to topic question
				if(this.topic) {
					// this.restApi.put('topics-questions/' + this.topic.id, {questionId: res.id}).subscribe((res: any) => {
						// navigate to topic
						this.navCtrl.navigateRoot('/topic/detail/' + this.topic.id);
					// });
				}
				else this.navCtrl.navigateRoot('/question');
			});
		} else {
			// show error message
			this.notificationService.showMsg(res.error);
		}
	}

	selectableTopicChange(event: {
        component: IonicSelectableComponent,
        value: any
    }) {
        if(event.value && event.value.id) this.form.controls.topicId.setValue(event.value.id);
        else this.form.controls.topicId.setValue(null);
    }

}