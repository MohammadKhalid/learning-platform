import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {

  addVideoForm: FormGroup
  @Input() sectionPageId: any;
  @Input() sectionId: any;
  id: any;
  response : any
  btnText: string = "Save";
  @Output() eventEmitterCloseModel = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: RestApiService,
    private noti: NotificationService,
    private section: ActivatedRoute,
    private router : Router,
    public cntrl: ModalController,
  ) { }

  ngOnInit() {
    debugger;
    // this.sectionId;
    // this.recordId;
    // this.id = this.section.snapshot.paramMap.get('sectionid')
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
      sectionPageId: this.sectionPageId
    });

    // if (this.recordId && this.sectionId) {
    //   let id = this.section.snapshot.paramMap.get('id')
    //   this.sectionId = id
    //   this.btnText = "Update";
    //   this.apiservice.getPromise('lesson/get-lesson-by-id', this.recordId).then(res => {
    //     this.addVideoForm.controls['title'].setValue(res.data[0].title)
    //     this.addVideoForm.controls['url'].setValue(res.data[0].url);
    //     this.addVideoForm.controls['description'].setValue(res.data[0].description);
    //     this.addVideoForm.controls['experience'].setValue(res.data[0].experience);
    //     this.sectionPageId


    //   }).catch(err => {
    //     this.noti.showMsg(err);
    //   })
    // }
  }

  addVideo() {
    // if (this.recordId) {
    //   this.apiservice.putPromise(`lesson/${this.recordId}`, this.addVideoForm.value).then(res => {

    //     this.noti.showMsg('updade record');
    //     let id = this.section.snapshot.paramMap.get('id')
    //     this.apiservice.populateSectionSubMenu(id);
    //   }).catch(err => {
    //     this.noti.showMsg(err)
    //   })
    // } else {
      this.apiservice.postPromise('lesson', this.addVideoForm.value).then(res => {
            this.response = res.data;
            // let id = this.section.snapshot.paramMap.get('');
            this.apiservice.populateSectionSubMenu(this.id);
            this.eventEmitterCloseModel.next();

        this.router.navigate([`certification/sections/concepts/${this.sectionId}/${this.sectionPageId}`])

        this.noti.showMsg('video Created successfully');
        // this.addVideoForm.reset();
        //section side menu service need to call.
      }).catch(err => {
        this.noti.showMsg(err);
      })
    }
  // }
}




