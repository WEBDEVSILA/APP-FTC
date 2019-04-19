import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Loading } from '../../../node_modules/ionic-angular';
import { AlertParams } from '../models/interviews';

/*
  Generated class for the InterviewsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InterviewsProvider {

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  openAlert(pParams: AlertParams) {
    let alert = this.alertCtrl.create({
      title: pParams.title,
      subTitle: pParams.subTitle ? pParams.subTitle : '',
      buttons: pParams.buttons ? pParams.buttons : ['Ok']
    });
    alert.present();
  }

  presentLoading(): Loading {
    const loader = this.loadingCtrl.create({
      content: "Un momento por favor...",
      duration: 3000
    });
    loader.present();
    return loader;
  }

}
