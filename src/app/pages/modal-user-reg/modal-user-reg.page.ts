import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-user-reg',
  templateUrl: './modal-user-reg.page.html',
  styleUrls: ['./modal-user-reg.page.scss'],
})
export class ModalUserRegPage implements OnInit {

  @Input() usuario;
  imagenes:string[];
  constructor(
    private modalController:ModalController,
    private userService:UsuariosService,
    private router:Router
  ) { }

  ngOnInit() {
    const images:string=this.usuario.url_imagen;
    if(images){
      this.imagenes = images.split(',');
    }
    
  }

  cerrarD(){
    this.modalController.dismiss();
  }

  cerrar(){
    this.router.navigate([`user/update-user/${this.usuario.id}`])
    this.modalController.dismiss();
  }
  activar(){
    this.usuario.estado="true";
    this.userService.updateUser(this.usuario).subscribe(
      res=>{
        
      }
    )
  }
  desactivar(){
    this.usuario.estado="false";
    
    
    this.userService.updateUser(this.usuario).subscribe(
      res=>{
          
      }
    )
  }
  imagen(imagen:string){
    return 'http://'+imagen;
  }
}
