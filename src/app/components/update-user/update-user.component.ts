import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {

  load: boolean = false;
  id: string = '';
  contrato;
  createContract: boolean = false;
  imagenes: string[];
  usuario: any = [] = [];
  userForm: FormGroup;
  constructor(
    private routerAc: ActivatedRoute,
    private userService: UsuariosService,
    private fb: FormBuilder,
    private router: Router,
    private loadingCtr: LoadingController,
    private alertCtr: AlertController
  ) {
    this.routerAc.params.subscribe(
      (params) => {
        this.id = params.id
        this.userService.getUser(this.id).subscribe(
          async (res) => {
            this.usuario = res;
            const images: string = this.usuario[0].url_imagen;
            if (images) {
              this.imagenes = images.split(',');
            }

            if (this.usuario[0].id_contrato != null) {

              userService.getContrato({ id: this.usuario[0].id_contrato }).subscribe(
                (resp: any) => {
                  this.contrato = resp.Contrato;
                  this.loadForm();
                  this.load = true;
                }
              )
            } else {
              this.loadForm();
              this.load = true;

            }
          }
        )
      });



  }

  ngOnInit() { }


  getUser(id) {
    this.userService.getUser(id).subscribe(
      async (res) => {
        this.usuario = res;

      }
    )
  }
  loadForm() {
    this.userForm = this.fb.group({
      name: [this.usuario[0].name, [Validators.required, Validators.minLength(4)]],
      apellidos: [this.usuario[0].apellidos, [Validators.required, Validators.minLength(4)]],
      numero_identificacion: [this.usuario[0].numero_identificacion, [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(5)]],
      telefono: [this.usuario[0].telefono, [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(10), Validators.maxLength(10)]],
      email: [this.usuario[0].email, [Validators.required, Validators.email]],
      rol: [this.usuario[0].rol, [Validators.required]],
      id_contratoA: [{ value: this.contrato?.id_contrato, disabled: true }],
      fecha_inicioA: [{ value: this.contrato?.fecha_inicio, disabled: true }],
      fecha_finA: [{ value: this.contrato?.fecha_fin, disabled: true }]
    })
  }

  //validar que los campos esten correctos
  get nameNoValido() {
    return this.userForm.get('name').invalid && this.userForm.get('name').touched
  }
  //validar que los campos esten correctos
  get apellidosNoValido() {
    return this.userForm.get('apellidos').invalid && this.userForm.get('apellidos').touched
  }
  //validar que los campos esten correctos
  get numero_identificacionNoValido() {
    return this.userForm.get('numero_identificacion').invalid && this.userForm.get('numero_identificacion').touched
  }
  //validar que los campos esten correctos
  get telefonoNoValido() {
    return this.userForm.get('telefono').invalid && this.userForm.get('telefono').touched
  }
  //validar que los campos esten correctos
  get emailNoValido() {
    return this.userForm.get('email').invalid && this.userForm.get('email').touched
  }
  //validar que los campos esten correctos
  get rolNoValido() {
    return this.userForm.get('rol').invalid && this.userForm.get('rol').touched
  }
  //validar que los campos esten correctos
  get id_contratoNoValido() {
    return this.userForm.get('id_contrato').invalid && this.userForm.get('id_contrato').touched
  }
  //validar que los campos esten correctos
  get fecha_inicioNoValido() {
    return this.userForm.get('fecha_inicio').invalid && this.userForm.get('fecha_inicio').touched
  }
  //validar que los campos esten correctos
  get fecha_finNoValido() {
    return this.userForm.get('fecha_fin').invalid && this.userForm.get('fecha_fin').touched
  }

  crearContrato(crear) {
    //verificar si se quire crear un nuevo contrato
    if (crear) {
      this.userForm.addControl('id_contrato', new FormControl('', Validators.required));
      this.userForm.addControl('fecha_inicio', new FormControl('', Validators.required));
      this.userForm.addControl('fecha_fin', new FormControl('2040-12-31', Validators.required));
      this.createContract = true;

    } else {
      this.userForm.removeControl('id_contrato');
      this.userForm.removeControl('fecha_inicio');
      this.userForm.removeControl('fecha_fin');
      this.createContract = false;
    }
  }

  async actualizar() {
    //verficar que todos los campos esten validos
    if (this.userForm.invalid) {
      return Object.values(this.userForm.controls).forEach(control => {
        control.markAsTouched();
      })
    }

    //creacion del componente loading
    const loading = await this.loadingCtr.create({
      message: 'Actualizando usuario'
    });

    //mostrar componente loading
    await loading.present();
    //Se valida si se van a realizar cambios
    if (
      this.usuario[0].numero_identificacion == this.userForm.value.numero_identificacion &&
      this.usuario[0].name == this.userForm.value.name &&
      this.usuario[0].apellidos == this.userForm.value.apellidos &&
      this.usuario[0].email == this.userForm.value.email &&
      this.usuario[0].rol == this.userForm.value.rol &&
      this.usuario[0].telefono == this.userForm.value.telefono &&
      !this.userForm.value.id_contrato
    ) {
      const alert = await this.alertCtr.create({
        message: 'No se han hecho cambios al usuario',
        buttons: ['ok']
      });
      await loading.dismiss();
      await alert.present();
    } else {
      this.userService.getUserId({ numero_identificacion: this.userForm.value.numero_identificacion }).subscribe(
        async resp => {
          if (resp && this.usuario[0].numero_identificacion != this.userForm.value.numero_identificacion) {
            const alert = await this.alertCtr.create({
              message: 'Ya existe un usuario con ese número de identificación',
              buttons: ['ok']
            });
            await loading.dismiss();
            await alert.present();
          } else {
            this.userService.getUserEmail(this.userForm.value.email).subscribe(
              async resp => {
                if (resp.length > 0 && this.usuario[0].email != this.userForm.value.email) {
                  const alert = await this.alertCtr.create({
                    message: 'Ya existe un usuario con ese email',
                    buttons: ['ok']
                  });
                  await loading.dismiss();
                  await alert.present();
                } else {
                  //verificar si se quire crear un nuvo contrato
                  if (this.userForm.value.id_contrato) {
                    //extraer la información del contrato del formulario
                    const { fecha_inicio, fecha_fin, id_contrato } = this.userForm.value
                    //establecer la informacion para enviarla
                    const dataContrato = {
                      fecha_fin,
                      fecha_inicio,
                      id_contrato
                    }
                    //llamar al servicio para crear el nuevo contrato
                    this.userService.createContrato(dataContrato).subscribe(
                      (resp: any) => {
                        const values = this.userForm.value
                        this.usuario[0].name = values.name.toUpperCase();
                        this.usuario[0].apellidos = values.apellidos.toUpperCase();
                        this.usuario[0].id_contrato = resp.id_contrato.id;
                        this.usuario[0].email = values.email
                        this.usuario[0].numero_identificación = values.numero_identificación
                        this.usuario[0].rol = values.rol
                        this.usuario[0].telefono = values.telefono
                        //llamar al servicio para actualizar el usuario
                        this.userService.updateUser(this.usuario[0]).subscribe(
                          async resp => {
                            const alert = await this.alertCtr.create({
                              message:'Se ha actualizado correctamente el usuario',
                              backdropDismiss:false
                            });
                            await loading.dismiss();
                            await alert.present();
                            setTimeout(async() => {
                              await alert.dismiss();
                              this.router.navigate([`/user/admin-regis`],{replaceUrl:true});
                            }, 3000);
                          }
                        )
                      }
                    )

                  } else {
                    const values = this.userForm.value
                    this.usuario[0].name = values.name.toUpperCase();
                    this.usuario[0].apellidos = values.apellidos.toUpperCase();
                    this.usuario[0].email = values.email
                    this.usuario[0].numero_identificación = values.numero_identificación
                    this.usuario[0].rol = values.rol
                    this.usuario[0].telefono = values.telefono
                    //llamar al servicio para actualizar el usuario
                    this.userService.updateUser(this.usuario[0]).subscribe(
                      async resp => {
                        const alert = await this.alertCtr.create({
                          message:'Se ha actualizado correctamente el usuario',
                          backdropDismiss:false
                        });
                        await loading.dismiss();
                        await alert.present();
                        setTimeout(async() => {
                          await alert.dismiss();
                          this.router.navigate([`/user/admin-regis`],{replaceUrl:true});
                        }, 3000);
                      }
                    )

                  }
                }
              }
            )

          }

        }
      )

    }

   
  }
  imagen(imagen) {
    return 'http://' + imagen;
  }
}
