import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AddEditPopoverComponent } from '../common/add-edit-popover/add-edit-popover.component';

@Component({
  selector: 'app-quiz-viewer-coach',
  templateUrl: './quiz-viewer-coach.component.html',
  styleUrls: ['./quiz-viewer-coach.component.scss'],
})
export class QuizViewerCoachComponent implements OnInit {

  @Output() QuizIndexEitter = new EventEmitter();
  @Output() removeItem = new EventEmitter<object>();
  @Output() openQuizEditModal = new EventEmitter<object>();

  @Input() data: any;
  @Input() quizIndex: any;
  quizzesArray: any = []
  optionsCopy: any = []
  user: any
  attempted: Boolean = false;
  isDeletedClicked: boolean = false
  constructor(
    private restApi: RestApiService,
    private auth: AuthenticationService,
    private router: Router,
    public popoverController: PopoverController,
  ) { }
 
  ngOnInit() {

    this.user = this.auth.getSessionData().user;
    this.quizzesArray.push({
      questionId: this.data.id,
      sectionPageId: this.data.sectionPageId,
      correctOptions: JSON.parse(this.data.options),
      question: this.data.question,
    })
  }


  deleteQuiz() {
    this.isDeletedClicked = true
    this.restApi.delete(`quiz/${this.data.id}`).subscribe(res => {
      this.isDeletedClicked = false
      this.removeItem.next(this.data)
      this.popoverController.dismiss();
    })
  }
  
  editQuiz() {
    this.openQuizEditModal.next(this.data)
    this.popoverController.dismiss();
  }
  
  todo(value) {
    return value.map(x => {
      if (x.correctOption) {
        return x.text;
      }
    }).join(',')
  }
  
  async addEditPopOver(ev: any, item: any) {
    const popover = await this.popoverController.create({
      component: AddEditPopoverComponent,
      componentProps: {
        delete: this.deleteQuiz.bind(this),
        edit: this.editQuiz.bind(this),
        item: item
      },
      event: ev,
      animated: true,
      showBackdrop: true,
    });
    return await popover.present();
  }
}
