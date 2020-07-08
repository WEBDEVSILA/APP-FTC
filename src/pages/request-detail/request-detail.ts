import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { ApproveRequestProvider } from '../../providers/approve-request/approve-request';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { InterviewsProvider } from '../../providers/interviews/interviews';
import { PushNotificationsProvider } from '../../providers/push-notifications/push-notifications';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';


/**
 * Generated class for the RequestDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-request-detail',
  templateUrl: 'request-detail.html',
})
export class RequestDetailPage {

  request: any;
  reviewers: Array<any>;
  displayMessageBox: boolean;
  typeToSendNotify: string;
  notes: string;
  docs: Array<any>;
  fileUrl;

  constructor(
    private platform: Platform,
    private document: DocumentViewer,
    private file : File,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private auth: AuthenticationProvider,
    private approveRequestService: ApproveRequestProvider,
    private interviews: InterviewsProvider,
    private pushManage: PushNotificationsProvider
  ) {
    this.reviewers = new Array<any>();
    this.request = navParams.get('request');
    this.typeToSendNotify = 'resolve';
    this.notes = '';
    this.displayMessageBox = false;
    this.docs = new Array<any>();
  }

  ionViewDidLoad() {
    this.approveRequestService.getReviewersByReferenceNumber(this.request.referenceNumber)
    .then(reviewersList => { this.reviewers = reviewersList })
    .catch(err => { this.reviewers = []} );

    this.approveRequestService.getFiles(this.request.id).then((docs) => {
      this.docs = docs;
    });
  }

  openConfirmAuth() {
    const confirm = this.alertCtrl.create({
      title: 'Solicitud de: ' +this.request.type[0].toUpperCase() + this.request.type.substring(1).toLowerCase(),
      message: '¿Estás seguro de autorizar?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.send(true);
          }
        }
      ]
    });
    confirm.present();
  }

  enableToAuth() {
    let isInvalid = false;
    this.reviewers.forEach(reviewer => {
      if(this.request.orden > reviewer.orden){
        if (!reviewer.approve){
          isInvalid = true;
        }
      }
    });

    return isInvalid;
  }

  openMessageBox(pType) {
    this.displayMessageBox = true;
    this.typeToSendNotify = pType;
    setTimeout(() => {
      document.getElementById('atNotes').focus();
    }, 200);
  }

  send(pApproved) {
    if(this.typeToSendNotify === 'comment') {
      this.notifyComment();
    }else{
      this.approveRequestService.saveAuthRequest({
        id: this.request.id,
        userAuth: this.auth.currentUser.userName,
        approved: pApproved,
        rejectedReason: this.notes
      }).then(() => {
        this.interviews.openAlert({
          title: '',
          subTitle: 'Se ha guardado satisfactoriamente.'
        });
        this.navCtrl.pop();
        const pos = this.approveRequestService.approveRequestList.findIndex(request => request.id === this.request.id);
        this.approveRequestService.approveRequestList.splice(pos, 1);
        this.pushManage.getBadgeNumber().then((count) => {
          this.pushManage.setBadgeNumber(count -1);
        })
      }).catch(() => {
        this.interviews.openAlert({
          title: 'Ups!',
          subTitle: 'hemos tenido problemas. Intentaló nuevamente.'
        });
      })
    }
  }

  notifyComment() {
    this.approveRequestService.notifyComment(this.request.id, this.notes).then(() => {
      this.interviews.openAlert({
        title: '',
        subTitle: 'Se ha envíado un email al solicitante.'
      });
      this.navCtrl.pop();
    }).catch(() => {
      this.interviews.openAlert({
        title: 'Ups!',
        subTitle: 'hemos tenido problemas. Intentaló nuevamente.'
      });
    })
  }

  downloadFile(docRef) {
    const loaderef = this.interviews.presentLoading();
    this.approveRequestService.downloadFile(docRef.id).then((blob) => {
      if(this.platform.is('ios') || this.platform.is('android')){
        this.file.writeFile(this.file.dataDirectory, docRef.id+"file.pdf", blob, {replace: true}).then(c => {
          this.document.viewDocument(this.file.dataDirectory+ docRef.id + "file.pdf", "application/pdf",
          {print: {enabled: true}, bookmarks: {enabled: true}, email: {enabled: true}, title: document.title});
          loaderef.dismiss();
        });
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl,'_system ','location=yes');
        loaderef.dismiss();
      }else{
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.getElementById('donwloadLink') as HTMLAnchorElement;
        a.href = blobUrl;
        a.download = docRef.name;
        //a.click();
        //window.URL.revokeObjectURL(blobUrl);
        window.open(blobUrl,'_system ','location=yes');
        loaderef.dismiss();
      }
    });
  }


}
