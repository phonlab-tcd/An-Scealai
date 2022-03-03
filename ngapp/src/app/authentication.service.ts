import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  /* throwError,*/ Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import config from '../abairconfig.json';

export interface UserDetails {
  _id: string;
  username: string;
  exp: number;
  iat: number;
  role: string;
}

interface TokenResponse {
  token: string;
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
  public getLoggedInName: any = new Subject();

  public pendingUserPayload: LoginTokenPayload = null;

  constructor(
    private http: HttpClient,
    private router: Router, ) { }

  private saveToken(token: string): void {
    localStorage.setItem('scealai-token', token);
    this.token = token;
  }

  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('scealai-token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload: any;
    if (token) {

      payload = token.split('.')[1];
      payload = window.atob(payload);

      this.getLoggedInName.next(JSON.parse(payload).username);

      return JSON.parse(payload);

    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();

    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
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
          this.saveToken(data.token);
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
        map((data: TokenResponse) => {
          if (data.token) {
            this.saveToken(data.token);
          }
          return data;
        })
      );
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('scealai-token');
    this.router.navigateByUrl('/landing');
    // location.reload();
  }
}
