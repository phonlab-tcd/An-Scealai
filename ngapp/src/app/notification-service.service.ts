import { Injectable } from "@angular/core";
import { StoryService } from "./story.service";
import { MessageService } from "./message.service";
import { Story } from "./core/models/story";
import { Classroom } from "./core/models/classroom";
import { AuthenticationService } from "./authentication.service";
import { Message } from "./core/models/message";
import { ClassroomService } from "./classroom.service";
import { TranslationService } from "./translation.service";
import { firstValueFrom, Subject } from "rxjs";

export type TeacherMessage = {
  classroom: Classroom;
  numClassroomMessages: number;
};

export type Notification = {
  header: string;
  body: Story[] | Message[] | TeacherMessage[];
};

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  notifications: Notification[] = [];
  notificationEmitter = new Subject<Notification[]>();

  constructor(
    private storyService: StoryService,
    private auth: AuthenticationService,
    private messageService: MessageService,
    private classroomService: ClassroomService,
    private ts: TranslationService
  ) {}

  /**
   * Get stories and messages for student notifications
   */
  async getStudentNotifications() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    this.notifications = [];

    // get stories and filter to ones that haven't viewed feedback
    let storyRes: Story[] = await firstValueFrom(this.storyService.getStoriesForLoggedInUser());
    let stories = storyRes.filter(
      (story) =>
        story &&
        story.feedback.seenByStudent === false &&
        (story.feedback.text ||
          story.feedback.audioId ||
          story.feedback.feedbackMarkup)
    );
    // create notification entry for stories
    let storyNotifications: Notification = {
      header: this.ts.l.new_feedback,
      body: stories,
    };
    this.notifications.push(storyNotifications);

    // get messages and filter to ones that have not been viewed
    let messageRes: Message[] = await firstValueFrom(this.messageService.getMessagesForLoggedInUser());
    let messages = messageRes.filter(
      (message) => message.seenByRecipient === false
    );

    // create notification entry for messages
    let messageNotifications: Notification = {
      header: this.ts.l.new_messages,
      body: messages,
    };
    this.notifications.push(messageNotifications);

    // emit new (updated) messages to app component
    this.notificationEmitter.next(this.notifications);
  }

  /**
   * Get classroom messages for teacher notifications
   */
  async getTeacherNotifications() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    this.notifications = [];

    this.classroomService.getClassroomsForTeacher(userDetails._id).subscribe((res) => {
      let classrooms = res;
      this.messageService.getMessagesForLoggedInUser().subscribe((messages: Message[]) => {
          let classMessages: TeacherMessage[] = [];
          // get number of unread messages for each classroom, push classrom and count onto array
          for (let c of classrooms) {
            let numberOfMessages = this.messageService.getNumberOfUnreadMessagesForClass(messages, c.studentIds);
            if (numberOfMessages > 0) {
              classMessages.push({
                classroom: c,
                numClassroomMessages: numberOfMessages,
              });
            }
          }
          // create notification entry for teacher messages
          let classNotification: Notification = {
            header: this.ts.l.new_messages,
            body: classMessages,
          };
          this.notifications.push(classNotification);
          // emit new (updated) messages to app component
          this.notificationEmitter.next(this.notifications);
        });
    });
  }
}
