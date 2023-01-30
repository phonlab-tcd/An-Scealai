import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import config from 'abairconfig';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  baseUrl:string = config.baseurl + 'stats/';

  constructor(private http: HttpClient, private auth: AuthenticationService) { }
  
// *********************** Admin stats ************************************  
  getProfileDataByDate(startDate: string, endDate: string): Observable<any> {
    console.log("start date: ", startDate);
    console.log("end date: ", endDate);
    return this.http.get(this.baseUrl + 'getProfileDataByDate/' + startDate + "/" + endDate);
  }
  
  getFeatureDataByDate(startDate: string, endDate: string): Observable<any> {
    console.log("start date: ", startDate);
    console.log("end date: ", endDate);
    return this.http.get(this.baseUrl + 'getFeatureDataByDate/' + startDate + "/" + endDate);
  }
  
  getFeatureDataSinceLog(date): Observable<any> {
    console.log("Date: ", date);
    return this.http.get(this.baseUrl + 'getFeatureDataSinceLog/' + date.toString());
  }

}
