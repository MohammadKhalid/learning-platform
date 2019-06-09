import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AskExpertPage } from './ask-expert.page'; 
import { ContactAddModelComponent } from './contact-add-model/contact-add-model.component';
import { TimeformatPipe } from 'src/app/pipes/timeformat.pipe';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { TimeformatHhMmPipe } from 'src/app/pipes/timeformat-hh-mm.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';

const routes: Routes = [
  {
    path: '',
    component: AskExpertPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfiniteScrollModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AskExpertPage, ContactAddModelComponent, TimeformatPipe, FilterPipe, TimeformatHhMmPipe,
    TimeAgoPipe],
  entryComponents: [ContactAddModelComponent],
})
export class AskExpertPageModule { }
