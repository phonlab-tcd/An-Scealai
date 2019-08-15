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
  responseHtml: SafeHtml[] = [];
  audioSources: string[] = [];
 
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
          this.responseHtml.push(this.sanitizer.bypassSecurityTrustHtml(sentence));
        }
        for(let src of res.audio) {
          this.audioSources.push(src);
        }
        
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

  logMeme(index: number) {
    let a = new Audio(this.audioSources[index]);
    a.play()
  }

}
