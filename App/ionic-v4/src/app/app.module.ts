import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { ErrorsService } from './services/errors/errors.service';
import { ErrorsHandler } from './errors/handler/errors-handler';
import { ServerErrorsInterceptor } from './errors/interceptor/server-errors.interceptor';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicSelectableModule } from 'ionic-selectable';
import { FileDropModule } from 'ngx-file-drop';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from './components/components.module';
import { RtcService } from './services/rtc/rtc.service';
import { LoaderService } from './services/utility/loader.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NotificationService } from './services/notification/notification.service';
import { MatFormFieldModule } from '@angular/material';
 // import { AvailableCertificationsComponent } from './pages/certification/certification/available-certifications/available-certifications.component';

@NgModule({
  declarations: [
    AppComponent
    
    // OrderByDatePipe
  ],
  entryComponents: [],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ComponentsModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: '__thrive19',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    HttpClientModule,
    IonicSelectableModule,
    FileDropModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  providers: [
    LoaderService,
    StatusBar,
    SplashScreen,
    InAppBrowser,
    NotificationService,
    ErrorsService,
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private rtcService: RtcService) {
    this.rtcService.initConnection();
  }
}