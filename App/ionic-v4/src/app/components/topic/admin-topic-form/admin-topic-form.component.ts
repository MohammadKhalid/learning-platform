import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, ToastController, ModalController, AlertController, IonContent } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { RestApiService } from '../../../services/http/rest-api.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { AuthenticationService } from '../../../services/user/authentication.service';

// modal
import { MediaComponent } from '../../../components/media/media.component';

@Component({
  selector: 'app-admin-topic-form',
  templateUrl: './admin-topic-form.component.html',
  styleUrls: ['./admin-topic-form.component.scss'],
})
export class AdminTopicFormComponent implements OnInit {
	@ViewChild(IonContent) content: IonContent;
	@ViewChildren('questionElem', { read: ElementRef }) questions: QueryList<ElementRef>;

	urlEndPoint: string = 'topic';
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
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
		private alertCtrl: AlertController,
		private authService: AuthenticationService,
	) {
		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		this.form = this.formBuilder.group({
			categories: new FormControl([]),
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      questions: this.formBuilder.array([]),
			isPrivate: new FormControl(false),
			status: new FormControl('publish'),
			clients: this.formBuilder.array([], Validators.required)
    });

    // get input data
		this.restApi.get('topics/form-input-data', {}).subscribe((res: any) => {
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
				this.restApi.get('topics/' + this.paramData.id, {}).subscribe((res: any) => {
					if(res.success === true) {
            // set item
						this.item = res.item;

						// set form value
						this.form.controls.categories.setValue(this.item.categories);
						this.form.controls.title.setValue(this.item.title);
						this.form.controls.description.setValue(this.item.description);
						this.form.controls.isPrivate.setValue(this.item.isPrivate);
						this.form.controls.status.setValue(this.item.status);

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

            // set companies
            setTimeout(() => { this.setFormCompanies() });
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
				if(this.action === 'new') this.restApi.post('topics', this.form.value).subscribe(this.saveCallback, this.saveErrorCallback);
				else this.restApi.put('topics/' + this.item.id, this.form.value).subscribe(this.saveCallback, this.saveErrorCallback);
			}).catch(this.saveErrorCallback);
		}
	}

	saveCallback = (res: any) => {
		this.notificationService.toast.dismiss();

		if(res.success === true) {
			this.item = res.item;

			// action msg
			const actionResMsg: string = this.action === 'new' ? 'saved' : 'updated';

			// navigate to
			this.notificationService.showMsg('Topic ' + this.form.value.title + ' has been ' + actionResMsg + '!').then(() => {
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

	saveErrorCallback = (err: any) => {
		this.submitted = false;
		this.notificationService.toast.dismiss().then(() => {
			this.notificationService.showMsg(err.statusText);
		});
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
}