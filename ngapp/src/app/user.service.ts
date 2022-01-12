import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { User } from './user';
import { Observable, of } from 'rxjs';
import { User } from './user'
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

  searchUser(searchString: string, pageNumber: number, limit: number, roles: string[]): Observable<any> {
    console.log(roles);
    return of({
      users: [
        {
          "_id": '12345',
          "username": 'alice',
          "role": 'STUDENT',
          "language" : 'ga',
        },
        {
          "_id": '67890',
          "username": 'bob',
          "role": 'TEACHER',
          "language" : 'en',
        },
        {
          "_id": '14525',
          "username": 'carl',
          "role": 'TEACHER',
          "language" : 'en',
        },
        {
          "_id": '19572',
          "username": 'dearbhla',
          "role": 'STUDENT',
          "language" : 'ga',
        },
      ].slice(pageNumber * limit, (pageNumber * limit) + limit),
      count: 4
    });
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
