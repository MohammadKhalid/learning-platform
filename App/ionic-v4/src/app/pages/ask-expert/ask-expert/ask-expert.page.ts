import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalController, ToastController, IonContent, IonList } from '@ionic/angular';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';

import * as moment from 'moment';
import { ContactAddModelComponent } from './contact-add-model/contact-add-model.component';
import { OverlayEventDetail } from '@ionic/core';
import { LoaderService } from 'src/app/services/utility/loader.service';
import { RtcService } from 'src/app/services/rtc/rtc.service';
import io from 'socket.io-client';
import { SOCKET_URL } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-ask-expert',
	templateUrl: './ask-expert.page.html',
	styleUrls: ['./ask-expert.page.scss'],
	animations: [
		trigger('openClose', [
			state('open', style({
				opacity: 1,
			})),
			state('closed', style({
				opacity: 0,
			})),
			transition('open => closed', [
				animate('600ms ease-out')
			]),
			transition('closed => open', [
				animate('1000ms ease-in')
			]),
		]),
	],
})
export class AskExpertPage implements OnInit {
	@ViewChild('chatMessageUl') private myScrollContainer: ElementRef;
	@ViewChild('chatMessageUlMob') private myScrollContainerMob: ElementRef;
	myObserver = null;
	urlEndPoint: string = 'ask-expert';
	isPractice: boolean;
	value: number = 12;
	sessionData: any;
	items: any = [];
	public chatTerm: string = "";
	imagepath: string = './assets/img/askexpert/';
	chatMouseOver: boolean = true;
	addMouseOver: boolean;
	findMouseOver: boolean;
	chatMob: boolean;
	queryParams: any;
	isMsgSearchable: boolean = false;
	isMsgSearchableMobile: boolean = false;
	isContactLst: boolean = false;
	contactTerm: string = "";
	contactSkeleton: any;
	isSkeliton: boolean = true;
	userName: string = this.restApi.sessionData.user.firstName + ' ' + this.restApi.sessionData.user.lastName;
	userId: string = this.restApi.sessionData.user.id;
	chatMessage: any = [];
	contactId: string;
	chat_input: string;
	contact_name: string;
	isContactsearch: boolean = false;
	isStartScreen: boolean;
	chatlist: any = [];
	headerIsOnline: boolean = false;
	public sockets = io(SOCKET_URL);
	IsinfinitScroll: boolean = true;
	allDates: any = [];
	firstLoad: boolean = true;
	chatSpinner: boolean = false;
	userSubscription: Subscription;

	constructor(
		private restApi: RestApiService,
		private authService: AuthenticationService,
		public activatedRoute: ActivatedRoute,
		public modalcontroler: ModalController,
		public loader: LoaderService,
		public rtcService: RtcService,
		public toastController: ToastController
	) {
		this.queryParams = {
			pageNumber: 0,
			limit: 25
		};
		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		this.isStartScreen = false;
		this.sockets.on('contact-online', (data) => {
			if (this.userId != data.user_id) {
				this.chatlist.forEach((el, i) => {
					if (el.contact_id == data.user_id) {
						this.chatlist[i].isLogin = 1;
						this.headerIsOnline = true;
					}
				});

			}
		})
		this.sockets.on('contact-offline', (data) => {
			if (this.userId != data.user_id) {
				this.chatlist.forEach((el, i) => {
					if (el.contact_id == data.user_id) {
						this.chatlist[i].isLogin = 0;
						this.headerIsOnline = false;
					}
				});

			}
		})
		this.sockets.on('send-reply', (data) => {
			this.chatlist.forEach((el, i) => {
				if (el.contact_id == data.message.senderId && this.userId == data.message.recieverId) {
					this.chatlist[i].lastMessage = data.message.message;
					this.chatlist[i].lastMessageDate = data.message.date;
				}
			});

			if (this.userId == data.message.recieverId && this.contactId == data.message.senderId) {
				let isToday = this.chatMessage.find(x => moment(x.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')); //is today
				if (isToday == undefined) { //undefined mean date not found any of array
					let objTimeAgo = {
						timeAgo: true,
						date: data.message.date,
					};
					this.chatMessage.push(objTimeAgo);
				}

				this.chatMessage.push(data.message);
				this.bottomScroll();
			}
		})
		this.userSubscription = this.activatedRoute.params.subscribe(
			(params: Params) => {
				this.chatMessage = [];
				this.allDates = [];
				this.chatlist = [];

				this.contactId = params.contactid;
				this.getAllDate();
				this.getContactList();
			})

	}
	ngOnDestroy(): void {
		this.userSubscription.unsubscribe();
	}
	getAllDate() {
		let user_id = this.userId;
		let contact_id = this.contactId;
		this.restApi.get(`chatDates/${user_id}/${contact_id}`).then((res) => {
			this.allDates = res.data;

			this.loadchat();
		});
	}
	loadchat() {

		this.chatSpinner = true;
		let selectedDate = this.allDates.length > 0 ? this.allDates[0].date : 'null';//this.allDates[this.allDates.length - 1];
		this.chatMob = true;
		let user_id = this.userId;
		let contact_id = this.contactId;
		this.isStartScreen = true;
		if (this.allDates.length > 0) {
			this.restApi.get(`chat/${user_id}/${contact_id}/${selectedDate}`).then((res) => {

				setTimeout(() => {
					this.chatSpinner = false;
				});
				this.contact_name = res.firstName;
				this.isStartScreen = true;
				this.headerIsOnline = res.isLogin;

				if (this.allDates.length > 0) {
					const index = this.allDates.indexOf(this.allDates[0]); ///alway get 0 index 
					this.allDates.splice(index, 1); //always remove 0 index object
					this.IsinfinitScroll = false;

					res.messages.forEach(el => {
						this.chatMessage.unshift(el);
					});
					let obj = {
						timeAgo: true,
						date: res.messages[0].date,
					};
					this.chatMessage.unshift(obj);

					this.firstLoad ? this.bottomScroll() : '';
					this.firstLoad = false;

					if (this.chatMessage.length < 7) {

						this.loadchat()
					}
				}
				else {
					this.IsinfinitScroll = true;
				}
			});
		}

	}
	currentTab(type) {
		this.chatMouseOver = false;
		this.addMouseOver = false;
		this.findMouseOver = false;
		if (type == "chat") {
			this.chatMouseOver = true;
		}
		else if (type == 'add') {
			this.addMouseOver = true;
		}
		else {
			this.findMouseOver = true;
		}
	};
	async presentToast(msg) {
		const toast = await this.toastController.create({
			message: msg,
			duration: 2000
		});
		toast.present();
	}

	changeStatus() {
		this.getContactList();
	}
	async openModal() {
		const modal: HTMLIonModalElement =
			await this.modalcontroler.create({
				component: ContactAddModelComponent,
				componentProps: {
					aParameter: true,
					otherParameter: new Date(),
					change: this.changeStatus.bind(this),
					tab: this.currentTab.bind(this)
				}
			});

		modal.onDidDismiss().then(() => {
			this.currentTab('chat');
		});
		await modal.present();
	}

	createRange(number) {
		this.contactSkeleton = [];
		for (var i = 1; i <= number; i++) {
			this.contactSkeleton.push(i);
		}
		return this.contactSkeleton;
	}
	getContactList() {
		this.restApi.get(`contact/${this.restApi.sessionData.user.id}`).then((res: any) => {
			this.isSkeliton = false;
			if (res.success === true) {
				this.chatlist = res.message;
				let index = this.chatlist.findIndex(i => i.contact_id == this.contactId);
				if (index != -1) {
					this.chatlist[index].activeChat = 1;
				}
			}
		}).catch((error: any) => {
			this.isSkeliton = false;
		});
	}
	getList() {
		this.restApi.get(this.urlEndPoint, this.queryParams).then((res: any) => {
			if (res.success === true) {
				this.items = res.items;
			}
		});
	}

	canAdd() {
		return this.sessionData.user.type == 'student' ? true : false;
	}

	beautifyDate(date: string, format: string = 'MMMM D, YYYY') {
		return moment(date).format(format);
	}
	bottomScroll(): void {
		setTimeout(() => {
			this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
			this.myScrollContainerMob.nativeElement.scrollTop = this.myScrollContainerMob.nativeElement.scrollHeight;

		}, 50);
	}
	send(data) {
		if (data.trim()) {

			let obj = {
				userId_userId: '',
				message: '',
				date: '',
				senderId: this.userId,
			};

			let index = this.chatlist.findIndex(i => i.contact_id == this.contactId);
			if (index != -1) {
				this.chatlist[index].lastMessage = data;
				this.chatlist[index].lastMessageDate = moment().format('YYYY-MM-DD HH:mm:ss');
			}

			obj.userId_userId = this.userId + '_' + this.contactId;
			obj.message = data;
			obj.date = moment().format('YYYY-MM-DD HH:mm:ss');
			let isToday = this.chatMessage.find(x => moment(x.date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')); //is today
			if (isToday == undefined) { //undefined mean date not found any of array
				let objTimeAgo = {
					timeAgo: true,
					date: obj.date,
				};
				this.chatMessage.push(objTimeAgo);
			}
			this.chatMessage.push(obj);
			this.chat_input = "";
			this.bottomScroll();
			this.restApi.put('chat/', obj)
				.then((res: any) => { });
		}
	}
}