import { Injectable } from '@angular/core';
import { Event, EventType } from './event';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';  
import { Story } from './story';
import config from '../abairconfig.json';

@Injectable({
  providedIn: 'root'
})
export class EngagementService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  baseUrl: string = config.baseurl + 'engagement/';

  addEventForLoggedInUser(type: EventType, story?: object){
    this.addEventObservable(type, story).subscribe();
  }

  addEventObservable(type: EventType, storyData: object): Observable<any> {
    if (! this.auth.isLoggedIn()) {
      throw new Error('Cannot add event if user is not logged in');
    }

    const event: Event = new Event();
    event.type = type;
    if(storyData) { event.storyData = storyData; }
    event.userId = this.auth.getUserDetails()._id;

    return this.http
        .post(this.baseUrl + 'addEventForUser/' +
              event.userId,
              { event });
  }

  getEventsForUser(id: string): Observable<any> {
    return this.http.get(this.baseUrl + "eventsForUser/" + id);
  }

  getEventsForStory(id: string): Observable<any> {
    return this.http.get(this.baseUrl + "eventsForStory/" + id);
  }
  
}
