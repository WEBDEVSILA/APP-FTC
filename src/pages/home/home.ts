import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { MenuComponent } from '../../components/menu/menu';
import { ENV } from '@app/env';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  @ViewChild('menuComponent') menuComponent: MenuComponent;
  loaded:boolean;
  showBanner: boolean;
  showLogin: boolean;
  isLogged: boolean;
  userName: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthenticationProvider
  ) {
    this.loaded = false;
    this.userName = '';
    auth.onAuthenticate.subscribe(
      () => {
        this.showBanner = auth.currentUser ? true : false;
        this.showLogin = auth.currentUser ? false : true;
        if(!this.showLogin) {
          this.isLogged = true;
          this.menuComponent.generateMenu();
          this.userName = auth.currentUser.fullName;
        }
      },
      err => {
        this.showBanner = false;
        this.isLogged = false;
        this.showLogin = true;
      }
    )
  }

  get appTitle(){
    return ENV.production === 'prod' ? 'Foxtelecolombia' : 'Estudios Teleméxico';
  }

  ionViewDidEnter() {
    this.loaded = true;
    this.menuComponent.generateMenu();
  }

  ionViewWillLeave() {
    this.loaded = false;
  }

  onViewChange(event){
    this.showLogin = !(event === 'closeLogin');
    if(!this.showLogin) {
      this.isLogged = true;
    }
  }

  logout(){
    this.auth.logout().then(() =>{
      this.isLogged = false;
    })
  }

}
