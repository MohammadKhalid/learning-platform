import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  @Output() eventEmitterCloseModel = new EventEmitter<object>();

  @Input() sectionId: any;
  @Input() recordId: any;
  @Input() sectionPageId: any;
  @Input() data: any;

  addTextForm: FormGroup
  btnTxt: string = 'Save'
  title: any;
  description: any;
  id: any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter description here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    //   customClasses: [
    //   {
    //     name: 'quote',
    //     class: 'quote',
    //   },
    //   {
    //     name: 'redText',
    //     class: 'redText'
    //   },
    //   {
    //     name: 'titleText',
    //     class: 'titleText',
    //     tag: 'h1',
    //   },
    // ],
    // uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
  };
  constructor(private formValue: FormBuilder,
    private serviceApi: RestApiService,
    private actroute: ActivatedRoute,
    private noti: NotificationService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.id = this.actroute.snapshot.paramMap.get('sectionpageid');

    this.formInitialize();
    if (this.data) {
      this.btnTxt = "update"
      this.addTextForm.get('title').setValue(this.data.title)
      this.addTextForm.get('description').setValue(this.data.description)
      this.addTextForm.get('experience').setValue(this.data.experience)
    }
  }

  formInitialize() {
    this.addTextForm = this.formValue.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      sectionPageId: this.sectionPageId,
      experience: new FormControl('', Validators.required)
    })

  }

  addText() {
    if (this.data) {
      this.serviceApi.putPromise(`text/${this.data.id}`, this.addTextForm.value).then(res => {
        this.noti.showMsg("update Record");
        this.eventEmitterCloseModel.next();
      }).catch(err => {
        this.noti.showMsg(err)
      })

    }
    else {
      this.serviceApi.postPromise('text', this.addTextForm.value).then(res => {
        this.loadingController.dismiss()
        this.noti.showMsg('text Created');
        this.eventEmitterCloseModel.next();
      }).catch(err => {
        this.noti.showMsg(err);
        console.log(err);


      })
    }
  }



}
