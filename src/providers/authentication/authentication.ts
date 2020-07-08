import { Injectable } from '@angular/core';
import { RequestProvider } from '../request/request';
import { Properties } from '../../Properties';
import { Subject } from '../../../node_modules/rxjs/Subject';
import CryptoJS from 'crypto-js';
import { AlertController } from 'ionic-angular';
/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {

  currentUser: any;
  onAuthenticate: Subject<any>
  CryptoJS: any;
  private key: string;

  constructor(private request: RequestProvider, public alertCtrl: AlertController) {
    this.onAuthenticate = new Subject<any>();
    this.getDecodedKey(); 
  }

  login(pUser, pPassword, encrypt=true): Promise<any> {
    return new Promise((resolve, reject) =>{
      const uri = Properties.baseUrl.concat('/rest/$directory/login');
      let pwd = pPassword;
      if (encrypt) {
        pwd = this.encodePwd(pPassword);        
      }
      
      this.request.post(uri,{
        externalEndpoint: true,
        data: [ pUser, pwd.toString() ]
      }).then(response => {        
        this.getCurrentUserData().then(() => {
          this.onAuthenticate.next();          
          resolve(pwd.toString());
        })
      }).catch(error => {
        
        reject(error);
      });
    });
  }

  forgotPwd(pAccount): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.request.get('/forgotPassword', {
        queryParams: {
          user: pAccount,
        }}).then((result) => {
          result[0].success ? resolve(result[0]) : reject(result[0]); 
        }).catch((err) => {
          reject(err);
        });
    });
  }

  logout(): Promise<any> {
    return new Promise((resolve, reject) =>{
      const uri = Properties.baseUrl.concat('/rest/$directory/logout');
      this.request.post(uri,{
        externalEndpoint: true
      }).then(response => {
        this.getCurrentUserData();
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  }

  getCurrentUserData(): Promise<any> {
    return new Promise((resolve, reject) =>{
      const uri = Properties.baseUrl.concat('/rest/$directory/currentUser');      
      this.request.get(uri,{
        externalEndpoint: true
      }).then(response => {            
        this.currentUser = response.result;
        this.onAuthenticate.next();        
        resolve(this.currentUser);        
      }).catch(error => {
        this.onAuthenticate.error(error);
        reject(error);
        console.log(error);
        const alert = this.alertCtrl.create({
          title: 'Ups!!',       
          subTitle:'Parece que ha ocurrido un error, por favor revisa tu conexión.',   
          buttons: ['OK']
        });
        alert.present();

      });
    });
  }

  getUserMenu(): Promise<any> {
    return new Promise((resolve, reject) =>{
      if( this.currentUser ) {
        this.request.get('/menu', { queryParams: { userId: this.currentUser.userName } }).then(response => {
          this.currentUser.menu = response[0].modules;
          resolve(this.currentUser.menu);
        }).catch(error => {
          reject(error);
        });
      }else {
        this.getCurrentUserData().then(() => {
          this.request.get('/menu', { queryParams: { userId: this.currentUser.userName } }).then(response => {
            this.currentUser.menu = response[0].modules;
            resolve(this.currentUser.menu);
          }).catch(error => {
            reject(error);
          });
        });
      }
    });
  }

  getDecodedKey(): Promise<string> {
    return new Promise((resolve, rejected) => {
      this.request.get('', {methodRPC: 'getKey'}).then((keys) => {
        const bytes = CryptoJS.AES.decrypt(keys[0], Properties.publicKey);
        this.key = bytes.toString(CryptoJS.enc.Utf8);
        resolve(keys);
      }).catch((err) => {
        rejected(err);
      });
    });
  }

  getDecodePwd(pPassword): string {
    return CryptoJS.AES.decrypt(pPassword, this.key).toString(CryptoJS.enc.Utf8);
  }

  encodePwd(pPassword): any {
    return CryptoJS.AES.encrypt(pPassword, this.key).toString();
  }
}
