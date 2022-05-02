import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-update-perfil',
  templateUrl: './update-perfil.component.html',
  styleUrls: ['./update-perfil.component.scss'],
})
export class UpdatePerfilComponent implements OnInit {

  load: boolean = false;
  usuario;
  formulario: FormGroup;
  constructor(
    private authservice: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UsuariosService,
    private loadingCtr: LoadingController,
    private alertCtr: AlertController
  ) {
    authservice.perfil().subscribe(
      res => {
        this.usuario = res;
        this.loadForm();
        this.load = true;
      }
    )
  }

  //funcion que carga el formulario
  loadForm() {
    this.formulario = this.fb.group({
      name: [{ value: this.usuario.name, disabled: true },],
      apellidos: [{ value: this.usuario.apellidos, disabled: true }],
      telefono: [this.usuario.telefono, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: [this.usuario.email, [Validators.required, Validators.email]],
      numero_identificacion: [{ value: this.usuario.numero_identificacion, disabled: true }],
      rol: [{ value: this.usuario.rol, disabled: true }]
    })
  }

  //validar que los campos esten correctos
  get emailNoValido() {
    return this.formulario.get('email').invalid && this.formulario.get('email').touched
  }
  //validar que los campos esten correctos
  get telefonoNoValido() {
    return this.formulario.get('telefono').invalid && this.formulario.get('telefono').touched
  }

  //funcion para actualizar el perfil
  async actualizarPerfil() {
    //verficar que todos los campos esten validos
    if (this.formulario.invalid) {
      return Object.values(this.formulario.controls).forEach(control => {
        control.markAsTouched();
      })
    }
    const loading = await this.loadingCtr.create({
      message: 'Actulizando perfil'
    })
    await loading.present();

    if (this.usuario.telefono == this.formulario.value.telefono && this.usuario.email == this.formulario.value.email) {
      const alert = await this.alertCtr.create({
        message: 'No se han hecho cambios en el perfil',
        buttons: ['ok']
      });
      await loading.dismiss();
      await alert.present();
    } else {
      this.userService.getUserEmail(this.formulario.value.email).subscribe(
        async resp => {
          if (resp.length > 0 && this.usuario.email != this.formulario.value.email) {
            const alert = await this.alertCtr.create({
              message: 'Ya existe un usuario con ese email',
              buttons: ['ok']
            });
            await loading.dismiss();
            await alert.present();
          } else {
            this.usuario.telefono = this.formulario.value.telefono;
            this.usuario.email = this.formulario.value.email;
            this.formulario.reset();
            this.userService.updatePerfil(this.usuario).subscribe(
              async res => {
                const alert = await this.alertCtr.create({
                  message:'Perfil actualizado correctamente',
                  backdropDismiss:false
                });
                await loading.dismiss();
                await alert.present();
                setTimeout(async() => {
                  await alert.dismiss();
                  this.router.navigate(['/user/perfil'], { replaceUrl: true });
                }, 3000);
              }
            )
          }
        }
      )

    }
  }

  ngOnInit() { }

}
