import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../services/http/rest-api.service';
import { AuthenticationService } from '../../services/user/authentication.service';
import { ToastController } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-level-settings',
  templateUrl: './level-settings.page.html',
  styleUrls: ['./level-settings.page.scss'],
})
export class LevelSettingsPage implements OnInit {

  initialLevel: string = '';
  initialExperience: string = '';
  baseUrl: string;
  sessionData: any;
  adminId: any;
  submitToLevelSettingsForm: FormGroup;
  flag: boolean = false;
  buttonText: String;

  constructor(
    private restApi: RestApiService,
    private authService: AuthenticationService,
    private toast: ToastController,
    private notificationService: NotificationService,
    private fb : FormBuilder
  ) {
    this.baseUrl = this.restApi.url;
    this.authService.authenticationState.subscribe((state) => {
      this.sessionData = state ? this.authService.getSessionData() : null;
    });
    this.adminId = this.sessionData.user.id;

  }

  ngOnInit() {
    this.submitToLevelSettingsForm = this.fb.group({
      initialLevel: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*[1-9][0-9]*$')])),

      initialExperience: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*[1-9][0-9]*$')])),

        adminId:this.adminId
  });
    this.restApi.getPromise(`levelSetting/${this.adminId}`).then(
      res => { // Success
        let { data } = res;
        console.log(res.length);
        if(data.length > 0){
          this.flag = true;
          this.buttonText = "Edit"
        }
        else{
          this.flag = false;
          this.buttonText = "Save"
        }
        
        // data = data.pop();
        this.submitToLevelSettingsForm.controls['initialLevel'].setValue(data[0].initialLevel);
        this.submitToLevelSettingsForm.controls['initialExperience'].setValue(data[0].initialExperience);
      }
    ).catch(onreject => {

    });

  }

  saveSettings() {
    console.log(this.submitToLevelSettingsForm.valid)
    // let obj = {
    //   initialLevel: this.initialLevel,
    //   initialExperience: this.initialExperience,
    //   adminId: this.adminId
    // }

    this.restApi.postPromise('levelSetting', this.submitToLevelSettingsForm.value).then(
      res => { // Success
        this.notificationService.showMsg("Saved Successfully");
      }
    ).catch(onreject => {
      this.notificationService.showMsg("Not Saved");
    });
  }
}
