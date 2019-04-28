import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { IonicSelectableComponent } from 'ionic-selectable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';

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
	defaultDateTime: string = '09:00';
	action: string;
	timeZones: any = [];
	defaultTimezone: string;

	modulePermission: boolean;

	constructor(
		private restApi: RestApiService,
		private formBuilder: FormBuilder,
		private navCtrl: NavController,
		private activatedRoute: ActivatedRoute,
		private authService: AuthenticationService
	) {
		this.sessionData = this.authService.getSessionData();

		const localTimeZone = moment.tz.guess();
		// this.defaultTimezone = "(GMT" + moment.tz(localTimeZone).format('Z') + ")" + localTimeZone;
		this.defaultTimezone = localTimeZone;
		console.log('DEFAULT TZ', this.defaultTimezone);

		// init timezone
		const timeZones = moment.tz.names();
		this.timeZones = timeZones;

		console.log('TZ', timeZones);
	}

	ngOnInit() {
		this.initForm();

		// load
		this.activatedRoute.params.subscribe((param) => {
			this.routeParam = param;

			if(this.routeParam.id) {
				this.restApi.get(this.urlEndPoint + 's/' + this.routeParam.id, {}).then((resp: any) => {
					if(resp.success === true) {
						this.item = resp.item;

						// set form
						if(this.item.speakerId === this.sessionData.user.id) {
							// timezone fix
							if(!this.item.timezone) this.item.timezone = this.defaultTimezone;

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
		this.restApi.get('students').then((resp: any) => {
			// permission
			this.modulePermission = resp.success;

			if(this.modulePermission === true) {
				// participants list
				this.participants = resp.items;
			}
		});
	}

	initForm() {
		// setup form
		this.form = this.formBuilder.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            detail: [''],
            date: [this.defaultDate, Validators.required],
						time: [this.defaultDateTime, Validators.required],
						timezone: [this.defaultTimezone, Validators.required],
            public: [false, Validators.required],
            participants: []
        });
	}

	save() {
		if(this.action === 'new')
			this.restApi.post(this.urlEndPoint + 's', this.form.value).then((resp: any) => {
				this.saveCallback(resp);
			});
		else if(this.action === 'edit')
			this.restApi.put(this.urlEndPoint + 's/' + this.item.id, this.form.value).then((resp: any) => {
				this.saveCallback(resp);
			});
	}

	saveCallback(resp: any) {
		// show message
		this.restApi.showMsg(resp.msg).finally(() => {
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

		if(selectedParticipantIndex >= 0) {
			participants.splice(selectedParticipantIndex, 1);
			this.form.controls.participants.setValue(participants);
		}
	}

}