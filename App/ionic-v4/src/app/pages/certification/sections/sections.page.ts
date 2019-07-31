import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.page.html',
  styleUrls: ['./sections.page.scss'],
})
export class SectionsPage implements OnInit {

  constructor(private menu: MenuController, private reouter: Router, private apiSrv: RestApiService, private actRoute: ActivatedRoute, private navCntrl: NavController) { }
  public searchTerm: string = "";
  private subscription: Subscription;
  public items: any;
  listData: any;
  id: any
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
    this.subscription = this.apiSrv.getSectionMenuData().subscribe(value => {
      value ? this.listData = value : '';
    });
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
  gotoConceptType(recordId, type) {
    let sectionId = this.apiSrv.sectionId;
    this.reouter.navigate([`certification/sections/concepts/${sectionId}/${recordId}/${type}`])
  }

}
