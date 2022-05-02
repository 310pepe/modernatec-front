import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  usuario:any;
  load:boolean=false;

  constructor(
    private authService:AuthService
  ) {
    
  }

  

  ngOnInit() {
    
    this.authService.perfil().subscribe(
      res=>{
        this.usuario=res;
        this.load=true;
      }
    )
  }

  imagen(usuario){
    const images: string = usuario.url_imagen;
    if (images) {
      const imagenes = images.split(',');
      
      return 'http://'+imagenes[0];
    }else{
      return './assets/icon/perfil.jpg';
    }
  }

}
