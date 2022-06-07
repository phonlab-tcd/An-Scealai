import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Story } from '../../story';
import { StoryService } from 'app/services/story';
import { StatsService } from '../../stats.service';
import { MessageService } from 'app/services/message';
import { ProfileService } from 'app/services/profile';
import { UserService } from 'app/services/user';
import { Classroom } from '../../classroom';
import { ClassroomService } from 'app/services/classroom';
import { EngagementService } from 'app/services/engagement';
import { Event } from '../../event';
import { TranslationService } from 'app/services/translation';
import { RecordingService } from 'app/services/recording';
import config from 'abairconfig';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private storyService: StoryService,
              private router: Router,
              private classroomService: ClassroomService,
              private engagement: EngagementService,
              private ts: TranslationService,
              private statsService: StatsService,
              private messageService: MessageService,
              private profileService: ProfileService,
              private userService: UserService,
              private recordingService: RecordingService) { }

  user: any;
  stories: Story[];
  classrooms: Classroom[];
  eventDates: Event[][];
  eventSelected = {};
  allEvents: Event[] = [];
  maximised : boolean = false;
  modalClass : string = "hidden";

  baseUrl: string = config.baseurl;

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

  goToClassroom(classroomId) {
    this.router.navigateByUrl('admin/classroom/' + classroomId);
  }
  
  deleteAccount() {
    if (!this.user) return;

    if(this.user.role === 'STUDENT') {
      this.classroomService.getClassroomOfStudent(this.user._id).subscribe((res) => {
        if(res) {
          this.classroomService.removeStudentFromClassroom(res._id, this.user._id).subscribe(res => {
          });
        }
      });
      
      this.statsService.deleteStats(this.user._id).subscribe( (res) => {
      });
      
      this.storyService.getStoriesFor(this.user.username).subscribe( (res: Story[]) => {
        for(let story of res) {
          this.recordingService.deleteStoryRecordingAudio(story._id).subscribe((res) => {
          });
          this.recordingService.deleteStoryRecording(story._id).subscribe( (res) => {
          })
        }
      });
    
      this.storyService.deleteAllStories(this.user.username).subscribe( (res) => {
      });
    }
    if(this.user.role === "TEACHER") {
      if(this.classrooms) {
        for(let classroom of this.classrooms) {
          this.statsService.deleteStatsForClassroom(classroom._id).subscribe( (res) => {
          });
        }
        
      }
      this.classroomService.deleteClassroomsForTeachers(this.user._id).subscribe( (res) => {
      });  
    }
    
    this.messageService.deleteAllMessages(this.user._id).subscribe( (res) => {
    });  
    this.profileService.deleteProfile(this.user._id).subscribe( (res) => {
    });
    this.userService.deleteUser(this.user.username).subscribe( (res) => {
    });
    
    this.router.navigateByUrl('admin/find-user');
    
  }
  
  showModal() {
    this.modalClass = "visibleFade";
  }

  hideModal() {
    this.modalClass = "hiddenFade";
  }
}
