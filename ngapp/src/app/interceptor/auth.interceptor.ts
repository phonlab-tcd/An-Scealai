import { Injectable             } from '@angular/core';
import { HttpRequest            } from '@angular/common/http';
import { HttpHandler            } from '@angular/common/http'; 
import { HttpInterceptor        } from '@angular/common/http';
import { AuthenticationService  } from 'app/authentication.service';

function authHeader(token: string) {
  if(token) {
    return 'Bearer ' + token;
  }
  return false;
}

function isGramadoirRequest(request: HttpRequest<unknown>) {
  return request.url.includes('gramsrv') ||
    request.url.includes('cadhan') ||
    request.url.includes('api-gramadoir');
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    const Authorization = authHeader(this.auth.getToken());
    if(Authorization && !isGramadoirRequest(request)) {
      const newRequest = request.clone({setHeaders: {Authorization}});
      return next.handle(newRequest);
    }
    else {
      return next.handle(request);
    }
  }
}
