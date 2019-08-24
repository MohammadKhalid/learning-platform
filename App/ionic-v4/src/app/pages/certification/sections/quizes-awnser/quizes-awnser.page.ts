import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quizes-awnser',
  templateUrl: './quizes-awnser.page.html',
  styleUrls: ['./quizes-awnser.page.scss'],
})
export class QuizesAwnserPage implements OnInit {
  sectionId : any;
  constructor(
    private restApi : RestApiService,
    private actRoute : ActivatedRoute
  ) { }

  ngOnInit() {
    let id = this.restApi.sectionId = this.sectionId = this.actRoute.snapshot.paramMap.get('sectionid');
    this.restApi.populateSectionSubMenu(id);
  }

}
