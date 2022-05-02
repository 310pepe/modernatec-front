import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-codigo-verificacion',
  templateUrl: './codigo-verificacion.page.html',
  styleUrls: ['./codigo-verificacion.page.scss'],
})
export class CodigoVerificacionPage implements OnInit {

  formulario: FormGroup;
  email: string;
  constructor(
    private fb: FormBuilder,
    private loadingCtr: LoadingController,
    private alertCtr: AlertController,
    private authService: AuthService,
    private router: Router,
    private modalCtr: ModalController
  ) {
    //obtener el email guardado
    this.email = localStorage.getItem('email-verified');
    //cargar formulario
    this.loadForm();
  }

  ngOnInit() {
  }

  loadForm() {
    this.formulario = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(20)]]
    })
  }

  async verificarCode() {
    //verificar que el formulario sea valido
    if (this.formulario.invalid) {
      return Object.values(this.formulario.controls).forEach(control => {
        control.markAsTouched();
      })
    }
    //Crear componente cargando
    const load = await this.loadingCtr.create(
      {
        message: 'Verificando'
      }
    )
    //Presentar componente cargando
    await load.present();
    this.formulario.value.email = this.email;
    //llamado al servicio
    this.authService.codeVerific(this.formulario.value).subscribe(
      async(res: any) => {
        if (res.message == 'No conside el codigo para realizar el cambio de contraseña') {
          this.formulario.reset();
          load.dismiss();
          const alert = await this.alertCtr.create({
          cssClass: 'my-custom-class',
          header: 'MODERNATEC',
          subHeader: 'Atención',
          message: 'El código no coincide',
          buttons: ['OK'],
          backdropDismiss: false
        });
        await alert.present();
        } else {
          load.dismiss();
          this.router.navigate(['new-password'], { replaceUrl: true });
        }
      },
      async (err) => {
        this.formulario.reset();
        load.dismiss();
        const alert = await this.alertCtr.create({
          cssClass: 'my-custom-class',
          header: 'MODERNATEC',
          subHeader: 'Atención',
          message: 'El código no coincide',
          buttons: ['OK'],
          backdropDismiss: false
        });
        await alert.present();

      }
    )


  }

}
