import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CambiarPasswordComponent } from './cambiar-password/cambiar-password.component';
import { ReportesComponent } from './reportes/reportes.component';
import { UpdatePerfilComponent } from './update-perfil/update-perfil.component';
import { NgChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';
import { CodigoCitaComponent } from './codigo-cita/codigo-cita.component';
import { HomeRegisComponent } from './home-regis/home-regis.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { DataBaseComponent } from './data-base/data-base.component';
import { CitasComponent } from './citas/citas.component';
import { CreateCitaComponent } from './create-cita/create-cita.component';
import { UpdateCitaComponent } from './update-cita/update-cita.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HomeSegComponent } from './home-seg/home-seg.component';
import { ModalUserRegPageModule } from '../pages/modal-user-reg/modal-user-reg.module';
import { AgregarRecoComponent } from './agregar-reco/agregar-reco.component';
import { ModalUserSegPageModule } from '../pages/modal-user-seg/modal-user-seg.module';
import { CameraPreview } from '@awesome-cordova-plugins/camera-preview/ngx';
import { ModalCitaPageModule } from '../pages/modal-cita/modal-cita.module';
import { ModalUserPageModule } from '../pages/modal-user/modal-user.module';
import { AdicionarRecoComponent } from './adicionar-reco/adicionar-reco.component';



@NgModule({
  providers:[CameraPreview],
  declarations: [
    HomeAdminComponent,
    MenuComponent,
    AdminUsersComponent,
    PerfilComponent,
    CambiarPasswordComponent,
    ReportesComponent,
    UpdatePerfilComponent,
    CodigoCitaComponent,
    HomeRegisComponent,
    UpdateUserComponent,
    CreateUserComponent,
    DataBaseComponent,
    CitasComponent,
    CreateCitaComponent,
    UpdateCitaComponent,
    HomeSegComponent,
    AgregarRecoComponent,
    AdicionarRecoComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    NgChartsModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ModalUserRegPageModule,
    ModalUserSegPageModule,
    ModalCitaPageModule,
    ModalUserPageModule
  ],
  exports:[
    HomeAdminComponent,
    MenuComponent,
    AdminUsersComponent,
    PerfilComponent,
    CambiarPasswordComponent,
    ReportesComponent,
    UpdatePerfilComponent,
    CodigoCitaComponent,
    HomeRegisComponent,
    UpdateUserComponent,
    CreateUserComponent,
    DataBaseComponent,
    CitasComponent,
    CreateCitaComponent,
    UpdateCitaComponent,
    HomeSegComponent,
    AgregarRecoComponent,
    AdicionarRecoComponent,
  ]
})
export class ComponentsModule { }
