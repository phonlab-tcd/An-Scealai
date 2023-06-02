import { Injectable } from '@angular/core';
import { Story } from 'app/core/models/story';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService, TokenPayload } from 'app/core/services/authentication.service';
import { Observable, throwError } from 'rxjs';
import { EngagementService } from 'app/core/services/engagement.service';
import { EventType } from 'app/core/models/event';
import { TranslationService } from 'app/core/services/translation.service';
import config from 'abairconfig';


@Injectable({
  providedIn: 'root'
})
export class StoryService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthenticationService,
    private engagement: EngagementService,
    private ts: TranslationService,
  ) { }

  baseUrl: string = config.baseurl + 'story/';
  storiesLoaded: boolean = false;

  saveStory(studentId, title, date, dialect, text, author, createdWithPrompts) {
    const storyObj = {
      title: title,
      date: date,
      dialect: dialect,
      text: text,
      htmlText: text,
      author: author,
      createdWithPrompts: createdWithPrompts,
      studentId: studentId,
      lastUpdated: new Date(),
      activeRecording: null
    };
    // this.http.post<{id: string}>(this.baseUrl + 'create', storyObj)
    //   .subscribe(res => {
    //     this.engagement.addEventForLoggedInUser(EventType['CREATE-STORY'], storyObj);
    //     // this.engagement.addEventForLoggedInUser(EventType["RECORD-STORY"], storyObj);

    //     this.router.navigateByUrl('/dashboard/' + res.id);
    //   });

      this.engagement.addEventForLoggedInUser(EventType['CREATE-STORY'], storyObj);
      return this.http.post<{id: string}>(this.baseUrl + 'create', storyObj);
  }

  getStoriesFor(author : string) {
    return this.http.get(this.baseUrl + author);
  }

  getStoriesByOwner(owner: string) : Observable<Story[]>  {
    return this.http.get<Story[]>(this.baseUrl + 'owner/' + owner);
  }

  getStory(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + 'withId/' + id);
  }
  
  getStoriesByDate(studentId:string, startDate:string, endDate:string) : Observable<any> {
    return this.http.post(this.baseUrl + "getStoriesByDate/" + studentId, {startDate:startDate, endDate:endDate});
  }

  getStoriesForLoggedInUser(): Observable<Story[]> {
    const userDetails = this.auth.getUserDetails();
    if(!userDetails) {
      return new Observable(subscriber=>{
        subscriber.next([]);
        subscriber.complete();
      });
    }
    return this.getStoriesByOwner(userDetails._id);
  }

  updateStoryTitleAndDialect(story: Story, title:string, dialect:any): Observable<any> {
    let updatedStory = story;
    if (title) updatedStory.title = title;
    
    if (dialect == this.ts.l.connacht) updatedStory.dialect = 'connemara';
    if (dialect == this.ts.l.munster) updatedStory.dialect = 'kerry';
    if (dialect == this.ts.l.ulster) updatedStory.dialect = 'donegal';
    
    console.log(updatedStory);

    return this.http.post(this.baseUrl + 'update/' + story._id, updatedStory);
  }

  updateTitle(storyId: string, title:string): Observable<any> {
    return this.http.post(this.baseUrl + 'updateTitle/' + storyId, {title});
  }
  
  getStoriesForClassroom(owner: string, date = 'empty'): Observable<any> {
    return this.http.get(this.baseUrl + "getStoriesForClassroom/" + owner + "/" + date);
  }

  getNumberOfStories(owner: string, date = 'empty'): Observable<any> {
    return this.http.get(this.baseUrl + "getNumberOfStories/" + owner + "/" + date);
  }

  updateStory(updateData: any, id: string): Observable<any> {
    return this.http.post(
      this.baseUrl + 'update/' + id,
      updateData);
  }

  deleteStory(id) {
    return this.http.get(this.baseUrl + 'delete/' + id);
  }
  
  deleteAllStories(id) {
    return this.http.get(this.baseUrl + 'deleteAllStories/' + id);
  }

  addFeedback(id, feedbackText: string, feedbackMarkup: string) : Observable<any> {
    return this.http.post(this.baseUrl + "addFeedback/" + id, {feedback : feedbackText, feedbackMarkup: feedbackMarkup});
  }

  updateFeedbackMarkup(id, feedbackMarkup: string) : Observable<any> {
    return this.http.post(this.baseUrl + "updateFeedbackMarkup/" + id, {feedbackMarkup: feedbackMarkup});
  }

  getFeedback(id) : Observable<any> {
    return this.http.get(this.baseUrl + "feedback/" + id);
  }

  viewFeedback(id) : Observable<any> {
    return this.http.post(this.baseUrl + "viewFeedback/" + id, {});
  }

  getFeedbackAudio(id) : Observable<any> {
    return this.http.get(this.baseUrl + "feedbackAudio/" + id, {responseType: "blob"});
  }

  addFeedbackAudio(id, audioBlob: Blob) : Observable<any>{
    let formData = new FormData();
    formData.append('audio', audioBlob);
    return this.http.post(this.baseUrl + "addFeedbackAudio/" + id, formData);
  }

  synthesise(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'synthesise/' + id);
  }

  synthesiseObject(storyObject: Story): Observable<any> {
    return this.http.post(this.baseUrl + 'synthesiseObject/', {story: storyObject});
  }

  updateActiveRecording(storyId: string, recordingId: string): Observable<any> {
    return this.http.post(this.baseUrl + 'updateActiveRecording/' + storyId + '/', {activeRecording: recordingId});
  }
  
  averageWordCount(studentId:string, startDate:string, endDate:string) : Observable<any> {
    return this.http.post(this.baseUrl + "averageWordCount/" + studentId, {startDate:startDate, endDate:endDate});
  }
  
  countGrammarErrors(studentId:string) : Observable<any> {
    return this.http.get(this.baseUrl + "countGrammarErrors/" + studentId);
  }

  getStoryStats() : Observable<any> {
    return this.http.get(this.baseUrl + "getStoryStats/allDB");
  }
}
