import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../story.service';
import { Story } from '../../story';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-synthesis',
  templateUrl: './synthesis.component.html',
  styleUrls: ['./synthesis.component.css']
})
export class SynthesisComponent implements OnInit {

  constructor(private storyService: StoryService, private route: ActivatedRoute,
              private router: Router, private sanitizer: DomSanitizer) { }

  story: Story;
  paragraphs: Paragraph[] = [];
  audioFinishedLoading: boolean = false;
  a;

  ngOnInit() {
    this.getStory().then(() => {
      this.storyService.synthesise(this.story._id).subscribe((res) => {
        console.log(res);
        for(let p of res.html) {
          let sentences: string[] = []
          let sentence: string = "";
          for(let s of p) {
            sentence += s;
          }
          let paragraphObject = new Paragraph();
          paragraphObject.responseHtml = this.sanitizer.bypassSecurityTrustHtml(sentence);
          paragraphObject.audioPlaying = false;
          this.paragraphs.push(paragraphObject);
        }
        for(let i in res.audio) {
          this.paragraphs[i].audioUrl = res.audio[i];
          this.paragraphs[i].index = i;
          console.log(this.paragraphs[i]);
        }
        this.audioFinishedLoading = true;
      });
    });
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

  playAudio(p: Paragraph) {
    if(this.a) {
      this.a.pause();
      this.paragraphs.forEach((para) => {
        para.stopHighlighting();
      })
    }
    this.a = new Audio(p.audioUrl);
    this.a.play();
    p.startHighlighting();
  }

  stopAudio(p: Paragraph) {
    this.a.pause();
    p.stopHighlighting();
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

    startHighlighting() {
      this.audioPlaying = true;
      let paragraphElement = document.getElementById('paragraph-' + this.index);
      let spans = paragraphElement.querySelectorAll('span');
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
                this.resetHighlight();
              }, (+s.getAttribute("data-dur")) * 1000);
            }
            if(previousSpan) {
              previousSpan.classList.add("spanTextNoHighlight");
            }
            s.classList.add("spanTextHighlight");
            s.style.setProperty('--trans', "width " + (+s.getAttribute("data-dur") / 2 ).toString() + "s  ease-in-out");
            previousSpan = s;
          }, (+s.getAttribute("data-begin") * 1000) + ((+s.getAttribute("data-dur") / 2) * 1000));
          this.highlightTimeouts.push(t);
        }
      });
      
    }

    stopHighlighting() {
      this.highlightTimeouts.forEach((t) => {
        clearTimeout(t);
      });
      this.resetHighlight();
    }

    resetHighlight() {
      this.audioPlaying = false;
      let paragraphElement = document.getElementById('paragraph-' + this.index);
      let spans = paragraphElement.querySelectorAll('span');
      spans.forEach((s) => {
        s.classList.remove("spanText");
        s.classList.remove("spanTextHighlight");
        s.classList.remove("spanTextNoHighlight");
      });
    }
}