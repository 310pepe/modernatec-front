import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  protected alerta:HTMLIonAlertElement;
  //* -> Implementacion de propiedad del formGroup
  public register_form: FormGroup


  constructor(//* -> propiedad privada que dara las propiedades al grup
    private fb : FormBuilder,
    //* -> Inyeccion del servicio 
    private authService : AuthService,
      // impotación del controlador de alertas
      private alertController: AlertController,
      //importación del controlador de loading
      public loadingController: LoadingController,
      //importacion del router
      private router:Router,
    
    ) { }

  ngOnInit() {
    
    this.loadFormRegister()
    
    
  }

  // retorna si el campo valido está valido o no
  get nombreNoValido(){
    return this.register_form.get('name').invalid && this.register_form.get('name').touched
  }
  // retorna si el campo valido está valido o no
  get apellidoNoValido(){
    return this.register_form.get('apellidos').invalid && this.register_form.get('apellidos').touched
  }
  // retorna si el campo valido está valido o no
  get numeroIdNoValido(){
    return this.register_form.get('numero_identificacion').invalid && this.register_form.get('numero_identificacion').touched
  }
  // retorna si el campo valido está valido o no
  get telefonoNoValido(){
    return this.register_form.get('telefono').invalid && this.register_form.get('telefono').touched
  }
  // retorna si el campo valido está valido o no
  get emailNoValido(){
    return this.register_form.get('email').invalid && this.register_form.get('email').touched
  }

  
  //* -> Metodo que armara y cargara el formulario reactivo
  loadFormRegister() {
    this.register_form = this.fb.group({
      //* -> Extructura { propiedad: [ tipo_campo&&valor, [ validadores ] ] }
      name: [ '', [ Validators.required ] ],
      apellidos: [ '', [ Validators.required ] ],
      telefono: [ '', [ Validators.required,Validators.pattern('[0-9]+'),Validators.minLength(10),Validators.maxLength(10)] ],
      email : [ '', [ Validators.required,Validators.email ] ],
      numero_identificacion: [ '', [Validators.required,Validators.pattern('[0-9]+'),Validators.minLength(5)] ]



    })
  }

  validCamps( campo: string ) {
    if (!this.register_form.get(campo).invalid || !this.register_form.get(campo).touched) {


      return false
    }else {

      return true
    }
  }

  //* -> metodo que generara un 

  async submitPost() {  
    if (this.register_form.invalid){
      return Object.values(this.register_form.controls).forEach(control=>{
        control.markAsTouched();
      })
    }
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Guardando Datos'
    });
    await loading.present();
    this.register_form.value.name=this.register_form.value.name.toUpperCase();
    this.register_form.value.apellidos=this.register_form.value.apellidos.toUpperCase();

    this.authService.register(this.register_form.value).subscribe(
      async (resp:any)=>{  
        if(!resp.message1){
          this.alerta = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'No se ha registrado',
            message: 'Al parecer ya hay una cuenta con ese correo o numero de identificación'
          });
          loading.dismiss();
          await this.alerta.present();
          
        }else{
          this.alerta = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Se ha registrado correctamente',
            message: 'Se envió un email para realizar la confirmación de la cuenta',
            buttons:['ok']
          });
          loading.dismiss();
          await this.alerta.present();
          setTimeout(async() => {
            await this.alerta.dismiss();
            this.router.navigate(['/login'],{replaceUrl:true});
          }, 5000);
        }
        
      },
      async err=>{
        this.alerta = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Error al registrarse',
          message: 'Por favor intente más tarde',
          buttons:['ok']
        });
        loading.dismiss();
        await this.alerta.present();
      }
    )
  }
  
}
