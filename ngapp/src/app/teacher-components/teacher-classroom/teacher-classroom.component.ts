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
import { DialogService } from '../../services/dialog.service';

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
              private dialogService: DialogService) { }
  
  classroom : Classroom;
  students : User[] = [];
  studentIds: String[] = [];
  registrationError : boolean = false;
  newTitle: string;
  unreadMessages: number = 0;
  messagesForNotifications: Message[] = [];
  numOfStories: Map<string, number> = new Map();

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
          this.storyService.getStoriesForClassroom(res.username, this.classroom.date).subscribe( (stories) => {
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
    this.dialogService.openDialog({
      type: 'shareCode',
      title: this.ts.l.classroom_code,
      data: this.classroom.code,
      confirmText: this.ts.l.done,
    }, "10%").subscribe(() => {});
  }
  
  openUpdateClassroomDialog() {
    this.dialogService.openDialog({
      type: 'updateText',
      title: this.ts.l.edit_classroom_title,
      cancelText: this.ts.l.cancel,
      confirmText: this.ts.l.save,
    }, "30%").subscribe((res) => {
      if(res) {
        this.newTitle = res;
        this.editTitle();
      }
    });
  }
  
  openDeleteClassroomDialog() {
    this.dialogService.openDialog({
      type: 'simpleConfirm',
      title: this.ts.l.sure_you_want_to_delete_code,
      cancelText: this.ts.l.cancel,
      confirmText: this.ts.l.delete,
    }, "30%").subscribe((res) => {
      if(res) {
        this.deleteClassroom();
      }
    });
  }
  
}
