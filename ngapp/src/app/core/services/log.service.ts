import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import config from 'abairconfig';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }

  baseUrl: string = config.baseurl + 'log';

  clientsideError(route: string, message: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/clientsideError/`, {route: route, message: message}); 
  }
}
