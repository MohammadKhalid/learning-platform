import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.page.html',
  styleUrls: ['./test-page.page.scss'],
})
export class TestPagePage implements OnInit {

  items: any[] = [];

  constructor(
    private alert: AlertController
  ) { }

  ngOnInit() {
    // this.items.push('Item 01');
    // this.items.push('Item 02');
    // this.items.push('Item 03');

    this.items = ['Item 01', 'Item 02', 'Item 03', 'Item 04', 'Item 05'];
  }

  test() {

  }

  delete(item: string) {
    this.alert.create({
      header: 'TEST ALERT',
      message: item
    }).then((alert) => {
      alert.present();
    });
  }

}
