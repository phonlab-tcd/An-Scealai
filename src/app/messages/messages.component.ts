import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Classroom } from '../classroom';
import { Observable } from 'rxjs';
import { User } from '../user';
import { Message } from '../message';
import { UserService } from '../user.service';
import { TranslationService } from '../translation.service';
import { ClassroomService } from 'src/app/classroom.service';
import { Router, ActivatedRoute } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { AuthenticationService } from '../authentication.service';
import { MessageService } from '../message.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProfileService } from '../profile.service';
import { NotificationService } from '../notification-service.service';

declare var MediaRecorder : any;

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  
  //messages 
  createNewMessage: boolean = false;
  students : User[] = [];
  receivedMessages: Message[] = [];
  classroom : Classroom = new Classroom;
  messageSent: boolean = false;
  studentId: string = '';
  teacherId: string = '';
  teacherName: string = '';
  isTeacher: Boolean = false;
  isStudent: Boolean = false;
  name: string = '';
  showBody: boolean = false;
  messageContent: string = '';
  numberOfUnread: number = 0;
  totalNumberOfMessages: number = 0;
  deleteMode: Boolean = false;
  toBeDeleted: string[] = [];
  isFromAmerica: boolean = false;
  
  //used for creating a new message
  message: Message = {
    _id: '',
    id: '',
    subject: '',
    date: new Date(),
    senderId: '',
    senderUsername: '',
    recipientId: '',
    text: '',
    seenByRecipient: false,
    audioId: ''
  };
  
  //audio files 
  modalClass : string = "hidden";
  recording: boolean = false;
  audioSource : SafeUrl;
  feedbackText: string;
  feedbackSent : boolean = false;
  newRecording : boolean = false;
  showListenBack : boolean = false;
  canSendAudio : boolean = false;
  showAudio: boolean = false;
  blob: any;

  errorText : string;
  registrationError : boolean;

  recorder;
  stream;
  chunks;


  constructor(private classroomService: ClassroomService,
              private userService: UserService, 
              private route: ActivatedRoute,
              private auth: AuthenticationService, 
              public ts : TranslationService,
              private router: Router,
              private messageService: MessageService,
              protected sanitizer: DomSanitizer,
              protected profileService: ProfileService,
              protected notificationService: NotificationService) { }

  
  ngOnInit() {
    this.deleteMode = false;
    this.toBeDeleted = [];
    
    if(this.auth.getUserDetails().role === "TEACHER") {
      this.isTeacher = true;
      this.getClassroom();
      this.teacherId = this.auth.getUserDetails()._id;
    }
    else {
      this.studentId = this.auth.getUserDetails()._id;
      this.classroomService.getClassroomOfStudent(this.studentId).subscribe((res: Classroom) => {
        this.classroom = res;
        this.teacherId = this.classroom.teacherId;
        this.userService.getUserById(this.teacherId).subscribe( (res) => {
          this.teacherName = res.username;
        });
      });
      this.isStudent = true;
      this.getMessages();
    }
    
    
    // get date format for user 
    this.profileService.getForUser(this.auth.getUserDetails()._id).subscribe((res) => {
      let p = res.profile;
      let country = p.country;
      if(country == "United States of America" || country == "America") {
        this.isFromAmerica = true;
      }
      else {
        this.isFromAmerica = false;
      }
    });
  }
  
  /*
  * Set remaining message fields that were not filled with the form 
  * Use message service to send message to the DB
  */
  sendMessage() {
    this.message.id = uuid();
    this.message.date = new Date();
    this.message.seenByRecipient = false;
    this.message.senderUsername = this.auth.getUserDetails().username;

    if(this.isTeacher) {
      this.message.senderId = this.teacherId;
    }
    if(this.isStudent) {
      this.message.senderId = this.studentId;
      this.message.recipientId = this.teacherId;
    }

    this.messageService.saveMessage(this.message);
    // add audio file to database if recorded
    if(this.canSendAudio) {
      this.messageService.getMessageById(this.message.id).subscribe((res) => {
        this.messageService.addMessageAudio(res._id, this.blob).subscribe((res) => {
          this.hideModal();
        }, (err) => {
          this.errorText = err.message;
          this.registrationError = true;
        });
      })
      
    }
    this.createNewMessage = false;
  }
  
  /*
  * Get messages form database for logged in user
  */
  getMessages() {  
    this.messageService.getMessagesForLoggedInUser().subscribe( (res: Message[]) =>{
      this.receivedMessages = [];
      if(this.auth.getUserDetails().role === "TEACHER") {
        let messages = res;
        for(let m of messages) {
          for(let s of this.students) {
            if(s._id === m.senderId) {
              this.receivedMessages.push(m);
            }  
          }
        }
      }
      else {
          this.receivedMessages = res;
      }
      
      this.receivedMessages.sort((a, b) => (a.date > b.date) ? -1 : 1)
      this.numberOfUnread = this.messageService.getNumberOfUnreadMessages(this.receivedMessages);
      /*
      if(this.receivedMessages.length > 0) {
        this.messageContent = this.receivedMessages[0].text;
      }
      */
      this.totalNumberOfMessages = this.receivedMessages.length;
    });
  }
  
  /*
  * Get classroom id from route parameters
  */
    getClassroomId(): Promise<any> {
      return new Promise((resolve, reject) => {
        this.route.params.subscribe(
          params => {
            resolve(params);
        });
      });
    }

  /*
  * Get classroom id with function and call getClassroom with classroom service
  * call function to get list of students
  */
    getClassroom() {
      this.getClassroomId().then((params) => {
        let id: string = params.id.toString();
        this.classroomService.getClassroom(id).subscribe((res : Classroom) => {
          this.classroom = res;
          this.getStudents();
        });
      });
    }

  /*
  * Loop through student ids in classroom object to get student objects
  * Get the messages for the particular classroom 
  */
    getStudents() {
      for(let id of this.classroom.studentIds) {
        this.userService.getUserById(id).subscribe((res : User) => {
          this.students.push(res);
          this.getMessages();
        });
      }
    }
    
  /*
  * Rerout the user to homepage depending on student/teacher
  */  
  goBack() {
    if(this.createNewMessage) {
      this.createNewMessage = false;
    }
    else {
      if(this.auth.getUserDetails().role === "TEACHER") {
        this.router.navigateByUrl(`teacher/classroom/${this.classroom._id}`);
      }
      else {
        this.router.navigateByUrl('contents');
      }
    }
  }
  
  /*
  * Set the parameters for showing the message body
  */
  showMessageBody(message: Message) {
    this.messageContent = message.text;
    this.numberOfUnread--;
    this.messageService.markAsOpened(message._id).subscribe(() => {
      message.seenByRecipient = true;
    });
    console.log("message to remove from notification: " + message._id);
    
    if(this.auth.getUserDetails().role === "TEACHER") {
      this.notificationService.removeTeacherMessage(message.senderId);
    }
    if(this.auth.getUserDetails().role === "STUDENT") {
      this.notificationService.removeMessage(message);
    }
    
    if(message.audioId) {
      this.getMessageAudio(message._id);
      this.showAudio = true;
    }
    else {
      this.showAudio = false;
    }
  }
  
  /*
  * get audio message from the database using the message service 
  */
  getMessageAudio(id: string) {
    this.messageService.getMessageAudio(id).subscribe((res) => {
      console.log(res);
      this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
    });
  }

  /*
  * Create media object and record audio
  */
    recordAudio() {
      let media = {
        tag: 'audio',
        type: 'audio/mp3',
        ext: '.mp3',
        gUM: {audio: true}
      }
      navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
        this.stream = _stream;
        this.recorder = new MediaRecorder(this.stream);
        this.startRecording();
        this.recorder.ondataavailable = e => {
          this.chunks.push(e.data);
          if(this.recorder.state == 'inactive') {

          };
        };
        console.log('got media successfully');
      }).catch();
      
    }

  /*
  * Call the recording audio function
  */
    prepRecording() {
      this.recordAudio();
    }

  /*
  * Set parameters for recording audio and start the process
  */
    startRecording() {
      this.recording = true;
      this.newRecording = false;
      this.showListenBack = false;
      this.chunks = [];
      this.recorder.start();
    }

  /*
  * Reset parameters for recording audio and stop the process 
  */
    stopRecording() {
      this.recorder.stop();
      this.recording = false;
      this.showListenBack = true;
      this.canSendAudio = true;
      this.stream.getTracks().forEach(track => track.stop());
    }

  /*
  * Playback the recorded audio
  */
    playbackAudio() {
      this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob(this.chunks, {type: 'audio/mp3'})));
      console.log(this.chunks);
      this.newRecording = true;
    }

  /*
  * Save audio data into a blob (function called in sendMessage)
  */
    saveAudio() {
      this.blob = new Blob(this.chunks, {type: 'audio/mp3'});
      console.log(this.blob);
    }
    
  // change css class to show recording container
    showModal() {
      this.modalClass = "visibleFade";
    }

  // change the css class to hide the recording container 
    hideModal() {
      this.modalClass = "hiddenFade";
      if(this.recorder.state != 'inactive') {
        this.recorder.stop();
        this.stream.getTracks().forEach(track => track.stop());
      }
      this.chunks = [];
      this.recording = false;
      this.newRecording = false;
      this.showListenBack = false;
    }
    
  /* delete messages added to the to be deleted array
  * adds delete event to event list 
  * deletes message using the message service 
  */
    toggleDeleteMode() {
      if(this.deleteMode && this.toBeDeleted.length > 0) {
        console.log("to be deleted: " + this.toBeDeleted);
        for(let id of this.toBeDeleted) {
          this.notificationService.removeTeacherMessage(id);
          this.messageService.deleteMessage(id).subscribe(
            res => {
              console.log('Deleted: ', id);
              this.ngOnInit();
            }
          )
        }
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
    
    resetMessages() {
      this.notificationService.setNotifications();
    }
    

}
