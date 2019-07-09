import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    // BrowserModule,
    NgCircleProgressModule.forRoot({
      "backgroundGradient": true,
      "backgroundColor": "#ffffff",
      "backgroundGradientStopColor": "#c0c0c0",
      "backgroundPadding": -10,
      "radius": 40,
      "maxPercent": 100,
      "outerStrokeWidth": 10,
      "outerStrokeColor": "#61A9DC",
      "innerStrokeWidth": 0,
      "subtitleColor": "#444444",
      "showBackground": false,
      "showInnerStroke": false,
      "responsive": false
    }),
    
    RouterModule.forChild(routes)
  ],
  declarations: [AddmodulePage]
})
export class AddmodulePageModule {}
