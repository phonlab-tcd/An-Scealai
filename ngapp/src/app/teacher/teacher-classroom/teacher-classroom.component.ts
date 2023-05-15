import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassroomService } from 'app/core/services/classroom.service';
import { Classroom } from '../../core/models/classroom';
import { User } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';
import { TranslationService } from 'app/core/services/translation.service';
import { StoryService } from 'app/core/services/story.service';
import { MessageService } from 'app/core/services/message.service';
import { Message } from '../../core/models/message';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasicDialogComponent } from '../../dialogs/basic-dialog/basic-dialog.component';
import { firstValueFrom } from 'rxjs';

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
              private dialog: MatDialog) { }
  
  classroom : Classroom;
  students : User[] = [];
  registrationError : boolean = false;
  newTitle: string;
  unreadMessages: number = 0;
  messagesForNotifications: Message[] = [];
  numOfStories: Map<string, number> = new Map();
  dialogRef: MatDialogRef<unknown>;

  async ngOnInit() {
    this.classroom = await firstValueFrom(this.classroomService.getClassroom(this.route.snapshot.params['id']));
    this.getStudents();
    this.messageService.getMessagesForLoggedInUser().subscribe((res: Message[]) => {
      this.messagesForNotifications = res;
      this.unreadMessages = this.messageService.getNumberOfUnreadMessagesForClass(this.messagesForNotifications, this.classroom.studentIds);
    });
  }

/*
* Loop through student ids in classroom object to get student objects
*/
  async getStudents() {
    for(let id of this.classroom.studentIds) {
      this.userService.getUserById(id).subscribe({
        next: async student => {
          this.students.push(student);
          let storyCount = await firstValueFrom(this.storyService.getNumberOfStories(student._id, this.classroom?.date?.toString()));
          this.numOfStories.set(student.username, storyCount);
        },
        error: () => {console.log(id + " does not exist")}
      });
    }
  }

/*
* Delete classroom with classroom service, redirect to landing
*/
  deleteClassroom() {
    this.classroomService.deleteClassroom(this.classroom._id).subscribe((_) => {
      this.router.navigateByUrl('/landing');
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
    this.router.navigateByUrl('/stats-dashboard/' + this.classroom._id);
  }
  
  goToSettings() {
    this.router.navigateByUrl('/teacher/teacher-settings/' + this.classroom._id);
  }

  goToDictgloss() {
    this.router.navigateByUrl('/teacher/teacher-dictogloss/' + this.classroom._id);
  }
  
  openCodeDialog() {    
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.classroom_code,
        type: 'classCode',
        data: this.classroom.code,
        confirmText: this.ts.l.done,
      },
      width: '15vh',
    });
    
    this.dialogRef.afterClosed().subscribe( () => this.dialogRef = undefined);
  }
  
  openDeleteClassroomDialog() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.sure_you_want_to_delete_code,
        type: 'simpleConfirm',
        confirmText: this.ts.l.delete,
        cancelText: this.ts.l.cancel
      },
      width: '50vh',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        if(res) {
          this.deleteClassroom();
        }
    });
  }
  
}
