import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StoryService } from '../../story.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslationService } from '../../translation.service';
import { UserService } from '../../user.service';
import { ProfileService } from '../../profile.service';
import { AuthenticationService } from '../../authentication.service';
import { RecordingService } from '../../services/recording.service';
import config from 'abairconfig';

declare var MediaRecorder : any;

@Component({
  selector: 'app-teacher-story',
  templateUrl: './teacher-story.component.html',
  styleUrls: ['./teacher-story.component.scss']
})
export class TeacherStoryComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private storyService: StoryService,
    protected sanitizer: DomSanitizer,
    public ts : TranslationService,
    private router: Router,
    private userService: UserService,
    private profileService: ProfileService,
    private auth: AuthenticationService,
    private recordingService: RecordingService) { }

  modalClass : string = "hidden";

  recording: boolean = false;
  story : any;
  audioSource : SafeUrl;
  feedbackText: string;
  authorPossessive : string;
  feedbackSent : boolean = false;
  newRecording : boolean = false;
  isRecording: boolean = false;
  showAudio: boolean = false;
  userId: string;
  isFromAmerica: boolean = false;

  errorText : string;
  registrationError : boolean;

  baseUrl: string = config.baseurl;

  ngOnInit() {
    this.getStoryData();
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    //set date format
    this.profileService.getForUser(userDetails._id).subscribe((res) => {
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
* Use url parameters to get the story and its audio feedback, the author's name 
* with possessive ending, and the user's id 
*/
  getStoryData() {
    this.getParams().then(params => {
      this.http.get(this.baseUrl + 'story/viewStory/' + params['id'].toString()).subscribe((res) => {
        this.story = res[0];
        if(this.story.htmlText == null) {
          this.story.htmlText = this.story.text;
        }
        this.getFeedbackAudio();
        this.getAuthorPossessive();
        this.getUserId();
      });
    })
  }

/*
* Add the possessive 's' ending to the author's name
*/
  getAuthorPossessive() {
    let name : string = this.story.author;
    this.authorPossessive = name + '\'' + (name[name.length - 1] === 's' ? '' : 's');
  }

/*
* Get the id of the author using the user service 
* Set date format dependng on where the user is from using the profile service
*/
  getUserId() {
    this.userService.getUserByUsername(this.story.author).subscribe((res) => {
      this.userId = res[0]._id;
    })
  }

/*
* get audio feedback from the database using the story service 
*/
  getFeedbackAudio() {
    this.storyService.getFeedbackAudio(this.story._id).subscribe((res) => {
      if(res) {
        this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
      }
      
    });
  }

/*
* Add feedback text to the story using the story service 
*/
  sendFeedback() {
    this.storyService.addFeedback(this.story._id, this.story.feedback.text).subscribe((res) => {
      this.feedbackSent = true;
    });
  }
  
  /*
  * Start and stop recording
  */
  record() {
    if(this.isRecording) {
      this.newRecording = this.recordingService.stopRecording();
    }
    else {
      this.showAudio = false;
      this.newRecording = false;
      this.recordingService.recordAudio();
    }
    this.isRecording = !this.isRecording;
  }


/*
* Playback the recorded audio
*/
  getAudio() {
    this.showAudio = true;
    this.audioSource = this.recordingService.playbackAudio();
  }

/*
* Add the audio fedback to the database 
*/
  saveAudio() {
    this.errorText = this.recordingService.saveAudio(this.story._id);
    if(!this.errorText) {
      this.hideModal();
    }
  }

/*
* Return the url parameters as a promise
*/
  getParams(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => {
          resolve(params);
      });
    });
  }
  
// fix the css class for recording audio
  showModal() {
    this.modalClass = "visibleFade";
  }

  hideModal() {
    this.modalClass = "hiddenFade";
    this.newRecording = false;
    this.showAudio = false;
  }

  goBack() {
    this.router.navigateByUrl('teacher/student/' + this.userId);
  }
}
