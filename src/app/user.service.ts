import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs';
import config from '../abairconfig.json';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl:string = config.baseurl + 'user/';

  constructor(private http: HttpClient) { }

  getUserById(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + 'viewUser', {headers: {_id : id}});
  }

}
