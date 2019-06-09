import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, ToastController, ModalController, AlertController, IonContent } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { RestApiService } from '../../../services/http/rest-api.service';
import { NotificationService } from '../../../services/notification/notification.service';

// modal
import { MediaComponent } from '../../../components/media/media.component';

@Component({
  selector: 'app-topic-form',
  templateUrl: './topic-form.page.html',
  styleUrls: ['./topic-form.page.scss'],
})
export class TopicFormPage implements OnInit {
	@ViewChild(IonContent) content: IonContent;
	@ViewChildren('questionElem') questions: QueryList<ElementRef>;

	form: FormGroup;
	submitted: boolean = false;
	action: string;

	item: any;
	paramData: any;

	categories: [];

	constructor(
		private notificationService: NotificationService,
  		private restApi: RestApiService,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController
	) {
		// get categories
		this.restApi.get('categories', {}).subscribe((res: any) => {
			this.categories = res.items;
		});
	}

	ngOnInit() {
		this.form = this.formBuilder.group({
			categories: new FormControl([]),
            title: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            questions: this.formBuilder.array([]),
            isPrivate: new FormControl(false)
        });

		this.activatedRoute.params.subscribe((data) => {
			this.paramData = data;

			// load item
			if(this.paramData.id) {
				this.restApi.get('topics/' + this.paramData.id, {}).subscribe((res: any) => {
					if(res.success === true) {
						this.item = res.item;
						// this.challenges = res.item.questions;

						// set form value
						this.form.controls.categories.setValue(this.item.categories);
						this.form.controls.title.setValue(this.item.title);
						this.form.controls.description.setValue(this.item.description);
						this.form.controls.isPrivate.setValue(this.item.isPrivate);

						for (var i = 0; i < this.item.questions.length; i++) {
							const question = this.item.questions[i];

							// medias
							let questionMedias: FormArray = this.formBuilder.array([]);


							if(question.question) {
								for (var ii = question.question.medias.length - 1; ii >= 0; ii--) {
									const media = question.question.medias[ii];

									questionMedias.push(this.formBuilder.group({
										id: new FormControl(media.id, Validators.required),
										filename: new FormControl(media.filename)
									}));
								}

								this.questionForms.push(this.formBuilder.group({
									id: new FormControl(question.id),
									number: new FormControl(question.number, Validators.required),
									question: this.formBuilder.group({
										id: new FormControl(question.question.id),
										question: new FormControl(question.question.question, Validators.required),
										script: new FormControl(question.question.script),
										answerLimit: new FormControl(question.question.answerLimit),
										answerLimitTime: new FormControl(question.question.answerLimitTime),
										medias: questionMedias
									})
								}));
							}
						}

						// update number
						this.setQuestionNumber();

					} else {
						// navigate back to list
						this.notificationService.showMsg('Topic not found!').then(() => {
							this.navCtrl.navigateRoot('/topic');
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
		if(this.form.value.questions.length < 1) {
			this.alertCtrl.create({
				header: 'Save Topic',
	    		subHeader: 'Confirmation Message',
	    		message: 'There is no question / challenge added in this topic. Continue anyway?',
	    		buttons: [
	    			{
			          text: 'Cancel',
			          role: 'cancel',
			          cssClass: 'secondary',
			          handler: () => {}
			        }, {
			          text: 'Yes',
			          handler: () => {
			          	this.saveConfirmed();
			          }
			        }
	    		]
	    	}).then((alert) => {
	    		alert.present();
	    	});
		} else {
			this.saveConfirmed();
		}
	}

	saveConfirmed() {
		this.submitted = true;

		if(this.form.valid) {
			this.notificationService.showMsg('Saving...', 0).then(() => {
				if(this.action === 'new') this.restApi.post('topics', this.form.value).subscribe((res: any) => this.saveCallback(res));
				else this.restApi.put('topics/' + this.item.id, this.form.value).subscribe((res: any) => this.saveCallback(res));
			});
		}
	}

	saveCallback(res: any) {
		this.notificationService.toast.dismiss();

		if(res.success === true) {
			// set response data
			this.item = res.item;

			// navigate to
			this.notificationService.showMsg('Topic ' + this.form.value.title + ' has been saved!').then(() => {
				// go to detail page
				this.navCtrl.navigateRoot('/topic/detail/' + this.item.id);
			});
		} else {
			// show error message
			this.notificationService.showMsg(res.error);

			// reenable button
			this.submitted = false;
		}
	}

	selectableTopicChange(event: {
        component: IonicSelectableComponent,
        value: any
    }) {
        // if(event.value && event.value.id) this.form.controls.categories.setValue(event.value.id);
        // else this.form.controls.categories.setValue(null);
    }

	addQuestion() {
		const question = this.formBuilder.group({
			number: new FormControl('', Validators.required),
			question: this.formBuilder.group({
				question: new FormControl('', Validators.required),
				script: new FormControl(''),
				answerLimit: new FormControl(true),
				answerLimitTime: new FormControl(30),
				medias: this.formBuilder.array([])
			})
		});

		this.questionForms.push(question);

		setTimeout(() => {
			if(this.questions.last) {
				const topElem: number = this.questions.last.nativeElement.getBoundingClientRect().top - 50;
				this.content.scrollByPoint(0, topElem, 1200).then(() => this.setQuestionNumber());
			}
		});
	}

	setQuestionNumber() {
		let questions: FormArray = this.questionForms;

		for (var i = questions.controls.length - 1; i >= 0; i--) {
			let question: any = questions.controls[i];
			question.controls.number.setValue(i + 1);
		}
	}

	get questionForms() {
		return this.form.get('questions') as FormArray;
	}

    removeQuestion(index: number) {
    	// confirmation
    	this.alertCtrl.create({
    		header: 'Confirmation Message',
    		subHeader: '#' + (+index + 1) + ' Challenge / Question',
    		message: 'Are you sure you want to remove this challenge?',
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
		          	this.questionForms.removeAt(index);

		          	// reset number
		          	this.setQuestionNumber();
		          }
		        }
    		]
    	}).then((alert) => {
    		alert.present();
    	});
    }

    addMedia(question: any) {
		this.modalCtrl.create({
			component: MediaComponent,
			backdropDismiss: false
		}).then((modal) => {
			modal.onWillDismiss().then((data) => {
				if(data && data.data && data.data.items) this.addQuestionMedia(question, data.data.items);
			});

			modal.present();
		});
	}

	addQuestionMedia(questionMedias: FormArray, items: any) {
		for (var i = items.length - 1; i >= 0; i--) {
			questionMedias.push(this.formBuilder.group({ 
				id: new FormControl(items[i].id, Validators.required),
				filename: new FormControl(items[i].filename)
			}));
		}
	}

	removeMedia(question: any, index: number) {
		// confirmation
    	this.alertCtrl.create({
    		header: 'Confirmation Message',
    		subHeader: '#' + (this.questionForms.controls.indexOf(question) + 1) + ' Challenge / Question',
    		message: 'Are you sure you want to remove this media?',
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
		  			question.controls.question.get('medias').removeAt(index);
		          }
		        }
    		]
    	}).then((alert) => {
    		alert.present();
    	});
	}
}