import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CitasService } from '../../services/citas.service';
import { UsuariosService } from '../../services/usuarios.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-update-cita',
  templateUrl: './update-cita.component.html',
  styleUrls: ['./update-cita.component.scss'],
})
export class UpdateCitaComponent implements OnInit {

  changeImg: boolean = false;
  load: boolean = false;
  usuario: any;
  citaForm: FormGroup
  cita: any;
  urlImg;
  //foto del visitante
  img: File;
  //preview de la imagen
  preview: any[] = [];
  constructor(
    private routerAc: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private citasService: CitasService,
    private userService: UsuariosService,
    private alertCtr: AlertController,
    private loadingCtr: LoadingController
  ) {

    routerAc.params.subscribe(
      params => {
        this.citasService.getCita({ codigo_cita: params.id }).subscribe(
          (resp: any) => {
            this.urlImg = `http://${resp.url_imagen}`
            this.cita = resp;
            this.userService.getUser(this.cita.numero_identificacion).subscribe(
              res => {
                this.usuario = res[0];
                this.load = true
                this.loadForm();
              }
            )
          }
        )
      }
    )

  }

  loadForm() {
    this.citaForm = this.fb.group({
      numero_identificacion: [{ value: this.usuario.numero_identificacion, disabled: true }],
      telefono: [{ value: this.usuario.telefono, disabled: true }],
      name: [{ value: this.usuario.name, disabled: true }],
      apellidos: [{ value: this.usuario.apellidos, disabled: true }],
      correo_invitado: [{ value: this.cita.correo_invitado, disabled: true }],
      area: [this.cita.area, [Validators.required]],
      correo_solicitante: [this.cita.correo_solicitante, [Validators.required, Validators.email]],
      fecha: [this.cita.fecha, [Validators.required]],
      hora: [this.cita.hora, [Validators.required]],
      codigo_cita: [{ value: this.cita.codigo_cita, disabled: true }, Validators.required]
    })
  }
  ngOnInit() { }

  //validar que el campo esté valido
  get correo_solicitanteNoValido() {
    return this.citaForm.get('correo_solicitante').invalid && this.citaForm.get('correo_solicitante').touched
  }
  //validar que el campo esté valido
  get areaNoValido() {
    return this.citaForm.get('area').invalid && this.citaForm.get('area').touched
  }
  //validar que el campo esté valido
  get fechaNoValido() {
    return this.citaForm.get('fecha').invalid && this.citaForm.get('fecha').touched
  }
  //validar que el campo esté valido
  get horaNoValido() {
    return this.citaForm.get('hora').invalid && this.citaForm.get('hora').touched
  }
  //validar que los campos esten correctos
  get imgNoValido() {
    return this.citaForm.get('img').invalid && this.citaForm.get('img').touched
  }

  async actualizar() {
    //verficar que todos los campos esten validos
    if (this.citaForm.invalid) {
      return Object.values(this.citaForm.controls).forEach(control => {
        control.markAsTouched();
      })
    }
    console.log(this.citaForm);

    const loading = await this.loadingCtr.create({
      message: 'Actualizando cita'
    });

    await loading.present();

    if (
      this.citaForm.value.area == this.cita.area &&
      this.citaForm.value.correo_solicitante == this.cita.correo_solicitante &&
      this.citaForm.value.fecha == this.cita.fecha &&
      this.citaForm.value.hora == this.cita.hora &&
      !this.citaForm.value.img
    ) {
      const alert = await this.alertCtr.create({
        message: 'No se han hecho cambios a la cita',
        buttons: ['ok']
      });
      await loading.dismiss();
      await alert.present();
    } else {
      const alert = await this.alertCtr.create({
        message: 'Se ha actualizado correctamente la cita',
        backdropDismiss: false
      })
      this.cita.area = this.citaForm.value.area;
      this.cita.correo_solicitante = this.citaForm.value.correo_solicitante;
      this.cita.fecha = this.citaForm.value.fecha;
      this.cita.hora = this.citaForm.value.hora;
      this.citasService.updateCita(this.cita).subscribe(
        async res => {
          if (this.img) {
            this.citasService.updateFotoCita(this.img, this.cita.codigo_cita).subscribe(
              async resp => {
                await loading.dismiss();
                await alert.present();
                setTimeout(async () => {
                  await alert.dismiss();
                  this.router.navigate(['/user/citas'], { replaceUrl: true });
                }, 3000);
              },
              err => {
                console.log(err);
                
              }
            )
          } else {
            await loading.dismiss();
            await alert.present();
            setTimeout(async () => {
              await alert.dismiss();
              this.router.navigate(['/user/citas'], { replaceUrl: true });
            }, 3000);
          }



        }
      )
    }
  }

  async delete() {
    const loading = await this.loadingCtr.create({
      message: 'Borrando cita'
    });

    await loading.present();

    const alert = await this.alertCtr.create({
      message: 'Se ha eliminado correctamente la cita',
      backdropDismiss: false
    });
    this.citasService.deleteFotoCita(this.cita.codigo_cita).subscribe(
      async resp => {
        this.citasService.deleteCita({ id: this.cita.id }).subscribe(
          async res => {
            await loading.dismiss();
            await alert.present();
            setTimeout(async () => {
              await alert.dismiss();
              this.router.navigate(['/user/citas'], { replaceUrl: true });
            }, 3000);
          }
        )
      },
      err => {
        console.log(err);
        
      }
    )
   
  }
  cambiarImagen(cambiar: boolean) {
    if (cambiar) {
      this.citaForm.addControl('img', new FormControl('', Validators.required));
      this.changeImg = true;
    } else {
      this.citaForm.removeControl('img')
      this.changeImg = false;
    }
  }
  agregarImagen(event, posicion) {

    const reader = new FileReader();
    this.img = event.files[0];
    reader.readAsDataURL(event.files[0]);

    reader.onload = () => {
      this.preview[posicion] = reader.result;
    }
  }
}
