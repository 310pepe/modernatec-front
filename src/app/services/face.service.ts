import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FaceService {

  url:string=environment.BASE_URL_FACE;
  userToken:string;
  constructor(
    private http:HttpClient,
    private authService:AuthService
  ) { 
    this.userToken = authService.userToken;
  }

  identifyBase64(data){
    const formData = new FormData();
    
    formData.append('img',data);

    return this.http.post(`${this.url}/identifypersonbase64`,formData,{headers:{'x-token':this.userToken}});
  }

  getPerson(id){    
    return this.http.get(`${this.url}/persongrouppersonid/`,{params:{idperson:id},headers:{'x-token':this.userToken}});
  }

  createPerson(img:File[],id){  
    const formData = new FormData();
    Array.from(img).forEach( f => formData.append('img', f));
    

    return this.http.put(`${this.url}/persongroupperson/${id}`,formData,{headers:{'x-token':this.userToken}});
  }

  addFotosRec(img:File[],id:string){
    const formData = new FormData();
    Array.from(img).forEach( f => formData.append('img', f));

    return this.http.post(`${this.url}/persongroupperson/${id}`,formData,{headers:{'x-token':this.userToken}});
  }

  trainIa(){
    return this.http.post(`${this.url}/persongroup`,{},{headers:{'x-token':this.userToken}});
  }

  setImages(urlImgs,id){
    return this.http.post(`${this.url}/setimagenes`,{urlImgs,numero_identificacion:id},{headers:{'x-token':this.userToken}});
  }

  getRegistrosDias(){
    return this.http.get(`${this.url}/ultimosdias`,{headers:{'x-token':this.userToken}});
  }

  getRegistrosMeses(){
    return this.http.get(`${this.url}/ultimosmeses`,{headers:{'x-token':this.userToken}});
  }
}
