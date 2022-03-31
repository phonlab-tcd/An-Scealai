import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class GramadoirService {
  private apiUrl = "https://www.abair.ie/cgi-bin/api-gramadoir-1.0.pl"
  //private apiUrl = "http://localhost:5000/api/v1/getIrishGramadoirCheck"
  constructor(private http:HttpClient) { }

  getGramadoir = text => {
    let httpParams = new HttpParams()
      .append("teacs", text)
      .append("teanga", "ga")
      
    let headers = {"Content-Type": "application/x-www-form-urlencoded"}
    
    return this.http.post<any>(this.apiUrl, httpParams, { headers })
  }

}
