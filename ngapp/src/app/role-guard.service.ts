import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthenticationService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
      const expectedRole = route.data.expectedRole;
      const token = localStorage.getItem('scealai-token');
      const tokenPayload = decode(token) as {role?: string};

      if (!this.auth.isLoggedIn() || tokenPayload.role !== expectedRole) {
        this.router.navigateByUrl('/landing');
        return false;
      }
      return true;
  }
}
