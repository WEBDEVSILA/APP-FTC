import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RequestProvider } from '../providers/request/request';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { ComponentsModule } from '../components/components.module';
import { InterviewsProvider } from '../providers/interviews/interviews';
import { RequestListPageModule } from '../pages/request-list/request-list.module';
import { ApproveRequestProvider } from '../providers/approve-request/approve-request';
import { HomePageModule } from '../pages/home/home.module';
import { RequestDetailPageModule } from '../pages/request-detail/request-detail.module';
import { StorageProvider } from '../providers/storage/storage';
import { PushNotificationsProvider } from '../providers/push-notifications/push-notifications';
import { Push } from '@ionic-native/push';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { TermsConditionsPageModule } from '../pages/terms-conditions/terms-conditions.module';
import { PrivacyPolicyPageModule } from '../pages/privacy-policy/privacy-policy.module';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    HttpClientModule,
    HomePageModule,
    PrivacyPolicyPageModule,
    TermsConditionsPageModule,
    RequestListPageModule,
    RequestDetailPageModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RequestProvider,
    AuthenticationProvider,
    ApproveRequestProvider,
    InterviewsProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApproveRequestProvider,
    StorageProvider,
    PushNotificationsProvider,
    Push,
    File,
    DocumentViewer
  ]
})
export class AppModule {}
