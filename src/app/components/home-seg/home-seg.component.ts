import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FaceService } from '../../services/face.service';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@awesome-cordova-plugins/camera-preview/ngx';
import { ModalUserSegPage } from '../../pages/modal-user-seg/modal-user-seg.page';
import { WebSocketService } from '../../services/web-socket.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Subscription } from 'rxjs';
import { SeguridadService } from '../../services/seguridad.service';

@Component({
  selector: 'app-home-seg',
  templateUrl: './home-seg.component.html',
  styleUrls: ['./home-seg.component.scss'],
})
export class HomeSegComponent implements OnInit, OnDestroy {

  @ViewChild('video') video: ElementRef;

  persona: any;
  cameraPreviewOpts: CameraPreviewOptions;
  modal;
  personasActual;
  idInterval;
  socket:Subscription;
  identificando: boolean = false;
  android: boolean = false;
  load: boolean = false;
  currentStram;
  constructor(
    private usuariosService:UsuariosService,
    private faceService: FaceService,
    private alertController: AlertController,
    private cameraPreview: CameraPreview,
    private modalController: ModalController,
    private segService:SeguridadService,
    private loadingCtr:LoadingController
  ) {
    this.cameraPreviewOpts = {
      x: window.screen.width/2,
      y: 100,
      width: window.screen.width/2,
      height: window.screen.height/5*2,
      tapPhoto:false,
      camera: 'rear',
      storeToFile: false
    }
  }

  async ngOnInit() {
    await this.checkMedia();
    this.socket = this.usuariosService.getActual().subscribe(
      res=>{
        console.log(res);
        this.personasActual=res[0].total;
      }
    );
  }

  ngOnDestroy(): void {
    this.socket.unsubscribe();
    this.load=false;
    if (this.android) {
      this.cameraPreview.stopCamera();
    }
      
    clearInterval(this.idInterval);
    
  }

  async checkMedia() {

    await this.cameraPreview.startCamera(this.cameraPreviewOpts).then(
      (res) => {
        this.android = true;
      }
    ).catch(
      err => {
      }
    );
    if (navigator && navigator.mediaDevices && !this.android) {
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      }).then((stream) => {
        this.load = true
        this.currentStram = stream;
      }).catch(async (err) => {

        const alert = await this.alertController.create({
          message: 'No se ha podido encender la cámara, por favor asegurese contar con una y dar los permisos necesarios',
          buttons: ['ok']
        });

        await alert.present();

      })
    } else {

    }
  }

  async identificarBase64(base64) {

    if (this.android) {
      await this.cameraPreview.stopCamera();
    }
    this.faceService.identifyBase64(base64).subscribe(
      (res: any) => {
        if (res.identifyResults[0].candidates[0]) {
          this.persona = res.identifyResults[0].candidates[0];
          this.faceService.getPerson(res.identifyResults[0].candidates[0].personId).subscribe(
            async (res: any) => {

              const modal = await this.modalController.create({
                component: ModalUserSegPage,
                componentProps: {
                  'persona': this.persona,
                  'id': res.identificacion
                },
                backdropDismiss:false
              });
              await modal.present();

              modal.onDidDismiss().then(
                async resp => {
                  this.usuariosService.sendActual();
                  if (this.android) {
                    await this.cameraPreview.startCamera(this.cameraPreviewOpts);
                  }
                  this.identificando = false;

                }
              );
            },
            async err => {
              this.identificando = false;
              if (this.android) {
                await this.cameraPreview.startCamera(this.cameraPreviewOpts);
              }
            }
          )
        }else{
          this.identificando = false
          if (this.android) {
            this.cameraPreview.startCamera(this.cameraPreviewOpts);
          }
        }
      }
      , async err => {
        this.identificando = false
        if (this.android) {
          await this.cameraPreview.startCamera(this.cameraPreviewOpts);
        }
      }
    )
  }

  identify() {
    this.idInterval = setInterval(() => {
      console.log('interval identify');
      
      if (this.load && !this.identificando) {
        this.identificando = true;
        const picture = document.createElement('canvas') as HTMLCanvasElement;
        const { videoWidth, videoHeight } = this.video.nativeElement;
        picture.width = videoWidth;
        picture.height = videoHeight;
        picture.getContext('2d').drawImage(this.video.nativeElement, 0, 0, videoWidth, videoHeight);

        const base = picture.toDataURL();
        const baseArray = base.split(',');
        const base64 = baseArray[1];

        this.identificarBase64(base64);
      }
    }, 5000);
  }

  tomarFoto() {
    //establecer las opciones de la foto
    const pictureOpts: CameraPreviewPictureOptions = {
      width: 1280,
      height: 1280,
      quality: 85
    }
    //tomar la fotográfia y enviar a identificar
    this.cameraPreview.takePicture(pictureOpts).then(imageData => {
      this.identificarBase64(imageData[0]);
    })

  }

  loadedMetaData() {
    this.video.nativeElement.play();
    this.load = true;
    this.identify();
  }

  async descargarReporte(){
    const loading = await this.loadingCtr.create({
      message:'Generando reporte'
    });
    await loading.present();
    this.segService.getActualmenteRegis().subscribe(
      async resp=>{
        const alert = await this.alertController.create(
          {
            message:'Reporte generado',
            buttons:['ok']
          }
        )
        await loading.dismiss();
        this.manageExcel(resp,'reporteActual.xlsx');
        await alert.present();
      },async err=>{
        const alert = await this.alertController.create(
          {
            message:'Error al generar reporte',
            buttons:['ok']
          }
        )
        await loading.dismiss();
        await alert.present();
      }
    )
    
  }
  
  //funcion que maneja la descarga de archivos
  manageExcel(res,filename){
    //constante que tiene el tipo del documento
    const dataType= res.type;
    //variable que contendra los datos binarios del archivo
    const binaryData = [];
    binaryData.push(res);
    
    const filePath = window.URL.createObjectURL(new Blob(binaryData,{type:dataType}) );
    const donwload = document.createElement('a');
    donwload.href = filePath;
    donwload.setAttribute('download',filename);
    document.body.appendChild(donwload);
    donwload.click();
    document.body.removeChild(donwload);
  }
}
