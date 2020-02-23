import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from '../abairconfig.json';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  baseUrl:string = config.baseurl + 'stats/';

  constructor(private http: HttpClient) { }

  getSynthesisData() : Observable<any> {
    return this.http.get(this.baseUrl + 'synthesisFixes');
  }


}
