import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { throwError, Subject } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl : string = config.baseurl + 'user/';
  private token: string;
  public getLoggedInName : any = new Subject();

  constructor(private http: HttpClient, private router: Router,) { }

  private saveToken(token: string): void {
    localStorage.setItem('scealai-token', token);
    this.token = token;
  }

  private getToken(): string {
    if(!this.token) {
      this.token = localStorage.getItem('scealai-token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if(token) {
      
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
    
    if(user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'post'|'get', type: 'login'|'register'|'registerTeacher'|'profile', user?: TokenPayload): Observable<any> {
    let base;

    if(method === 'post') {
      base = this.http.post(this.baseUrl + type, user);
    } else {
      base = this.http.get(this.baseUrl + '${type}', { headers: { Authorization: 'Bearer ${this.getToken()}'}});
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if(data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    
    return this.request('post', 'login', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }

  public logout(): void {

    this.token = '';
    window.localStorage.removeItem('scealai-token');
    this.router.navigateByUrl('/landing');
    //location.reload();
  }
  


}
