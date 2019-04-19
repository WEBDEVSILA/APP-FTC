import { Injectable } from '@angular/core';
import { RequestProvider } from '../request/request';
import { AuthenticationProvider } from '../authentication/authentication';

/*
  Generated class for the ApproveRequestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApproveRequestProvider {

  approveRequestList: Array<any>;

  constructor(
    public request: RequestProvider,
    public auth: AuthenticationProvider
  ) {
    this.approveRequestList = new Array<any>();
  }

  getApproveRequest(pType?: string): Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.request.get('/requests/pending', {
        queryParams: {
          userAuthId: this.auth.currentUser.userName,
          requestType: pType ? pType : 'Autorizacion'
        }}).then((result) => {
          this.approveRequestList = result;
          resolve(this.approveRequestList);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  getReviewersByReferenceNumber(pReferenceNumber: number): Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.request.get('/requests/reviewers', {
        queryParams: {
          requestNumber: pReferenceNumber,
          userRequestId: this.auth.currentUser.userName
        }}).then((result) => {
          resolve(result);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  saveAuthRequest(pAuthRequest: any): Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.request.post('/requests/save', { data: pAuthRequest }).then((result) => {
          if( result[0] && result[0].success ) {
            resolve(true);
          }
          else{
            reject(false);
          }
        }).catch((err) => {
          reject(err);
        });
    });
  }

  notifyComment(pAuthRequestId: any, pNotes: string): Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.request.post('/requests/notifyComment', { data: {
        id: pAuthRequestId,
        notes: pNotes
      }}).then((result) => {
          if( result[0] && result[0].success ) {
            resolve(true);
          }
          else{
            reject(false);
          }
        }).catch((err) => {
          reject(err);
        });
    });
  }

  getFiles(pRequestId): Promise<Array<any>> {
    return new Promise<Array<any>>((resolve, reject) => {
      this.request.get('/requests/docs', { queryParams: {requestId: pRequestId }}).then((result) => {
          if( result ) {
            resolve(result);
          }
          else{
            reject([]);
          }
        }).catch((err) => {
          reject(err);
        });
    });
  }

  downloadFile(pFileId: any): Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.request.get('/files/auth', { queryParams: {doc: pFileId}}).then((result) => {
          if( result[0] ) {
            const b64 = result[0];
            const binary = atob(b64.replace(/\s/g, '')); // IE COMPATIBILITY
            const len = binary.length;
            const buffer = new ArrayBuffer(len);
            const view = new Uint8Array(buffer);
            for (let i = 0; i < len; i++) {
              view[i] = binary.charCodeAt(i);
            }
            const blob = new Blob([view], { type: 'application/pdf' });
            resolve(blob);
          }
          else{
            reject(false);
          }
        }).catch((err) => {
          reject(err);
        });
    });
  }
}
