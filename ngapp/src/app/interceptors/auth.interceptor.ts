import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {
  AuthenticationService
} from 'src/app/authentication.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthenticationService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const idToken = this.auth.getToken();
    if(idToken) {
      if(request.headers.get('No-Intercept')) {
        console.log("NO INTERCEPT");
        console.dir(request);
        request.headers.delete('No-Intercept');
        console.dir(request);
      } else {
        const cloned = request.clone({
          headers: request.headers.set("Authorization", idToken)
        });
        return next.handle(cloned);
      }
    }
    return next.handle(request);
  }
}
