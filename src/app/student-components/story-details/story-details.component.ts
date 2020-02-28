import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Story } from '../../story';
import { StoryService } from '../../story.service';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.css']
})
export class StoryDetailsComponent implements OnInit {

  constructor(private route : ActivatedRoute,
              private storyService : StoryService,
              private router : Router,
              public ts : TranslationService) { }

  story : Story;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.storyService.getStory(params['id']).subscribe(
        story => {
          this.story = story;
        }
      );
    })
  }

  dialects = [
    {
      code : "connemara",
      name : this.ts.l.connacht
    },
    {
      code : "kerry",
      name : this.ts.l.munster
    },
    {
      code : "donegal",
      name : this.ts.l.ulster
    }
  ];

  saveDetails() {
    this.storyService.updateStory(this.story, this.story.id).subscribe(res => {
      this.router.navigateByUrl('/dashboard/' + this.story.id);
    });
  }

}
