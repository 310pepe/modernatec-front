import { Component, Input, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { RegistroService } from '../../services/registro.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-user-seg',
  templateUrl: './modal-user-seg.page.html',
  styleUrls: ['./modal-user-seg.page.scss'],
})
export class ModalUserSegPage implements OnInit {

  @Input()persona;
  @Input()id;
  imagenes;
  user;
  fecha:Date;
  ultimoRegistro;
  load:boolean=false;
  constructor(
    private userService:UsuariosService,
    private registroService:RegistroService,
    private modalCtr:ModalController
  ) {
    this.fecha= new Date();
  }

  close(){
    this.modalCtr.dismiss();
  }

  ngOnInit() {
    this.userService.getUserId({numero_identificacion:this.id}).subscribe(
      res=>{
        this.user=res;
        const images:string=this.user.url_imagen;
        if(images){
          this.imagenes = images.split(',');
        }
        this.registroService.ultimoRegistro({id:this.user.id,token:''}).subscribe(
          resp=>{
            this.ultimoRegistro=resp;  
            this.load=true;  
          }
        )
      },
      err=>{

      }
    )
    
    
  }
  imagen(imagen:string){
    return 'http://'+imagen;
  }

  registrar(){
    
    
    if(!this.ultimoRegistro.Ultimo_registro || this.ultimoRegistro.Ultimo_registro.hora_salida){

      const fechaEnv= `${this.fecha.getFullYear()}-${this.fecha.getMonth()+1}-${this.fecha.getDate()}`;
      
      
      const hora =`${this.fecha.getHours()}:${this.fecha.getMinutes()}:${this.fecha.getSeconds()}`;
      
      
      
      this.registroService.registroEntrada({fecha:fechaEnv,token:'',hora_ingreso:hora,numero_identificacion:this.user.id}).subscribe(
        resp=>{
          this.modalCtr.dismiss();
        }
      )
    }else{
      const hora =`${this.fecha.getHours()}:${this.fecha.getMinutes()}:${this.fecha.getSeconds()}`;

      this.registroService.registroSalida({hora_salida:hora,numero_identificacion:this.user.id,token:''}).subscribe(
        resp=>{
          this.modalCtr.dismiss();
        }
      )
    }
  }

}
