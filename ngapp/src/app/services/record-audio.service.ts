import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { StoryService } from '../story.service';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root'
})
export class RecordAudioService {

  constructor(protected sanitizer: DomSanitizer,
              private storyService: StoryService,
              private messageService: MessageService) { }

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
  saveAudioFeedback(storyId: string):string {
    let blob = new Blob(this.chunks, {type: 'audio/mp3'});
    let errorText = "";
    
    this.storyService.addFeedbackAudio(storyId, blob).subscribe(() => {
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
  
  saveAudioMessage(id: string) {
    let blob = new Blob(this.chunks, {type: 'audio/mp3'});
    
    this.messageService.addMessageAudio(id, blob).subscribe(() => {
      if(this.recorder.state != 'inactive') {
        this.recorder.stop();
        this.stream.getTracks().forEach(track => track.stop());
      }
      this.chunks = [];
    });
  }

  async getAudioTranscription() {
    await new Promise(resolve => setTimeout(resolve,500));   // chunks needs some time to fully load?
    const blob = new Blob(this.chunks, {type: 'audio/mp3'});
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    
    let transcription: string = await new Promise(resolve => {
      /* stop recording stream and convert audio to base64 to send to ASR */
      reader.onloadend = async function () {
        let encodedAudio = (<string>reader.result).split(";base64,")[1];   // convert audio to base64
        // send audio to ASR
        const rec_req = {
          recogniseBlob: encodedAudio,
          developer: true,
        };
        await fetch("https://phoneticsrv3.lcs.tcd.ie/asr_api/recognise", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rec_req),
        })
          .then((response) => response.json())
          .then((data) => {
          let transcript = data["transcriptions"][0]["utterance"];
          resolve(transcript);
        });
      }
      
    });
    return transcription;
  }  
}
