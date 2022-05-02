import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistroService } from '../../services/registro.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-data-base',
  templateUrl: './data-base.component.html',
  styleUrls: ['./data-base.component.scss'],
})
export class DataBaseComponent implements OnInit {

  load:boolean=false;
  errores:any[];
  archivo:File
  dbForm:FormGroup
  constructor(
    private fb:FormBuilder,
    private registroService:RegistroService,
    private loadingCtr:LoadingController,
    private alertCtr:AlertController
  ) { 
    this.loadForm()
   }

  ngOnInit() {}

  loadForm(){
    this.dbForm= this.fb.group({
      file:[,Validators.required]
    })
  }
  cambiarArchivo(file){
    this.archivo=file.files[0] 
  }

  async subirdb(){
   
    const loading = await this.loadingCtr.create({
      message:'subiendo base de datos',
      backdropDismiss:false
    });  

    await loading.present();

    if(this.archivo.type !=  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
      const alert = await this.alertCtr.create({
        message:'Formato de archivo incorrecto, por favor seleccione un archivo con formato xlsx',
        buttons:['ok']
      });

      await loading.dismiss();

      await alert.present();
      
    }
    
    this.registroService.subirDb(this.archivo).subscribe(
      async (rep:any)=>{
        const alert = await this.alertCtr.create({
          message:'Base de datos cargada con exito',
          buttons:['ok']
        });
        this.errores=rep.errores
        await loading.dismiss();
        this.load=true
        await alert.present();
      },
      async err=>{
        const alert = await this.alertCtr.create({
          message:'Error al cargar base de datos, asgurese que el archivo cumpla con los parámetros especificados',
          buttons:['ok']
        });
        await loading.dismiss();
        await alert.present();
      }
    )
  }
}
