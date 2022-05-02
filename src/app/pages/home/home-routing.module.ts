import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//importación de los componentes a utilizar
import { HomePage } from './home.page';
import { HomeAdminComponent } from '../../components/home-admin/home-admin.component';
import { AdminUsersComponent } from '../../components/admin-users/admin-users.component';
import { ReportesComponent } from '../../components/reportes/reportes.component';
import { PerfilComponent } from '../../components/perfil/perfil.component';
import { CambiarPasswordComponent } from '../../components/cambiar-password/cambiar-password.component';
import { UpdatePerfilComponent } from '../../components/update-perfil/update-perfil.component';
import { HomeRegisComponent } from '../../components/home-regis/home-regis.component';
import { UpdateUserComponent } from '../../components/update-user/update-user.component';
import { CreateUserComponent } from '../../components/create-user/create-user.component';
import { UpdateCitaComponent } from '../../components/update-cita/update-cita.component';
import { CreateCitaComponent } from '../../components/create-cita/create-cita.component';
import { DataBaseComponent } from '../../components/data-base/data-base.component';
import { HomeSegComponent } from '../../components/home-seg/home-seg.component';
import { CodigoCitaComponent } from '../../components/codigo-cita/codigo-cita.component';
import { CitasComponent } from '../../components/citas/citas.component';
import { AgregarRecoComponent } from '../../components/agregar-reco/agregar-reco.component';
import { TokenGuard } from '../../guards/token.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { RegGuard } from '../../guards/reg.guard';
import { SegGuard } from '../../guards/seg.guard';
import { HomeGuard } from '../../guards/home.guard';
import { AdicionarRecoComponent } from '../../components/adicionar-reco/adicionar-reco.component';

const routes: Routes = [
  {//declaración de la ruta principal
    path: '',
    component: HomePage,
    canActivate:[TokenGuard],
    //declaración de las rutas hijas
    children:[
      {
        path:'admin-home',
        component:HomeAdminComponent,
        canActivate:[AdminGuard]
      },
      {
        path:'admin-users',
        component:AdminUsersComponent,
        canActivate:[AdminGuard]
      },
      {
        path:'admin-reportes',
        component:ReportesComponent,
        canActivate:[AdminGuard]
      },
      {
        path:'perfil',
        component:PerfilComponent,
        canActivate:[]
      },
      {
        path:'changepass',
        component:CambiarPasswordComponent,
        canActivate:[]
      },
      {
        path:'update-perfil',
        component:UpdatePerfilComponent,
        canActivate:[]
      },
      {
        path:'admin-regis',
        component:HomeRegisComponent,
        canActivate:[RegGuard]
      },
      {
        path:'update-user/:id',
        component:UpdateUserComponent,
        canActivate:[RegGuard]
      },
      {
        path:'create-user',
        component:CreateUserComponent,
        canActivate:[RegGuard]
      },
      {
        path:'update-cita/:id',
        component:UpdateCitaComponent,
        canActivate:[RegGuard]
      },
      {
        path:'create-cita',
        component:CreateCitaComponent,
        canActivate:[RegGuard]
      },
      {
        path:'data-base',
        component:DataBaseComponent,
        canActivate:[RegGuard]
      },
      {
        path:'home-seg',
        component:HomeSegComponent,
        canActivate:[SegGuard]
      },
      {
        path:'verificar-cita',
        component:CodigoCitaComponent,
        canActivate:[SegGuard]
      },
     
      {
        path:'citas',
        component:CitasComponent,
        canActivate:[RegGuard]
      },
      {
        path:'agregar-reconocimiento/:id',
        component:AgregarRecoComponent,
        canActivate:[RegGuard]
      },
      {
        path:'adicionar-reconocimiento/:id',
        component:AdicionarRecoComponent,
        canActivate:[RegGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
