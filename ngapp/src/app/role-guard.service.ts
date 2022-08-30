import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthenticationService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
      const nope = () => { this.router.navigateByUrl('/landing'); return false };
      if (!this.auth.isLoggedIn()) return nope();

      const token = this.auth.getToken();
      if(!token) return nope();

      const payload = jwtDecode(token) as {role?: string};
      const expectedRole = route.data.expectedRole;
      if (payload.role !== expectedRole) return nope();
      return true;
  }
}
