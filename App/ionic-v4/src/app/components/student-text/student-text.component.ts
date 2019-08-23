import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { PopoverController } from '@ionic/angular';
import { AddEditPopoverComponent } from '../common/add-edit-popover/add-edit-popover.component';
import { AuthenticationService } from 'src/app/services/user/authentication.service';

@Component({
  selector: 'app-student-text',
  templateUrl: './student-text.component.html',
  styleUrls: ['./student-text.component.scss'],
})
export class StudentTextComponent implements OnInit {
  @Input() data: any;
  @Output() removeItem = new EventEmitter<object>();
  @Output() editItem = new EventEmitter<object>();

  user: any;
  title: string = "";
  isDeletedClicked: boolean = false
  constructor(private activateroute: ActivatedRoute,
    private authService: AuthenticationService,
    public popoverController: PopoverController,
    private restApi: RestApiService) { }

  ngOnInit() {
    this.user = this.authService.getSessionData().user;

    this.title = this.data.title;
  }

  deleteText() {
    this.isDeletedClicked = true
    this.restApi.delete(`text/${this.data.id}`).subscribe(res => {
      this.isDeletedClicked = false
      this.removeItem.next(this.data)
    })
  }

  editText() {
    this.editItem.next(this.data)
  }

  async addEditPopOver(ev: any, item: any) {
    const popover = await this.popoverController.create({
      component: AddEditPopoverComponent,
      componentProps: {
        delete: this.deleteText.bind(this),
        edit: this.editText.bind(this),
        item: item
      },
      event: ev,
      animated: true,
      showBackdrop: true,
    });
    return await popover.present();
  }
}