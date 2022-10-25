import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordingService } from '../../recording.service';
import { DomSanitizer, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { TranslationService } from '../../translation.service';
import { Story } from 'app/story';
import { Recording } from 'app/recording';
import { StoryService } from '../../story.service';

@Component({
  selector: 'app-view-recording',
  templateUrl: './view-recording.component.html',
  styleUrls: ['./view-recording.component.scss']
})
export class ViewRecordingComponent implements OnInit {

  constructor(private recordingService: RecordingService, private route: ActivatedRoute,
              private sanitizer: DomSanitizer, public ts: TranslationService,
              private storyService: StoryService) { }
  
  audioSource = null;
  story: Story;
  paragraphs: Paragraph[] = [];
  sentences: Sentence[] = [];
  audioFinishedLoading = false;
  recordingsFinishedLoading = false;
  sectionSplit : string = "paragraph";
  a;
  audioPlaying: boolean = false;
  audioTimeouts = [];

  paragraphToAudioSource: SafeUrl[] = [];
  sentenceToAudioSource: SafeUrl[] = [];

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.recordingService.get(params['id']).subscribe((res: Recording) => {
        this.story = res.storyData;
        this.synthesiseStory(this.story);
        this.loadRecordings(res);
      });
    })
  }

  loadRecordings(recording: Recording) {
    for (let i=0; i<recording.paragraphIndices.length; ++i) {
      this.recordingService.getAudio(recording.paragraphAudioIds[i]).subscribe((res) => {
        this.paragraphToAudioSource[recording.paragraphIndices[i]] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
      });
    }
    for (let i=0; i<recording.sentenceIndices.length; ++i) {
      this.recordingService.getAudio(recording.sentenceAudioIds[i]).subscribe((res) => {
        this.sentenceToAudioSource[recording.sentenceIndices[i]] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
      });
    }
    this.recordingsFinishedLoading = true;
  }

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
  * Play the audio of a word when it is clicked 
  * Method bound to event target in sentence/paragraphMode functions
  */
  playWord(event) {
    let span = event.target;
    this.pauseAllAudio();
    this.a = new Audio(span.getAttribute("audio-url"));
    let time = span.getAttribute("data-begin");
    let duration = span.getAttribute("data-dur");
    this.a.currentTime = time;
    this.a.play();
    span.style.background = "var(--scealai-light-blue)";
    let t = setTimeout(() => {
      this.a.pause();
      span.classList.remove("staticHighlight");
      span.style.background = "#00000000";
    }, duration * 1500);
    this.audioTimeouts.push(t);
  }

}

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
