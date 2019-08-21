import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/http/rest-api.service';

@Component({
  selector: 'app-student-text',
  templateUrl: './student-text.component.html',
  styleUrls: ['./student-text.component.scss'],
})
export class StudentTextComponent implements OnInit {
  @Input() data: any;

  constructor(private activateroute: ActivatedRoute,
    private authser: RestApiService) { }

  ngOnInit() {
   
  }

}