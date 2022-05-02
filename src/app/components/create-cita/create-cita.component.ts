/**
 * @author Jose Bermudez 
 * 
 */
//importaciones necesarias
import { Component, OnInit } from '@angular/core';
//formularios reactivos de angular
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

//servicios
import { CitasService } from '../../services/citas.service';
import { UsuariosService } from '../../services/usuarios.service';
//router
import { Router } from '@angular/router';
//controladores de alertas y progress
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-create-cita',
  templateUrl: './create-cita.component.html',
  styleUrls: ['./create-cita.component.scss'],
})
export class CreateCitaComponent implements OnInit {

  //codigos de las citas 
  private codigos;
  //codigo unico de cada cita
  codigo: number
  //usuario al que se la asignara cita
  usuario;
  //formulario
  citaForm: FormGroup
  //foto del visitante
  img: File;
  //preview de la imagen
  preview: any[] = [];
  load:boolean=false;
  constructor(
    private fb: FormBuilder,//inicializacion del constructor de formularios
    private citasService: CitasService,//inicializacion del serivicio de citas
    private userService: UsuariosService,//inicializacion del servicio de usuarios
    private router: Router,//inicializacion del router
    private alertCtr: AlertController,//inicializacion del controlador de alertas
    private loadingCtr: LoadingController//inicializacion del controlador de progress
  ) {
    
  }

  ngOnInit() {
    this.citasService.getCodigosCitas().subscribe(
      resp => {
        this.codigos = resp;
        this.loadForm();
        this.load=true;
      },
      err => {

      }
    )
  }


  //cargar formulario
  loadForm() {
    //creacion del formulario
    this.citaForm = this.fb.group({
      //form control para el numero de identificacion
      numero_identificacion: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(5)]],
      //form control para el telefono
      telefono: [{ value: '', disabled: true }, [Validators.required]],
      //form control para el nombre
      name: [{ value: '', disabled: true }, [Validators.required]],
      //form control para los apellidos
      apellidos: [{ value: '', disabled: true }, [Validators.required]],
      //form control para el correo del invitado
      correo_invitado: [{ value: '', disabled: true }, [Validators.required]],
      //form control para el area
      area: ['', [Validators.required, Validators.pattern('[a-zA-Z ]+')]],
      //form control para el correo del solicitante
      correo_solicitante: ['', [Validators.required, Validators.email]],
      //form control para la fecha de la cita
      fecha: ['', [Validators.required]],
      //form control para la hora de la cita
      hora: ['', [Validators.required]],
      //form control para el codigo de la cita
      codigo_cita: new FormControl({ value: '', disabled: true }, Validators.required),
      //form control para la imagen de la cita
      img: [, Validators.required]
    })
    do {  
      const dig1 = Math.floor(Math.random() * (9 - 1) + 1);
      const dig2 = Math.floor(Math.random() * (9 - 0) + 0);
      const dig3 = Math.floor(Math.random() * (9 - 0) + 0);
      const dig4 = Math.floor(Math.random() * (9 - 0) + 0);
      const dig5 = Math.floor(Math.random() * (9 - 0) + 0);
      const dig6 = Math.floor(Math.random() * (9 - 0) + 0);
      this.codigo = parseInt(dig1.toString()+dig2.toString()+dig3.toString()+dig4.toString()+dig5.toString()+dig6.toString());
    } while (this.codigos.includes(this.codigo) );
    

    this.citaForm.controls.codigo_cita.setValue(this.codigo);


  }

  //buscar si existe un usuario con el numero de identificación digitado
  buscar() {
    //emplear servicio que busca a una persona por un numero de identificación
    this.userService.getUserId({ numero_identificacion: this.citaForm.value.numero_identificacion }).subscribe(
      (resp: any) => {
        //asignamos el valor de la respuesta a la variable local usuario
        this.usuario = resp;
        //asignamos los valores correspondientes a los campos si se obtiene una respuesta satisfactoria
        this.citaForm.controls.name.setValue(this.usuario?.name)
        this.citaForm.controls.telefono.setValue(this.usuario?.telefono)
        this.citaForm.controls.apellidos.setValue(this.usuario?.apellidos)
        this.citaForm.controls.correo_invitado.setValue(this.usuario?.email)
      }
    )
  }

  //validar que los campos esten correctos
  get numero_identificacionNoValido() {
    return this.citaForm.get('numero_identificacion').invalid && this.citaForm.get('numero_identificacion').touched
  }
  //validar que los campos esten correctos
  get areaNoValido() {
    return this.citaForm.get('area').invalid && this.citaForm.get('area').touched
  }
  //validar que los campos esten correctos
  get correo_solicitanteNoValido() {
    return this.citaForm.get('correo_solicitante').invalid && this.citaForm.get('correo_solicitante').touched
  }
  //validar que los campos esten correctos
  get fechaNoValido() {
    return this.citaForm.get('fecha').invalid && this.citaForm.get('fecha').touched
  }
  //validar que los campos esten correctos
  get horaNoValido() {
    return this.citaForm.get('hora').invalid && this.citaForm.get('hora').touched
  }
  //validar que los campos esten correctos
  get imgNoValido() {
    return this.citaForm.get('img').invalid && this.citaForm.get('img').touched
  }


  //crear cita
  async crearCita() {
    //validar que los campos sean validos
    if (this.citaForm.invalid) {
      return Object.values(this.citaForm.controls).forEach(control => {
        control.markAsTouched();
      })
    }

    const loading = await this.loadingCtr.create({
      message: 'Creando cita',
      backdropDismiss: false
    });

    await loading.present();

    if (this.usuario) {
      this.citaForm.value.name = this.usuario.name;
      this.citaForm.value.telefono = this.usuario.telefono;
      this.citaForm.value.apellidos = this.usuario.apellidos;
      this.citaForm.value.correo_invitado = this.usuario.email;
      this.citaForm.value.telefono = this.usuario.telefono;
      this.citaForm.value.numero_identificacion = this.usuario.id;
      this.citaForm.value.codigo_cita = this.codigo;



      this.citasService.createCita(this.citaForm.value).subscribe(
        async (resp) => {
          this.citasService.createFotoCita(this.img, this.citaForm.value.codigo_cita).subscribe(
            async resp => {
              const alert = await this.alertCtr.create({
                message: 'Se ha creado correctamente la cita',
                backdropDismiss: false
              });

              await loading.dismiss();

              await alert.present();

              setTimeout(async () => {
                await alert.dismiss();
                this.router.navigate(['/user/citas'], { replaceUrl: true });
              }, 3000);
            },
            async err => {
              console.log(err);

              this.citasService.deleteCita({ id: this.citaForm.value.codigo_cita }).subscribe(
                async resp => {
                  this.citaForm.reset();
                  const alert = await this.alertCtr.create({
                    message: 'No se ha podido crear la cita',
                    buttons: ['ok']
                  });
                  await loading.dismiss();
                  await alert.present();
                }
              )
            }
          )



        },
        async err => {
          this.citaForm.reset();
          const alert = await this.alertCtr.create({
            message: 'No se ha podido crear la cita',
            buttons: ['ok']
          });
          await loading.dismiss();
          await alert.present();
        }
      )
    } else {

      const alert = await this.alertCtr.create({
        message: 'No se pueden crear citas para usuarios no registrados',
        buttons: ['ok']
      });
      await loading.dismiss();
      await alert.present();
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
