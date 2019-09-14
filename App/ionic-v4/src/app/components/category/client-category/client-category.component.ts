import { Component, OnInit } from '@angular/core';
import { CategoryComponent } from '../category.component';

@Component({
  selector: 'app-client-category',
  templateUrl: './client-category.component.html',
  styleUrls: ['./client-category.component.scss'],
})
export class ClientCategoryComponent extends CategoryComponent implements OnInit {
  
  showHideTemplateForm = false;
  templateItems: Array<object> = [];
  templateSelectedIds: Array<number> = [];

  ngOnInit() {
		this.loadData();
	}

  importList() {
    this.showHideTemplateForm = !this.showHideTemplateForm;

    this.restApi.get('categories/form-input-data/templates', {}).subscribe((res: any) => {
      if(res.success) {
        this.templateItems = res.items;
      }
    });
  }

  saveTemplate() {
    this.notificationService.showMsg('Saving...', 0).then(() => {
      this.restApi.post('categories/import-templates', { ids: this.templateSelectedIds }).subscribe((res: any) => {
        this.notificationService.toast.dismiss();

        this.showHideTemplateForm = !this.showHideTemplateForm;
        this.templateSelectedIds = [];
        
        if(res.success) {
          this.notificationService.showMsg('Import done!');
          this.resetAll().then(() => this.loadData());
        }
      });
    });
  }

  updateSelectedIds(e: any) {
    if(e.detail.checked) this.templateSelectedIds.push(e.detail.value);
    else {
      const templateIndex = this.templateSelectedIds.indexOf(e.detail.value);
      if(templateIndex > -1)
        this.templateSelectedIds.splice(templateIndex, 1);
    }
  }

}