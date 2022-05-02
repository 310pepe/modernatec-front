/**
 * @author Jose Daniel Bermudez Salamanca
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  
  load:boolean;
  constructor(
    //importar srvicio http
    private http:HttpClient
    ) 
    {
    }

  //url de la api
  protected url = environment.BASE_URL_AUTH;

  login(data:{email:string,password:string}){
    // 
    return this.http.post(`${this.url}/login`,data).pipe(map((data:any)=>{  
      localStorage.setItem('token',data.access_token)
      return data
    }))
  }
  get userToken(): string {
    return localStorage.getItem('token') || '';
  }

  
  
  //función para destruir el token
  logout(){
    localStorage.removeItem('token');
  }
  

  autenticarRol():Observable<string>{
    const tok=localStorage.getItem('token')||'' 
    return this.http.post(`${this.url}/me`,{token:tok}).pipe(map((resp:any)=>{
      if(resp.rol==1){
        return 'admin-regis';
      }else if(resp.rol==2){
        return 'admin-home';
      }else if(resp.rol==3){
        return 'home-seg';
      }
    }))
  }

  //atenticación de usuario registro
  autenticarReg():Observable<boolean>{ 
    const tok=localStorage.getItem('token')||'';
    return this.http.post(`${this.url}/me`,{token:tok}).pipe(map((resp:any)=>{  
      if(resp.rol==1){
        return true
      }else{
        return false
      }
    }),
    catchError(err=>of(false))
    )
  }
  //atenticación de usuario registro
  autenticarSeg():Observable<boolean>{  
    const tok=localStorage.getItem('token')||'' 
    return this.http.post(`${this.url}/me`,{token:tok}).pipe(map((resp:any)=>{
      if(resp.rol==3){
        return true
      }else{
        return false
      }
    }),
    catchError(err=>of(false))
    )
  }
  //atenticación de usuario registro
  autenticarAdm():Observable<boolean>{  
    const tok=localStorage.getItem('token')||'' 
    return this.http.post(`${this.url}/me`,{token:tok}).pipe(map((resp:any)=>{
      if(resp.rol==2){
        return true
      }else{
        return false
      }
    }),
    catchError(err=>of(false))
    )
  }
  autenticarToken():Observable<boolean>{
    const tok=localStorage.getItem('token')||'' 
    return this.http.post(`${this.url}/refresh`,{token:tok}).pipe(map((resp:any)=>{      
      localStorage.setItem('token',resp.access_token)
      return true
    }),
    catchError( err => of(false) ))
  }
  register(data:{
    name:string,
    apellidos:string,
    numero_identificacion:string,
    telefono:string,
    email:string
  }){
    return this.http.post(`${this.url}/Registro_Invitado`,data);
  }

  perfil(){
    return this.http.post(`${this.url}/me`,{token:this.userToken});
  }

  forgotPass(data){
    return this.http.get(`${this.url}/email_password_reset/${data.email}`)
  }

  codeVerific(data){
    return this.http.post(`${this.url}/Validacion_code`,data);
  }

  changePass(data){
    return this.http.post(`${this.url}/confirm_reset_password`,data);
  }

  updatePass(data){
    data.token=this.userToken;
    return this.http.post(`${this.url}/password_update`,data);
  }
}
