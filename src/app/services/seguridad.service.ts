import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {
  userToken:string;
  url=environment.BASE_URL_SEGURIDAD;
  constructor(
    private http:HttpClient,
    private authService:AuthService
  ) { 
    this.userToken = authService.userToken;  
  }

  getActualmenteRegis(){
    return this.http.post(`${this.url}/userEnLInea`,{token:this.userToken},{responseType:'blob'as 'json'})
  }

}
