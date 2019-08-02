import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  addTextForm: FormGroup
  sectionId: any;
  btnTxt: string = 'Save'

  @Input() recordId;
  title: any;
  description: any;
  id: any;
  constructor(private formValue: FormBuilder,
    private serviceApi: RestApiService,
    private actroute: ActivatedRoute,
    private noti: NotificationService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.actroute.snapshot.paramMap.get('id');

    this.formInitialize();
    if (this.recordId) {
      this.btnTxt = "update"
      let id = this.activeRoute.snapshot.paramMap.get('id')
      this.sectionId = id
      this.serviceApi.getPromise('text/get-by-id', this.recordId).then(res => {
        this.addTextForm.controls['title'].setValue(res.data[0].title),
          this.addTextForm.controls['description'].setValue(res.data[0].description),
          this.sectionId

      })
    }
  }


  ngOnChanges() {
    debugger;
    this.formInitialize();
  }
  formInitialize() {
    this.addTextForm = this.formValue.group({


      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      sectionId: this.id,
    })

  }
  addText() {
    debugger
    if (this.recordId) {
      this.serviceApi.putPromise(`text/${this.recordId}`, this.addTextForm.value).then(res => {
        this.noti.showMsg("update Record")
      }).catch(err => {
        this.noti.showMsg(err)
      })

    } else {
      debugger
      this.serviceApi.postPromise('text', this.addTextForm.value).then(res => {
        this.noti.showMsg('text Created');
        if (res) {
          this.addTextForm.reset();
          this.formInitialize();
        }

        let id = this.actroute.snapshot.paramMap.get('id');
        this.serviceApi.getPromise(`section/get-section-details`, id).then(resSec => {
          this.serviceApi.setSectionMenuData(resSec.data);

        })
      }).catch(err => {
        this.noti.showMsg(err);
        console.log(err);


      })
    }
  }



}
