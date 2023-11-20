import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from 'abairconfig';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  baseUrl:string = config.baseurl + 'stats/';

  constructor(private http: HttpClient) { }
  
// *********************** Admin stats ************************************  
  getProfileDataByDate(startDate: string, endDate: string): Observable<any> {
    return this.http.get(this.baseUrl + 'getProfileDataByDate/' + startDate + "/" + endDate);
  }
  
  getFeatureDataByDate(startDate: string, endDate: string): Observable<any> {
    return this.http.get(this.baseUrl + 'getFeatureDataByDate/' + startDate + "/" + endDate);
  }
  
  getFeatureDataSinceLog(date: Date): Observable<any> {
    return this.http.get(this.baseUrl + 'getFeatureDataSinceLog/' + date.toString());
  }

}
