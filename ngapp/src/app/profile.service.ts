import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from 'abairconfig';
import { ConsentService } from "./privacy-preferences/consent.service";

@Injectable({providedIn: 'root'})
export class ProfileService {

  baseUrl: string = config.baseurl + 'profile/';
  american: boolean = false;

  constructor(private http: HttpClient, private consent: ConsentService) { }

  // Send a new profile to the database 
  create(profile): Observable<any> {
    return this.consent.http.post(this.baseUrl + 'create', profile);
  }

  // Get a profile from the database using the user id
  getForUser(userId: string): Observable<any> {
    return this.http.get(this.baseUrl + 'getForUser/' + userId);
  }

  // Delete a profile from the DB for a given user id
  deleteProfile(userId): Observable<any> {
    return this.http.get(this.baseUrl + 'deleteProfile/' + userId);
  }

}
