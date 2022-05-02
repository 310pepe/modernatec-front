import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';

import { Router } from '@angular/router';
import { FaceService } from '../../services/face.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss'],
})
export class HomeAdminComponent implements OnInit {
  linear:boolean=true;
  barras:boolean=false;
  pastel:boolean=false;
  dias: any;
  loadDia: boolean = false;
  meses: any;
  loadMes: boolean = false;
  lineChartData: ChartConfiguration['data'];
  lineChartData1: ChartConfiguration['data'];
  barChartData: ChartData<'bar'> ;
  barChartData1: ChartData<'bar'> ;
  pieChartData: ChartData<'pie', number[], string | string[]>;
  pieChartData1: ChartData<'pie', number[], string | string[]>;
  constructor(
    private faceService: FaceService
  ) {
    this.faceService.getRegistrosDias().subscribe(
      (resp: any) => {
        this.dias = resp.data
        this.loadDia = true;
        this.loadGraf();
      }
    );
    this.faceService.getRegistrosMeses().subscribe(
      (resp: any) => {
        this.meses = resp.data;
        this.loadMes = true
        this.loadGraf1();
      }
    )
  }

  ngOnInit() {

  }

  cambiarGrafico(grafico){
    if(grafico==1){
      this.linear=true;
      this.barras=false;
      this.pastel=false;
    }
    if(grafico==2){
      this.linear=false;
      this.barras=true;
      this.pastel=false;
    }
    if(grafico==3){
      this.linear=false;
      this.barras=false;
      this.pastel=true;
    }
  }

  loadGraf1() {
    let data = [];
    let labels = [];
    this.meses.forEach((element: any) => {
      console.log(element);
      switch (element.mes) {
        case 1:
          labels.unshift('Enero');
          break;
        case 2:
          labels.unshift('Febrero');
          break;
        case 3:
          labels.unshift('Marzo');
          break;
        case 4:
          labels.unshift('Abril');
          break;
        case 5:
          labels.unshift('Mayo');
          break;
        case 6:
          labels.unshift('Junio');
          break;
        case 7:
          labels.unshift('Julio');
          break;
        case 8:
          labels.unshift('Agosto');
          break;
        case 9:
          labels.unshift('Septiembre');
          break;
        case 10:
          labels.unshift('Octubre');
          break;
        case 11:
          labels.unshift('Noviembre');
          break;
        case 12:
          labels.unshift('Diciembre');
          break;

      }
      data.unshift(element.total)
    })
    this.pieChartData1 = {
      labels,
      datasets: [ {
        data
      } ]
    };
    this.barChartData1={
      labels,
      datasets: [
        { data, label: 'Ingresos' }
      ]
    };

    this.lineChartData1 = {
      datasets: [
        {
          data,
          label: 'Ingresos',
          backgroundColor: 'rgba(63,182,95,0.2)',
          borderColor: 'rgb(63,182,95)',
          pointBackgroundColor: 'rgb(242,153,148)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        }
      ],
      labels: labels
    };
  }

  loadGraf() {
    let data = [];
    let labels = [];
    this.dias.forEach((element) => {
      console.log(element);

      let fecha = new Date(element.fecha).toLocaleDateString();
      data.unshift(element.total)
      labels.unshift(fecha);
    })
    this.pieChartData = {
      labels,
      datasets: [ {
        data
      } ]
    };
    this.barChartData={
      labels,
      datasets: [
        { data, label: 'Ingresos' }
      ]
    };
    this.lineChartData = {
      datasets: [
        {
          data,
          label: 'Ingresos',
          backgroundColor: 'rgba(63,182,95,0.2)',
          borderColor: 'rgb(63,182,95)',
          pointBackgroundColor: 'rgb(242,153,148)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        }
      ],
      labels: labels
    };
  }
  //uso de gráficas
  //gráfica de linea


  //opciones para la gráfica de linea
  lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    }
  };

  //establecer el tipo de gráfica
  lineChartType: ChartType = 'line';
  barChartType: ChartType = 'bar';
  pieChartType: ChartType = 'pie';


  

}
