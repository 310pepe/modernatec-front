import { Component, Input, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { RegistroService } from '../../services/registro.service';
import { ModalController } from '@ionic/angular';
import { CitasService } from '../../services/citas.service';

@Component({
  selector: 'app-modal-cita',
  templateUrl: './modal-cita.page.html',
  styleUrls: ['./modal-cita.page.scss'],
})
export class ModalCitaPage implements OnInit {

  @Input() cita;
  user;
  fecha: Date;
  ultimoRegistro;
  load: boolean = false;
  urlImg;
  constructor(
    private userService: UsuariosService,
    private registroService: RegistroService,
    private modalCtr: ModalController,
    private citasService: CitasService
  ) { }

  ngOnInit() {
    this.urlImg = `http://${this.cita.url_imagen}`
    this.fecha = new Date();
  
    this.userService.getUser(this.cita.numero_identificacion).subscribe(
      resp => {
        this.user = resp[0];
        this.registroService.ultimoRegistro({ id: this.user.id, token: '' }).subscribe(
          resp => {
            this.ultimoRegistro = resp;
            this.load = true;
          }
        )
      }
    )
  }

  close() {
    this.modalCtr.dismiss();
  }

  registrar() {
    if (!this.ultimoRegistro.Ultimo_registro || this.ultimoRegistro.Ultimo_registro.hora_salida) {

      const fechaEnv = `${this.fecha.getFullYear()}-${this.fecha.getMonth() + 1}-${this.fecha.getDate()}`;

      const hora = `${this.fecha.getHours()}:${this.fecha.getMinutes()}:${this.fecha.getSeconds()}`;



      this.registroService.registroEntrada({ fecha: fechaEnv, token: '', hora_ingreso: hora, numero_identificacion: this.user.id }).subscribe(
        resp => {
          this.modalCtr.dismiss();
        }
      )
    } else {
      const hora = `${this.fecha.getHours()}:${this.fecha.getMinutes()}:${this.fecha.getSeconds()}`;

      this.registroService.registroSalida({ hora_salida: hora, numero_identificacion: this.user.id, token: '' }).subscribe(
        resp => {
          this.citasService.deleteFotoCita(this.cita.codigo_cita).subscribe(
            resp => {
              this.citasService.deleteCita({ id: this.cita.id }).subscribe(
                resp => {
                  this.modalCtr.dismiss();
                },
                err => {                  
                  this.modalCtr.dismiss();
                }
              )
            },
            err => {       
              this.citasService.deleteCita({ id: this.cita.id }).subscribe(
                resp => {
                  this.modalCtr.dismiss();
                },
                err => {                  
                  this.modalCtr.dismiss();
                }
              )
            }
          )
        }
      )
    }
  }

}
