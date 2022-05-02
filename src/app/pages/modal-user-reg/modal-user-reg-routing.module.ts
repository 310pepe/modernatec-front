import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalUserRegPage } from './modal-user-reg.page';

const routes: Routes = [
  {
    path: '',
    component: ModalUserRegPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalUserRegPageRoutingModule {}
