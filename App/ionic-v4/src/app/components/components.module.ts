import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { IonicSelectableModule } from 'ionic-selectable';
import { FileDropModule } from 'ngx-file-drop';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';

import { MediaComponent } from './media/media.component';
import { ConferenceComponent } from './conference/conference.component';
import { ShowTimeComponent } from './show-time/show-time/show-time.component';
import { ShowTimeDetailComponent } from './show-time/show-time-detail/show-time-detail.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		IonicSelectableModule,
		FileDropModule,
		SimplePdfViewerModule,
		RouterModule
	],
	declarations: [
		MediaComponent,
		ConferenceComponent,
		ShowTimeComponent,
		ShowTimeDetailComponent,
		ChatBoxComponent,
		ProfileComponent
	],
	entryComponents: [
		MediaComponent
	],
	exports: [
		ConferenceComponent,
		ShowTimeComponent,
		ShowTimeDetailComponent,
		ProfileComponent,
		ChatBoxComponent
	]
})
export class ComponentsModule {}