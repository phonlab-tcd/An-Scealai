import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl:string = 'http://localhost:4000/user/';

  constructor(private http: HttpClient) { }

  getUserById(id: string) : Observable<any> {
    return this.http.get('http://localhost:4000/user/viewUser', {headers: {_id : id}});
  }
 
}
