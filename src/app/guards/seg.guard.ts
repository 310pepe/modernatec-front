import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SegGuard implements CanActivate {
  constructor(
    private authService:AuthService,
    private router:Router
  ){
    
  }
  canActivate(){
    return this.authService.autenticarSeg().pipe(tap(
      autenticado=>{
        if(!autenticado){
         this.router.navigateByUrl('/login');
        }
      }
    ))
  }
  
}
