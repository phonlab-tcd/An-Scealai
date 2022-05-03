import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  /* throwError,*/ Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import config from 'abairconfig';

export interface UserDetails {
  _id: string;
  username: string;
  exp: number;
  iat: number;
  role: string;
  language: 'ga'|'en';
}

interface TokenResponse {
  token: string;
  expires: string;
}

export interface TokenPayload {
  username: string;
  password: string;
  role: string;
}

export interface VerifyEmailRequest {
  username: string;
  email: string;
  password: string;
  // TODO is role necessary for this request?
  role: string;
  baseurl: string;
  language: 'ga' | 'en';
}

export interface LoginTokenPayload {
  baseurl: string; // 'http://localhost:4000/' | 'https://www.abair.tcd.ie/anscealaibackend';
  username: string;
  password: string;
  role: string;
}

export interface RegistrationTokenPayload {
  baseurl: string; // 'http://localhost:4000/' | 'https://www.abair.tcd.ie/anscealaibackend/';
  username: string;
  email: string;
  password: string;
  role: string;
  language: 'en' | 'ga'; // english | gaeilge
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl: string = config.baseurl + 'user/';
  private token: string;
  public userDetails: UserDetails = null;
  public user: UserDetails = null;
  public getLoggedInName: any = new Subject();

  public pendingUserPayload: LoginTokenPayload = null;

  constructor(
    private http: HttpClient,
    private router: Router, ) { }

  expiration() {
    const expiration = localStorage.getItem('expires');
    return new Date(parseInt(expiration));
  }

  public whoami() {
    return this.http
      .get(config.baseurl + 'user/whomai')
      .pipe(tap((freshUser: UserDetails)=>this.user=freshUser));
  }

  private saveToken(res: TokenResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('expires', res.expires);
    this.token = res.token;
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    return JSON.parse(window.localStorage.getItem('user'));
  }

  public isLoggedIn(): boolean {
    return this.expiration() > new Date();
  }

  public isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  private request(
    method: 'post'|'get',
    type: 'register'|'registerTeacher'|'profile',
    user?: TokenPayload | LoginTokenPayload | RegistrationTokenPayload): Observable<any> {

    let base: Observable<any>;

    if (method === 'post') {
      base = this.http.post(this.baseUrl + type, user);
    } else {
      base = this.http.get(this.baseUrl + '${type}', { headers: { Authorization: 'Bearer ${this.getToken()}'}});
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data);
        }
        return data;
      })
    );

    return request;
  }

  public verifyOldAccount(requestObj: VerifyEmailRequest): Observable<any> {
    return this.http.post(this.baseUrl + 'verifyOldAccount', requestObj);
  }

  public resetPassword(username: string): Observable<any> {
    return this.http.post(
      this.baseUrl + `resetPassword`, {
        username: username,
        baseurl: config.baseurl,
      });
  }

  public register(user: TokenPayload | RegistrationTokenPayload): Observable<any> {
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload | LoginTokenPayload): Observable<any> {
    return this.http.post(
      this.baseUrl + 'login',
      user)
      .pipe(
        map((data: {token:TokenResponse;user:UserDetails;}) => {
          if (data.token) {
            this.saveToken(data.token);
          }
          window.localStorage.setItem('user',JSON.stringify(data.user));
          return data;
        })
      );
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('expires');
    window.localStorage.removeItem('user');
    this.router.navigateByUrl('/landing');
    // location.reload();
  }
}
