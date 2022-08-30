import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { ConsentService } from "../services/consent.service";
import   config from "abairconfig";
@Injectable({
  providedIn: 'root'
})
export class SingletonService {
  constructor(private http: HttpClient, private consent: ConsentService){}
  age = (()=>{
    const subject = new BehaviorSubject<"under16"|"over16">(undefined);
    this.http.get<"under16"|"over16">(config.baseurl + 'privacy-preferences/age')
      .subscribe((body)=>subject.next(body));
    return subject;
  })();
}
