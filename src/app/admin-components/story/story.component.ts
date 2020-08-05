import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StoryService } from '../../story.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslationService } from '../../translation.service';


@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              protected sanitizer: DomSanitizer,
              private storyService: StoryService,
              private router: Router,
              private ts: TranslationService) { }

  story : any;
  audioSource : SafeUrl;
  
  ngOnInit() {
    this.getParams().then(params => {
      this.http.get('http://localhost:4000/story/viewStory/' + params['id'].toString()).subscribe((res) => {
        this.story = res[0];
        this.getFeedbackAudio();
      });
    })
  }

  getParams(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => {
          resolve(params);
      });
    });
  }

  getFeedbackAudio() {
    this.storyService.getFeedbackAudio(this.story._id).subscribe((res) => {
      this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
      console.log(this.audioSource);
    });
  }

  goToStoryHistory() {
    this.router.navigateByUrl('/admin/story-history/' + this.story._id);
  }

}
