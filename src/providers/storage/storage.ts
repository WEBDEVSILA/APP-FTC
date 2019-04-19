import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {

  constructor(public http: HttpClient) {

  }

  saveUser(pUser,shouldEncrypt = true){
    if (!pUser) {
      localStorage.removeItem('u');
    } else {
      if (shouldEncrypt) {
        pUser = JSON.stringify(pUser);
        localStorage.setItem('u', btoa(pUser));
      } else {
        localStorage.setItem('u', pUser);
      }
    }
  }

  getUser() {
    return localStorage.getItem('u') ? JSON.parse(atob(localStorage.getItem('u'))) : null;
  }

}
