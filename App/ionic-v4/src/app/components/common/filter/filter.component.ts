import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, Form } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { RestApiService } from 'src/app/services/http/rest-api.service';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  categories = [];
  searchBy: string = "";
  user: any;
  categoryList: any = [];
  @Output() searchByFilterEvent = new EventEmitter<object>();
   constructor(
    private restApi: RestApiService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.user = this.authService.getSessionData().user;
    this.fetchCategories();
  }

  fetchCategories() {
    this.restApi.getPromise(`course-category/get-all/${this.user.createdBy}`)
      .then(res => {
        let { success, data } = res;
        if (success) {
          this.categoryList = data;
        }
      }).catch(err => {
        console.log(err);
      })
  }

  search() {
    let obj = {
      userId: this.user.id,
      categories: this.categories,
      searchBy: this.searchBy
    }
    this.searchByFilterEvent.next(obj);
  }
}
