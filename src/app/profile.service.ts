import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from '../abairconfig.json';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  baseUrl:string = config.baseurl + 'profile/';
  american: boolean = false;

  constructor(private http: HttpClient) { }

/*
* Send a new profile to the database 
*/
  create(profile) : Observable<any> {
    return this.http.post(this.baseUrl + 'create', profile);
  }

/*
* Get a profile from the database using the user id
*/
  getForUser(userId) : Observable<any> {
    return this.http.get(this.baseUrl + 'getForUser/' + userId);
  }

}
