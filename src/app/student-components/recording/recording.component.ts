import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { TranslationService } from '../../translation.service';
import { StoryService } from '../../story.service';
import { RecordingService } from '../../recording.service';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { DomSanitizer, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { Story } from '../../story';
import { Recording } from '../../recording';
import { NullInjector } from '@angular/core/src/di/injector';
import { Subject } from 'rxjs';
declare var MediaRecorder : any;

@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.css']
})
export class RecordingComponent implements OnInit {

  constructor(private auth: AuthenticationService,
              private storyService: StoryService, public ts: TranslationService,
              private sanitizer: DomSanitizer, private route: ActivatedRoute,
              private router: Router, private recordingService: RecordingService) { }
  
  //synthesiser variables
  story: Story = new Story();
  paragraphs: Paragraph[] = [];
  sentences: Sentence[] = [];
  audioFinishedLoading: boolean = false;
  a;
  audioPlaying: boolean = false;
  sectionSplit : string = "paragraph";
  audioTimeouts = [];
  needsUpdating: boolean = false;
  
  modalClass : string = "hidden";
  modalChoice: Subject<boolean> = new Subject<boolean>();


  isRecordingParagraph: boolean[] = [];
  isRecordingSentence: boolean[] = [];
  paragraphAudioSources : SafeUrl[] = [];
  sentenceAudioSources: SafeUrl[] = [];
  recordingSaved: boolean = true;
  
  //recording history variables
  recordingMode: boolean = true;
  historyMode: boolean = false;
  recordingHistory: Recording[] = [];
  popupVisible = false;

  errorText : string;
  registrationError : boolean;

  recorder;
  stream;
  chunks;
  paragraphBlobs: any[] = [];
  sentenceBlobs: any[] = [];

  paragraphChunks: {[key:number]:any[]} = [];
  sentenceChunks: {[key:number]:any[]}  = [];

  /*
  * Call getStory() to get current story recording, story data, synthesise, and recordings
  * Reset variables when recording text updated (function called in updateStory())
  */
    ngOnInit() {
      this.modalClass = "hidden";
      this.chunks = [];
      this.getStory();
    }
    
    /**
     * - Get story from URL id
     * - Load activeRecording if there is one,
     * - Otherwise, make a new one, using this.archive()
     */
    getStory() {
      this.story = null;
      this.route.params.subscribe(params => {
        this.storyService.getStory(params['id']).subscribe(
          story => {
            this.story = story;
            if (this.story.activeRecording) {
              this.recordingService.get(this.story.activeRecording).subscribe(recording => {
                this.synthesiseStory(recording.storyData);
                this.loadAudio(recording);
              });
            } else {
              console.log('This should be running');
              this.synthesiseStory(this.story);
              this.archive(this.story);
            }
          });
      });
    }

    /**
     * Archives story.activeRecording by making a new, blank
     * up-to-date activeRecording for story.
     * 
     * @param story - story whose activeRecording will be updated
     */
    archive(story: Story) {
      this.recordingService.updateArchiveStatus(story.activeRecording).subscribe();
      
      const newActiveRecording = new Recording(story);
      this.recordingService.create(newActiveRecording).subscribe(res => {
        if (res.recording) {
          const newActiveRecordingId = res.recording._id;
          console.log(newActiveRecordingId);
          this.storyService.updateActiveRecording(story._id, newActiveRecordingId).subscribe(_ => {
            this.story.activeRecording = newActiveRecordingId;
            // Reset all recording / audio data
            this.paragraphs = [];
            this.sentences = [];
            this.paragraphAudioSources = [];
            this.paragraphChunks = [];
            this.sentenceAudioSources = [];
            this.sentenceChunks = [];
            this.popupVisible = false;
            // Resynthesise with latest story text
            this.getStory();
          });
        }
      })
    }

    /**
     * Given some recording, gets audio data from the DB and saves it
     * in SafeUrl arrays to be displayed in <audio>s on the .html page
     * 
     * @param recording - recording whose audio clips should be loaded
     */
    loadAudio(recording: Recording) {
      for (let i=0; i<recording.paragraphIndices.length; ++i) {
        this.recordingService.getAudio(recording.paragraphAudioIds[i]).subscribe((res) => {
          this.paragraphAudioSources[recording.paragraphIndices[i]] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
        });
      }
      for (let i=0; i<recording.sentenceIndices.length; ++i) {
        this.recordingService.getAudio(recording.sentenceAudioIds[i]).subscribe((res) => {
          this.sentenceAudioSources[recording.sentenceIndices[i]] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
        });
      }
    }
  
  /*
  * Synthesise recording text using story service
  */
    synthesiseStory(story) {
      this.storyService.synthesiseObject(story).subscribe((res) => {
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
          paragraphObject.responseHtml = this.sanitizer.bypassSecurityTrustHtml(paragraphStr);
          paragraphObject.audioPlaying = false;
          this.paragraphs.push(paragraphObject);
        }
        let j = 0;
        // loop through the audio of the synthesis response and add to sentence/paragraph instances
        for(let i in res.audio) {
          this.paragraphs[i].audioUrl = res.audio[i];
          this.paragraphs[i].index = i;
          for(let s of this.paragraphs[i].sentences) {
            s.index = j;
            ++j;
          }
        }
        this.audioFinishedLoading = true;
        this.paragraphMode();
      });
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

    /**
     * Given some chunksArray (either paragraphChunks or sentenceChunks) and a
     * sentence / paragraph index, populate that chunks array with audio data
     * recorded through microphone.
     * @param index - index for the paragraph / sentence being recorded
     * @param chunksArray - array of any[], should be either paragraphChunks
     * or sentenceChunks
     */
    recordAudio(index:number, chunksArray: Array<any[]>, isRecording: boolean[]) {
      let media = {
        tag: 'audio',
        type: 'audio/mp3',
        ext: '.mp3',
        gUM: {audio: true}
      }
      navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
        this.stream = _stream;
        this.recorder = new MediaRecorder(this.stream);
        chunksArray[index] = [];
        this.recorder.start();
        isRecording[index] = true;
        this.recorder.ondataavailable = e => {
          chunksArray[index].push(e.data);
          if(this.recorder.state == 'inactive') {
          };
        };
        console.log('got media successfully');
      }).catch();
    }

    stopRecording(index: number, sources: SafeUrl[], chunksArray: Array<any[]>, isRecording: boolean[]) {
      this.recorder.stop();
      isRecording[index] = false;
      this.stream.getTracks().forEach(track => track.stop());
      setTimeout(() => {
        sources[index] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob(chunksArray[index], {type: 'audio/mp3'})));
        this.recordingSaved = false;
      }, 500);
    }

    deleteRecording(index: number, sources: SafeUrl[], chunksArray: Array<any[]>) {
      this.recordingSaved = false;
      delete sources[index];
      delete chunksArray[index];
    }
    
    /**
     * Saves contents of this.paragraphChunks and this.sentenceChunks to DB
     * as individual audio clips using recordingService.saveAudio.
     * 
     * Each clip is given an id on the database. These ids are mapped to
     * by paragraph / sentence indices which are stored in Recording object,
     * which is also saved to DB.
     */
    async saveRecordings() {
      const paragraph_promises = Object.entries(this.paragraphChunks).map(async ([index, chunks]) => {
        const blob = new Blob(chunks, {type: 'audio/mp3'});
        return this.recordingService.saveAudio(this.story._id, blob, index).toPromise();
      });
 
      const sentence_promises = Object.entries(this.sentenceChunks).map(async ([index, chunks]) => {
        const blob = new Blob(chunks, {type: 'audio/mp3'});
        return this.recordingService.saveAudio(this.story._id, blob, index).toPromise();
      });
 
      const paragraphResponses = await Promise.all(paragraph_promises);
      const sentenceResponses = await Promise.all(sentence_promises);
 
      let paragraphIndices = [];
      let paragraphAudioIds = [];
      for (const res of paragraphResponses) {
        paragraphIndices.push(res.index);
        paragraphAudioIds.push(res.fileId);
      }
 
      let sentenceIndices = [];
      let sentenceAudioIds = [];
      for (const res of sentenceResponses) {
        sentenceIndices.push(res.index);
        sentenceAudioIds.push(res.fileId);
      }
 
      const trackData = {
        paragraphAudioIds: paragraphAudioIds,
        paragraphIndices: paragraphIndices,
        sentenceIndices: sentenceIndices,
        sentenceAudioIds: sentenceAudioIds
      }

      this.recordingService.update(this.story.activeRecording, trackData).subscribe(res => {
        this.recordingSaved = true;
      });
    }
  
  // set mmodalClass to visible fade 
  showModal() {
    this.modalClass = "visibleFade";
  }

  hideModal() {
    this.modalClass = "hiddenFade";
    this.modalChoice.next(false);
  }

  setModalChoice() {
    this.modalChoice.next(true);
  }

  saveModal() {
    this.saveRecordings();
    this.modalChoice.next(true);
  }
  
  goToDashboard() {
    this.router.navigateByUrl('/dashboard/' + this.story.id);
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