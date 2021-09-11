import { Injectable } from '@angular/core';
import { Story } from './story';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
//import { DefaultIterableDifferFactory } from '@angular/core/src/change_detection/change_detection';
import { Router } from '@angular/router';
import { AuthenticationService, TokenPayload } from './authentication.service';
import { Observable } from 'rxjs';
// import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { EngagementService } from './engagement.service';
import { RecordingService } from './recording.service';
import { EventType } from './event';
import { TranslationService } from './translation.service';
import config from '../abairconfig.json';


@Injectable({
  providedIn: 'root'
})
export class StoryService {

  chosenStory: Story;

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthenticationService,
    private engagement: EngagementService,
    private ts: TranslationService,
    private recordingService: RecordingService
  ) { }

  baseUrl: string = config.baseurl + 'story/';

  saveStory(studentId: any, title: any, date: any, dialect: any, text: any, author: any) {
    const storyObj = {
      title: title,
      date: date,
      dialect: dialect,
      text: text,
      htmlText: text,
      author: author,
      studentId: studentId,
      lastUpdated: new Date(),
      activeRecording: null as any
    };
    console.log(storyObj);
    this.http.post(this.baseUrl + 'create', storyObj)
      .subscribe((res: any) => {
        this.engagement.addEventForLoggedInUser(EventType["CREATE-STORY"], storyObj);
        //this.engagement.addEventForLoggedInUser(EventType["RECORD-STORY"], storyObj);
        //this.recordingService.addRecordingForLoggedInUser(storyObj);
        this.router.navigateByUrl('/dashboard/' + res["id"]);
      });
  }

  getStoriesFor(author : string) {
    return this.http.get(this.baseUrl+author);
  }

  getStory(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + 'getStoryById/' + id);
  }

  getStoriesForLoggedInUser(): Observable<Story[]> {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) {
      return new Observable<Story[]>();
    }

    const author = userDetails.username;
    return this.http.get<Story[]>(this.baseUrl + author);
  }

  updateStoryTitleAndDialect(story: Story): Observable<any> {
    return this.http.post(this.baseUrl + 'update/' + story._id, story);
  }
  
  getStoriesForClassroom(author: string, date: any): Observable<any> {
    return this.http.get(this.baseUrl + "getStoriesForClassroom/" + author + "/" + date);
  }

  updateStory(storyUpdate: object, id: string): Observable<any> {
    return this.http.post(
      this.baseUrl + 'update/' + id,
      storyUpdate);
  }
  
  updateAuthor(oldAuthor: string, newAuthor: string): Observable<any> {
    return this.http.post(this.baseUrl + 'updateAuthor/' + oldAuthor, {newAuthor: newAuthor});
  }

  deleteStory(id: string) {
    return this.http.get(this.baseUrl + 'delete/' + id);
  }
  
  deleteAllStories(author: string) {
    return this.http.get(this.baseUrl + 'deleteAllStories/' + author);
  }

  addFeedback(id: string, feedbackText: string) : Observable<any> {
    return this.http.post(this.baseUrl + "addFeedback/" + id, {feedback : feedbackText});
  }

  getFeedback(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + "feedback/" + id);
  }

  viewFeedback(id: string) : Observable<any> {
    return this.http.post(this.baseUrl + "viewFeedback/" + id, {});
  }

  getFeedbackAudio(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + "feedbackAudio/" + id, {responseType: "blob"});
  }

  addFeedbackAudio(id: string, audioBlob: Blob) : Observable<any>{
    let formData = new FormData();
    formData.append('audio', audioBlob);
    return this.http.post(this.baseUrl + "addFeedbackAudio/" + id, formData);
  }

  synthesise(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'synthesise/' + id);
  }

  gramadoirViaBackend(id: string): Observable<any> {
    return this
      .http
      .get(
        // URL
        this.baseUrl + 'gramadoir/' + id + '/' + this.ts.l.iso_code);
  }

  gramadoirDirect(text: string): Observable<any> {
    return this
      .http
      .post('https://www.abair.ie/cgi-bin/api-gramadoir-1.0.pl', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        observe: 'body',
        params: {
          teacs: text.replace(/\n/g, ' '),
          teanga: this.ts.l.iso_code,
        },
      });
  }

  synthesiseObject(storyObject: Story): Observable<any> {
    return this.http.post(this.baseUrl + 'synthesiseObject/', {story: storyObject});
  }

  updateActiveRecording(storyId: string, recordingId: string): Observable<any> {
    return this.http.post(this.baseUrl + 'updateActiveRecording/' + storyId + '/', {activeRecording: recordingId});
  }
}
