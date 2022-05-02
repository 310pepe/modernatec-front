import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalUserSegPageRoutingModule } from './modal-user-seg-routing.module';

import { ModalUserSegPage } from './modal-user-seg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalUserSegPageRoutingModule
  ],
  declarations: [ModalUserSegPage]
})
export class ModalUserSegPageModule {}
