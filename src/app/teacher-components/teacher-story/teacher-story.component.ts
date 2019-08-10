import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StoryService } from '../../story.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-teacher-story',
  templateUrl: './teacher-story.component.html',
  styleUrls: ['./teacher-story.component.css']
})
export class TeacherStoryComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private storyService: StoryService,
    protected sanitizer: DomSanitizer) { }

  modalClass : string = "hidden";

  recording: boolean = false;
  story : any;
  audioSource : SafeUrl;
  feedbackText: string;

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
        this.getFeedback();
        this.getFeedbackAudio();
      });
    })
  }

  getFeedback() {
    this.storyService.getFeedback(this.story._id).subscribe((res) => {
      this.feedbackText = res.text;
    });
  }

  getFeedbackAudio() {
    this.storyService.getFeedbackAudio(this.story._id).subscribe((res) => {
      this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
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
      this.recorder.ondataavailable = e => {
        this.chunks.push(e.data);
        if(this.recorder.state == 'inactive') {
          this.saveBlob();
        };
      };
      console.log('got media successfully');
    }).catch();
  }

  startRecording() {
    this.recording = true;
    this.chunks = [];
    this.recorder.start();
  }

  stopRecording() {
    this.recorder.stop();
    this.recording = false;
  }

  saveBlob() {
    let blob = new Blob(this.chunks, {type: 'audio/mp3'});
    this.storyService.addFeedbackAudio(this.story._id, blob).subscribe((res) => {
      console.log(res);
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
    this.recordAudio();
    this.modalClass = "visibleFade";
  }

  hideModal() {
    this.modalClass = "hiddenFade";
  }
}
