import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DropzoneComponent } from '../common/dropzone/dropzone.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit {
  @ViewChild(DropzoneComponent) fileField: DropzoneComponent;
  @Input() recordId;
  addResourcesForm: FormGroup;
  submitBtn: boolean = true;
  files: any = [];
  fileData: any = [];
  constructor(
    private restApi: RestApiService,
    private notificationService: NotificationService,
    private actRoute: ActivatedRoute,
		private alertCtrl: AlertController,

  ) { }
  ngOnInit() {
    // alert(this.actroute.snapshot.paramMap.get('id'))
    //  this.actroute.snapshot.paramMap.get('type');
    let sectionId = this.actRoute.snapshot.paramMap.get('id');
    this.restApi.getPromise('resource/get-resources', sectionId).then(res => {
      debugger;

      // for(var i=0; i <= res.data.length; i++){

      // }     
      this.fileData = res.data;
      console.log(res.data)
    }).catch(err => {
      this.notificationService.showMsg('server down');
    })


  }
  // show(filename){ 
  //   debugger
  //   let fileExt = filename.split('.')
  //   if(fileExt[1]== "docx"){

  //     return 'cart';
  //   }else if(fileExt[1] == "pdf"){
  //     return 'checkmark-circle';
  //   }else {
  //   return 'football'
  //   }
  // }
  upload() {


    this.files = this.fileField.getFiles();
    console.log(this.files);
    let formData = new FormData();
    // let test = [];

    // formData.append('somekey', 'some value') // Add any other data you want to send
    this.files.forEach((file) => {
      formData.append('file', file.rawFile);
    });
    // formData.append('file', JSON.stringify(test));
    // debugger;
    // formData.append('file', this.files);
    formData.append('sectionId', this.actRoute.snapshot.paramMap.get('id'));

    // this.fileField.removeAll();

    this.restApi.postPromise('resource', formData)
      .then(res => {

        this.files = res.data;
        this.fileField.removeAll();
        this.notificationService.showMsg("Saved Successfully");
      }).catch(err => {
        this.notificationService.showMsg("Error inserting resources");
      })
    // // POST formData to Server
  }

  eventBtnSubmit(count) {
    this.submitBtn = count > 0 ? false : true;
  }
  deletePrompt(file){
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
    this.restApi.delete(`resource/${file.id}/${file.url}`).subscribe(res => {
      if (res) {
        this.notificationService.showMsg('Delete Successfully');

        // this.fileData = this.fileData.filter(x => x.id != id)
        this.fileData.splice(file, 1);

      } else {

      }

    })
  }
}

