import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  userToken:string;
  url=environment.BASE_URL_CITAS;
  urlStorage=environment.BASE_URL_CITAS_STORAGE;
  constructor(
    private http:HttpClient,
    private authService:AuthService
  ) { 
    this.userToken = authService.userToken;  
   }

  getCitas(){
    return this.http.post(`${this.url}/index`,{token:this.userToken})
  }

  getCodigosCitas(){
    return this.http.post(`${this.url}/index`,{token:this.userToken}).pipe(map(
      (data:any[])=>{
        const codigos = data.map(elemet=>{
          return elemet.codigo_cita
        });
        return codigos
      }
    ))
  }


  createCita(data){
    data.token=this.userToken;
    return this.http.post(`${this.url}/store`,data)
  }

  getCita(data){
    data.token=this.userToken;
    return this.http.post(`${this.url}/show`,data)
  }

  updateCita(data){
    data.token=this.userToken;  
    return this.http.put(`${this.url}/update/${data.id}`,data)
  }

  deleteCita(data){
    data.token=this.userToken;  
    return this.http.delete(`${this.url}/destroy`,{body:data})
  }

  createFotoCita(img:File,codigoCita:string){
    const formData = new FormData();
    formData.append('img',img);
    return this.http.post(`${this.urlStorage}/${codigoCita}`,formData,{headers:{'x-token':this.userToken}});
  }

  updateFotoCita(img:File,codigoCita:string){
    const formData = new FormData();
    formData.append('img',img);
    return this.http.put(`${this.urlStorage}/${codigoCita}`,formData,{headers:{'x-token':this.userToken}});
  }

  deleteFotoCita(codigoCita){
    return this.http.delete(`${this.urlStorage}/${codigoCita}`,{headers:{'x-token':this.userToken}});
  }

}
