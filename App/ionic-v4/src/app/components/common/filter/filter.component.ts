import { Component, OnInit } from '@angular/core';
import {FormControl, Form} from '@angular/forms';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  toppings = [];
  search:string

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  constructor() { }

  ngOnInit() {}

  submitvalues(){
    console.log(this.search,this.toppings)
    
  }
}
