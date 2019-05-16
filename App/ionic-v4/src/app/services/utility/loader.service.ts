import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loadercontext: any;
  constructor(public loadingCtrl: LoadingController) { }
  async showLoading() {
		this.loadercontext = await this.loadingCtrl.create({ message: "Loading..." });
		this.loadercontext.present();
  }
  hideLoading() {
		this.loadercontext.dismiss();
	}
}
