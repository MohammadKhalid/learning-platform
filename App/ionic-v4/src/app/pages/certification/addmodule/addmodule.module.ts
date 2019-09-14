import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { IonicModule } from '@ionic/angular';

import { AddmodulePage } from './addmodule.page';
import { BrowserModule } from '@angular/platform-browser';
import { AddEditModelComponent } from './add-edit-model/add-edit-model.component';
import { AddEditPopoverComponent } from 'src/app/components/common/add-edit-popover/add-edit-popover.component';

const routes: Routes = [
  {
    path: '',
    component: AddmodulePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    IonicModule,
    RoundProgressModule,
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot({
      "radius": 40,
      "renderOnClick": false,
      "space": -10,
      "outerStrokeGradient": true,
      "outerStrokeWidth": 10,
      "outerStrokeColor": "#4882c2",
      "outerStrokeGradientStopColor": "#0065b3",
      "innerStrokeColor": "#e7e8ea",
      "innerStrokeWidth": 10,
      "title": "",
      "animateTitle": true,
      "animationDuration": 200,
      "showTitle": true,
      "showSubtitle": false,
      "showBackground": false,
      "lazy": false,
      "showUnits": true
    }),

    RouterModule.forChild(routes)
  ],
  declarations: [AddmodulePage, AddEditModelComponent],
  entryComponents: [AddEditModelComponent],
})
export class AddmodulePageModule {
}
