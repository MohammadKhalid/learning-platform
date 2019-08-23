import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DropzoneComponent } from 'src/app/components/common/dropzone/dropzone.component';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-resource-add-model',
  templateUrl: './resource-add-model.component.html',
  styleUrls: ['./resource-add-model.component.scss'],
})
export class ResourceAddModelComponent implements OnInit {
  @ViewChild(DropzoneComponent) fileField: DropzoneComponent;
  @Input() sectionId: any;
  
  submitBtn: boolean = false;
  fileData: any = [];
  files: any = [];
  uploads : boolean ;


  constructor(
    private apiSrv: RestApiService,
    private notificationService: NotificationService,
    private router : Router,
    private act : ActivatedRoute,
    private ctrl : ModalController


  ) { }

  ngOnInit() { }

  eventBtnSubmit(count) {
  
      this.submitBtn = count > 0 ? false : true;
  }


  upload() {
  
    this.files = this.fileField.getFiles();
    let formData = new FormData();
    this.files.forEach((file) => {
      formData.append('file', file.rawFile);
    });
     
    formData.append('sectionId', this.sectionId);
       this.apiSrv.postPromise('resource', formData)
        .then(res => {
          this.files = res.data;
          this.fileField.removeAll();
          this.uploads = false; 
          this.notificationService.showMsg("Saved Successfully");
          this.apiSrv.populateSectionSubMenu(this.sectionId);
          this.router.navigate([`/certification/sections/resources/${this.sectionId}`])

          this.ctrl.dismiss('cancel')
        }).catch(err => {
          this.notificationService.showMsg("Error inserting resources");
        })
    // // POST formData to Server
  }

  close(){
    this.ctrl.dismiss('cancel');
  }

}


