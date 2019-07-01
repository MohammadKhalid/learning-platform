import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Form } from '@angular/forms';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  categories = [];
  searchBy: string
  @Output() searchByFilterEvent = new EventEmitter<object>();

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  constructor() { }

  ngOnInit() { }
  search() {
    let obj = { 
      searchBy: this.searchBy,
       categories: this.categories
       }
    this.searchByFilterEvent.next(obj);
  }
}
