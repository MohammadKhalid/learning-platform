import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, LoadingController } from '@ionic/angular';
import { RestApiService } from 'src/app/services/http/rest-api.service';
@Component({
  selector: 'app-contact-add-model',
  templateUrl: './contact-add-model.component.html',
  styleUrls: ['./contact-add-model.component.scss'],
})
export class ContactAddModelComponent implements OnInit {
  userList: any = [];
  selected: any = [];
  loadercontext: any;
  changeStatus: any;
  currenttab: any;
  contactSkeleton: any;
  isSkeliton: boolean = true;
  searchTerm: string = "";

  imagepath: string = './assets/img/askexpert/';
  constructor(public cntrl: ModalController, public navct: NavController, private restApi: RestApiService, public loadingCtrl: LoadingController, private navParams: NavParams) {
    this.changeStatus = this.navParams.get("change");
    this.currenttab = this.navParams.get("tab");
  }
  searchListCopy: any = []
  ionViewDidEnter() {
    this.getUsers();
  }
  createRange(number) {
    this.contactSkeleton = [];
    for (var i = 1; i <= number; i++) {
      this.contactSkeleton.push(i);
    }
    return this.contactSkeleton;
  }

  ngOnInit() {

  }

  getUsers() {
    let user_id = this.restApi.sessionData.user.id;
    let type = this.restApi.sessionData.user.type;

    this.restApi.get(`getcontactbyid/${user_id}/${type}`, {}).then((resp: any) => {
      this.isSkeliton = false;
      if (resp.success === true) {
        this.userList = resp.message;
        this.searchListCopy = JSON.parse(JSON.stringify(this.userList));
        console.log(resp);
      }
    }).catch((err: any) => {
      this.isSkeliton = false;
    });
  }
  addContact(item) {
    let payload = {
      user_id: '',
      contact_id: '',
    };
    payload.user_id = this.restApi.sessionData.user.id;
    payload.contact_id = item.id;

    const index = this.userList.indexOf(item);
    this.userList.splice(index, 1);

    this.restApi.post('contact', payload).then((resp: any) => {
      if (resp.success && resp.success === true) {
        this.changeStatus();

      } else {
        this.restApi.showMsg(resp.error.error);
      }
    }).catch((err) => {
      this.restApi.showMsg(err);
    });
  }
  close() {
    this.cntrl.dismiss();
    this.currenttab('chat');
  }
  resetChanges = () => {
    this.userList = this.searchListCopy;
  };

  search = (search) => {
    this.resetChanges();
    this.userList = this.userList.filter((item) => {
      return item.firstName.toLowerCase().indexOf(search.toLowerCase()) > -1;
    })
  };
}
