import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DefaultIterableDifferFactory } from '@angular/core/src/change_detection/change_detection';
import { Router } from '@angular/router';
import { AuthenticationService, TokenPayload } from './authentication.service';
import { Observable } from 'rxjs';
import { EngagementService } from './engagement.service';
import { EventType } from './event';
import { TranslationService } from './translation.service';
import { Message } from './message';
import config from '../abairconfig.json';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient, private router: Router,
    private auth: AuthenticationService, private engagement: EngagementService,
    private ts : TranslationService) { }
  
  baseUrl: string = config.baseurl + "messages/";

  /*
  * save a new message to the database
  */
  saveMessage(message) {
    
    const messageObj = {
      id: message.id,
      date: message.date,
      subject: message.subject,
      senderId: message.senderId,
      senderUsername: message.senderUsername,
      recipientId: message.recipientId,
      text: message.text,
      seenByRecipient: message.seenByRecipient,
    };
    
    console.log(messageObj);
    this.http.post(this.baseUrl + 'create', messageObj)
      .subscribe(res => {
        this.engagement.addEventForLoggedInUser(EventType["CREATE-MESSAGE"], messageObj);
      });
  }
  
  /*
  * Return messages from the database for the logged in user
  */
  getMessagesForLoggedInUser(): Observable<any> {
    let id = this.auth.getUserDetails()._id;
    return this.http.get(this.baseUrl + 'viewMessges/' + id);
  }
  
  /*
  * Return a message given the 'id' attribute
  */
  getMessageById(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + 'getMessageById/' + id);
  }
  
  /*
  * Given a message id, change the seenByRecipient value of the message to true
  */
  markAsOpened(id): Observable<any> {
    console.log("ID: "+ id);
    return this.http.post(this.baseUrl + "markAsOpened/" + id, {});
  }
  
  /*
  * Delete message from the database
  */
  deleteMessage(id) : Observable<any> {
    return this.http.get(this.baseUrl + 'delete/' + id);
  }
  
  /*
  * Return the number of messages that have not yet been read
  */
  getNumberOfUnreadMessages(messages: Message[]): number {
    let sum: number = 0;
    for(let m of messages) {
      if(!m.seenByRecipient) {
        sum++;
      }
    }
    return sum;
  }
  
  getMessageAudio(id) : Observable<any> {
    return this.http.get(this.baseUrl + "messageAudio/" + id, {responseType: "blob"});
  }
  
  addMessageAudio(id, audioBlob: Blob) : Observable<any> {
    let formData = new FormData();
    formData.append('audio', audioBlob);
    return this.http.post(this.baseUrl + "addMessageAudio/" + id, formData);
  }

}
