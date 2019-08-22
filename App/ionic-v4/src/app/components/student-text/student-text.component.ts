import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/http/rest-api.service';

@Component({
  selector: 'app-student-text',
  templateUrl: './student-text.component.html',
  styleUrls: ['./student-text.component.scss'],
})
export class StudentTextComponent implements OnInit {
  @Input() data: any;
  @Output() removeItem = new EventEmitter<object>();
  @Output() editItem = new EventEmitter<object>();

  title: string = "";
  isDeletedClicked: boolean = false
  constructor(private activateroute: ActivatedRoute,

    private restApi: RestApiService) { }

  ngOnInit() {
    this.title = this.data.title;
  }

  deleteText() {
    this.isDeletedClicked = true
    this.restApi.delete(`text/${this.data.id}`).subscribe(res => {
      this.isDeletedClicked = false
      this.removeItem.next(this.data)
    })
  }

  editText(){
    this.editItem.next(this.data)
  }
}