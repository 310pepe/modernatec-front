import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroService } from '../../services/registro.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {

  protected alerta:HTMLIonAlertElement;
  //* -> Implementacion de propiedad del formGroup
  public reporte_form: FormGroup

  constructor(
    private registroService:RegistroService,
    private fb:FormBuilder,
    private loadingCtr:LoadingController,
    private alertCtr:AlertController
  ) { }

  ngOnInit() {
    this.loadForm()
  }

  //retorna si el campo password se ha ingresado
  get fecha_1NoValido(){
    return this.reporte_form.get('fecha_1').invalid && this.reporte_form.get('fecha_1').touched
  }
  //retorna si el campo password se ha ingresado
  get fecha_2NoValido(){
    return this.reporte_form.get('fecha_2').invalid && this.reporte_form.get('fecha_2').touched
  }

  //cargar el formulario
  loadForm(){
    this.reporte_form= this.fb.group(
      {
        fecha_1:['',[Validators.required]],
        fecha_2:['',[Validators.required]]
      }
    )
  }
  
  //funcion que se ejecuta al dar clic en submit
  async generarReporte(){
    //verficar que todos los campos esten validos
    if (this.reporte_form.invalid){
      return Object.values(this.reporte_form.controls).forEach(control=>{
        control.markAsTouched();
      })
    }

    const loading = await this.loadingCtr.create({
      message:'Generando reporte'
    });
    await loading.present();
    //llamado al servicio de descarga de reportes
    this.registroService.descargarReporte(this.reporte_form.value).subscribe(
      async res=>{
        
        //reseteamos el formulario
        this.reporte_form.reset();
        const alert= await this.alertCtr.create({
          message:'Reporte generado con exito',
          buttons:['ok']
        })
        //llamamos a la funcion que descarga el archivo    
        this.manageExcel(res,'reporte.xlsx');
        await loading.dismiss();
        await alert.present();
      },
      async err=>{
        this.reporte_form.reset();
        const alert= await this.alertCtr.create({
          message:'Reporte generado con exito',
          buttons:['ok']
        })
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
