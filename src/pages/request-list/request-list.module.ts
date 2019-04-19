import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestListPage } from './request-list';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    RequestListPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(RequestListPage),
  ],
  entryComponents: [
    RequestListPage
  ]
})
export class RequestListPageModule {}
