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

  addEventForLoggedInUser(type: EventType, story?: Object){
    if(this.auth.isLoggedIn()) {
      let event: Event = new Event();
      event.type = type;
      if(story) event.storyData = story;
      event.userId = this.auth.getUserDetails()._id;
      return this.http.post(this.baseUrl + "addEventForUser/" + this.auth.getUserDetails()._id, {event:event}).subscribe();
    }
  }

  getEventsForUser(id: string): Observable<any> {
    return this.http.get(this.baseUrl + "eventsForUser/" + id);
  }

  getEventsForStory(id: string): Observable<any> {
    return this.http.get(this.baseUrl + "eventsForStory/" + id);
  }
}
