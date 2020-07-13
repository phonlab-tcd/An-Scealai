import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StoryService } from './story.service';
import { MessageService } from './message.service';
import { Story } from './story';
import { AuthenticationService } from './authentication.service';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _messages: BehaviorSubject<Story[]>;
  private dataStore: {
    stories: Story[],
    messages: Message[]
  }
  

  constructor(private storyService : StoryService, private auth: AuthenticationService, private messageService: MessageService ) {
    this.dataStore = { stories: [], messages: [] };
    this._messages = <BehaviorSubject<Story[]>>new BehaviorSubject([]);
    if(this.auth.isLoggedIn()) {
      this.getNotifications();
    }
  }

/*
* Fill dataStore stories array with stories where the student has not yet viewed the feedback
*/
  getNotifications() {
    this.storyService.getStoriesForLoggedInUser().subscribe((res : Story[]) => {
      let stories = res;
      for(let story of stories) {
        if(story.feedback.seenByStudent === false) {
          this.dataStore.stories.push(story);
        }
      }
      this.loadObservable();
    });
  }

/*
* Fill _stories array with data from dataStore
*/
  private loadObservable() {
    this._messages.next(Object.assign({}, this.dataStore).stories);
  }

/*
* Return the list of stories that have not viewed feedback
*/
  getStories() {
    return this._messages.asObservable();
  }
  
  getMessages() {
    this.messageService.getMessagesForLoggedInUser().subscribe((res : Message[]) => {
      let messages = res;
      for(let m of messages) {
        if(m.seenByRecipient === false) {
          this.dataStore.messages.push(m);
        }
      }
      this.loadObservable(); //// NEEDS FIXING 
    });
  }
  

/*
* remove a story from the 'not yet viewed feedback' array 
*/
  removeStory(story: Story) {
    for(let s of this.dataStore.stories) {
      if(s._id === story._id) {
        let i = this.dataStore.stories.indexOf(s);
        this.dataStore.stories.splice(i, 1);
        this.loadObservable();
      }
    }
  }

}
