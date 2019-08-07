import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  @Input() sectionId: any;
  @Input() recordId: any;
  addTextForm: FormGroup
  btnTxt: string = 'Save'
  title: any;
  description: any;
  id: any;
  constructor(private formValue: FormBuilder,
    private serviceApi: RestApiService,
    private actroute: ActivatedRoute,
    private noti: NotificationService,
    private activeRoute: ActivatedRoute,
    private router : Router,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.id = this.actroute.snapshot.paramMap.get('id');

    this.formInitialize();
    if (this.recordId && this.sectionId) {
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

  formInitialize() {
    this.addTextForm = this.formValue.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      sectionId: this.id,
    })

  }
  
  addText() {
  
   
    if (this.recordId) {
      this.serviceApi.putPromise(`text/${this.recordId}`, this.addTextForm.value).then(res => {
        
        this.noti.showMsg("update Record");
        let id = this.actroute.snapshot.paramMap.get('id');
        this.serviceApi.populateSectionSubMenu(id);
      }).catch(err => {
        this.noti.showMsg(err)
      })

    } else {
      
      this.serviceApi.postPromise('text', this.addTextForm.value).then(res => {
        this.loadingController.dismiss()
        this.noti.showMsg('text Created');
        let id = this.actroute.snapshot.paramMap.get('id');
        this.serviceApi.populateSectionSubMenu(id);
        this.router.navigate([`certification/sections/concepts/${this.sectionId}/${res.data.id}/Text`])

      }).catch(err => {
        this.noti.showMsg(err);
        console.log(err);


      })
    }
  }



}
