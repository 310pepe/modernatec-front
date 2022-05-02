import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
//* -> Importacion del form
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  
  protected alerta:HTMLIonAlertElement;
  //* -> Implementacion de propiedad del formGroup
  public login_form: FormGroup

  constructor(
    //* -> propiedad privada que dara las propiedades al grup
    private fb : FormBuilder,
    //* -> Inyeccion del servicio 
    private authService:AuthService,
   // impotación del controlador de alertas
   private alertController: AlertController,
   //importación del controlador de loading
   public loadingController: LoadingController,
   //importacion del router
   private router:Router,
  ) {  }
  
  ngOnInit() {
    //construcción del formulario
    this.loadFormLogin()
  }

  // retorna si el campo valido está valido o no
  get emailNoValido(){
    return this.login_form.get('email').invalid && this.login_form.get('email').touched
  }
  //retorna si el campo password se ha ingresado
  get passNoValido(){
    return this.login_form.get('password').invalid && this.login_form.get('password').touched
  }

  //* -> Metodo que armara y cargara el formulario reactivo
  loadFormLogin() {
    this.login_form = this.fb.group({
      //* -> Extructura { propiedad: [ tipo_campo&&valor, [ validadores ] ] }
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required ] ]

    })
  }

  //* -> metodo que enviara la peticion
  async submitPost() {
    // http://127.0.0.1:8000/api/auth/login

    if (this.login_form.invalid){
      return Object.values(this.login_form.controls).forEach(control=>{
        control.markAsTouched();
      })
    }
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Validando'
    });
    await loading.present();
    this.authService.login(this.login_form.value).subscribe(
      async resp => {
        
        if(resp.error){
          this.alerta = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Inautorizado',
            buttons:['ok']
          });
          loading.dismiss();
          await this.alerta.present();
        }else if(resp.message){
          this.alerta = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Correo no confirmado',
            message:'Por favor confirme su correo, se ha enviado un email para su confirmación',
            buttons:['ok']
          });
          loading.dismiss();
          await this.alerta.present();
        }else{
          this.alerta = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'credenciales validas',
            message: 'Bienvenido',
            backdropDismiss:false
          });
          loading.dismiss();
          await this.alerta.present();
          setTimeout(async() => {
            await this.alerta.dismiss();
            this.authService.perfil().subscribe(
              (resp:any)=>{
                
                switch (resp.rol) {
                  case 1:
                    this.router.navigate(['/user/admin-regis'],{replaceUrl:true});
                    break;
                  case 2:
                    this.router.navigate(['/user/admin-home'],{replaceUrl:true});
                    break;
                  case 3:
                    this.router.navigate(['/user/home-seg'],{replaceUrl:true});
                    break;
                }
              }
            )
          }, 1500);
        }
        
        
        
        
      }, async err => {
        
        this.alerta = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'credenciales no validas',
          message: 'Verifique sus datos',
          buttons:['ok']
        });
        loading.dismiss();
        await this.alerta.present();
        return Object.values(this.login_form.controls).forEach(control=>{
          control.markAsTouched();
        })
        
      }
    )
  }

}
