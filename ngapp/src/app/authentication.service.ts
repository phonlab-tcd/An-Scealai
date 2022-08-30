import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  /* throwError,*/ Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import jwtDecode from "jwt-decode";
import config from 'abairconfig';

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
  public jwtTokenName = 'scealai-token' as const;
  private jwt$ = new Subject<string>();
  private jwtPayload$ = new Subject<object>();
  public jwtPayload$sub(observer){ return this.jwtPayload$.subscribe(observer); }


  constructor(
    private http: HttpClient,
    private router: Router, ) {
      this.jwt$.subscribe(token=>{
        const payload = jwtDecode(token);
        console.log("PAYLOAD",payload);
        if(payload instanceof Object) this.jwtPayload$.next(payload);
      });
      this.jwtPayload$.subscribe(p=>this.handleExpiration(p['exp']));
      this.jwt$.next(this.getToken());
    }

  private saveToken(token: string): void {
    localStorage.setItem(this.jwtTokenName, token);
    this.jwt$.next(token);
    this.token = token;
  }

  public getToken(): string {
    this.token = localStorage.getItem(this.jwtTokenName);
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    if(!token) return null;
    const payload = jwtDecode(token) as UserDetails;
    if(!payload) return null;
    this.getLoggedInName.next(payload.username);
    return payload;
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();

    if (user) {
      return user.exp > (Date.now() / 1000);
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

  private tokenExpirationTimeoutId;

  private handleExpiration(exp){
    clearTimeout(this.tokenExpirationTimeoutId);
    const expSecs = Number(exp);
    if(!expSecs) return;
    const expMs = expSecs * 1000;
    const expiresIn = (expMs - Date.now());
    this.tokenExpirationTimeoutId = setTimeout(
      ()=>{window.alert("Your session has expired! You have been logged out automatically. If you navigate away from this page all unsaved data will be lost.")},
      expiresIn);
  }

  public login(user: TokenPayload | LoginTokenPayload): Observable<any> {
    return this.http.post(
      this.baseUrl + 'login',
      user)
      .pipe(
        map((data: TokenResponse) => {
          if (data.token) this.saveToken(data.token);
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
