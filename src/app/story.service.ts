import { Injectable } from '@angular/core';
import { Story } from './story';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DefaultIterableDifferFactory } from '@angular/core/src/change_detection/change_detection';
import { Router } from '@angular/router';
import { AuthenticationService, TokenPayload } from './authentication.service';
import { Observable } from 'rxjs';
import { EngagementService } from './engagement.service';
import { EventType } from './event';
import { TranslationService } from './translation.service';
import config from '../abairconfig.json';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  chosenStory: Story;

  constructor(private http: HttpClient, private router: Router,
    private auth: AuthenticationService, private engagement: EngagementService,
    private ts : TranslationService) { }

  baseUrl: string = config.baseurl + "story/";

  saveStory(id, title, date, dialect, text, author) {
    const storyObj = {
      id: id,
      title: title,
      date: date,
      dialect: dialect,
      text: text,
      author: author
    };
    console.log(storyObj);
    this.http.post(this.baseUrl + 'create', storyObj)
      .subscribe(res => {
        this.engagement.addEventForLoggedInUser(EventType["CREATE-STORY"], storyObj);
        this.router.navigateByUrl('/dashboard/' + id);
      });
  }

  getStoriesFor(author : string) {
    return this.http.get(this.baseUrl+author);
  }

  getStory(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + 'getStoryById/' + id);
  }

  getStoryBy_id(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + 'getStoryByUnderscoreId/' + id);
  }

  getStoriesForLoggedInUser() {
    let author = this.auth.getUserDetails().username;
    return this.http.get(this.baseUrl+author);
  }

  updateStory(data, id) : Observable<any> {
    return this.http.post(this.baseUrl + 'update/' +id, data);
  }

  deleteStory(id) {
    return this.http.get(this.baseUrl + 'delete/' + id);
  }
  
  deleteAllStories(author) {
    return this.http.get(this.baseUrl + 'deleteAllStories/' + author);
  }

  addFeedback(id, feedbackText: string) : Observable<any> {
    return this.http.post(this.baseUrl + "addFeedback/" + id, {feedback : feedbackText});
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

  synthesise(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + 'synthesise/' + id);
  }

  gramadoir(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + 'gramadoir/' + id + '/' + this.ts.l.iso_code);
  }
}
