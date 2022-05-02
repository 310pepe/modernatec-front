import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService:AuthService,
    private router:Router
  ){
    
  }
  canActivate(){
    return this.authService.autenticarRol().pipe(map(
      resp=>{
        if(resp=='sin rol'){
          return true;
        }else{
          
          this.router.navigate([`/user/${resp}`])
        }
      }
    ),catchError(err=> of(true)))
  }
  
}
