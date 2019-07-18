import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.page.html',
  styleUrls: ['./sections.page.scss'],
})
export class SectionsPage implements OnInit {

  constructor(private menu: MenuController, private reouter: Router) { }
  public searchTerm: string = "";
  public items: any;
  searchBy: string;
  public item: any = [
    { title: "one" },
    { title: "two" },
    { title: "three" },
    { title: "four" },
    { title: "five" },
    { title: "six" }
  ];



  ngOnInit() {
  }
  back() {
    this.menu.enable(true, 'mainMenu')
  }
  setFilteredItems() {
    this.items = this.item.filterItems(this.searchTerm);
  }

  ionViewWillEnter() {
    this.menu.enable(false, 'mainMenu')

  }

  goto(route) {
    this.reouter.navigate([`/certification/sections/${route}`])
  }

}
