import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { ModalCitaPage } from '../../pages/modal-cita/modal-cita.page';
import { CitasService } from '../../services/citas.service';

@Component({
  selector: 'app-codigo-cita',
  templateUrl: './codigo-cita.component.html',
  styleUrls: ['./codigo-cita.component.scss'],
})
export class CodigoCitaComponent implements OnInit {

  formulario:FormGroup;
  constructor(
    private fb:FormBuilder,
    private modalctr:ModalController,
    private citasService:CitasService,
    private alertCtr:AlertController
  ) { }

  ngOnInit() {
    this.loadForm();
  }

  loadForm(){
    this.formulario= this.fb.group({
      codigo_cita:['',[Validators.required,Validators.minLength(5),Validators.maxLength(6)]]
    })
  }

  //validar que los campos esten correctos
  get codeNoValido(){
    return this.formulario.get('codigo_cita').invalid && this.formulario.get('codigo_cita').touched
  }

  async verificar(){
    //verficar que todos los campos esten validos
    if (this.formulario.invalid){
      return Object.values(this.formulario.controls).forEach(control=>{
        control.markAsTouched();
      })
    }

    this.citasService.getCita(this.formulario.value).subscribe(
      async resp=>{              
        this.formulario.reset();
        if(resp){
          const modal = await this.modalctr.create({
            component:ModalCitaPage,
            componentProps: {
              'cita':resp
            }
          });
          await modal.present();
        }else{
          const alert = await this.alertCtr.create({
            message:'No hay ninguna cita con ese código',
            buttons:['ok']
          })
          await alert.present();
        }
        
      }
    )

    
  }

}
