import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { RestApiService } from '../../../services/http/rest-api.service';

@Component({
  selector: 'app-media-viewer',
  templateUrl: './media-viewer.page.html',
  styleUrls: ['./media-viewer.page.scss'],
})
export class MediaViewerPage implements OnInit {
  
  item: any;
  paramData: any;
  mediaSrc: string;
  mediaPoster: string;

  constructor(
    private restApi: RestApiService,
    private menu: MenuController, 
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((paramData) => {
      this.paramData = paramData;

        // load item
        if(this.paramData.id) {
          this.restApi.get('media-viewer/' + this.paramData.id, {}).then((res: any) => {
            if(res.success === true) {
              this.item = res.item;

              // change ext to mp4
              // media path
              let mediaPath = this.item.path;

              let mediaPathArray  = mediaPath.split('.');
              let mediaFileExt    = mediaPathArray[mediaPathArray.length - 1];
              
              if(mediaFileExt !== 'mp4') {
                  let newMediaPathArray   = mediaPathArray;
                  newMediaPathArray.pop();

                  let newMediaPath = newMediaPathArray.join('.');

                  this.mediaSrc = this.restApi.url + newMediaPath + '.mp4';
                  this.mediaPoster = this.restApi.url + newMediaPath + '.jpg';
              }
            } else {
              // navigate back to list
              this.restApi.showMsg('Not found!');
            }
          });
        }

        // hide menu
        setTimeout(() => {
          this.menu.enable(false, 'mainMenu');
        }, 1000);
    });
  }

  ionViewWillUnload() {
    this.menu.enable(true, 'mainMenu');
  }

}