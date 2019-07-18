import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { IonicSelectableModule } from 'ionic-selectable';
import { FileDropModule, FileComponent } from 'ngx-file-drop';
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
import { MatTabsModule, MatSelectModule, MatCardModule } from '@angular/material';
import { ErrorsComponent } from './errors/errors.component';
import { MatButtonModule } from '@angular/material/button';
// import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FilterComponent } from './common/filter/filter.component';
import { CartificateCardComponent } from './common/cartificate-card/cartificate-card.component';
import { DragScrollModule } from 'ngx-drag-scroll';

import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
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
		MatSelectModule,
		MatCardModule,
		MatButtonModule,
		DragScrollModule,
		LazyLoadImageModule.forRoot({
			preset: intersectionObserverPreset // <-- tell LazyLoadImage that you want to use IntersectionObserver
		})
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
		CompanyProfileComponent,
		FilterComponent,
		CartificateCardComponent
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
		CompanyProfileComponent,
		FilterComponent,
		CartificateCardComponent

	]
})
export class ComponentsModule { }