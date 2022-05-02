import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { FaceService } from '../../services/face.service';

@Component({
  selector: 'app-adicionar-reco',
  templateUrl: './adicionar-reco.component.html',
  styleUrls: ['./adicionar-reco.component.scss'],
})
export class AdicionarRecoComponent implements OnInit {
  idUser;
  //preview de las imagenes
  preview: any[] = [];
  //imagenes
  img: any[] = [];

  form:FormGroup;
  constructor(
    private routerAc:ActivatedRoute,
    private fb:FormBuilder,
    private alertCtr:AlertController,
    private loadingCtr:LoadingController,
    private faceService:FaceService,
    private router:Router
  ) { 
    routerAc.params.subscribe(
      resp=>{
        this.idUser=resp.id;  
        this.loadForm();
      }
    )
  }

  get imagenes(){
    return this.form.get('img') as FormArray
  }

  ngOnInit() {}

  loadForm(){
    this.form = this.fb.group({
      img: this.fb.array([[,Validators.required]])
    }
    )
  }

  agregarImagen(event, posicion) {
    
    const reader = new FileReader();
    this.img[posicion] = event.files[0];
    reader.readAsDataURL(event.files[0]);

    reader.onload = () => {
      this.preview[posicion] = reader.result;
    }
  }
  async addLearning(){    
    //verficar que todos los campos esten validos
    if (this.form.invalid) {
      const alert = await this.alertCtr.create({
        message:'Por favor selecciones las imagenes',
        buttons:['ok']
      });
      await alert.present();
    }
    const loading = await this.loadingCtr.create({
      message:'Agregando las imagenes al reconocimiento facial'
    });
    await loading.present();
    this.faceService.addFotosRec(this.img,this.idUser).subscribe(
      resp=>{
        this.faceService.trainIa().subscribe(
          async resp=>{
            const alert = await this.alertCtr.create({
              message:'Se agregó correctamente las imagenes al reconocimiento facial',
              backdropDismiss:false
            })
            await loading.dismiss();
            await alert.present();
            setTimeout(async() => {
              await alert.dismiss();
              this.router.navigate(['/user/admin-regis'],{replaceUrl:true});
            }, 4000);
          },
          async err=>{  
            const alert = await this.alertCtr.create({
              message:'Error al poner en entrenamiento la IA',
              buttons:['ok']
            });
            await loading.dismiss();
            await alert.present();
          }
        )
      },
      async err=>{  
        const alert = await this.alertCtr.create({
          message:'Error al agregar las imagenes al reconocimiento facial',
          buttons:['ok']
        });
        await loading.dismiss();
        await alert.present();
      }
    )
  }
  agregarImg(){
    this.imagenes.push( this.fb.control('',Validators.required) )
  }
  borrarImg(index){
    this.imagenes.removeAt(index);
    this.img.splice(index,1);
    this.preview.splice(index,1);
  }
}
