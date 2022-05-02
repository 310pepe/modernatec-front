import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  name:string;
  opciones:any[]

  constructor(
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit() {
    this.authService.perfil().subscribe(
      (res:any)=>{
        this.name=res.name;
        switch (res.rol) {
          case 1:
            this.opciones=[
              {
                name:'Usuarios',
                url:'/user/admin-regis',
                icon:'person-circle'
              },
              {
                name:'Citas',
                url:'/user/citas',
                icon:'document-text'
              }
            ]
            break;
          case 2:
            this.opciones=[
              {
                name:'Reportes',
                url:'/user/admin-home',
                icon: 'document-text'
              },
              {
                name:'Usuarios',
                url:'/user/admin-users',
                icon:'person-circle'
              }
            ]
            break;
          case 3:
            this.opciones=[
                {
                  name:'Inicio',
                  url:'/user/home-seg',
                  icon: 'home'
                },
                {
                  name:'Visitante',
                  url:'/user/verificar-cita',
                  icon:'people'
                }
              ]
            break;
        }
      }
    )
  }
  cerrarSesion(){
    localStorage.removeItem('token');
    this.router.navigate(['/login'],{replaceUrl:true});
  }

}
