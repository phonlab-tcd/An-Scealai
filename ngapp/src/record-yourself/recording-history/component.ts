import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Recording } from 'app/recording';
import { Message } from 'app/message';
import { Story } from 'app/story';
import { EventType } from 'app/event';
import { ClassroomService } from 'app/classroom.service';
import { MessageService } from 'app/message.service';
import { NotificationService } from 'app/notification-service.service';
import { EngagementService } from 'app/engagement.service';
import { TranslationService } from 'app/translation.service';
import { ProfileService } from 'app/profile.service';
import { RecordingService } from 'app/recording.service';
import { AuthenticationService, TokenPayload } from 'app/authentication.service';
import { StoryService } from 'app/story.service';

@Component({
  selector: 'app-recording-history',
  templateUrl: './component.html',
  styleUrls: ['../module.css'],
  host: {
    class: 'bookContentsContainer',
  },
})
export class RecordingHistoryComponent implements OnInit {
  constructor(
    public  ts:               TranslationService,
    private storyService:     StoryService,
    private auth:             AuthenticationService,
    private engagement:       EngagementService,
    private router:           Router,
    private messageService:   MessageService,
    private profileService:   ProfileService,
    private classroomService: ClassroomService,
    private ns:               NotificationService,
    private route:            ActivatedRoute,
    private recordingService: RecordingService,
  ) { }

  recordings: Recording[] = [];
  storyId: string = '';
  userId: string = '';
  isFromAmerica: boolean = false;

  // Set story array of stories for logged in user
  // set delete mode to false and create empty to be deleted array
  ngOnInit() {
    // get recordings for the story
    // this.paramid = this.route.snapshot.params.param2;
    //let id = this.route.snapshot.params.param1;
    this.getStoryId().then(params => {
      this.storyId = params['id'];
      this.recordingService.getHistory(this.storyId).subscribe(recordings => {
        this.recordings = recordings;
        this.recordings.sort((a, b) => (a.date > b.date) ? -1 : 1)
      })
    });


    // get date format for user 
    this.profileService.getForUser(this.userId).subscribe((res) => {
      let p = res.profile;
      let country = p.country;
      if(country == "United States of America" || country == "America" || country == "USA" || country == "United States") {
        this.isFromAmerica = true;
      }
      else {
        this.isFromAmerica = false;
      }
    });
  }

    // return the story id using the routing parameters
    getStoryId(): Promise<any> {
      return new Promise((resolve, reject) => {
        this.route.params.subscribe(
          params => {
            resolve(params);
        });
      });
    }

    goToDashboard() {
      this.router.navigateByUrl('/dashboard/' + this.storyId);
    }

    viewRecording(id) {
      this.router.navigateByUrl('/record-yourself/view/' + id);
    }

}
