import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import config from "abairconfig";
import { FeedbackComment } from "../../core/models/feedbackComment";

@Injectable({
  providedIn: "root",
})
export class FeedbackCommentService {
  constructor(private http: HttpClient) {}

  baseUrl: string = config.baseurl + "feedbackComment";

  createNewComment(comment: FeedbackComment): Observable<any> {
    return this.http.post(`${this.baseUrl}/createNewComment/`, { comment });
  }

  getFeedbackComments(storyId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getFeedbackComments/${storyId}`);
  }

  updateFeedbackComment(comment: FeedbackComment): Observable<any> {
    return this.http.post(`${this.baseUrl}/updateFeedbackComment/`, { comment });
  }

  deleteFeedbackComment(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/deleteFeedbackComment/${id}`);
  }

  addAudioFeedback(id: string, audioBlob: Blob) : Observable<any>{
    let formData = new FormData();
    formData.append('audio', audioBlob);
    return this.http.post(this.baseUrl + "/addAudioFeedback/" + id, formData);
  }

  getAudioFeedback(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + "/getAudioFeedback/" + id, {responseType: "blob"});
  }
}
