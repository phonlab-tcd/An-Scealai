import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from 'abairconfig';

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

/*
* Get number of filled profiles
*/
  getNumOfProfiles() : Observable<any> {
    return this.http.get(this.baseUrl + 'getCount');
  }

/*
* Get number of users per county
*/
  getCountyCounts() : Observable<any> {
    return this.http.get(this.baseUrl + 'getCountyCounts');
  }


/*
* Delete a profile from the DB for a given user id
*/
  deleteProfile(userId) : Observable<any> {
    return this.http.get(this.baseUrl + 'deleteProfile/' + userId);
  }

}
