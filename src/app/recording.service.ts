import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';  
import { Story } from './story';
import { Recording } from './recording';
import { EventType } from './event';
import { EngagementService } from './engagement.service';
import config from '../abairconfig.json';

@Injectable({
  providedIn: 'root'
})
export class RecordingService {

  constructor(private http: HttpClient, private auth: AuthenticationService, private engagement: EngagementService ) { }

  baseUrl: string = config.baseurl + 'recordings/';
  
  addRecordingForLoggedInUser(story: Object){
    if(this.auth.isLoggedIn()) {
      let recording: Recording = new Recording();
      if(story) recording.storyData = story;
      recording.userId = this.auth.getUserDetails()._id;
      recording.addedToHistory = false;
      return this.http.post(this.baseUrl + "addRecordingForUser/" + this.auth.getUserDetails()._id, {recording:recording}).subscribe( (res) => {
        this.engagement.addEventForLoggedInUser(EventType["RECORD-STORY"], story);
      });
    }
  }

  getRecordingsForStory(id: string, storyId: string): Observable<any> {
    return this.http.get(this.baseUrl + "recordingsForStory/" + id + "/" + storyId);
  }  
  
  getRecordedAudio(id: string, index: number, type: string): Observable<any> {
    return this.http.get(this.baseUrl + "getRecordedAudio/" + id + '/' + index + '/' + type, {responseType: "blob"});
  }
  
  getCurrentRecording(id: string, storyId: string): Observable<any> {
    return this.http.get(this.baseUrl + "getCurrentRecording/" + id + '/' + storyId);
  }
  
  updateRecordingText(id: string, storyText: string) {
    return this.http.post(this.baseUrl + "updateRecordingText/" + id, {text: storyText});
  }
  
  updateRecordings(id: string, index: number, type: string, audioBlob: Blob): Observable<any> {
    let formData = new FormData();
    formData.append('audio', audioBlob);
    return this.http.post(this.baseUrl + "updateRecordings/" + id + '/' + index + '/' + type, formData);
  }
  
  updateHistoryStatus(id: string): Observable<any> {
    console.log(this.baseUrl + "updateHistoryStatus/" + id);
    return this.http.post(this.baseUrl + "updateHistoryStatus/" + id, {});
  }
  
  synthesiseRecording(id: string) : Observable<any> {
    console.log(this.baseUrl + "synthesiseRecording/" + id);
    return this.http.get(this.baseUrl + 'synthesiseRecording/' + id);
  }
  
}
