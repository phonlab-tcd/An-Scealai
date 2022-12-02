import { Injectable } from '@angular/core';
import { Event, EventType, MouseOverGrammarSuggestionEvent } from './event';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SynthItem } from './synth-item';
import { AuthenticationService } from './authentication.service';
import { QuillHighlightTag } from './services/quill-highlight.service';
import config from 'abairconfig';

@Injectable({
  providedIn: 'root'
})
export class EngagementService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  baseUrl: string = config.baseurl + 'engagement/';

  playSynthesis(si: SynthItem, storyId: string) {
    const info = {
      voice: si.voice,
      text: si.text,
      time: Date(),
      user: this.auth.getUserDetails(),
      storyId: storyId,
    };
    console.log(info);
    this.http.post(this.baseUrl + 'addEvent/playSynthesis', info).subscribe();
  };

  addEventForLoggedInUser(type: EventType, storyData?: object, dictionaryLookup?: string){
    this.addEventObservable(type, storyData, dictionaryLookup).subscribe();
  }

  addEventObservable(type: EventType, storyData: object, dictionaryLookup: string): Observable<any> {
    if (! this.auth.isLoggedIn()) {
      throw new Error('Cannot add event if user is not logged in');
    }

    const event: Event = new Event();
    event.type = type;
    if (storyData) { event.storyData = storyData; }
    if (dictionaryLookup) { event.dictionaryLookup = dictionaryLookup; }
    event.userId = this.auth.getUserDetails()._id;

    return this.http
        .post(this.baseUrl + 'addEventForUser/' +
              event.userId,
              { event });
  }
  
  addAnalysisEvent(type: EventType, stats: Object) {
    if(this.auth.isLoggedIn()) {
      let event: Event = new Event();
      event.type = type;
      event.statsData = stats;
      event.userId = this.auth.getUserDetails()._id;
      console.log("event to record: ", event);
      return this.http.post(this.baseUrl + "addAnalysisEvent/", {event:event}).subscribe();
    }
  }
  
  getPreviousAnalysisData(type: string): Observable<any> {
    return this.http.get(this.baseUrl + "getPreviousAnalysisData/" + type); 
  }

  getEventsForUser(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'eventsForUser/' + id);
  }

  mouseOverGrammarSuggestionEvent(tag: QuillHighlightTag) {
    if (! this.auth.isLoggedIn()) {
      throw new Error('Cannot add event if user is not logged in');
    }
    const event: MouseOverGrammarSuggestionEvent =
      new MouseOverGrammarSuggestionEvent();
    event.type = EventType['MOUSE-OVER-GRAMMAR-SUGGESTION'];
    event.grammarSuggestionData = {};
    for (const key of Object.getOwnPropertyNames(tag)) {
      if ( key !== 'tooltip'){
        event.grammarSuggestionData[key] = tag[key];
      }
    }
    event.userId = this.auth.getUserDetails()._id;
    this.http
        .post(
            this.baseUrl + 'addEventForUser/' + event.userId,
            { event: event.fromJSON(event) })
        .subscribe();

  }

  getEventsForStory(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'eventsForStory/' + id);
  }
  
  getDictionaryLookups(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'dictionaryLookups/' + id)
  }
}
