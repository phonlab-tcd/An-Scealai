import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { User } from './user';
import { Observable } from 'rxjs';
import config from '../abairconfig.json';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string = config.baseurl + 'user/';

  constructor(private http: HttpClient) { }

  getUserById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'viewUser', {headers: {_id : id}});
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get(this.baseUrl + 'getUserByUsername/' + username);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(this.baseUrl + 'getAllUsers/');
  }

  deleteUser(username: string): Observable<any> {
    return this.http.get(this.baseUrl + 'deleteUser/' + username);
  }

  updateUsername(id: string, username: string): Observable<any> {
    return this.http.post(this.baseUrl + 'updateUsername/' + id, { username });
  }

  updatePassword(id: string, password: string): Observable<any> {
    return this.http.post(this.baseUrl + 'updatePassword/' + id, { password });
  }

  sendNewPassword(username: string, email: string): Observable<any> {
    return this.http.post(this.baseUrl + 'sendNewPassword/', {
      username,
      email
    });
  }
}
