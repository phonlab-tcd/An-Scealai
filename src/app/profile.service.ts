import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from '../abairconfig.json';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  baseUrl:string = config.baseurl + 'profile/';

  constructor(private http: HttpClient) { }

  create(profile) : Observable<any> {
    return this.http.post(this.baseUrl + 'create', profile);
  }

}
