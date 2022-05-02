import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalCitaPage } from './modal-cita.page';

const routes: Routes = [
  {
    path: '',
    component: ModalCitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalCitaPageRoutingModule {}
