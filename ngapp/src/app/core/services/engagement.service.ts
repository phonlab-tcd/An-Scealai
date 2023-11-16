import { Injectable } from '@angular/core';
import { Event, EventType, MouseOverGrammarSuggestionEvent } from 'app/core/models/event';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { SynthItem } from 'app/core/models/synth-item';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { HighlightTag } from 'lib/quill-highlight/quill-highlight';
import config from 'abairconfig';
import { Story } from '../models/story';

@Injectable({
  providedIn: 'root'
})
export class EngagementService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  baseUrl: string = config.baseurl + 'engagement/';

  addEventForLoggedInUser(type: EventType, data?: object){
    this.addEventObservable(type, data).subscribe({next: () => {}, error: (err) => console.log(err)});
  }

  addEventObservable(type: EventType, data: object | undefined): Observable<any> {
    const user = this.auth.getUserDetails();

    if (!this.auth.isLoggedIn() || !user) {
      throw new Error('Cannot add event if user is not logged in');
    }

    const event: Event = new Event();
    event.type = type;
    if (data) event.data = data;

    return this.http.post(this.baseUrl + 'addEventForLoggedInUser/' + user._id, { event });
  }

  playSynthesis(si: SynthItem, storyId: string) {
    const info = {
      date: Date(),
      voice: si.voice,
      text: si.text,
      user: this.auth.getUserDetails(),
      storyId: storyId,
    };
    this.http.post(this.baseUrl + 'addEvent/playSynthesis', info).subscribe();
  };

  saveStoryEvent(storyObject: Story) {
    const reqBody = {
      ownerId: this.auth.getUserDetails()?._id,
      storyObject: storyObject
    }
    this.http.post(this.baseUrl + 'addEvent/saveStory', reqBody).subscribe();
  };
  
  addAnalysisEvent(type: EventType, stats: Object){
    const user = this.auth.getUserDetails();
    if (!user || !this.auth.isLoggedIn()) return;
    let event: Event = new Event();
    event.type = type;
    event.data = stats;
    event.ownerId = user._id;
    console.log("event to record: ", event);
    return this.http.post(this.baseUrl + "addAnalysisEvent/", {event:event}).subscribe();
  }
  
  getPreviousAnalysisData(type: string): Observable<any> {
    return this.http.get(this.baseUrl + "getPreviousAnalysisData/" + type); 
  }

  getEventsForUser(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'eventsForUser/' + id);
  }

  mouseOverGrammarSuggestionEvent(tags: HighlightTag[]) {
    const user = this.auth.getUserDetails();
    if (! this.auth.isLoggedIn() || !user) {
      throw new Error('Cannot add event if user is not logged in');
    }
    const event: MouseOverGrammarSuggestionEvent =
      new MouseOverGrammarSuggestionEvent();
    event.grammarSuggestionData = tags;
    // for (const key of Object.getOwnPropertyNames(tag)) {
    //   if ( key !== 'tooltip'){
    //     event.grammarSuggestionData[key] = tags;
    //   }
    // }
    event.ownerId = user._id;
    this.http.post( this.baseUrl + '/addEvent/mouseOverGrammarError', { event: event.fromJSON(event) }).subscribe();

  }

  getEventsForStoryObject(storyId: string): Observable<any> {
    return this.http.get(this.baseUrl + 'eventsForStory/' + storyId);
  }
  
  getDictionaryLookups(id: string, startDate: string, endDate: string): Observable<any> {
    return this.http.post(this.baseUrl + 'dictionaryLookups/' + id, {startDate: startDate, endDate: endDate});
  }
}
