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
  @Input() data: any;
  spinner : boolean  = false ;
  id: any;
  response: any
  btnText: string = "Save";
  @Output() eventEmitterCloseModel = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private apiservice: RestApiService,
    private noti: NotificationService,
    private section: ActivatedRoute,
    private router: Router,
    public cntrl: ModalController,
  ) { }

  ngOnInit() {
    
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

    if (this.data) {
      this.btnText = "Update";
      this.addVideoForm.get('title').setValue(this.data.title)
      this.addVideoForm.get('url').setValue(this.data.url)
      this.addVideoForm.get('experience').setValue(this.data.experience)
      this.addVideoForm.get('description').setValue(this.data.description)
    }
  }

  addVideo() {
    if (this.data) {
      this.apiservice.putPromise(`lesson/${this.data.id}`, this.addVideoForm.value).then(res => {

        this.noti.showMsg('updade record');
        this.eventEmitterCloseModel.next();

        // this.router.navigate([`certification/sections/concepts/${this.sectionId}/${this.sectionPageId}`])
      }).catch(err => {
        this.noti.showMsg(err)
      })
    } else {
      this.spinner = true;
      this.apiservice.postPromise('lesson', this.addVideoForm.value).then(res => {
        this.response = res.data;
        // let id = this.section.snapshot.paramMap.get('');
        // this.apiservice.populateSectionSubMenu(this.id);
        this.eventEmitterCloseModel.next();

        this.noti.showMsg('video Created successfully');
        // this.router.navigate([`certification/sections/concepts/${this.sectionId}/${this.sectionPageId}`])

        // this.addVideoForm.reset();
        //section side menu service need to call.
      }).catch(err => {
        this.noti.showMsg(err);
      })
    }
  }
}




