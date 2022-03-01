import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class GramadoirService {
  private apiUrl = "https://scealai-dashboard-server.herokuapp.com/api/v1/getIrishGramadoirCheck"
  //private apiUrl = "http://localhost:5000/api/v1/getIrishGramadoirCheck"
  constructor(private http:HttpClient) { }

  getGramadoir = text => {
    return this.http.post<any>(this.apiUrl, { "text": text })
  }

}
