import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-client-tag-modal',
  templateUrl: './client-tag-modal.component.html',
  styleUrls: ['./client-tag-modal.component.scss'],
})
export class ClientTagModalComponent {

  propsData: any;

  constructor(private navParams: NavParams) {
    // set data
    this.propsData = this.navParams.data;
    console.log('MODAL DATA ', this.propsData);
  }

}