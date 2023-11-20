import { Injectable } from "@angular/core";
import { Event, EventType, MouseOverGrammarSuggestionEvent, SaveStoryEvent, PlaySynthesisEvent } from "app/core/models/event";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "app/core/services/authentication.service";
import { HighlightTag } from "lib/quill-highlight/quill-highlight";
import config from "abairconfig";
import { Story } from "../models/story";

@Injectable({
  providedIn: "root",
})
export class EngagementService {
  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  baseUrl: string = config.baseurl + "engagement/";

  /**
   * Add generic event log to DB
   * @param type event type
   * @param data any optional event data
   */
  addEvent(type: EventType, data?: object) {
    this.addEventObservable(type, data).subscribe({ next: () => {}, error: (err) => console.log(err), });
  }

  addEventObservable(type: EventType, data?: object): Observable<any> {
    const user = this.auth.getUserDetails();

    if (!this.auth.isLoggedIn() || !user) {
      throw new Error("Cannot add event if user is not logged in");
    }

    const event: Event = new Event();
    event.type = type;
    if (data) event.data = data;

    return this.http.post( this.baseUrl + "addEvent/" + user._id, { event } );
  }

  /**
   * Add a 'Play Synthesis' event log to the DB
   * @param si synthesis metadata
   * @param storyId story id
   */
  addPlaySynthesisEvent(voice: string, text: string, speed: number) {
    const user = this.auth.getUserDetails();
    if (!user || !this.auth.isLoggedIn()) return;
    const event: PlaySynthesisEvent = new PlaySynthesisEvent();
    event.voice = voice;
    event.text = text;
    event.speed = speed;
    event.ownerId = user._id;
    this.http.post(this.baseUrl + "addEvent/playSynthesis", event).subscribe();
  }

  /**
   * Add a 'Save Story' event log to the DB
   * @param storyObject Story data at moment of saving
   */
  addSaveStoryEvent(storyObject: Story) {
    const user = this.auth.getUserDetails();
    if (!user || !this.auth.isLoggedIn()) return;
    const reqBody = {
      ownerId: user._id,
      storyObject: storyObject,
    };
    this.http.post(this.baseUrl + "addEvent/saveStory", reqBody).subscribe();
  }

  /**
   * Add a 'Mouse over grammar error' event log to the DB
   * @param tags grammar error tags
   */
  addMouseOverGrammarSuggestionEvent(tags: HighlightTag[]) {
    const user = this.auth.getUserDetails();
    if (!this.auth.isLoggedIn() || !user) {
      throw new Error("Cannot add event if user is not logged in");
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
    this.http.post(this.baseUrl + "/addEvent/mouseOverGrammarError", { event: event.fromJSON(event), }).subscribe();
  }

  /**
   * Add a 'Speak Story' event log to the DB
   * @param ASRdata audio blob and ASR transcript
   */
  addSpeakStoryEvent(transcript: string, audioBlob: Blob) {
    const user = this.auth.getUserDetails();
    if (!user || !this.auth.isLoggedIn()) return;
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('transcription', transcript);
    this.http.post(this.baseUrl + "addEvent/speakStory", formData).subscribe();
  }

  /**
   * Get all the dictionary word lookups for a given user
   * @param id user id
   * @param startDate optional date range start date
   * @param endDate optional date range end date
   */
  getDictionaryLookups(
    id: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this.http.post(this.baseUrl + "dictionaryLookups/" + id, { startDate: startDate, endDate: endDate, });
  }

  ///////////////////////////////////// Stats for Admin page ////////////////////////////////

  /**
   * Save an admin-generated stats object to the DB
   * @param type event stats type
   * @param stats stats summary generated on the admin page
   */
  addAnalysisEvent(type: EventType, stats: Object) {
    const user = this.auth.getUserDetails();
    if (!user || !this.auth.isLoggedIn()) return;
    let event: Event = new Event();
    event.type = type;
    event.data = stats;
    event.ownerId = user._id;
    return this.http.post(this.baseUrl + "addAnalysisEvent/", { event: event }).subscribe();
  }

  /**
   * Get admin stats summary event from the DB
   * @param type event stats type
   */
  getPreviousAnalysisData(type: string): Observable<any> {
    return this.http.get(this.baseUrl + "getPreviousAnalysisData/" + type);
  }

  /**
   * Get all stats for a given user (used on admin page)
   * @param id user id
   */
  getEventsForUser(id: string): Observable<any> {
    return this.http.get(this.baseUrl + "eventsForUser/" + id);
  }

  /**
   * Get all event types associated with a particular story
   * @param storyId story id
   */
  getEventsForStoryObject(storyId: string): Observable<any> {
    return this.http.get(this.baseUrl + "eventsForStory/" + storyId);
  }
}
