import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.page.html',
  styleUrls: ['./modal-user.page.scss'],
})
export class ModalUserPage implements OnInit {

  @Input() usuario;
  imagenes:string[];
  constructor(
    private modalController:ModalController
  ) { }

  ngOnInit() {
    const images:string=this.usuario.url_imagen;
    if(images){
      this.imagenes = images.split(',');
    }
  }
  cerrar(){
    this.modalController.dismiss();
  }
  imagen(imagen:string){
    return 'http://'+imagen;
  } 
}
