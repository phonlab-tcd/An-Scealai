import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StoryService } from '../../story.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslationService } from '../../translation.service';
import { UserService } from '../../user.service';

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
    private userService: UserService) { }

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

  errorText : string;
  registrationError : boolean;

  recorder;
  stream;
  chunks;

  ngOnInit() {
    this.getStoryData();
  }

  getStoryData() {
    this.getParams().then(params => {
      this.http.get('http://localhost:4000/story/viewStory/' + params['id'].toString()).subscribe((res) => {
        this.story = res[0];
        this.getFeedbackAudio();
        this.getAuthorPossessive();
        this.getUserId();
      });
    })
  }

  getAuthorPossessive() {
    let name : string = this.story.author;
    this.authorPossessive = name + '\'' + (name[name.length - 1] === 's' ? '' : 's');
  }

  getUserId() {
    this.userService.getUserByUsername(this.story.author).subscribe((res) => {
      this.userId = res[0]._id;
    })
  }

  getFeedbackAudio() {
    this.storyService.getFeedbackAudio(this.story._id).subscribe((res) => {
      this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
    });
  }

  sendFeedback() {
    this.storyService.addFeedback(this.story._id, this.story.feedback.text).subscribe((res) => {
      this.feedbackSent = true;
    });
  }

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

  prepRecording() {
    this.recordAudio();
  }

  startRecording() {
    this.recording = true;
    this.newRecording = false;
    this.showListenBack = false;
    this.chunks = [];
    this.recorder.start();
  }

  stopRecording() {
    this.recorder.stop();
    this.recording = false;
    this.showListenBack = true;
    this.canSendAudio = true;
    this.stream.getTracks().forEach(track => track.stop());
  }

  playbackAudio() {
    this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob(this.chunks, {type: 'audio/mp3'})));
    this.newRecording = true;
  }

  saveAudio() {
    let blob = new Blob(this.chunks, {type: 'audio/mp3'});
    this.storyService.addFeedbackAudio(this.story._id, blob).subscribe((res) => {
      this.hideModal();
    }, (err) => {
      this.errorText = err.message;
      this.registrationError = true;
    });
  }

  getParams(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => {
          resolve(params);
      });
    });
  }

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
