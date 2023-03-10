import { Component, OnInit } from '@angular/core';
import { Classroom } from '../classroom';
import { User } from '../user';
import { Message } from '../message';
import { UserService } from '../user.service';
import { TranslationService } from '../translation.service';
import { ClassroomService } from 'app/classroom.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { MessageService } from '../message.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProfileService } from '../profile.service';
import { NotificationService } from '../notification-service.service';
import { RecordAudioService } from '../services/record-audio.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RecordingDialogComponent } from '../dialogs/recording-dialog/recording-dialog.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  
  //message variables
  createNewMessage: boolean = false;
  students : User[] = [];
  inboxMessages: Message[] = [];
  classroom : Classroom = new Classroom;
  messageSent: boolean = false;
  teacherId: string = '';
  teacherName: string = '';
  isTeacher: Boolean = false;
  name: string = '';
  showBody: boolean = false;
  messageContent: string = '';
  numberOfUnread: number = 0;
  totalNumberOfMessages: number = 0;
  deleteMode: Boolean = false;
  toBeDeleted: string[] = [];
  lastClicked : string = '';
  newMessageText: string = '';
  newMessageSubject: string = '';
  newMessageRecipientId: string = '';
    
  //audio file variables
  audioSource : SafeUrl;
  feedbackText: string;
  feedbackSent : boolean = false;
  showAudio: boolean = false;
  dialogRef: MatDialogRef<unknown>;

  constructor(private classroomService: ClassroomService,
              private userService: UserService, 
              private route: ActivatedRoute,
              private auth: AuthenticationService, 
              public ts : TranslationService,
              private router: Router,
              private messageService: MessageService,
              protected sanitizer: DomSanitizer,
              protected profileService: ProfileService,
              protected notificationService: NotificationService,
              private recordAudioService: RecordAudioService,
              private dialog: MatDialog,) { }

  /*
  * Get classroom and student information for TEACHER, get teacher information for STUDENT 
  * Get message inbox
  * Set the date of the messages depending on the user's country
  */  
  async ngOnInit() {
    this.deleteMode = false;
    this.toBeDeleted = [];
    
    const userDetails = this.auth.getUserDetails();
    
    // Return if user not logged in to avoid calling null.role (which results in error)
    if (!userDetails) return;

    if(userDetails.role === "TEACHER") {
      this.isTeacher = true;
      this.classroom = await firstValueFrom(this.classroomService.getClassroom(this.route.snapshot.params['id']));
      this.getStudents();
    }
    if(userDetails.role === "STUDENT") {
      this.isTeacher = false;
      this.classroom = await firstValueFrom(this.classroomService.getClassroomOfStudent(userDetails._id));
      this.userService.getUserById(this.classroom.teacherId).subscribe( (res) => {
        this.teacherName = res.username;
      });
    }

    this.teacherId = this.classroom.teacherId;
    this.getMessages();
  }

    /*
  * Loop through student ids in classroom object to get student objects
  */
    getStudents() {
      this.students = [];
      for(let id of this.classroom.studentIds) {
        this.userService.getUserById(id).subscribe((res : User) => {
          this.students.push(res);
          this.students.sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
        });
      }
    }

  /*
  * Get messages form database for logged in user
  */
    getMessages() {  
      this.messageService.getMessagesForLoggedInUser().subscribe( (res: Message[]) =>{
        this.inboxMessages = [];
        if(this.isTeacher) {
          this.inboxMessages = res.filter(message => this.classroom.studentIds.includes(message.senderId))
        }
        else {
          this.inboxMessages = res;
        }
        this.inboxMessages.sort((a, b) => (a.date > b.date) ? -1 : 1)
        this.numberOfUnread = this.messageService.getNumberOfUnreadMessages(this.inboxMessages);
        this.totalNumberOfMessages = this.inboxMessages.length; 
      });
    }
  
  /*
  * Set remaining message fields that were not filled with the form 
  * Use message service to send message to the DB
  * Add audio file to DB if audio taken
  */
  async sendMessage() {
    if(this.newMessageText && this.newMessageSubject) {
      let newMessage = {
        subject: this.newMessageSubject,
        text: this.newMessageText,
        date: new Date(),
        seenByRecipient: false,
        senderUsername: this.auth.getUserDetails().username,
        senderId: this.auth.getUserDetails()._id,
      }

      let recipients = [];
      let sentMessageIds = [];
      
      if (!this.isTeacher) {
        recipients = [this.classroom.teacherId]  // recipient is the teacher
      }
      else {
        if (this.newMessageRecipientId === this.classroom._id) {
          recipients = this.classroom.studentIds;  // recipients are all students
        }
        else {
          recipients = [this.newMessageRecipientId]  // recipient is selected student
        }
      }
      
      // for each recipient, save a message for them in the DB
      for (const id of recipients) {
        let sentMessage = await firstValueFrom(this.messageService.saveMessage(newMessage, id));
        sentMessageIds.push(sentMessage._id);
      }

      // Add audio to each sent message if recorded
      if(this.audioSource) {
        for(let id of sentMessageIds) {
          this.recordAudioService.saveAudioMessage(id);
        }
      }
      this.createNewMessage = false;
    }
    else {
      alert("Message empty");
    }
  }
  

  /*
  * Rerout the user to homepage depending on student/teacher
  */  
  goBack() {
    if(this.createNewMessage) {
      this.createNewMessage = false;
      this.audioSource = null;
    }
    else {
      if(this.isTeacher) {
        this.router.navigateByUrl(`teacher/classroom/${this.classroom._id}`);
      }
      else {
        this.router.navigateByUrl('contents');
      }
    }
  }
  
  /*
  * Set the parameters for showing the message body
  * Set the CSS class for a clicked message
  * Update nav bar notifications at the top of the screen
  */
  showMessageBody(message: Message) {
    if(message) {
      let id = "message-" + message._id;
      let messageElement = document.getElementById(id);
      
      if(this.lastClicked != '') {
        let previousMessage = document.getElementById(this.lastClicked);
        previousMessage.classList.remove("clickedresultCard");
      }
      this.lastClicked = id;
      messageElement.classList.add("clickedresultCard");
      
      this.messageContent = message.text;
      
      if(!message.seenByRecipient) {
        this.numberOfUnread--;
        this.messageService.markAsOpened(message._id).subscribe(() => {
          message.seenByRecipient = true;
          // reset notifications in nav bar
          this.resetMessages();
        });
      }
      
      if(message.audioId) {
        this.getMessageAudio(message._id);
        this.showAudio = true;
      }
      else {
        this.showAudio = false;
      }

      if(message.subject === "New Dictogloss") {
        this.sendToDictogloss(message.text);
      }
      
    }
  }

  sendToDictogloss(passage: string){
    this.router.navigateByUrl('/dictogloss', {state: {text: passage} });
  }
  
  /*
  * get audio message from the database using the message service and message id
  */
  getMessageAudio(id: string) {
    this.messageService.getMessageAudio(id).subscribe((res) => {
      if(res) {
        this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
      }
    });
  }
  
  /* 
  * Open Recording Dialog Box 
  */
  openRecordingDialog() {
    this.dialogRef = this.dialog.open(RecordingDialogComponent, {
      data: {
        type: 'messageAudio',
        id: "test",
        confirmButton: this.ts.l.add_to_message
      },
      width: '30vh',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        if(res) {
          this.audioSource = res;
        }
    });
  }

  // clear out audio source if it exists and close new messsage
    resetForm() {
      if(this.audioSource) {
        this.audioSource = null;
      }
      this.createNewMessage = false;
    }

  /* delete messages added to the to be deleted array
  * deletes message using the message service 
  * deletes associated audio files if there are any
  */
    toggleDeleteMode() {
      if(this.deleteMode && this.toBeDeleted.length > 0) {
        for(let id of this.toBeDeleted) {
          this.messageService.deleteMessageAudio(id).subscribe( (res) => {
            if(res) {
            }
          });
        
          this.messageService.deleteMessage(id).subscribe(
            res => {
              //this.ngOnInit();
            }
          );
        }
        this.lastClicked = '';
        this.ngOnInit();
      } else if(this.deleteMode && this.toBeDeleted.length === 0) {
        this.deleteMode = false;
      } else {
        this.deleteMode = true;
      }
    }

  //add message to be deleted to an array given the message id as a paramter
    toggleDelete(id: string) {
      if(this.toBeDeleted.includes(id)) {
        var indexToRemove = this.toBeDeleted.indexOf(id);
        this.toBeDeleted.splice(indexToRemove, 1);
      } else {
        this.toBeDeleted.push(id);
      }
    }
    
  //reset the notifications at the nav bar on the top of the screen
    resetMessages() {
      this.isTeacher ? this.notificationService.getTeacherNotifications(): this.notificationService.getStudentNotifications(); 
    }
}
