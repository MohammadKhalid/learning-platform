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
import { StudentProfileComponent } from './profile/student-profile/student-profile.component';
import { CoachProfileComponent } from './profile/coach-profile/coach-profile.component';
import { CompanyProfileComponent } from './profile/company-profile/company-profile.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ErrorsComponent } from './errors/errors.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		IonicSelectableModule,
		FileDropModule,
		SimplePdfViewerModule,
		RouterModule,
		MatTabsModule,
		MatFormFieldModule,
		MatSelectModule
	],
	declarations: [
		ErrorsComponent,
		MediaComponent,
		ConferenceComponent,
		ShowTimeComponent,
		ShowTimeDetailComponent,
		ChatBoxComponent,
		ProfileComponent,
		StudentProfileComponent,
		CoachProfileComponent,
		CompanyProfileComponent
	],
	entryComponents: [
		MediaComponent
	],
	exports: [
		ConferenceComponent,
		ShowTimeComponent,
		ShowTimeDetailComponent,
		ChatBoxComponent,
		ProfileComponent,
		StudentProfileComponent,
		CoachProfileComponent,
		CompanyProfileComponent
	]
})
export class ComponentsModule {}