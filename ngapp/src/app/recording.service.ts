import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';  
import { Story } from './story';
import { Recording } from './recording';
import { EventType } from './event';
import { EngagementService } from './engagement.service';
import config from '../abairconfig';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RecordingService {

  constructor(private http: HttpClient, private auth: AuthenticationService, private engagement: EngagementService ) { }

  baseUrl: string = config.baseurl + 'recordings/';

  get(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + id);
  }

  create(recording: Recording) : Observable<any> {
    return this.http.post(this.baseUrl + "create/", recording);
  }

  update(recordingId: string, trackData: Object) : Observable<any> {
    return this.http.post(this.baseUrl + "updateTracks/" + recordingId + "/", trackData);
  }

  saveAudio(storyId, audioBlob: Blob, index: string) : Observable<any> {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    return this.http.post(this.baseUrl + "saveAudio/" + storyId + "/" + index + "/" + uuid().toString(), formData);
  }

  getAudio(audioId: string) : Observable<any> {
    return this.http.get(this.baseUrl + "audio/" + audioId, {responseType: "blob"});
  }
  
  getHistory(storyId: string) : Observable<any> {
    return this.http.get(this.baseUrl + "getHistory/" + storyId);
  }
  
  updateArchiveStatus(recordingId: string) : Observable<any> {
    return this.http.get(this.baseUrl + "updateArchiveStatus/" + recordingId);
  }
  
  deleteStoryRecordingAudio(storyId: string): Observable<any> {
    return this.http.get(this.baseUrl + "deleteStoryRecordingAudio/" + storyId);
  }
  
  deleteStoryRecording(storyId: string): Observable<any> {
    return this.http.get(this.baseUrl + "deleteStoryRecording/" + storyId);
  }
  
}
