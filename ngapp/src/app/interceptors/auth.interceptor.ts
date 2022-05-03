import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {
  AuthenticationService
} from 'app/authentication.service';
import { Observable } from 'rxjs';

function mkNewRequest(
  request: HttpRequest<unknown>,
  command: {setHeaders: any;}): HttpRequest<unknown> {
  return request.clone(command);
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthenticationService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.getToken();
    const req =
      (token && request.url.indexOf('gramadoir') < 0) ?
      mkNewRequest(request, {setHeaders: {Authorization: token}}) :
      request;
    return next.handle(req);
  }
}
