import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {MatCardModule} from '@angular/material/card';

import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { IonicModule } from '@ionic/angular';

import { AddmodulePage } from './addmodule.page';
import { BrowserModule } from '@angular/platform-browser';

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
    // BrowserModule,
    NgCircleProgressModule.forRoot({
      "radius": 40,
      
      "space": -10,
      "outerStrokeGradient": true,
      "outerStrokeWidth": 10,
      "outerStrokeColor": "#4882c2",
      "outerStrokeGradientStopColor": "#0065b3",
      "innerStrokeColor": "#e7e8ea",
      "innerStrokeWidth": 10,
      "title": "UI",
      "animateTitle": true,
      "animationDuration": 200,
      "showTitle": false,
      "showSubtitle" : true,
      "showUnits": false,
      "showBackground": false,
      "startFromZero": false
    }),
    
    RouterModule.forChild(routes)
  ],
  declarations: [AddmodulePage]
})
export class AddmodulePageModule {}
