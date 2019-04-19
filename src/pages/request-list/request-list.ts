import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApproveRequestProvider } from '../../providers/approve-request/approve-request';
import { RequestDetailPage } from '../request-detail/request-detail';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { InterviewsProvider } from '../../providers/interviews/interviews';

/**
 * Generated class for the RequestListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-request-list',
  templateUrl: 'request-list.html',
})
export class RequestListPage {
  loaded: boolean;
  module: {id: Number, name: String};
  requestList: Array<any>;
  userName: string;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private approveRequestProvider: ApproveRequestProvider,
    public auth: AuthenticationProvider,
    private interview: InterviewsProvider
  ) {
    this.loaded = false;
    this.module = navParams.get('module');
    this.requestList = new Array<any>();
    this.userName = auth.currentUser.fullName;
  }
  
  ionViewDidLoad(): void {
    const loaderef = this.interview.presentLoading();
    const requestType = this.module.id === 1 ? 'autorizacion' : 'presupuesto';
    this.approveRequestProvider.getApproveRequest(requestType)
    .then((list) => {
      this.requestList = list;
      loaderef.dismiss();
    }).catch(() => {
      this.requestList = [];
      loaderef.dismiss();
    });
  }

  ionViewDidEnter() {
    this.loaded = true;
  }

  ionViewWillLeave() {
    this.loaded = false;
  }

  goToDetail(pRequest): void {
    this.navCtrl.push(RequestDetailPage, {request: pRequest})
  }

  isButtonDisplay(pRequestId): boolean{
    return getComputedStyle(document.getElementById('btn-rquest-'+ pRequestId)).display !== 'none';
  }

}
