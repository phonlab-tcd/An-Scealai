import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassroomService } from 'app/classroom.service';
import { Classroom } from '../../classroom';
import { User } from '../../user';
import { UserService } from '../../user.service';
import { TranslationService } from '../../translation.service';
import { StoryService } from '../../story.service';
import { MessageService } from '../../message.service';
import { Message } from '../../message';
import { StatsService } from '../../stats.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasicDialogComponent } from '../../dialogs/basic-dialog/basic-dialog.component';

@Component({
  selector: 'app-teacher-classroom',
  templateUrl: './teacher-classroom.component.html',
  styleUrls: ['./teacher-classroom.component.scss']
})
export class TeacherClassroomComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private classroomService: ClassroomService,
              private router: Router,
              private userService: UserService,
              public ts : TranslationService,
              private messageService: MessageService,
              private storyService : StoryService,
              private statsService : StatsService,
              private dialog: MatDialog) { }
  
  classroom : Classroom;
  students : User[] = [];
  studentIds: String[] = [];
  registrationError : boolean = false;
  newTitle: string;
  unreadMessages: number = 0;
  messagesForNotifications: Message[] = [];
  numOfStories: Map<string, number> = new Map();
  dialogRef: MatDialogRef<unknown>;

  ngOnInit() {
    this.getClassroom();
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
        this.messageService.getMessagesForLoggedInUser().subscribe((res: Message[]) => {
          this.messagesForNotifications = res;
          this.unreadMessages = this.messageService.getNumberOfUnreadMessagesForClass(this.messagesForNotifications, this.classroom.studentIds);
        });
        this.getStudents();
      });
    });
  }

/*
* Loop through student ids in classroom object to get student objects
* Use the message service to get number of unread messages for the classroom
*/
  getStudents() {
    for(let id of this.classroom.studentIds) {
      this.userService.getUserById(id).subscribe((res : User) => {
        this.students.push(res);
        //this.students.sort((a, b) => (a.username < b.username) ? -1 : 1);
        this.students.sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
        this.studentIds.push(res._id);
        if(this.classroom.date) {
          this.storyService.getStoriesForClassroom(res._id, this.classroom.date).subscribe( (stories) => {
            let count = Object.keys(stories).length;
            this.numOfStories.set(res.username, count);
          });
        }
        else {
          this.storyService.getStoriesFor(res.username).subscribe( (stories) => {
            let count = Object.keys(stories).length;
            this.numOfStories.set(res.username, count);
          });
        }
      });
    }
  }

/*
* Edit the title of the classroom with classroom service 
*/
  editTitle() {
    this.classroomService.editTitle(this.classroom._id, this.newTitle).subscribe(() => {
      this.getClassroom();
    }, (err) => {
      alert(err);
    });
  }

/*
* Delete classroom with classroom service, redirect to landing
*/
  deleteClassroom() {
    this.classroomService.delete(this.classroom._id).subscribe((res) => {
      this.statsService.deleteStatsForClassroom(this.classroom._id).subscribe((res) => {
        this.router.navigateByUrl('/landing');
      })  
    });
  }

/*
* Route to student component on teacher page
*/
  goToStudent(id: string) {
    this.router.navigateByUrl('/teacher/student/' + id);
  }
  
  goToMessages() {
    this.router.navigateByUrl('/messages/' + this.classroom._id);
  }
  
  goToStats() {
    this.router.navigateByUrl('/teacher/teacher-stats/' + this.classroom._id);
  }
  
  openCodeDialog() {    
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.classroom_code,
        type: 'classCode',
        data: this.classroom.code,
        confirmText: this.ts.l.done,
      },
      width: '15%',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        if(res) {
          console.log(res);
        }
    });
  }
  
  openUpdateClassroomDialog() {    
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.edit_classroom_title,
        type: 'updateText',
        confirmText: this.ts.l.save,
        cancelText: this.ts.l.cancel
      },
      width: '30%',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        if(res) {
          this.newTitle = res;
          this.editTitle();
        }
    });
  }
  
  openDeleteClassroomDialog() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.sure_you_want_to_delete_code,
        type: 'simpleConfirm',
        confirmText: this.ts.l.delete,
        cancelText: this.ts.l.cancel
      },
      width: '30%',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        if(res) {
          this.deleteClassroom();
        }
    });
  }
  
}
