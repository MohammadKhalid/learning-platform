import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';

import { ComponentsModule } from '../../../components/components.module';

import { LiveGroupTrainingSessionPage } from './live-group-training-session.page';
import 'hammerjs';

const routes: Routes = [
  {
    path: '',
    component: LiveGroupTrainingSessionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    SimplePdfViewerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LiveGroupTrainingSessionPage]
})
export class LiveGroupTrainingSessionPageModule {}
