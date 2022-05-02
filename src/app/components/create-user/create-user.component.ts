import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {

  userForm:FormGroup;
  constructor(
    private fb:FormBuilder,
    private userService:UsuariosService,
    private loadingCtr:LoadingController,
    private alertCtr:AlertController,
    private router:Router
  ) { 
    this.loadForm()
  }

  ngOnInit() {}

  loadForm(){
    this.userForm= this.fb.group({
      name:['',[Validators.required,Validators.minLength(4)]],
      apellidos:['',[Validators.required,Validators.minLength(4)]],
      numero_identificacion:['',[Validators.required,Validators.pattern('[0-9]+'),Validators.minLength(5)]],
      telefono:['',[Validators.required,Validators.pattern('[0-9]+'),Validators.minLength(10),Validators.maxLength(10)]],
      email:['',[Validators.required,Validators.email]],
      rol:['',[Validators.required]],
      id_contrato:['',[Validators.required]],
      fecha_inicio:['',[Validators.required]],
      fecha_fin:['2040-12-31',[Validators.required]]
    })
  }

  //validar que los campos esten correctos
  get nameNoValido(){
    return this.userForm.get('name').invalid && this.userForm.get('name').touched
  }
  //validar que los campos esten correctos
  get apellidosNoValido(){
    return this.userForm.get('apellidos').invalid && this.userForm.get('apellidos').touched
  }
  //validar que los campos esten correctos
  get numero_identificacionNoValido(){
    return this.userForm.get('numero_identificacion').invalid && this.userForm.get('numero_identificacion').touched
  }
  //validar que los campos esten correctos
  get telefonoNoValido(){
    return this.userForm.get('telefono').invalid && this.userForm.get('telefono').touched
  }
  //validar que los campos esten correctos
  get emailNoValido(){
    return this.userForm.get('email').invalid && this.userForm.get('email').touched
  }
  //validar que los campos esten correctos
  get id_contratoNoValido(){
    return this.userForm.get('id_contrato').invalid && this.userForm.get('id_contrato').touched
  }
  //validar que los campos esten correctos
  get fecha_inicioNoValido(){
    return this.userForm.get('fecha_inicio').invalid && this.userForm.get('fecha_inicio').touched
  }
  //validar que los campos esten correctos
  get fecha_finNoValido(){
    return this.userForm.get('fecha_fin').invalid && this.userForm.get('fecha_fin').touched
  }
  //validar que los campos esten correctos
  get rolNoValido(){
    return this.userForm.get('rol').invalid && this.userForm.get('rol').touched
  }

  async crear(){
    //verficar que todos los campos esten validos
    if (this.userForm.invalid){
      return Object.values(this.userForm.controls).forEach(control=>{
        control.markAsTouched();
      })
    }
    const loading = await this.loadingCtr.create({
      message:'Creando usuario'
    });
    await loading.present();
    this.userService.getUserId({numero_identificacion:this.userForm.value.numero_identificacion}).subscribe(
      async resp=>{
        if(resp){
          const alert = await  this.alertCtr.create({
            message:'Ya existe un usuario con ese número de identificación',
            buttons:['ok']
          });
          await loading.dismiss();
          await alert.present();
        }else{
          this.userService.getUserEmail(this.userForm.value.email).subscribe(
            async resp=>{
              if(resp.length>0){
                const alert = await  this.alertCtr.create({
                  message:'Ya existe un usuario con ese email',
                  buttons:['ok']
                });
                await loading.dismiss();
                await alert.present();
              }else{
                const { fecha_inicio, fecha_fin, id_contrato } =this.userForm.value
                const dataContrato={
                  fecha_fin,
                  fecha_inicio,
                  id_contrato
                }
            
                this.userService.createContrato(dataContrato).subscribe(
                  (resp:any)=>{
                    this.userForm.value.name=  this.userForm.value.name.toUpperCase();
                    this.userForm.value.apellidos = this.userForm.value.apellidos.toUpperCase();
                    this.userForm.value.id_contrato=resp.id_contrato.id;
                    this.userForm.value.estado="true";
                    this.userForm.value.id_area=this.userForm.value.rol;
                    this.userForm.value.password="Modernatec2021*"
                    this.userService.createUser(this.userForm.value).subscribe(
                      async resp=>{
                        const alert = await this.alertCtr.create({
                          message:'Usuario creado correctamente',
                          backdropDismiss:false
                        });
                        await loading.dismiss();
                        await alert.present();
                        setTimeout(async() => {
                          await alert.dismiss();
                          this.router.navigate(['/user/admin-regis'],{replaceUrl:true});
                        }, 3000);
                      },
                      async err=>{
                        console.log(err);
                        
                        const alert = await this.alertCtr.create({
                          message:'No se ha podido crear el usuario',
                          buttons:['ok']
                        });
                        await loading.dismiss();
                        await alert.present();
                      }
                    )
                  }
                )
                
              }
            }
          )
        }
        
      }
    )
  }

}
