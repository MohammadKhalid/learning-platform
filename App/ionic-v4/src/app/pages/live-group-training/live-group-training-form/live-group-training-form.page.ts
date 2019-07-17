import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { IonicSelectableComponent } from 'ionic-selectable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { NotificationService } from '../../../services/notification/notification.service';

import * as moment from 'moment';

@Component({
	selector: 'app-live-group-training-form',
	templateUrl: './live-group-training-form.page.html',
	styleUrls: ['./live-group-training-form.page.scss'],
})
export class LiveGroupTrainingFormPage implements OnInit {

	@ViewChild('participantSelectable') participantSelectable: IonicSelectableComponent;

	urlEndPoint: string = 'live-group-training';
	item: any;
	form: FormGroup;
	routeParam: any;
	sessionData: any;
	participants: any;
	defaultDate = new Date().toISOString().slice(0, 10);
	defaultDateTime: string = moment("09:00", "HH:mm").toString()
	// defaultDateTime: string = "Tue Jul 16 2019 09:00:00"
	action: string;
	timeZones: any = [];
	defaultTimezone: string;

	modulePermission: boolean;

	constructor(
		private notificationService: NotificationService,
		private restApi: RestApiService,
		private formBuilder: FormBuilder,
		private navCtrl: NavController,
		private activatedRoute: ActivatedRoute,
		private authService: AuthenticationService
	) {
		this.sessionData = this.authService.getSessionData();
		// alert(moment("09:00", "HH:mm").toString())
		// const localTimeZone = moment.tz.guess();
		debugger
		// this.defaultTimezone = "(GMT" + moment.tz(localTimeZone).format('Z') + ")" + localTimeZone;
		// this.defaultTimezone = localTimeZone;
		// console.log('DEFAULT TZ', this.defaultTimezone);
		// moment.tz.setDefault(localTimeZone)
		// // init timezone
		// const timeZones = moment.tz.names();
		// this.timeZones = timeZones;

		// console.log('TZ', timeZones);
	}

	ngOnInit() {
		// load
		this.initForm();
		this.activatedRoute.params.subscribe((param) => {
			this.routeParam = param;

			if (this.routeParam.id) {
				this.restApi.get(this.urlEndPoint + 's/' + this.routeParam.id, {}).subscribe((resp: any) => {
					if (resp.success === true) {
						this.item = resp.item;

						// set form
						if (this.item.speakerId === this.sessionData.user.id) {
							// timezone fix
							if (!this.item.timezone) this.item.timezone = this.defaultTimezone;

							this.form.setValue({
								title: this.item.title,
								description: this.item.description,
								detail: this.item.detail,
								date: this.item.date,
								time: this.item.time,
								timezone: this.item.timezone,
								public: this.item.public,
								participants: this.item.participants
							});
						}

						this.action = 'edit';
					} else {
						this.action = 'new';
					}
				});
			} else {
				this.action = 'new';
			}
		});

		// get participants list
		this.restApi.get('students').subscribe((resp: any) => {
			// permission
			this.modulePermission = resp.success;

			if (this.modulePermission === true) {
				// participants list
				this.participants = resp.items;
			}
		});
	}

	// ngAfterViewInit(){
	// 	debugger
	// 	this.form.get('time').setValue(this.defaultDateTime)
	// }

	initForm() {
		// setup form
		this.form = this.formBuilder.group({
			title: ['', Validators.required],
			description: ['', Validators.required],
			detail: [''],
			date: [this.defaultDate, Validators.required],
			time: [this.defaultDateTime, Validators.required],
			timezone: 'Australia/Sydney',
			public: [false, Validators.required],
			participants: []
		});
	}

	save() {
		let time = this.form.get('time').value;
		time = moment(time).format('HH:mm');
		this.form.get('time').setValue(time);

		let date = this.form.get('date').value;
		date = moment(date).format('YYYY-MM-DD');
		this.form.get('date').setValue(date);
		if (this.action === 'new')
			this.restApi.post(this.urlEndPoint + 's', this.form.value).subscribe((resp: any) => {
				this.saveCallback(resp);
			});
		else if (this.action === 'edit')
			this.restApi.put(this.urlEndPoint + 's/' + this.item.id, this.form.value).subscribe((resp: any) => {
				this.saveCallback(resp);
			});
	}

	saveCallback(resp: any) {
		// show message
		this.notificationService.showMsg(resp.msg).finally(() => {
			this.navCtrl.navigateRoot('/' + this.urlEndPoint);
		});
	}

	openParticipantSelectable() {
		this.participantSelectable.open();
	}

	participantChange(event: {
		component: IonicSelectableComponent,
		value: any
	}) {
		// this.selectedParticipants = event.value;
	}

	removeSelectedParticipant(selectedParticipant: any) {
		let participants = this.form.controls.participants.value;
		let selectedParticipantIndex: number = participants.indexOf(selectedParticipant);

		if (selectedParticipantIndex >= 0) {
			participants.splice(selectedParticipantIndex, 1);
			this.form.controls.participants.setValue(participants);
		}
	}

}