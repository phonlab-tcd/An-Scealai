import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { StoryService } from '../story.service';

@Injectable({
  providedIn: 'root'
})
export class RecordingService {

  constructor(protected sanitizer: DomSanitizer,
              private storyService: StoryService) { }

  audioSource : SafeUrl;
  recorder;
  stream;
  chunks;
  
  /* Set recording parameters and start recording */
  recordAudio() {
    this.chunks = [];
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
  
  /* Reset chunks and start recorder */ 
  startRecording() {
    this.chunks = [];
    this.recorder.start();
  }
  
  /* Stop recorder */
  stopRecording():boolean {
    this.recorder.stop();
    try {
      this.stream.getTracks().forEach(track => track.stop());
      return true;
    }
    catch {
      return false;
    }
  }
  
  /* Get blob from recording and return as SafeUrl */
  playbackAudio():SafeUrl {
    this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob(this.chunks, {type: 'audio/mp3'})));
    return this.audioSource;
  }
  
  /* Add the audio story fedback to the database */
  saveAudio(storyId):string {
    let blob = new Blob(this.chunks, {type: 'audio/mp3'});
    let errorText = "";
    
    this.storyService.addFeedbackAudio(storyId, blob).subscribe((res) => {
      if(this.recorder.state != 'inactive') {
        this.recorder.stop();
        this.stream.getTracks().forEach(track => track.stop());
      }
      this.chunks = [];
    }, (err) => {
      errorText = err.message;
    });
    return errorText;
  }
}
