import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/http/rest-api.service';

@Component({
  selector: 'app-student-text',
  templateUrl: './student-text.component.html',
  styleUrls: ['./student-text.component.scss'],
})
export class StudentTextComponent implements OnInit {
  @Input() sectionId: any;
  @Input() recordId: any;
  listData: any = [];

  constructor(private activateroute: ActivatedRoute,
    private authser: RestApiService) { }

  ngOnInit() {
    this.authser.getPromise(`text/get-text-by-id-for-student/${this.recordId}`).then(res => {
      this.listData = res.data
    }).catch(err => {

    })
  }

}
