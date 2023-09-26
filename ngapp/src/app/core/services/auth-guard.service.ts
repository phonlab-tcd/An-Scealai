import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) {}

  canActivate() {
    if (!this.auth.isLoggedIn()) {
      console.log("User not logged in, auth guard redirecting to home")
      this.router.navigateByUrl('/');
      return false;
    }
    console.log("User logged in, auth guard returning true")
    return true;
  }
}
