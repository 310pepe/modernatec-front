import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalUserRegPageRoutingModule } from './modal-user-reg-routing.module';

import { ModalUserRegPage } from './modal-user-reg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalUserRegPageRoutingModule
  ],
  declarations: [ModalUserRegPage]
})
export class ModalUserRegPageModule {}
