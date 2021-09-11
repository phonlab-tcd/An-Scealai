import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { DefaultIterableDifferFactory } from '@angular/core/src/change_detection/change_detection';
import { Router } from '@angular/router';
import { AuthenticationService, TokenPayload } from './authentication.service';
import { Observable } from 'rxjs';
import { EngagementService } from './engagement.service';
import { EventType } from './event';
import { TranslationService } from './translation.service';
import { Message } from './message';
import { User } from './user';
import config from '../abairconfig.json';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private engagement: EngagementService,
  ) { }

  baseUrl: string = config.baseurl + 'messages/';

  /*
  * save a new message to the database
  */
  saveMessage(message: any) {
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
      .subscribe((res: any) => {
        this.engagement.addEventForLoggedInUser(EventType['CREATE-MESSAGE'], messageObj);
      });
  }

  // Return messages from the database for the logged in user
  getMessagesForLoggedInUser(): Observable<any> {
    const id = this.auth.getUserDetails()._id;
    return this.http.get(this.baseUrl + 'viewMessges/' + id);
  }

  // Return a message given the 'id' attribute
  getMessageById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'getMessageById/' + id);
  }

  // Given a message id, change the seenByRecipient value of the message to true
  markAsOpened(id: string): Observable<any> {
    return this.http.post(this.baseUrl + 'markAsOpened/' + id, {});
  }

  // Delete message from the database
  deleteMessage(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'delete/' + id);
  }

  // Return the number of messages that have not yet been read
  getNumberOfUnreadMessages(messages: Message[]): number {
    let sum = 0;
    for (const m of messages) {
      if (!m.seenByRecipient) {
        sum++;
      }
    }
    return sum;
  }

  // Return the number of messages that have not yet been read for a given class
  getNumberOfUnreadMessagesForClass(messages: Message[], studentIds: string[]): number {
    let sum = 0;
    const filteredMessages: Message[] = [];
    for (const s of studentIds) {
      for (const m of messages) {
        if (s === m.senderId) {
          filteredMessages.push(m);
        }
      }
    }
    for (const m of filteredMessages) {
      if (!m.seenByRecipient) {
        sum++;
      }
    }
    return sum;
  }

  // Get audio file from DB for assoiaated message
  getMessageAudio(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'messageAudio/' + id, {responseType: 'blob'});
  }

  // Add an audio file to the DB for associated message
  addMessageAudio(id: string, audioBlob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    return this.http.post(this.baseUrl + 'addMessageAudio/' + id, formData);
  }

  // Delete all messages for given recipient id
  deleteAllMessages(userId: string): Observable<any> {
    return this.http.get(this.baseUrl + 'deleteAllMessages/' + userId);
  }

  // Delete audio file associated with message
  deleteMessageAudio(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'deleteMessageAudio/' + id);
  }

  // Update the sender username for a given account
  updateSenderUsername(id: string, username: string): Observable<any> {
    return this.http.post(
      this.baseUrl + 'updateSenderUsername/' + id,
      {username});
  }

}
