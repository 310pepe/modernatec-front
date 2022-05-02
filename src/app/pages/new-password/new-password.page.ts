import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {

  email:string;
  formulario:FormGroup
  constructor(
    private fb:FormBuilder,
    private authService:AuthService,
    private router:Router,
    private loadingCtr:LoadingController,
    private alertCtr:AlertController
  ) {
    this.email=localStorage.getItem('email-verified');
    this.loadForm();
  }


  ngOnInit() {
  }

  loadForm(){
    
    this.formulario=this.fb.group({
      password:['',[Validators.required]],
      password1:['',[Validators.required]]
    },{
      validators:[this.passwordIgual('password','password1')]
    })
  }

  //creacion funcion que valida campos
  passwordIgual( password:string, password1:string ){
    return (formGroup:FormGroup)=>{
      const passControl = formGroup.controls[password];
      const pass1Control = formGroup.controls[password1];
  
      if (passControl.value === pass1Control.value){
        pass1Control.setErrors(null);
      }else{
        pass1Control.setErrors({noEsIgual:true});
      }

    }
  }

  async changePass(){    
    //verificar que el formulario sea valido
    if (this.formulario.invalid){
      return Object.values(this.formulario.controls).forEach(control=>{
        control.markAsTouched();
      })
    }

    const loading = await this.loadingCtr.create({
      message:'Cambiando Contraseña'
    });

    await loading.present();
    this.formulario.value.email=localStorage.getItem('email-verified')
    this.authService.changePass( this.formulario.value ).subscribe(
      async(res:any)=>{
                
        if(res.message=='se cambio la contraseña'){
          this.formulario.reset();
          const alert= await this.alertCtr.create({
            message:'Se ha restablecido la contraseña correctamente'
          });
          await loading.dismiss();
          await alert.present();
          setTimeout(async() => {
            alert.dismiss();
            localStorage.removeItem('email-verified')
            this.router.navigate(['/login'],{replaceUrl:true});
          }, 2000);
        }else{
          this.formulario.reset();
          const alert= await this.alertCtr.create({
            message:'No se ha podido restablecer su contraseña',
            buttons:['ok']
          });
          await loading.dismiss();
          await alert.present();
        }  
      }
    )

    
  }

}
