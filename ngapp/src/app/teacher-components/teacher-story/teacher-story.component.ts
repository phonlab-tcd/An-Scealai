import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StoryService } from '../../story.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslationService } from 'app/services/translation';
import { UserService } from '../../user.service';
import { ProfileService } from '../../profile.service';
import { AuthenticationService } from '../../authentication.service';
import config from 'abairconfig';

declare var MediaRecorder : any;

@Component({
  selector: 'app-teacher-story',
  templateUrl: './teacher-story.component.html',
  styleUrls: ['./teacher-story.component.css']
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
    private auth: AuthenticationService) { }

  modalClass : string = "hidden";

  recording: boolean = false;
  story : any;
  audioSource : SafeUrl;
  feedbackText: string;
  authorPossessive : string;
  feedbackSent : boolean = false;
  newRecording : boolean = false;
  showListenBack : boolean = false;
  canSendAudio : boolean = false;
  userId: string;
  isFromAmerica: boolean = false;

  errorText : string;
  registrationError : boolean;

  recorder;
  stream;
  chunks;

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
    this.newRecording = true;
  }

/*
* Add the audio fedback to the database 
*/
  saveAudio() {
    let blob = new Blob(this.chunks, {type: 'audio/mp3'});
    this.storyService.addFeedbackAudio(this.story._id, blob).subscribe((res) => {
      this.hideModal();
    }, (err) => {
      this.errorText = err.message;
      this.registrationError = true;
    });
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
    if(this.recorder.state != 'inactive') {
      this.recorder.stop();
      this.stream.getTracks().forEach(track => track.stop());
    }
    this.chunks = [];
    this.recording = false;
    this.newRecording = false;
    this.showListenBack = false;
  }

  goBack() {
    this.router.navigateByUrl('teacher/student/' + this.userId);
  }
}
