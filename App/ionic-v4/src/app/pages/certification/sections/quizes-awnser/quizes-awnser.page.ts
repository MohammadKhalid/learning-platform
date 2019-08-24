import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-quizes-awnser',
  templateUrl: './quizes-awnser.page.html',
  styleUrls: ['./quizes-awnser.page.scss'],
})
export class QuizesAwnserPage implements OnInit {
  sessionData: any;
  user: any;
  answerList: any = [];
  title: string
  constructor(
    private authService: AuthenticationService,
    private restApi: RestApiService,
    private actRoute: ActivatedRoute,
    private notificationService: NotificationService,
  ) {
    this.authService.authenticationState.subscribe((state) => {
      this.sessionData = state ? this.authService.getSessionData() : null;
    });
    this.user = this.sessionData.user;
  }

  ngOnInit() {
    this.loadAll();
  }

  seprater(value) {
    return value.filter(x => x.correctOption).map(y => y.text).join(', ')
  }

  loadAll() {
    let user_id = this.user.id;
    let section_page_id = this.actRoute.snapshot.paramMap.get('sectionpageid');
    this.restApi.getPromise(`quiz/get-student-answers/${user_id}/${section_page_id}`)
      .then(response => {
        debugger;
        this.title = response.data[0].sectionPage.title;
        response.data.forEach(el => {
          let quizAnswers = [];

          el.quizAnswers.forEach(elChild => {
            debugger;
            quizAnswers.push({
              answer: JSON.parse(elChild.answer),
              user: elChild.user.name,
            })

          });

          this.answerList.push({
            question: el.question,
            options: JSON.parse(el.options),
            quizAnswers: quizAnswers,

          });
        });

      }).catch(error => {
        this.notificationService.showMsg(error);
      })
  }
}
