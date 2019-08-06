import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/http/rest-api.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.page.html',
  styleUrls: ['./sections.page.scss'],
})
export class SectionsPage implements OnInit {

  constructor(private menu: MenuController, private reouter: Router, private apiSrv: RestApiService, private actRoute: ActivatedRoute, private navCntrl: NavController) { }
  public searchTerm: string = "";
  private subscription: Subscription;
  private subscriptionResource: Subscription;
  public items: any;
  listData: any;
  listResourceData: any;
  id: any
  searchBy: string;
  panelOpenState = false;
  panelResourceOpenState = false;
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

    debugger;
    this.subscriptionResource = this.apiSrv.getSectionMenuDataResource().subscribe(value => {
      value ? this.listResourceData = value : '';
    });
    this.menu.enable(false);
    this.menu.enable(false, 'mainMenu')

  }
  ngAfterViewInit() {
    setInterval(() => {
      this.menu.enable(false);
      this.menu.enable(false, 'mainMenu')
    }, 100)
  }
  title(data) {

    return data;

  }
  back() {
    this.menu.enable(true, 'mainMenu')
  }
  setFilteredItems() {
    this.items = this.item.filterItems(this.searchTerm);
  }


  goto(route) {
    this.reouter.navigate([`/certification/sections/${route}`])
  }
  goToConcept() {
    this.reouter.navigate([`/certification/sections/concepts/${this.apiSrv.sectionId}`])
  }

  goToResource() {
    this.reouter.navigate([`/certification/sections/resources/${this.apiSrv.sectionId}`])
  }
  gotoConceptType(data) {
    debugger;
    let sectionId = this.apiSrv.sectionId;
    if (data.type == "Quiz") {
      this.reouter.navigate([`certification/sections/concepts/${sectionId}/${data.title}/${data.type}`])
    }
    else if (data.type == "Resource") {
      debugger;
      this.reouter.navigate([`certification/sections/resources/${sectionId}/${data.title}/${data.type}`])
    }
    else {
      this.reouter.navigate([`certification/sections/concepts/${sectionId}/${data.id}/${data.type}`])
    }
  }

}
