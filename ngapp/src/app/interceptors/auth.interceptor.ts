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
    if(idToken && request.url.indexOf('gramadoir') < 0) {
        const newRequest = request.clone({
          setHeaders: {
            Authorization: idToken,
          }
        });
        return next.handle(newRequest);
      }
    return next.handle(request);
  }
}
