import { Component, OnInit } from '@angular/core';
import { TopicComponent } from '../topic.component';

@Component({
  selector: 'app-coach-topic',
  templateUrl: './coach-topic.component.html',
  styleUrls: ['./coach-topic.component.scss'],
})
export class CoachTopicComponent extends TopicComponent implements OnInit {

  ngOnInit() {
    this.loadData();
  }

}