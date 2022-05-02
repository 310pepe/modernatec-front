import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { FaceService } from '../../services/face.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-reco',
  templateUrl: './agregar-reco.component.html',
  styleUrls: ['./agregar-reco.component.scss'],
})
export class AgregarRecoComponent implements OnInit {


  preview: any[] = []
  img: any[] = []
  id: string;
  constructor(
    private routerAc: ActivatedRoute,
    private storageService: StorageService,
    private faceService: FaceService,
    private router: Router,
    private loadingCtr:LoadingController,
    private alertCtr:AlertController
  ) {
    this.routerAc.params.subscribe(
      (params) => {
        this.id = params.id

      });
  }

  ngOnInit() { }

  agregarImagen(event, posicion) {
    
    const reader = new FileReader();
    this.img[posicion] = event.files[0];
    reader.readAsDataURL(event.files[0]);

    reader.onload = () => {
      this.preview[posicion] = reader.result;
    }
  }

  async addLearning() {
    const loading = await this.loadingCtr.create({
      message:'Agregando reconocimiento facial'
    });
    await loading.present();
    //crear y agregar person group personal machine learnig
    this.faceService.createPerson(this.img, this.id).subscribe(
      async (resp) => {
        //si se agrega correctamente pondremos en entrenamiento la ia
        await this.faceService.trainIa().subscribe(
          resp => { },
          err => {

          }
        )

        //si se agrega correctamente subiremos las imagenes al servidor de gestion de imagenes
        this.storageService.upImages(this.img, this.id).subscribe(
          resp => {
            //una vez agregadas las imagenes traemos todos las direcciones url 
            this.storageService.getImages(this.id).subscribe(
              (resp: any) => {
                const url: any[] = resp.paths;
                const urls = JSON.stringify(url);
                //agregamos las url de las imagenes a la base de datos
                this.faceService.setImages(urls, this.id).subscribe(
                  async resp => {
                    const alert = await this.alertCtr.create({
                      message:'Reconocimiento facial agregado correctamente',
                      backdropDismiss:false
                    })
                    await loading.dismiss();
                    await alert.present();
                    setTimeout(async() => {
                      await alert.dismiss();
                      //si se realiza todo correctamente se redirecciona a la página principal
                      this.router.navigate(['/user/admin-regis'], { replaceUrl: true })
                    }, 3000);
                  },
                  async err => {
                    const alert = await this.alertCtr.create({
                      header:'Error al agregar reconocimiento facial',
                      message:err.error.msg,
                      buttons:['ok']
                    })
                    await loading.dismiss();
                    await alert.present();
                  }
                )
              },
              async err => {
                const alert = await this.alertCtr.create({
                  header:'Error al agregar reconocimiento facial',
                  message:err.error.msg,
                  buttons:['ok']
                })
                await loading.dismiss();
                await alert.present();
              }
            )
          },
          async err => {
            const alert = await this.alertCtr.create({
              header:'Error al agregar reconocimiento facial',
              message:err.error.msg,
              buttons:['ok']
            })
            await loading.dismiss();
            await alert.present();
          }
        )
      },
      async err => {
        
        const alert = await this.alertCtr.create({
          header:'Error al agregar reconocimiento facial',
          message:err.error.msg,
          buttons:['ok']
        })
        await loading.dismiss();
        await alert.present();
      }
    )
  }
}

