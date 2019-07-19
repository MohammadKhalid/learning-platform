import { Component, OnInit } from '@angular/core';
import { TopicComponent } from '../topic.component';

@Component({
  selector: 'app-admin-topic',
  templateUrl: './admin-topic.component.html',
  styleUrls: ['./admin-topic.component.scss'],
})
export class AdminTopicComponent extends TopicComponent implements OnInit {

  ngOnInit() {
    this.loadData();
  }

}