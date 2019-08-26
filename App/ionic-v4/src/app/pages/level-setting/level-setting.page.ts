import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList, Input } from '@angular/core';
import { NavController, ToastController, ModalController, AlertController, IonContent, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { LoaderService } from 'src/app/services/utility/loader.service';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { toBase64String } from '@angular/compiler/src/output/source_map';

@Component({
  selector: 'app-level-setting',
  templateUrl: './level-setting.page.html',
  styleUrls: ['./level-setting.page.scss'],
})
export class LevelSettingPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChildren('questionElem') questions: QueryList<ElementRef>;
  user: any = {};

  form: FormGroup;
  submitted: boolean = false;
  action: string;

  item: any;
  paramData: any;
  clients: any = [];
  companie: any = [];

  categories: [];
  parentCategory: any;
  loadercontext: any;
  btnText: string = 'Save'
  lblCompanyName: string = ''
  lblCompanyId: string = ''
  lblClientName: number 
  lblClientId: number
  constructor(
    private notificationService: NotificationService,
    private restApi: RestApiService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private authService: AuthenticationService,
    private alertCtrl: AlertController,
    private loadingController: LoaderService,
    private router: Router
  ) { }

  ngOnInit() {
    let editId = this.activatedRoute.snapshot.paramMap.get('id');
    if (editId) {
      this.btnText = "Update"
      this.restApi.getPromise('/levelSetting/get', editId).then(res => {
        this.lblClientName = res.data[0].client.name
        this.lblClientId = res.data[0].clientId
        this.lblCompanyName = res.data[0].company.name
        this.lblCompanyId = res.data[0].companyId
        this.form.controls['initialLevel'].setValue(res.data[0].initialLevel);
        this.form.controls['initialExperience'].setValue(res.data[0].initialExperience);
        this.form.controls['clientId'].setValue(res.data[0].clientId);
        this.form.controls['companyId'].setValue(res.data[0].companyId);
      }).catch(err => {
        this.notificationService.showMsg(err);
      })
    }



    this.restApi.getPromise('/course-client-company/clients').then(res => {
      this.clients = res.data;
    })



    this.form = this.formBuilder.group({
      initialLevel: new FormControl('', Validators.compose([
        Validators.required, Validators.pattern('^[0-9]*$')
      ])),
      companyId: new FormControl('', Validators.required),
      initialExperience: new FormControl('', Validators.compose([
        Validators.required, Validators.pattern('^[0-9]*$')
      ])),
      clientId: new FormControl('', Validators.required),
    });
  }

  getCompanies() {
    this.companie = []
    let clientId = this.form.controls.clientId.value;
    this.restApi.getPromise(`course-client-company/companies/${clientId}/levelSettings`).then(res => {

      this.companie = res.data
    })
  }

  addRecord() {
    this.notificationService.showMsg('Saving...', 0).then(() => {
      this.restApi.postPromise('course-category', this.form.value)
        .then(res => {
          this.notificationService.toast.dismiss();
          this.navCtrl.navigateRoot('/category');
          console.log(res);
        }).catch(onreject => {
          this.notificationService.toast.dismiss();
          alert(onreject);
          console.log(onreject);
        })
    });
  }
  updateRecord() {
    debugger
    this.form.value
    this.notificationService.showMsg('Updated...', 0).then(() => {
      this.restApi.putPromise('categories/' + this.form.controls.id.value, this.form.value)
        .then(res => {
          this.notificationService.toast.dismiss();
          this.navCtrl.navigateRoot('/category');
          console.log(res);
        }).catch(onreject => {
          this.notificationService.toast.dismiss();
          alert(onreject);
          console.log(onreject);
        })
    });
  }
  save() {
    let editId = this.activatedRoute.snapshot.paramMap.get('id');

    if (editId) {
      this.btnText = "Update"
      this.restApi.putPromise(`/levelSetting/update/${editId}`, this.form.value).then(res => {
        this.notificationService.showMsg('updated Successfully!')

        this.router.navigate(['/level-setting'])
      }).catch(err => {
        this.notificationService.showMsg(err);

      })
    } else {
      this.btnText = "Save"
      this.restApi.postPromise('/levelSetting', this.form.value).then(res => {

        this.notificationService.showMsg('record save successfully');
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/level-setting'])

      }).catch(err => {
        this.notificationService.showMsg(err);
      })
    }

  }


}
