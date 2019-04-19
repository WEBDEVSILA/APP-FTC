import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { ENV } from '@app/env';
import { PushNotificationsProvider } from '../providers/push-notifications/push-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    auth: AuthenticationProvider,
    private platform: Platform,
    private pushManage: PushNotificationsProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      
      statusBar.overlaysWebView(true);      
      statusBar.backgroundColorByHexString('#ffffff');
      splashScreen.hide();
      auth.getCurrentUserData().catch(() => {
        //window.location.reload();
      });
      this.setTitle();
      this.manageNotifications();
    });
  }

  setTitle(){
    const title = ENV.production === 'prod' ? 'Foxtelecolombia' : 'Estudios Teleméxico';
    document.title  = title;
  }

  manageNotifications() {
    if(this.platform.is('ios')) {
      this.pushManage.initOptions();
      this.pushManage.events();    
    }else {
      const name = ENV.production === 'prod' ? 'AprobChannel' : 'TestChannel';
      this.pushManage.createChannel(name);
    }
  }
}

