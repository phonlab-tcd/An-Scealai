import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {
  engagement$ = new Subject<boolean>();
  googleAnalytics$ = new Subject<boolean>();
  cloudStorage$ =  new Subject<boolean>();
  constructor(private auth: AuthenticationService, private http: HttpClient) {
    // synchronise preferences

  }
}
