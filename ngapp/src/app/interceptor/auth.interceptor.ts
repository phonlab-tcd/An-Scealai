import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'app/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthenticationService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const maybeJwt = this.auth.getToken();
    const authHeaderValue = maybeJwt ? 'Bearer ' + maybeJwt : false;
    if(authHeaderValue && request.url.indexOf('gramadoir') < 0) {
      const newRequest =
        request.clone({
          setHeaders: {
            Authorization: authHeaderValue,
          }});
      return next.handle(newRequest);
    }
    else {
      return next.handle(request);
    }
  }
}
