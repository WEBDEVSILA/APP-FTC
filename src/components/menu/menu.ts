import { Component, ViewEncapsulation, Input } from '@angular/core';
import { NavController } from '../../../node_modules/ionic-angular';
import { RequestListPage } from '../../pages/request-list/request-list';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

/**
 * Generated class for the MenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'menu',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'menu.html'
})
export class MenuComponent {

  @Input('shown') shown: boolean;
  menu: Array<{id, name}>;

  constructor(
    public navCtrl: NavController,
    private auth: AuthenticationProvider
  ) {
    this.menu = new Array<{id, name}>();
  }

  generateMenu() {
    if(this.auth.currentUser) {  
      this.auth.getUserMenu().then((list) => {
        this.menu = list;
      }).catch((err)=> {

      });
    }
  }

  goTo(pOption) {
    this.navCtrl.push(RequestListPage, {module: pOption})
  }

}
