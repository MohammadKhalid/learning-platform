import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LevelSettingPage } from './level-setting.page';

const routes: Routes = [
  {
    path: '',
    component: LevelSettingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LevelSettingPage]
})
export class LevelSettingPageModule {}
