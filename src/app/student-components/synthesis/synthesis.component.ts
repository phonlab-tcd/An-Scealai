import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../story.service';
import { Story } from '../../story';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EventType } from '../../event';
import { EngagementService } from '../../engagement.service';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'app-synthesis',
  templateUrl: './synthesis.component.html',
  styleUrls: ['./synthesis.component.css']
})
export class SynthesisComponent implements OnInit {

  constructor(private storyService: StoryService, private route: ActivatedRoute,
              private router: Router, private sanitizer: DomSanitizer,
              private engagement: EngagementService, public ts : TranslationService) { }

  story: Story;
  paragraphs: Paragraph[] = [];
  sentences: Sentence[] = [];
  audioFinishedLoading: boolean = false;
  a;
  audioPlaying: boolean = false;
  sectionSplit : string = "paragraph";
  audioTimeouts = [];

  ngOnInit() {
    this.getStory().then(() => {
      this.storyService.synthesise(this.story._id).subscribe((res) => {
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
        for(let i in res.audio) {
          this.paragraphs[i].audioUrl = res.audio[i];
          this.paragraphs[i].index = i;
          for(let s of this.paragraphs[i].sentences) {
            s.index = j;
            ++j;
          }
        }
        this.engagement.addEventForLoggedInUser(EventType["SYNTHESISE-STORY"], this.story);
        this.audioFinishedLoading = true;
        this.paragraphMode();
        
      });
    });
  }

  paragraphMode() {
    this.sectionSplit = "paragraph";
    this.pauseAllAudio();
    setTimeout(() => {
      this.paragraphs.forEach(p => {
        console.log(p.index);
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

  getStory() {
    return new Promise((resolve, reject) => {
        this.getParamsFromUrl().then((params) => {
        this.storyService.getStory(params['id'].toString()).subscribe((res : Story) => {
          this.story = res;
          resolve();
        });
      });
    });
  }

  getParamsFromUrl() {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => {
          resolve(params);
      });
    });
  }

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
      if(!section.startTime) {
        section.startTime = sentenceElement.children[0].children[0].getAttribute("data-begin");
      }
      if(!section.duration) {
        section.duration = +sentenceElement.children[0].children[sentenceElement.children[0].childElementCount-1].getAttribute("data-begin")
        + +sentenceElement.children[0].children[sentenceElement.children[0].childElementCount-1].getAttribute("data-dur")
        - section.startTime;
      }
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

  stopAudio(section) {
    this.a.pause();
    this.audioPlaying = false;
    Highlighter.stopHighlighting(section);
  }

  goToDashboard() {
    this.router.navigateByUrl('/dashboard/' + this.story.id);
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