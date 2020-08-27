import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { TranslationService } from '../../translation.service';
import { StoryService } from '../../story.service';
import { RecordingService } from '../../recording.service';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { DomSanitizer, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { Story } from '../../story';
import { Recording } from '../../recording';
declare var MediaRecorder : any;

@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.css']
})
export class RecordingComponent implements OnInit {

  constructor(private auth: AuthenticationService,
              private storyService: StoryService, private ts: TranslationService,
              private sanitizer: DomSanitizer, private route: ActivatedRoute,
              private router: Router, private recordingService: RecordingService) { }
  
  //synthesiser variabless
  recording: Recording = new Recording();
  story: Story = new Story();
  paragraphs: Paragraph[] = [];
  sentences: Sentence[] = [];
  audioFinishedLoading: boolean = false;
  a;
  audioPlaying: boolean = false;
  sectionSplit : string = "paragraph";
  audioTimeouts = [];
  needsUpdating: boolean = false;
  
  //recording audio files variables
  modalClass : string = "hidden";
  isRecording: boolean = false;
  paragraphAudioSources : SafeUrl[] = [];
  sentenceAudioSources: SafeUrl[] = [];
  newRecordingParagraph : boolean[] = [false];
  newRecordingSentence : boolean[] = [false];
  showListenBackParagraph : boolean[] = [false];
  showListenBackSentence : boolean[] = [false];
  canSendAudio : boolean = false;
  audioSource: SafeUrl;
  recordingSaved: boolean = true;
  recordingsFinishedLoading: boolean = false;
  
  //recording history variables
  recordingMode: boolean = true;
  historyMode: boolean = false;
  recordingHistory: Recording[] = [];

  errorText : string;
  registrationError : boolean;

  recorder;
  stream;
  chunks;
  paragraphChunks;
  paragraphBlobs: any[] = [];
  sentenceBlobs: any[] = [];

  /*
  * Call getStory() to get current story recording, story data, synthesise, and recordings
  * Reset variables when recording text updated (function called in updateStory())
  */
    ngOnInit() {
      this.modalClass = "hidden";
      this.chunks = [];
      this.getStory();
    }
    
    getStory() {
      this.story = null;
      this.route.params.subscribe(params => {
        this.storyService.getStory(params['id']).subscribe(
          story => {
            this.story = story;
            this.getRecording();
          }
        );
      })
    }

  /* 
  * Get current recording using recording service
  * Get recording history for story
  */
    getRecording() {
      this.recording = null;
      this.recordingService.getCurrentRecording(this.auth.getUserDetails()._id, this.story.id).subscribe( (res) => {
        if(res.length !== 0) {
          this.recording = res[0];
          
          console.log("RECORDING", this.recording);
          console.log("STORY", this.story);
          
          //add updating button if recording text doesn't match story text
          console.log(this.recording["storyData"]["text"] + "======" + this.story.text);
          if(this.recording["storyData"]["text"] !== this.story.text) {
            this.needsUpdating = true;
          }
          
          this.synthesiseRecording();
        }
        else {
          console.log("No recordings have been made yet for this story -- generating a new one");
          this.recordingService.addRecordingForLoggedInUser(this.story);
          this.ngOnInit();
        }
      
      });
      
      this.recordingHistory = null;
      this.recordingService.getRecordingsForStory(this.auth.getUserDetails()._id, this.story.id).subscribe((res) => {
        console.log("Recording history", res);
        this.recordingHistory = res;
      });
    
    }
  
  /*
  * Synthesise recording text using story service
  */
    synthesiseRecording() {
      this.paragraphs = [];
      this.sentences = [];
      this.audioFinishedLoading = false;
      this.recordingsFinishedLoading = false;
      this.recordingService.synthesiseRecording(this.recording._id).subscribe((res) => {
        console.log("1 is reached");
        // loop through the html of the synthesis response and create sentences/paragraph instances
        for(let p of res.html) {
          let paragraphStr: string = "";
          let paragraphObject = new Paragraph();
          for(let sentenceStr of p) {
            paragraphStr += sentenceStr;
            let sentence = new Sentence();
            sentence.responseHtml = this.sanitizer.bypassSecurityTrustHtml(sentenceStr);
            sentence.audioPlaying = false;
            sentence.paragraph = paragraphObject;
            paragraphObject.sentences.push(sentence);
            this.sentences.push(sentence);
          }
          console.log("2 is reached");
          paragraphObject.responseHtml = this.sanitizer.bypassSecurityTrustHtml(paragraphStr);
          paragraphObject.audioPlaying = false;
          this.paragraphs.push(paragraphObject);
        }
        let j = 0;
        console.log("3 is reached");
        // loop through the audio of the synthesis response and add to sentence/paragraph instances
        for(let i in res.audio) {
          this.paragraphs[i].audioUrl = res.audio[i];
          this.paragraphs[i].index = i;
          for(let s of this.paragraphs[i].sentences) {
            s.index = j;
            ++j;
          }
        }
        console.log("4 is reached");
        this.audioFinishedLoading = true;
        this.paragraphMode();
        this.getRecordedAudio();
      }); 
    }
    
  /*
  * Get audio recordings for each paragraph/sentence if they exist  
  */
    getRecordedAudio() {
      //get the audio recording already saved in the database for the story
      this.recordingsFinishedLoading = false;
      this.paragraphAudioSources = [];
      this.sentenceAudioSources = [];
      for(let i = 0; i < this.paragraphs.length; i++) {
        this.recordingService.getRecordedAudio(this.recording._id, i, "paragraph").subscribe((res) => {
          console.log(res);
          if(res) {
            this.paragraphAudioSources[i] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
            this.newRecordingParagraph[i] = true;
          }
        }, (err) => {});
      }
      for(let i = 0; i < this.sentences.length; i++) {
        this.recordingService.getRecordedAudio(this.recording._id, i, "sentence").subscribe((res) => {
          if(res) {
            this.sentenceAudioSources[i] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
            this.newRecordingSentence[i] = true;
          }
        }, (err) => {});
      }
      this.recordingsFinishedLoading = true;
    }
    
  /*
  * Set the html format for paragraph mode
  */
    paragraphMode() {
      this.sectionSplit = "paragraph";
      this.pauseAllAudio();
      setTimeout(() => {
        this.paragraphs.forEach(p => {
          let pElem = document.getElementById("paragraph-" + p.index);
          if(pElem) {
            let spans = pElem.querySelectorAll('span');
            spans.forEach(span => {
              if(span.className != "sentence_normal") {
                span.addEventListener('click', this.playWord.bind(this));
                span.setAttribute("audio-url", p.audioUrl);
                span.classList.add("wordBtn");
              }
            })
          }
        });
      }, 1000);
    }

  /*
  * Set the html for sentence mode
  */
    sentenceMode() {
      this.sectionSplit = "sentence";
      this.pauseAllAudio();
      setTimeout(() => {
        this.sentences.forEach(s => {
          let sElem = document.getElementById("sentence-" + s.index);
          if(sElem) {
            let spans = sElem.children[0].querySelectorAll('span');
            spans.forEach(span => {
              if(span.className != "sentence_normal") {
                span.addEventListener('click', this.playWord.bind(this));
                span.setAttribute("audio-url", s.paragraph.audioUrl);
                span.classList.add("wordBtn");
              }
            })
          }
        });
      }, 1000);
    }

  /*
  * Play the audio of a word when it is clicked 
  * Method bound to event target in sentence/paragraphMode functions
  */
    playWord(event) {
      let span = event.target;
      this.pauseAllAudio();
      this.a = new Audio(span.getAttribute("audio-url"));
      let time = span.getAttribute("data-begin");
      console.log(time, time-0.1);
      let duration = span.getAttribute("data-dur");
      this.a.currentTime = time;
      this.a.play();
      span.style.background = "#0088ff6b";
      let t = setTimeout(() => {
        this.a.pause();
        span.classList.remove("staticHighlight");
        span.style.background = "#00000000";
      }, duration * 1500);
      this.audioTimeouts.push(t);
    }

  /*
  * Set audioPlaying to false for all sentences/paragraphs
  */
    pauseAllAudio() {
      if(this.a) {
        this.a.pause();
        this.audioPlaying = false;
        this.paragraphs.forEach((para) => {
          if(this.sectionSplit === "paragraph") {
            para.audioPlaying = false;
            Highlighter.stopHighlighting(para);
          } else if(this.sectionSplit === "sentence")  {
            para.sentences.forEach(sentence => {
              sentence.audioPlaying = false;
              Highlighter.stopHighlighting(sentence);
            });
            this.audioTimeouts.forEach(t => {
              clearTimeout(t);
            })
          }
        })
      }
    }

  /*
  * Play synthetic audio for each paragraph/sentence using the audio url and start highlighting
  */
    playAudio(section) {
      this.pauseAllAudio();
      console.log(section.type);
      if(section.type === "Paragraph") {
        this.a = new Audio(section.audioUrl);
        this.a.play();
        this.audioPlaying = true;
        Highlighter.startHighlighting(section);
      } else if(section.type === "Sentence") {
        let sentenceElement = document.getElementById('sentence-' + section.index);
        // calculate sentence start time
        if(!section.startTime) {
          section.startTime = sentenceElement.children[0].children[0].getAttribute("data-begin");
        }
        // calculate sentence duration
        if(!section.duration) {
          section.duration = +sentenceElement.children[0].children[sentenceElement.children[0].childElementCount-1].getAttribute("data-begin")
          + +sentenceElement.children[0].children[sentenceElement.children[0].childElementCount-1].getAttribute("data-dur")
          - section.startTime;
        }
        // set the audio player to start at the sentence start time
        this.a = new Audio(section.paragraph.audioUrl);
        this.a.currentTime = section.startTime;
        this.a.play();
        this.audioPlaying = true;
        Highlighter.startHighlighting(section);
        let t = setTimeout(()=> {
          this.a.pause();
          this.audioPlaying = false;
        }, section.duration * 1000);
        this.audioTimeouts.push(t);
      }
    }

  /*
  * Pause the audio player and stop highlighting
  */
    stopAudio(section) {
      this.a.pause();
      this.audioPlaying = false;
      Highlighter.stopHighlighting(section);
    }

  /*
  * Create media object and record audio
  */
    recordAudio(index) {
      let media = {
        tag: 'audio',
        type: 'audio/mp3',
        ext: '.mp3',
        gUM: {audio: true}
      }
      navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
        this.stream = _stream;
        this.recorder = new MediaRecorder(this.stream);
        this.startRecording(index);
        this.recorder.ondataavailable = e => {
          this.chunks.push(e.data);
          if(this.recorder.state == 'inactive') {

          };
        };
        console.log('got media successfully');
      }).catch();
    }

  /*
  * Call the recording audio function
  */
    prepRecording(index) {
      this.pauseAllAudio();
      this.recordAudio(index);
    }

  /*
  * Set parameters for recording audio and start the process
  */
    startRecording(index) {
      this.recordingSaved = false;
      this.isRecording = true;
      if(this.recordingSaved) {
        this.recordingSaved = false;
      }
      let id = "";
      
      if(this.sectionSplit === "paragraph") {
        id = "p-" + index;
        this.newRecordingParagraph[index] = false;
      }
      else {
        id = "s-" + index;
        this.newRecordingSentence[index] = false;
      }
      
      //change css of recording icon 
      let element = document.getElementById(id); 
      element.classList.remove("notRecordingBtn");
      element.classList.add("Rec");
      
      this.chunks = [];
      this.recorder.start();
    }

  /*
  * Reset parameters for recording audio and stop the process 
  */
    stopRecording(index) {
      let id = '';
      if(this.sectionSplit === "paragraph") {
        id = "p-" + index;
        this.showListenBackParagraph[index] = true;
      }
      else {
        id = "s-" + index;
        this.showListenBackSentence[index] = true;
      }
      
      let element = document.getElementById(id);
      element.classList.add("notRecordingBtn");
      element.classList.remove("Rec");
      
      this.recorder.stop();
      this.isRecording = false;
      
      this.canSendAudio = true;
      this.stream.getTracks().forEach(track => track.stop());
    }

  /*
  * Playback the recorded audio
  */
    playbackAudio(index) {
      console.log("chunks:", this.chunks);
      if(this.sectionSplit === "paragraph") {
        this.showListenBackParagraph[index] = false;
        this.paragraphAudioSources[index] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob(this.chunks, {type: 'audio/mp3'})));
        this.paragraphBlobs[index] = new Blob(this.chunks, {type: 'audio/mp3'});
        this.newRecordingParagraph[index] = true;
      }
      else {
        this.showListenBackSentence[index] = false;
        this.sentenceAudioSources[index] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob(this.chunks, {type: 'audio/mp3'})));
        this.sentenceBlobs[index] = new Blob(this.chunks, {type: 'audio/mp3'});
        this.newRecordingSentence[index] = true;
      }
    }

  /*
  * Save updated audio to database
  */
    saveRecordings() {
      if(this.canSendAudio) {
        console.log("paragraphBlobs", this.paragraphBlobs);
        console.log("sentenceBlobs", this.sentenceBlobs);
      
        for(let i = 0; i < this.paragraphBlobs.length; i++) {
          if(this.paragraphBlobs[i]) {
            this.recordingService.updateRecordings(this.recording._id, i, "paragraph", this.paragraphBlobs[i]).subscribe();
          }
        }
        for(let i = 0; i < this.sentenceBlobs.length; i++) {
          if(this.sentenceBlobs[i]) {
            this.recordingService.updateRecordings(this.recording._id, i, "sentence", this.sentenceBlobs[i]).subscribe();
          }
        }
        this.recordingSaved = true;
      }
    }

  /*
  * Update recording history with current recordings and load most recent story
  */
    updateStory() {
      this.recordingService.updateHistoryStatus(this.recording._id).subscribe();
      this.recordingService.addRecordingForLoggedInUser(this.story);
      this.needsUpdating = false;
      this.ngOnInit();
    }
  
  displayPreviousRecording() {
    console.log("RECORDING ID:", this.recording._id);
    this.synthesiseRecording();
    
  }
  
// change css class to show recording container
  showModal() {
    this.modalClass = "visibleFade";
  }

// change the css class to hide the recording container 
  hideModal() {
    this.modalClass = "hiddenFade";
    if(this.recorder.state != 'inactive') {
      this.recorder.stop();
      this.stream.getTracks().forEach(track => track.stop());
    }
    this.isRecording = false;
  }
  
  goToDashboard() {
    this.router.navigateByUrl('/dashboard/' + this.story.id);
  }
  
  switchToHistoryMode() {
    this.recordingMode = false;
    this.historyMode = true;
    this.recording = null;
    this.paragraphs = [];
    this.sentences = [];
  }
  
  switchToRecordMode() {
    this.recording = null;
    this.historyMode = false;
    this.recordingMode = true;
    this.audioFinishedLoading = false;
    this.recordingsFinishedLoading = false;
    this.paragraphs = [];
    this.sentences = [];
    this.getRecording();
  }
}

/***************************** ASSOCIATED CLASSES *****************************/

class Paragraph {
    index: string;
    audioUrl: string;
    responseHtml: SafeHtml;
    audioPlaying: boolean;
    highlightTimeouts = [];
    sentences : Sentence[] = [];
    type: string = "Paragraph";
}

class Sentence {
  index : string = "0";
  responseHtml : SafeHtml;
  audioPlaying : boolean;
  highlightTimeouts = [];
  startTime : number;
  duration : number;
  paragraph : Paragraph;
  type: string = "Sentence";
}

class Highlighter {

  static startHighlighting(section) {
    section.audioPlaying = true;

    let isParagraph = section.type === "Paragraph";
    let isSentence = section.type === "Sentence";

    // select all the span elements associated with each paragraph / sentence
    let spans, delay = 0;
    if(isParagraph) {
      let sectionElement = document.getElementById('paragraph-' + section.index);
      spans = sectionElement.querySelectorAll('span');
    } else if(isSentence) {
      let sectionElement = document.getElementById('sentence-' + section.index);
      spans = sectionElement.children[0].querySelectorAll('span');
      delay = section.startTime * 1000;
    }
    
    let previousSpan: HTMLSpanElement;

    spans.forEach((s) => {
      if(s.className != 'sentence_normal') {
        s.classList.add("spanText");
      }
    });

    // set and reset the css classes for each highlighted item
    spans.forEach((s, i) => {
      if(s.className != 'sentence_normal') {
        let t = setTimeout(() => {
          if(i === spans.length-1) {
            setTimeout(() => {
              s.classList.add("spanTextNoHighlight");
              s.classList.remove("spanTextHighlight");
              this.resetHighlight(section);
            }, (+s.getAttribute("data-dur")) * 1000);
          }
          if(previousSpan) {
            previousSpan.classList.add("spanTextNoHighlight");
          }
          s.classList.add("spanTextHighlight");
          s.style.setProperty('--trans', "width " + (+s.getAttribute("data-dur") / 2 ).toString() + "s  ease-in-out");
          previousSpan = s;
        }, ((+s.getAttribute("data-begin") * 1000)) + ((+s.getAttribute("data-dur") / 2) * 1000) - delay);
        section.highlightTimeouts.push(t);
      }
    }); 
    
  }

  static stopHighlighting(section) {
    section.highlightTimeouts.forEach((t) => {
      clearTimeout(t);
    });
    this.resetHighlight(section);
  }

  static resetHighlight(section) {
    section.audioPlaying = false;

    let isParagraph = section.type === "Paragraph";
    let isSentence = section.type === "Sentence";

    let spans;
    if(isParagraph) {
      let sectionElement = document.getElementById('paragraph-' + section.index);
      if(sectionElement) {
        spans = sectionElement.querySelectorAll('span');
      }
    } else if(isSentence) {
      let sectionElement = document.getElementById('sentence-' + section.index);
      if(sectionElement) {
        spans = sectionElement.children[0].querySelectorAll('span');
      }
    }

    if(spans) {
      spans.forEach((s) => {
        s.classList.remove("spanText");
        s.classList.remove("spanTextHighlight");
        s.classList.remove("spanTextNoHighlight");
      });
    }
    
  }

}