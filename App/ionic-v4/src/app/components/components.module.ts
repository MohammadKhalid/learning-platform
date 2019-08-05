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
import { ClientProfileComponent } from './profile/client-profile/client-profile.component';
import { MatTabsModule, MatSelectModule, MatCardModule, MatIconModule } from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentDashboardComponent } from './dashboard/student-dashboard/student-dashboard.component';
import { CoachDashboardComponent } from './dashboard/coach-dashboard/coach-dashboard.component';
import { ClientDashboardComponent } from './dashboard/client-dashboard/client-dashboard.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';

import { CategoryComponent } from './category/category.component';
import { AdminCategoryComponent } from './category/admin-category/admin-category.component';
import { AdminCategoryFormComponent } from './category/admin-category-form/admin-category-form.component';
import { ClientCategoryComponent } from './category/client-category/client-category.component';
import { ClientCategoryFormComponent } from './category/client-category-form/client-category-form.component';
import { CoachCategoryComponent } from './category/coach-category/coach-category.component';
import { StudentCategoryComponent } from './category/student-category/student-category.component';

import { TopicComponent } from './topic/topic.component';
import { AdminTopicComponent } from './topic/admin-topic/admin-topic.component';
import { AdminTopicFormComponent } from './topic/admin-topic-form/admin-topic-form.component';
import { ClientTopicComponent } from './topic/client-topic/client-topic.component';
import { ClientTopicFormComponent } from './topic/client-topic-form/client-topic-form.component';
import { CoachTopicComponent } from './topic/coach-topic/coach-topic.component';
import { StudentTopicComponent } from './topic/student-topic/student-topic.component';
import { ClientTagModalComponent } from './modal/client-tag-modal/client-tag-modal.component';
import { ErrorsComponent } from './errors/errors.component';
import { MatButtonModule } from '@angular/material/button';
// import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FilterComponent } from './common/filter/filter.component';
import { CartificateCardComponent } from './common/cartificate-card/cartificate-card.component';
import { DragScrollModule } from 'ngx-drag-scroll';

import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { VideoComponent } from './video/video.component';
import { FileUploadModule } from 'ng2-file-upload';
import { DropzoneComponent } from './common/dropzone/dropzone.component';
import { ResourcesComponent } from './resources/resources.component';
import { TextComponent } from './text/text.component';
import { QuizComponent } from './quiz/quiz.component';
import { ProgressCompleteCardComponent } from './common/progress-complete-card/progress-complete-card.component';
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
		FileUploadModule,
		MatIconModule,
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
		ClientProfileComponent,
		DashboardComponent,
		StudentDashboardComponent,
		CoachDashboardComponent,
		CoachDashboardComponent,
		ClientDashboardComponent,
		AdminDashboardComponent,
		CategoryComponent,
		AdminCategoryComponent,
		AdminCategoryFormComponent,
		ClientCategoryComponent,
		ClientCategoryFormComponent,
		CoachCategoryComponent,
		StudentCategoryComponent,
		TopicComponent,
		AdminTopicComponent,
		AdminTopicFormComponent,
		ClientTopicComponent,
		ClientTopicFormComponent,
		CoachTopicComponent,
		StudentTopicComponent,
		ClientTagModalComponent,
		FilterComponent,
		CartificateCardComponent,
		VideoComponent,
		DropzoneComponent,
		ResourcesComponent,
		TextComponent,
		QuizComponent,
		ProgressCompleteCardComponent,
	],
	entryComponents: [
		MediaComponent,
		ClientTagModalComponent
	],
	exports: [
		ConferenceComponent,
		ShowTimeComponent,
		ShowTimeDetailComponent,
		ChatBoxComponent,
		ProfileComponent,
		StudentProfileComponent,
		CoachProfileComponent,
		ClientProfileComponent,
		DashboardComponent,
		StudentDashboardComponent,
		CoachDashboardComponent,
		CoachDashboardComponent,
		ClientDashboardComponent,
		AdminDashboardComponent,
		CategoryComponent,
		AdminCategoryComponent,
		AdminCategoryFormComponent,
		ClientCategoryComponent,
		ClientCategoryFormComponent,
		CoachCategoryComponent,
		StudentCategoryComponent,
		TopicComponent,
		AdminTopicComponent,
		AdminTopicFormComponent,
		ClientTopicComponent,
		ClientTopicFormComponent,
		CoachTopicComponent,
		StudentTopicComponent,
		FilterComponent,
		CartificateCardComponent,
		VideoComponent,
		DropzoneComponent,
		ResourcesComponent,
		QuizComponent,
		TextComponent,
		ProgressCompleteCardComponent,
	],
	providers: [
		ProfileComponent
	]
})
export class ComponentsModule { }