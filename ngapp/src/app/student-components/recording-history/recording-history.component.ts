import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../story.service';
import { AuthenticationService } from '../../authentication.service';
import { EngagementService } from '../../engagement.service';
import { TranslationService } from '../../translation.service';
import { ProfileService } from '../../profile.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../message.service';
import { ClassroomService } from '../../classroom.service';
import { NotificationService } from '../../notification-service.service';
import { Recording } from '../../recording';
import { RecordingService } from '../../recording.service';

@Component({
  selector: 'app-recording-history',
  templateUrl: './recording-history.component.html',
  styleUrls: ['./recording-history.component.scss']
})
export class RecordingHistoryComponent implements OnInit {
  
  recordings: Recording[] = [];
  storyId: string = '';
  userId: string = '';
  isFromAmerica: boolean = false;

  constructor(public ts : TranslationService, private router: Router,
    private profileService: ProfileService,
    private route: ActivatedRoute, private recordingService: RecordingService) { }

/*
* Set story array of stories for logged in user
* set delete mode to false and create empty to be deleted array
*/
  ngOnInit() {
    // get recordings for the story
    //this.paramid = this.route.snapshot.params.param2;
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
  
  
  /*
  * return the story id using the routing parameters
  */
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
      this.router.navigateByUrl('/recording/' + id);
    }

}
