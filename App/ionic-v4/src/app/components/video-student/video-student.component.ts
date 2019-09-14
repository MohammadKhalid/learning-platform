import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { AddEditPopoverComponent } from '../common/add-edit-popover/add-edit-popover.component';
import { PopoverController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/user/authentication.service';

@Component({
  selector: 'app-video-student',
  templateUrl: './video-student.component.html',
  styleUrls: ['./video-student.component.scss'],
})
export class VideoStudentComponent implements OnInit {

  constructor(
    private restApi: RestApiService,
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    public popoverController: PopoverController,
  ) { 
    this.authService.authenticationState.subscribe((state) => {
      this.sessionData = state ? this.authService.getSessionData() : null;
    });
    this.user = this.sessionData.user
  }
  @Input() data: any;
  @Output() removeItem = new EventEmitter<object>();
  @Output() editItem = new EventEmitter<object>();
  youtubeKey: any;
  title: string = "";
  youtubeUrl: string = 'https://www.youtube.com/embed/';
  isDeletedClicked: boolean = false
  user: any;
  sessionData: any;

  ngOnInit() {
    this.getById(this.data);
    this.title = this.data.title;
  }

  deleteLesson() {
    this.isDeletedClicked = true
    this.restApi.delete(`lesson/${this.data.id}`).subscribe(res => {
      this.isDeletedClicked = false
      this.removeItem.next(this.data)
      this.popoverController.dismiss();

    })
  }

  editLesson() {
    this.editItem.next(this.data)
    this.popoverController.dismiss();
  }

  getById(data) {
    if (data.url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/)) {
      let videoKey = data.url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/)[1];
      this.youtubeKey = `${this.youtubeUrl}${videoKey}?rel=0`;
    }
  }

  async addEditPopOver(ev: any, item: any) {
    const popover = await this.popoverController.create({
      component: AddEditPopoverComponent,
      componentProps: {
        delete: this.deleteLesson.bind(this),
        edit: this.editLesson.bind(this),
        item: item
      },
      event: ev,
      animated: true,
      showBackdrop: true,
    });
    return await popover.present();
  }
}