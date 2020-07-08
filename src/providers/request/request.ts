import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestParams } from '../models/request';
import { Properties } from '../../Properties';

/*
  Generated class for the RequestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RequestProvider {

  private dataWakConnected  = {
    jsonrpc: '2.0',
    id: 519459430461,
    module: 'ConnectTo4D',
    method: 'Connect',
    params: []
};

  constructor(public http: HttpClient) {}

  /**
    * Generate headers to request
    * @return {Headers} headers of the request
  */
  get headers(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return headers;
  }

  private sendToWakServ(pMethod: string, pParams: RequestParams): Promise<any> {
    const serverConnectedURL = Properties.baseUrl.concat('/rpc/');
    this.dataWakConnected.method = pParams.methodRPC ? pParams.methodRPC : 'Connect';
    this.dataWakConnected.params.length = 0;
    if(pParams.data){
      pParams.data.method = pMethod; 
    }else {
      pParams.data = { method: pMethod }; 
    }
    
    this.dataWakConnected.params.push(pParams.uri);
    this.dataWakConnected.params.push(pParams.data);
    const jsonPlain = JSON.stringify(this.dataWakConnected);
    return new Promise((resolve, reject) => {
      this.http.post(serverConnectedURL, jsonPlain,
        { withCredentials: true, headers: pParams.requestOptions,  responseType: pParams.responseType })
        .subscribe(
          (response:any) => resolve(response.result.response.docs),
          err => {
            this.sendError(err);
            reject(err);
          });
    });
  }

  private setQueryParams(pUri, queryParams): string{
    const url = new URL('http://localhost'+pUri);
    const keys = Object.keys(queryParams);
    keys.forEach(key => {
      url.searchParams.append(key, queryParams[key]);
    });

    return url.toString().substr(16);
  }

  private sendError(error: any){}

  /**
     * GET request function
     * @param uri  resource of the request
     * @param pParams.queryParams queryParams
     * @param pParams.requestOptions add headers to the request
     * @param pParams.responseType type to accept into response
  */
  get(pUri: string, pParams?: RequestParams): Promise<any> {
    let options;
    pParams = pParams || {};
    options = options || {};
    options = pParams.requestOptions ? Object.assign(options, pParams.requestOptions) : this.headers;
    pParams.responseType = pParams.responseType ? pParams.responseType : 'json';
    if(pParams.externalEndpoint){
      return new Promise((resolve, reject) => {
        this.http.get(pUri, { withCredentials: true, headers: options, params: pParams.queryParams, responseType: pParams.responseType })
        .subscribe(          
          response => response ? resolve(response) : reject({ status: 204, error: null }),
            err => {              
              this.sendError(err);
              reject(err);
            });
      });
    }else {
      pParams.uri = pParams.queryParams ? this.setQueryParams(pUri, pParams.queryParams) : pUri;
      return this.sendToWakServ('GET', pParams);
    }

  }

  /**
     * POST request function
     * @param uri  resource of the request
     * @param pParams.queryParams queryParams
     * @param pParams.data body of the request
     * @param pParams.requestOptions add headers to the request
     * @param pParams.responseType type to accept into response
  */
  post(pUri: string, pParams?: RequestParams): Promise<any> {
    let options: HttpHeaders;

    pParams = pParams || {};
    pParams.data = pParams.data ? pParams.data : {};
    options = pParams.requestOptions ? Object.assign(options, pParams.requestOptions) : this.headers;
    pParams.responseType = pParams.responseType ? pParams.responseType : 'json';
    
    if (pParams.data.constructor.name === 'FormData') {
      options = options.delete('Content-Type', '');
    }
    
    if(pParams.externalEndpoint){
      return new Promise((resolve, reject) => {
        this.http.post(pUri, pParams.data, { withCredentials: true, headers: options, params: pParams.queryParams, responseType: pParams.responseType })
          .subscribe(
            response => resolve(response),
            err => {
              this.sendError(err);
              reject(err);
            });
      });
    }else {
      pParams.uri = pParams.queryParams ? this.setQueryParams(pUri, pParams.queryParams) : pUri;
      return this.sendToWakServ('POST', pParams);
    }

  }

  /**
     * PUT request function
     * @param uri  resource of the request
     * @param pParams.queryParams queryParams
     * @param pParams.data body of the request
     * @param pParams.requestOptions add headers to the request
     * @param pParams.responseType type to accept into response
  */
  put(pUri: string, pParams?: RequestParams): Promise<any> {
    let options: HttpHeaders;

    pParams = pParams || {};
    pParams.data = pParams.data ? pParams.data : {};
    pParams.queryParams = pParams.queryParams ? pParams.queryParams : null;
    options = pParams.requestOptions ? Object.assign(options, pParams.requestOptions) : this.headers;
    pParams.responseType = pParams.responseType ? pParams.responseType : 'json';
    
    if (pParams.data.constructor.name === 'FormData') {
      options = options.delete('Content-Type', '');
    }

    if(pParams.externalEndpoint){
      return new Promise((resolve, reject) => {
        this.http.put(pUri, pParams.data, { withCredentials: true, headers: options, params: pParams.queryParams, responseType: pParams.responseType })
          .subscribe(
            response => resolve(response),
            err => {
              this.sendError(err);
              reject(err);
            });
      });
    }else {
      pParams.uri = pParams.queryParams ? this.setQueryParams(pUri, pParams.queryParams) : pUri;
      return this.sendToWakServ('PUT', pParams);
    }

  }

  /**
     * DELETE request function
     * @param uri  resource of the request
     * @param pParams.queryParams queryParams
     * @param pParams.requestOptions add headers to the request
     * @param pParams.responseType type to accept into response
  */
  delete(pUri: string, pParams?: RequestParams): Promise<any> {
    let options: HttpHeaders;

    pParams = pParams || {};
    options = pParams.requestOptions ? Object.assign(options, pParams.requestOptions) : this.headers;
    pParams.responseType = pParams.responseType ? pParams.responseType : 'json';
    
    if(pParams.externalEndpoint){
      return new Promise((resolve, reject) => {
        this.http.delete(pUri, { withCredentials: true, headers: options, params: pParams.queryParams, responseType: pParams.responseType })
          .subscribe(
            response => resolve(response),
            err => {
              this.sendError(err);
              reject(err);
            });
      });
    }else {
      pParams.uri = pParams.queryParams ? this.setQueryParams(pUri, pParams.queryParams) : pUri;
      return this.sendToWakServ('DELETE', pParams);
    }
  }
}
