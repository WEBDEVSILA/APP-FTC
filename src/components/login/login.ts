import { Component, Output, EventEmitter } from '@angular/core';
import { InterviewsProvider } from '../../providers/interviews/interviews';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { StorageProvider } from '../../providers/storage/storage';
import { ENV } from '@app/env';
import { PushNotificationsProvider } from '../../providers/push-notifications/push-notifications';
import { NavController } from 'ionic-angular';
import { PrivacyPolicyPage } from '../../pages/privacy-policy/privacy-policy';
import { TermsConditionsPage } from '../../pages/terms-conditions/terms-conditions';

/**
 * Generated class for the LoginComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ftc-login',
  templateUrl: 'login.html'
})
export class LoginComponent {
  
  @Output('complete') complete = new EventEmitter<any>();
  userName: string;
  password: string;
  rememberPwd: boolean;
  showPassword = false;
  private encrypt: boolean;

  constructor(
    private interView: InterviewsProvider,
    private auth: AuthenticationProvider,
    private push: PushNotificationsProvider,
    private storage: StorageProvider,
    public navCtrl: NavController
  ) {
    const user = this.storage.getUser();
    if(user) {
      this.userName = user.userName;
      this.password = user.password;
      this.rememberPwd = true;
    }else {
      this.rememberPwd = false;
    }
  }

  get logoPath() {
    return ENV.production === 'prod' ? './assets/imgs/logoTelecolombia.png' : './assets/imgs/logoTelemexico.png';
  }
  
  login() {
    if(this.userName && this.password && this.userName.length > 3 && this.password.length > 4) {
      const loader = this.interView.presentLoading();
      this.encrypt = this.password.length < 16;
      this.auth.login(this.userName, this.password, this.encrypt)
      .then((pwdEncrypt)=> {                
        this.storage.saveUser({userName: this.userName, password: pwdEncrypt});                
        this.complete.emit('closeLogin');        
        //this.push.saveRegisterDevice(this.auth.currentUser.userName);        
        loader.dismiss();        
      })
      .catch(()=> {
        
        loader.dismiss();
        loader.onDidDismiss(() =>{          
          this.presentAlert();
        });
      });
    }else {      
      this.presentAlert();
    }
  }

  forgotPwd(){
    let response: MessageParameter;
    
    if(this.userName.length > 0) {
      const loader = this.interView.presentLoading();
      this.auth.forgotPwd(this.userName).then(()=>{
        loader.dismiss;
        response = {title: '', text: 'Se ha envíado la contraseña a tú correo eléctronico'};
      }).catch(()=> {
        loader.dismiss;
        response = {text: 'No hemos podido encontrar tu correo eléctronico, intentalo de nuevo.'};
      })
      loader.onDidDismiss(() =>{
        this.presentAlert(response);
      });
    }else {
      response = {text: 'Debes ingresar un correo eléctronico válido'};
      this.presentAlert(response);
    }

  }

  showPwd() {
    this.showPassword = !this.showPassword;
    if(this.showPassword){
      this.encrypt = true;
      if(this.password.length > 15 ){
        this.password = this.auth.getDecodePwd(this.password);
      }
    }else{
      this.encrypt = false;
        this.password = this.auth.encodePwd(this.password);
    }
  }

  onKeyup(event) {
    if (event.key === "Delete" || event.key === 'Backspace' || event.keyCode === 8) {
        this.rememberPwd = false;
    }
  }
  
  private presentAlert(pParameters?: MessageParameter){
    const  args = {
      title: pParameters && pParameters.title ? pParameters.title : 'Ups!',
      subTitle: pParameters && pParameters.text ? pParameters.text : 'La contraseña o el usuario no coinciden.' 
    }

    this.interView.openAlert(args);
  }

  openPP(){
    this.navCtrl.push(PrivacyPolicyPage);
  }

  openTC(){
    this.navCtrl.push(TermsConditionsPage);
  }
}

interface MessageParameter {
  text: string;
  title?: string;
}