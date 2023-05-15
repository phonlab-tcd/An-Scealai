import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Story } from '../../core/models/story';
import { StoryService } from 'app/core/services/story.service';
import { MessageService } from 'app/core/services/message.service';
import { ProfileService } from 'app/core/services/profile.service';
import { UserService } from '../../core/services/user.service';
import { Classroom } from '../../core/models/classroom';
import { ClassroomService } from 'app/core/services/classroom.service';
import { EngagementService } from 'app/core/services/engagement.service';
import { Event } from '../../core/models/event';
import { TranslationService } from 'app/core/services/translation.service';
import { RecordingService } from '../../core/services/recording.service';
import config from 'abairconfig';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasicDialogComponent } from '../../dialogs/basic-dialog/basic-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private storyService: StoryService,
              private router: Router,
              private classroomService: ClassroomService,
              private engagement: EngagementService,
              private ts: TranslationService,
              private messageService: MessageService,
              private profileService: ProfileService,
              private userService: UserService,
              private recordingService: RecordingService,
              private dialog: MatDialog) { }

  user: any;
  stories: Story[];
  classrooms: Classroom[];
  eventDates: Event[][];
  eventSelected = {};
  allEvents: Event[] = [];
  maximised : boolean = false;
  baseUrl: string = config.baseurl;
  dialogRef: MatDialogRef<unknown>;

  ngOnInit() {
    this.getUserId().then(params => {
      this.http.get(this.baseUrl + 'user/viewUser', {headers: {_id : params['id'].toString()}}).subscribe((res) => {
        this.user = res;
        if(this.user.role === 'STUDENT') {
          this.getStories();
        } else if (this.user.role === 'TEACHER') {
          this.getClassrooms();
        }
        this.engagement.getEventsForUser(this.user._id).subscribe((res: Event[]) => {
          let events: Event[] = res;
          this.eventDates = [];
          this.eventDates.push([res[0]]);
          events.forEach((e) => {
            if(events.indexOf(e) > 0) {
              let date : Date = new Date(e.date);
              // apologies to whoever tries to read this code.
              // Basically I've got an array of arrays of events.
              // Each event in the array found at a given index shares the same rounded date.
              // This is how I group the events that happened on the same day.
              if(this.roundDate(new Date(this.eventDates[this.eventDates.length-1][0].date)).toString() === this.roundDate(date).toString()) {
                this.eventDates[this.eventDates.length-1].push(e);
              } else {
                this.eventDates.push([e]);
              }
            }
            this.eventSelected[e._id] = false;
            this.allEvents.push(e);
          });
        });
      });
    })
  }

  roundDate(date: Date) : Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  formatDate(date: Date) : string {
    let dd = date.getDate();
    let mm = date.getMonth() + 1; //January is 0!

    let yyyy = date.getFullYear();
    let ddStr = dd.toString();
    let mmStr = mm.toString();
    if (dd < 10) {
      ddStr = '0' + dd;
    } 
    if (mm < 10) {
      mmStr = '0' + mm;
    } 
    return ddStr + '/' + mmStr + '/' + yyyy;
  }

  getTimeFromDate(dateStr: string) : string {
    let date = new Date(dateStr);

    let hrsStr = date.getHours().toString();
    let mntsStr = date.getMinutes().toString();
    let secStr = date.getSeconds().toString();

    if(date.getHours() < 10) {
      hrsStr = '0' + hrsStr;
    }
    if(date.getMinutes() < 10) {
      mntsStr = '0' + mntsStr;
    }
    if(date.getSeconds() < 10) {
      secStr = '0' + secStr;
    }

    return hrsStr + ":" + mntsStr + ":" + secStr;
  }

  getFormattedDateOfInitialElementFor(eventArray: Event[]) : string {
    return this.formatDate(new Date(eventArray[0].date));
  }

  eventIsSelected(event) : boolean {
    return this.eventSelected[event._id];
  }

  minimiseEvents() {
    this.allEvents.forEach((e) => {
      this.eventSelected[e._id] = false;
    });
    this.maximised = false;
  }
  
  maximiseEvents() {
    this.allEvents.forEach((e) => {
      this.eventSelected[e._id] = true;
    });
    this.maximised = true;
  }

  getUserId(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => {
          resolve(params);
      });
    });
  }

  getStories() {
    this.storyService
        .getStoriesFor(this.user.username)
        .subscribe((data: Story[]) => {
          this.stories = data;
        });
  }

  getClassrooms() {
    this.classroomService.getClassroomsForTeacher(this.user._id).subscribe((res : Classroom[]) => {
      this.classrooms = res;
    });
  }

  goToStory(storyId) {
    this.router.navigateByUrl('admin/story/' + storyId.toString());
  }

  goToClassroom(classroomId:string) {
    this.router.navigateByUrl('admin/classroom/' + classroomId);
  }
  
  deleteAccount() {
    if (!this.user) return;

    if(this.user.role === 'STUDENT') {
      this.classroomService.getClassroomOfStudent(this.user._id).subscribe((res) => {
        if(res) {
          this.classroomService.removeStudentFromClassroom(res._id, this.user._id).subscribe(() => {});
        }
      });
      
      this.storyService.getStoriesFor(this.user.username).subscribe( (res: Story[]) => {
        for(let story of res) {
          this.recordingService.deleteStoryRecordingAudio(story._id).subscribe(() => {});
          this.recordingService.deleteStoryRecording(story._id).subscribe( () => {})
        }
      });
    
      this.storyService.deleteAllStories(this.user._id).subscribe( () => {});
    }
    if(this.user.role === "TEACHER") {
      this.classroomService.deleteClassroomsForTeachers(this.user._id).subscribe( () => {});  
    }
    
    this.messageService.deleteAllMessages(this.user._id).subscribe( () => {});  
    this.profileService.deleteProfile(this.user._id).subscribe( () => {});
    this.userService.deleteUser(this.user._id).subscribe( () => {});
    
    this.router.navigateByUrl('admin/find-user');
    
  }
  
  openDeleteDialog() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.are_you_sure,
        message: this.ts.l.this_includes_story_data,
        type: 'simpleConfirm',
        confirmText: this.ts.l.yes,
        cancelText: this.ts.l.no
      },
      width: '50%',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        if(res) {
          this.deleteAccount();
        }
    });
  }
}
