import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ModalController } from '@ionic/angular';
import { ModalUserRegPage } from '../../pages/modal-user-reg/modal-user-reg.page';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home-regis',
  templateUrl: './home-regis.component.html',
  styleUrls: ['./home-regis.component.scss'],
})
export class HomeRegisComponent implements OnInit {

  perfil:any;
  usuarios:any[];
  usuariosB:any[];
  busqueda:boolean=false;
  constructor(
    private userService:UsuariosService,
    private modalController:ModalController,
    private authService:AuthService
  ) {
    
    this.authService.perfil().subscribe(
      res=>{      
        this.perfil=res;
        this.traerUsuarios();
      }
    )
  }
  ngOnInit() {}

  traerUsuarios(){  
    this.userService.getUsers(this.perfil.id).subscribe(
      (res:any)=>{
        this.usuarios=res;  
      }
    )
  }
 

  buscar(id){
    this.usuariosB=[];
    this.usuarios.forEach(user => {
      if(user.numero_identificacion==id){
        this.usuariosB.push(user)
      }
    });    
    this.busqueda=true;
  }

  async abrirModal(usuario){
    const modal = await this.modalController.create({
      component: ModalUserRegPage,
      componentProps:{
        usuario
      }
    });
    await modal.present();
  }

  imagen(usuario){
    const images: string = usuario.url_imagen;
    if (images) {
      const imagenes = images.split(',');
      
      return 'http://'+imagenes[0];
    }else{
      return '../../../assets/icon/lado2.jpg';
    }
  }

}
