import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RestApiService } from '../../../services/http/rest-api.service';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  selectedCategory = [];
  files: string;
  file: any;
  categoryList: string[] = [];
  user: any = {};
  sessionData: any;
  addCourseForm: FormGroup;

  constructor(
    private restApi: RestApiService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private route : Router,
    private navCtrl : NavController
  ) {
    this.authService.authenticationState.subscribe((state) => {
      this.sessionData = state ? this.authService.getSessionData() : null;
    });
    
    this.user = this.sessionData.user
  }
  // @ViewChild('element') elment : ElementRef
  ngOnInit() {

    this.initForm();
    this.fetchCategories();

  }

  fetchCategories() {
    this.restApi.getPromise(`course-category/get-all/${this.user.createdBy}`)
    
      .then(res => {
        let { success, data } = res
        if (success) {
          this.categoryList = data
        }
      }).catch(err => {
      })
  }

  initForm() {
    this.addCourseForm = this.fb.group({
      title: new FormControl('', Validators.compose([
        Validators.required
      ])),
      categoryId: new FormControl('', Validators.compose([
        Validators.required
      ])),
      description: new FormControl(''),
      file: new FormControl('', Validators.compose([
        Validators.required
      ])),
      createdBy: this.user.id
    });
  }
  onFileChanged(event) {
    this.files = event.target.files[0].name;
    this.addCourseForm.get('file').setValue(event.target.files[0])
  }

  addCourse(){
    let obj = new FormData()
    obj.append('file',this.addCourseForm.get('file').value)
    obj.append('title',this.addCourseForm.get('title').value)
    obj.append('categoryId',this.addCourseForm.get('categoryId').value)
    obj.append('description',this.addCourseForm.get('description').value)
    obj.append('createdBy',this.addCourseForm.get('createdBy').value)
    this.restApi.postPromise('course',obj)
    .then(res=>{ 
      this.notificationService.showMsg("Saved Successfully");
      this.navCtrl.navigateRoot('/certification/module/' + res.data.id)
      
    }).catch(err=>{
      this.notificationService.showMsg("Error inserting Course");
    })
  }

}
