import { TestBed                  } from '@angular/core/testing';
import { HttpClientTestingModule  } from '@angular/common/http/testing';
import { HttpClient               } from '@angular/common/http';
import { HttpBackend              } from '@angular/common/http';
import { HttpRequest              } from '@angular/common/http';
import { HttpHandler              } from '@angular/common/http';
import { HttpEvent                } from '@angular/common/http';
import { HttpHeaders              } from '@angular/common/http';
import { RouterTestingModule      } from '@angular/router/testing';

import { AuthInterceptor          } from './auth.interceptor';
import { AuthenticationService    } from '../services/authentication.service';
import { Observable               } from 'rxjs';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        HttpClient,
        AuthenticationService,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ]
    });
    http = TestBed.inject(HttpClient);
  });

  it('should not set Authorization header for "/gramadoir"', () => {
    const req = new HttpRequest<unknown>('GET','/gramadoir');
    const handler = { handle: (req: any)=>{expect(!req.headers.get('Authorization'))} } as any;
    const auth = TestBed.inject(AuthenticationService);
    const interceptor =  new AuthInterceptor(auth);
    interceptor.intercept(req,handler);
    expect(interceptor).toBeTruthy();
  });

  it('should set Authorization header for non gramadoir requests', () => {
    const req = new HttpRequest<unknown>('GET','/hello');
    const token = 'test';
    const handler = { handle: (req: any)=>{
      expect(req.headers.get('Authorization')).toEqual('Bearer ' + token);
    } } as any;
    const auth = TestBed.inject(AuthenticationService);
    const interceptor: AuthInterceptor = new AuthInterceptor(auth);
    localStorage.setItem(auth.jwtTokenName, token);
    interceptor.intercept(req,handler);
    expect(interceptor).toBeTruthy();
  });
});
