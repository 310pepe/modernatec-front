import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalCitaPageRoutingModule } from './modal-cita-routing.module';

import { ModalCitaPage } from './modal-cita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalCitaPageRoutingModule
  ],
  declarations: [ModalCitaPage]
})
export class ModalCitaPageModule {}
