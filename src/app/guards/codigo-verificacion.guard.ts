import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CodigoVerificacionGuard implements CanActivate {

  constructor(
    private router:Router
  ){}

  canActivate(): boolean  {
    const email = localStorage.getItem('email-verified')
    if(email){
      return true
    }else{
      this.router.navigate(['email-password'])
      return false
    }
  }
  
}
