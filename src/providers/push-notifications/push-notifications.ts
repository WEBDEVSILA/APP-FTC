import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Injectable } from '@angular/core';
import { RequestProvider } from '../request/request';
import { Platform } from 'ionic-angular';

/*
  Generated class for the PushNotificationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PushNotificationsProvider {

  private pushObject: PushObject;
  private FCMID = '501291599127';
  private FCMToken: any;
  
  constructor(
    private push: Push,
    private request: RequestProvider,
    private platform: Platform
  ) {}

  // to check if we have permission
  checkPermission(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.push.hasPermission()
      .then((res: any) => {
        if (res.isEnabled) {
          resolve();
        } else {
          reject();
        }
      }).catch(() =>  reject());
    });
  }

  // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
  createChannel(pName?: string): void {
    this.push.createChannel({
    id: this.FCMID,
    description: pName ? pName : 'MainChannel',
    // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
    importance: 3
    }).then(() => {
      this.initOptions();
      this.events();
    });
  }

  // Delete a channel (Android O and above)
  deleteChannel(pName): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.push.deleteChannel(pName)
      .then(() => resolve(true))
      .catch(() => reject(false));
    });
  }

  // Return a list of currently configured channels
  listChannels(): Promise<Array<any>> {
      return this.push.listChannels();
  }

  // to initialize push notifications
  initOptions(): void {
    const options: PushOptions = {
      android: {},
      ios: {
          alert: 'true',
          badge: true,
          sound: 'true',
          fcmSandbox: true,
          clearBadge: false
      },
      windows: {},
      browser: {
          pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    }

    this.pushObject= this.push.init(options);
  }

  events(): void {
    this.pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
    
    this.pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    
    this.pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration);
      this.FCMToken = registration;
    });
  }

  setBadgeNumber (pCount): void {
    if(!this.pushObject){
      this.initOptions();
    }
    if(pCount > -1) {
      this.pushObject.setApplicationIconBadgeNumber(pCount);
    }
  }

  getBadgeNumber (): Promise<number> {    
    return this.pushObject.getApplicationIconBadgeNumber();
  }

  saveRegisterDevice(pAccountID: string): Promise<boolean>{
    return new Promise<any>((resolve, reject) => {

      console.log(this.FCMToken);
      if(this.FCMToken) {
        this.request.post('/user/device/save', { data: 
          { 
            userId: pAccountID,
            deviceToken: this.FCMToken.registrationId,
            platform: this.platform.platforms().indexOf('ios') > -1 ? 'ios' : 'android'
          }
        }).then((result) => {
          if( result[0] && result[0].success ) {              
              console.log(result);
              resolve(true);
            }
            else{
              console.log(result);
              reject(false);
            }
          }).catch((err) => {
            reject(err);
          });
      } else {
        setTimeout(() => {
          reject(false);
        }, 200);
      }
    });
  }
}
