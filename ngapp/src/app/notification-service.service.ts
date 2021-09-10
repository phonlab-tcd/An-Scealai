import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StoryService } from './story.service';
import { MessageService } from './message.service';
import { Story } from './story';
import { Classroom } from './classroom';
import { AuthenticationService } from './authentication.service';
import { Message } from './message';
import { ClassroomService } from './classroom.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  stories: Story[] = [];
  messages: Message[] = [];
  teacherMessages: Map<Classroom, number> = new Map();
  storyEmitter = new EventEmitter();
  messageEmitter = new EventEmitter();
  teacherMessageEmitter = new EventEmitter();
  

  constructor(private storyService : StoryService, private auth: AuthenticationService, private messageService: MessageService,
              private classroomService: ClassroomService) {
  }

  /*
  * Set the message data structure for either student or teacher depending on
  * who is logged in.  Update student feedback notificaitons if student.
  * Emit data structures to the app component for constent updating
  */
  setNotifications() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    if(userDetails.role == "STUDENT") {
      this.messageService.getMessagesForLoggedInUser().subscribe((res : Message[]) => {
        this.messages = [];
        let messages = res;
        for(let m of messages) {
          if(m.seenByRecipient === false) {
            this.messages.push(m);
          }
        }
        this.messageEmitter.emit(this.messages);
      });
      this.storyService.getStoriesForLoggedInUser().subscribe((res : Story[]) => {
        this.stories = [];
        let stories = res;
        for(let story of stories) {
          if(story &&
             story.feedback &&
             story.feedback.seenByStudent === false) {
            this.stories.push(story);
          }
        }
        this.storyEmitter.emit(this.stories);
      });
    }
    if(userDetails.role == "TEACHER") {
      this.classroomService.getClassroomsForTeacher(userDetails._id).subscribe( (res) => {
        this.teacherMessages.clear();
        let classrooms = res;
        this.messageService.getMessagesForLoggedInUser().subscribe( (messages: Message[]) => {
          for(let c of classrooms) {
            let numberOfMessages = this.messageService.getNumberOfUnreadMessagesForClass(messages, c.studentIds);
            this.teacherMessages.set(c, numberOfMessages);
          }
          this.teacherMessageEmitter.emit(this.teacherMessages);
        });
      });
    }
  }

  /*
  * Remove a story from the feedback message array
  */
  removeStory(story: Story) {
    for(let s of this.stories) {
      if(s._id === story._id) {
        let i = this.stories.indexOf(s);
        this.stories.splice(i, 1);
        this.storyEmitter.emit(this.stories);
      }
    }
  }
  
  /*
  * Remove a message notification from student message account
  */
  removeMessage(message: Message) {
    for(let m of this.messages) {
      let i = this.messages.indexOf(m);
      this.messages.splice(i, 1);
      this.messageEmitter.emit(this.messages);
    }  
  }
  
  /*
  * Decrease number of messages for a given classroom given the id of the 
  * sender for the message
  */
  removeTeacherMessage(id: string) {
    for (let entry of Array.from(this.teacherMessages.entries())) {
      if(entry[0].studentIds.includes(id)) {
        let amount = entry[1];
        amount--;
        this.teacherMessages.set(entry[0], amount);
        this.teacherMessageEmitter.emit(this.teacherMessages);
      }
    }
  }

}
