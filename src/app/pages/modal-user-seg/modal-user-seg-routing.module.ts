import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalUserSegPage } from './modal-user-seg.page';

const routes: Routes = [
  {
    path: '',
    component: ModalUserSegPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalUserSegPageRoutingModule {}
