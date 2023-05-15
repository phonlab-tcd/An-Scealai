import { Component, OnInit } from "@angular/core";
import { Classroom } from "../core/models/classroom";
import { User } from "../core/models/user";
import { Message } from "../core/models/message";
import { UserService } from "../core/services/user.service";
import { TranslationService } from "app/core/services/translation.service";
import { ClassroomService } from "app/core/services/classroom.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "app/core/services/authentication.service";
import { MessageService } from "app/core/services/message.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NotificationService } from "app/core/services/notification-service.service";
import { RecordAudioService } from "../core/services/record-audio.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { RecordingDialogComponent } from "../dialogs/recording-dialog/recording-dialog.component";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.scss"],
})
export class MessagesComponent implements OnInit {
  // user dependent variables
  classroom: Classroom = new Classroom();
  students: User[] = [];
  teacherId: string = "";
  teacherName: string = "";
  isTeacher: Boolean = false;

  // inbox variables
  inboxMessages: Message[] = [];
  numberOfUnread: number = 0;
  messageText: string = "";
  totalNumberOfMessages: number = 0;
  lastClickedMessageId: string = "";
  deleteMode: Boolean = false;
  toBeDeleted: string[] = [];
  dictoglossMessage: string = "Go to dictogloss";
  dictoglossContent: string = "";

  // create new message variables
  createNewMessage: boolean = false;
  newMessageText: string = "";
  newMessageSubject: string = "";
  newMessageRecipientId: string = "";
  messageSent: boolean = false;

  // record audio variables
  audioSource: SafeUrl;
  showAudio: boolean = false;
  dialogRef: MatDialogRef<unknown>;

  constructor(
    private classroomService: ClassroomService,
    private userService: UserService,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    public ts: TranslationService,
    private router: Router,
    private messageService: MessageService,
    protected sanitizer: DomSanitizer,
    protected notificationService: NotificationService,
    private recordAudioService: RecordAudioService,
    private dialog: MatDialog
  ) {}

  /*
   * Get classroom information depending on user role
   * Get message inbox
   */
  async ngOnInit() {
    this.deleteMode = false;
    this.toBeDeleted = [];
    this.messageText = "";
    this.showAudio = false;

    const userDetails = this.auth.getUserDetails();

    // Return if user not logged in to avoid calling null.role (which results in error)
    if (!userDetails) return;

    if (userDetails.role === "TEACHER") {
      this.isTeacher = true;
      this.classroom = await firstValueFrom( this.classroomService.getClassroom(this.route.snapshot.params["id"]) );
      this.getStudents();
    }
    if (userDetails.role === "STUDENT") {
      this.classroom = await firstValueFrom( this.classroomService.getClassroomOfStudent(userDetails._id) );
      // get teacher username to display as recipient for sending a new message
      this.userService.getUserById(this.classroom.teacherId).subscribe({
        next: res => this.teacherName = res.username,
        error: () => {console.log(this.classroom.teacherId + " does not exist")}
      });
    }

    this.teacherId = this.classroom.teacherId;
    this.getMessages();
  }

  /*
   * Loop through student ids in classroom to get student user objects
   * These students are for the teacher send to dropdown in the HTML
   */
  getStudents() {
    this.students = [];
    for (let id of this.classroom.studentIds) {
      this.userService.getUserById(id).subscribe({
        next: (res: User) => {
          this.students.push(res);
          this.students.sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()) )
        },
        error: () => {console.log(id + " does not exist")}
      });
    }
  }

  /*
   * Get inbox messages from database for logged-in user
   */
  getMessages() {
    this.messageService.getMessagesForLoggedInUser().subscribe((res: Message[]) => {
      this.inboxMessages = [];
      if (this.isTeacher) {
        this.inboxMessages = res.filter((message) => this.classroom.studentIds.includes(message.senderId) );
      } else {
        this.inboxMessages = res;
      }
      this.inboxMessages.sort((a, b) => (a.date > b.date ? -1 : 1));
      this.numberOfUnread = this.messageService.getNumberOfUnreadMessages( this.inboxMessages );
      this.totalNumberOfMessages = this.inboxMessages.length;
    });
  }

  /*
   * Set the parameters for showing the body of an inbox message
   * Set the CSS class for a clicked message
   * Update nav bar notifications at the top of the screen
   */
  showMessageBody(message: Message) {
    if (message) {
      let id = message._id;
      let messageElement = document.getElementById(id);

      // remove css highlighting for currently highlighted message
      if (this.lastClickedMessageId) {
        document.getElementById(this.lastClickedMessageId).classList.remove("clickedresultCard");
      }
      this.lastClickedMessageId = id;
      // add css highlighting to the newly clicked message
      messageElement.classList.add("clickedresultCard");

      // if the message is for a Dictogloss, show pre-written content,
      // otherwise display regular message body
      if (message.subject === "Dictogloss") {
        this.messageText = this.dictoglossMessage;
        this.dictoglossContent = message.text;
      } else {
        this.messageText = message.text;
      }

      // reset unread message notifications
      if (!message.seenByRecipient) {
        this.numberOfUnread--;
        this.messageService.markAsOpened(message._id).subscribe(() => {
          message.seenByRecipient = true;
          // reset notifications in nav bar
          this.resetMessageNotifications();
        });
      }

      // load audio message if it exists
      if (message.audioId) {
        this.getMessageAudio(message._id);
        this.showAudio = true;
      } else {
        this.showAudio = false;
      }
    }
  }

  /*
   * Get audio message from the database using the message service and message id
   */
  async getMessageAudio(id: string) {
    let audioRes = await firstValueFrom( this.messageService.getMessageAudio(id) );
    if (audioRes) {
      this.audioSource = this.sanitizer.bypassSecurityTrustUrl( URL.createObjectURL(audioRes) );
    }
  }

  //reset the notifications at the nav bar on the top of the screen
  resetMessageNotifications() {
    this.isTeacher
      ? this.notificationService.getTeacherNotifications()
      : this.notificationService.getStudentNotifications();
  }

  /*
   * Set all fields for a new message
   * Use message service to send message to the DB
   * Add audio file to DB if audio recorded
   */
  async sendMessage() {
    if (this.newMessageText && this.newMessageSubject) {
      // create a new message
      let newMessage = {
        subject: this.newMessageSubject,
        text: this.newMessageText,
        date: new Date(),
        seenByRecipient: false,
        senderUsername: this.auth.getUserDetails().username,
        senderId: this.auth.getUserDetails()._id,
      };

      let recipients = [];
      let sentMessageIds = [];

      // calculate the recipients of the message
      if (!this.isTeacher) {
        recipients = [this.classroom.teacherId]; // recipient is the teacher
      } else {
        if (this.newMessageRecipientId === this.classroom._id) {
          recipients = this.classroom.studentIds; // recipients are all students
        } else {
          recipients = [this.newMessageRecipientId]; // recipient is selected student
        }
      }

      // for each recipient, save a message for them in the DB (i.e. just one person or each student in a class)
      for (const id of recipients) {
        let sentMessage = await firstValueFrom( this.messageService.saveMessage(newMessage, id) );
        sentMessageIds.push(sentMessage._id); // these ids are used for saving any audio to the messages
      }

      // Add audio to each sent message if recorded
      if (this.audioSource) {
        for (let id of sentMessageIds) {
          this.recordAudioService.saveAudioMessage(id);
        }
      }
      this.createNewMessage = false;
    } else {
      alert("Message empty");
    }
  }

  /**
   * Clear out audio source if it exists and close new messsage
   */
  resetForm() {
    if (this.audioSource) {
      this.audioSource = null;
    }
    this.createNewMessage = false;
  }

  /**
   * Re-route the user to the Dictogloss component
   */
  sendToDictogloss() {
    if (this.dictoglossContent) {
      this.router.navigateByUrl("/dictogloss", { state: { text: this.dictoglossContent }, });
    }
  }

  /*
   * Open Recording Dialog Box
   */
  openRecordingDialog() {
    this.dialogRef = this.dialog.open(RecordingDialogComponent, {
      data: {
        type: "messageAudio",
        id: "test",
        confirmButton: this.ts.l.add_to_message,
      },
      width: "30vh",
    });

    this.dialogRef.afterClosed().subscribe((res) => {
      this.dialogRef = undefined;
      if (res) {
        this.audioSource = res;
      }
    });
  }

  /* delete messages added to the to be deleted array
   * deletes message using the message service
   * deletes associated audio files if there are any
   */
  async toggleDeleteMode() {
    if (this.deleteMode && this.toBeDeleted.length > 0) {
      for (let id of this.toBeDeleted) {
        this.messageService.deleteMessageAudio(id).subscribe((_) => {});
        this.messageService.deleteMessage(id).subscribe((_) => {});
      }
      this.lastClickedMessageId = "";
      await this.ngOnInit();
    } else if (this.deleteMode && this.toBeDeleted.length === 0) {
      this.deleteMode = false;
    } else {
      this.deleteMode = true;
    }
  }

  //add message to be deleted to an array given the message id as a paramter
  toggleDelete(id: string) {
    if (this.toBeDeleted.includes(id)) {
      let indexToRemove = this.toBeDeleted.indexOf(id);
      this.toBeDeleted.splice(indexToRemove, 1);
    } else {
      this.toBeDeleted.push(id);
    }
  }

  /*
   * If creating a new message, hide the view
   * Otherwise re-route the user to homepage depending on role
   */
  goBack() {
    if (this.createNewMessage) {
      this.createNewMessage = false;
      this.audioSource = null;
    } else {
      if (this.isTeacher) {
        this.router.navigateByUrl(`teacher/classroom/${this.classroom._id}`);
      } else {
        this.router.navigateByUrl("contents");
      }
    }
  }
}
