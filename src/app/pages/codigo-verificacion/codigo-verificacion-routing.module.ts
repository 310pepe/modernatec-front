import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodigoVerificacionPage } from './codigo-verificacion.page';

const routes: Routes = [
  {
    path: '',
    component: CodigoVerificacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodigoVerificacionPageRoutingModule {}
