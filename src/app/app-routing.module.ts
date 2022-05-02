import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CodigoVerificacionGuard } from './guards/codigo-verificacion.guard';
import { TokenGuard } from './guards/token.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate:[LoginGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate:[TokenGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'email-password',
    loadChildren: () => import('./pages/email-password/email-password.module').then( m => m.EmailPasswordPageModule)
  },
  {
    path: 'codigo-verificacion',
    loadChildren: () => import('./pages/codigo-verificacion/codigo-verificacion.module').then( m => m.CodigoVerificacionPageModule),
    canActivate:[CodigoVerificacionGuard]
  },
  {
    path: 'new-password',
    loadChildren: () => import('./pages/new-password/new-password.module').then( m => m.NewPasswordPageModule),
    canActivate:[CodigoVerificacionGuard]
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }

  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
