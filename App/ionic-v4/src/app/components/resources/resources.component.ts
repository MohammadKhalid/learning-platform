import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DropzoneComponent } from '../common/dropzone/dropzone.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IMAGE_URL } from 'src/environments/environment';
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit {
  @ViewChild(DropzoneComponent) fileField: DropzoneComponent;
  @Input() resourceTitle: any;
  @Input() sectionId: any;
  btnTxt: string = 'Save';
  oldTitle: string;
  title: string;
  addResourcesForm: FormGroup;
  submitBtn: boolean = true;
  files: any = [];
  fileData: any = [];
  serverUrl: string = `${IMAGE_URL}/resources/`;

  constructor(
    private restApi: RestApiService,
    private notificationService: NotificationService,
    private actRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private router: Router,

  ) { }
  ngOnInit() {
    this.title = "";
    if (this.sectionId) {
      this.btnTxt = "Update";
      this.oldTitle = this.title = this.resourceTitle;

      this.restApi.getPromise(`resource/get-resources/${this.sectionId}`).then(res => {
        debugger;
        this.fileData = res.data;
      }).catch(err => {
        this.notificationService.showMsg('server down');
      })
    }



  }
  show(filename){ 
   
    let fileExt = filename.split('.')
    if(fileExt[1]== "jpeg"){
       
      return 'book';
    }else if(fileExt[1] == "png"){
      return 'checkmark-circle';
    }else {
    return 'mail'
    }
  }
  upload() {
    debugger
    this.files = this.fileField.getFiles();
    console.log(this.files);
    let formData = new FormData();
    // let test = [];
    // formData.append('somekey', 'some value') // Add any other data you want to send
    this.files.forEach((file) => {
      formData.append('file', file.rawFile);
    });
    // formData.append('file', JSON.stringify(test));
    // formData.append('file', this.files);
    formData.append('sectionId', this.sectionId);
    formData.append('title', this.title);
    // this.fileField.removeAll();
    if (this.sectionId) {
      // formData.append('oldTitle', this.oldTitle);
      this.restApi.putPromise('resource/update-section-resources', formData)
        .then(res => {
          this.files = res.data;
          this.fileField.removeAll();
          let id = this.actRoute.snapshot.paramMap.get('id');
          this.restApi.populateSectionSubMenu(id);

          this.notificationService.showMsg("Update Successfully");
         
          // this.router.navigateByUrl(`certification/sections/resources/${this.sectionId}/${this.title}/Recources`).then(e => {
          //   if (e) {
          //     console.log("Navigation is successful!");
          //   } else {
          //     console.log("Navigation has failed!");
          //   }
          // });
          this.router.navigate([`certification/sections/resources/${this.sectionId}/${this.title}/Recources`])
        }).catch(err => {
          this.notificationService.showMsg("Error Updating resources");
        })
    }
    else {
      this.restApi.postPromise('resource', formData)
        .then(res => {

          this.files = res.data;
          this.fileField.removeAll();
          let id = this.actRoute.snapshot.paramMap.get('id');
          this.restApi.populateSectionSubMenu(id);

          this.notificationService.showMsg("Saved Successfully");
          this.router.navigate([`certification/sections/concepts/${this.sectionId}/${this.resourceTitle}/Recources`])
        }).catch(err => {
          this.notificationService.showMsg("Error inserting resources");
        })
    }


    // // POST formData to Server
  }

  eventBtnSubmit(count) {
    this.submitBtn = count > 0 ? false : true;
  }
  deletePrompt(file) {
    this.alertCtrl.create({
      header: 'Alert!',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteFile(file);
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }
  deleteFile(file) {
    this.restApi.delete(`resource/${file.id}`).subscribe(res => {
      if (res) {
        this.notificationService.showMsg('Delete Successfully');

        // this.fileData = this.fileData.filter(x => x.id != id)
        this.fileData.splice(file, 1);

      } else {

      }

    })
  }
}

