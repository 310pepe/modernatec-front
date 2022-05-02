import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.scss'],
})
export class CambiarPasswordComponent implements OnInit {

  formulario:FormGroup;
  usuario;
  constructor(
    private fb:FormBuilder,
    private authService:AuthService,
    private loadingCtr:LoadingController,
    private alertCtr:AlertController,
    private router:Router
  ) { 
    authService.perfil().subscribe(
      resp=>{
        this.usuario=resp;
      }
    )
    //llamar a la funcion que carga el formulario
    this.loadForm();
  }
  
  ngOnInit() {}
  //Cargar formulario
  loadForm(){
    this.formulario=this.fb.group({
      password:['',Validators.required],
      password_update:['',Validators.required],
      password_update1:['',Validators.required]
    },{
      validators:[this.passwordIgual('password_update','password_update1')]
    })
  }
  //validar que los campos esten correctos
  get passNoValido(){
    return this.formulario.get('password').invalid && this.formulario.get('password').touched
  }
  //validar que los campos esten correctos
  get pass1NoValido(){
    return this.formulario.get('password_update').invalid && this.formulario.get('password_update').touched
  }
  //validar que los campos esten correctos
  get pass2NoValido(){
    return this.formulario.get('password_update1').invalid && this.formulario.get('password_update1').touched
  }

  async cambiarPass(){
    if (this.formulario.invalid){
      return Object.values(this.formulario.controls).forEach(control=>{
        control.markAsTouched();
      })
    }

    const loading = await this.loadingCtr.create({
      message:'Cambiando contraseña'
    })

    await loading.present();

    this.formulario.value.email= this.usuario.email;
    
    this.authService.updatePass(this.formulario.value).subscribe(
      async resp=>{
        const alert = await this.alertCtr.create({
          message:'Contraseña actualizada correctamente',
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


}
