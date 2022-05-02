import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-password',
  templateUrl: './email-password.page.html',
  styleUrls: ['./email-password.page.scss'],
})
export class EmailPasswordPage implements OnInit {

  formulario:FormGroup;
  constructor(
    private fb:FormBuilder,
    private alertController:AlertController,
    private authService:AuthService,
    private loadingCtrl:LoadingController,
    private router:Router
  ) { }

  ngOnInit() {
    this.loadForm();
  }

  loadForm(){
    this.formulario= this.fb.group({
      email:['',[Validators.required,Validators.email]]
    })
  }

  async verificar(){
    //verificar que el formulario sea valido
    if (this.formulario.invalid){
      return Object.values(this.formulario.controls).forEach(control=>{
        control.markAsTouched();
      })
    }

    const load = await this.loadingCtrl.create(
      {message:'Verificando'}
    )
    
    await load.present();
    
    this.authService.forgotPass(this.formulario.value).subscribe(
      async (res)=>{
        load.dismiss();
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header:'MODERNATEC',
          subHeader: 'Atención',
          message: 'En unos segundos usted recibira un codigo al correo para el cambio de contraseña ',
          backdropDismiss:false
        });   
        localStorage.setItem('email-verified',this.formulario.value.email)
        this.formulario.reset(); 
        await alert.present();        
        setTimeout(async() => {
          await alert.dismiss();
          this.router.navigate(['/codigo-verificacion'],{replaceUrl:true});
        }, 5000);
        
      },
      async (err)=>{
        load.dismiss();
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header:'MODERNATEC',
          subHeader: 'Atención',
          message: 'No se ha podido encontrar un usuario con el correo suministrado',
          buttons: ['OK'],
          backdropDismiss:false
        });    
        await alert.present();
        this.formulario.reset();
      }
    )

    
  }

}
