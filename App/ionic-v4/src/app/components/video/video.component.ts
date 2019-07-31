import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {

  addVideoForm: FormGroup
  sectionId :any;
  @Input() recordId: any;
  btnText: string = "Save";
  constructor(
    private formBuilder: FormBuilder,
    private apiservice: RestApiService,
    private noti: NotificationService,
    private section: ActivatedRoute
  ) { }

 
   

  ngOnInit() {
  
    let id = this.section.snapshot.paramMap.get('id')
    this.addVideoForm = this.formBuilder.group({
      title: new FormControl(''),
      url: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$')
      ])),
      experience: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
      description: new FormControl(''),
      sectionId : id
    });





 
    if (this.recordId) {
      let id = this.section.snapshot.paramMap.get('id')
    this.sectionId = id
      this.btnText = "Update";
      this.apiservice.getPromise('lesson/get-lesson-by-id', this.recordId).then(res => {
     debugger
        this.addVideoForm.controls['title'].setValue(res.data[0].title)
        this.addVideoForm.controls['url'].setValue(res.data[0].url);
        this.addVideoForm.controls['description'].setValue(res.data[0].description);
        this.addVideoForm.controls['experience'].setValue(res.data[0].experience);
        this.sectionId 


      }).catch(err => {
        this.noti.showMsg(err);
      })
    }
  }

  addVideo() {
   if(this.recordId) {
    this.apiservice.putPromise(`lesson/${this.recordId}`,this.addVideoForm.value).then(res => {
      
      this.noti.showMsg('updade record');
    }).catch(err => {
      this.noti.showMsg(err)
    })
   }else{
  this.apiservice.postPromise('lesson', this.addVideoForm.value).then(res => {
    debugger
    this.noti.showMsg('video Created successfully');
    //section side menu service need to call.
  }).catch(err => {
    this.noti.showMsg(err);
  })
}
  }
}

  


