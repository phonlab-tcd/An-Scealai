import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Story } from '../../story';
import { StoryService } from '../../story.service';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.scss']
})
export class StoryDetailsComponent implements OnInit {

  constructor(private route : ActivatedRoute,
              private storyService : StoryService,
              private router : Router,
              public ts : TranslationService) { }

  story : Story = new Story();

//get current story using id from route
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

  //uses story service to update story values and redirect to dashboard
  saveDetails() {
    this.storyService
        .updateStoryTitleAndDialect(this.story)
        .subscribe({
          complete: () => {
            if (this.story._id) {
              this.router.navigateByUrl('/dashboard/' + this.story._id);
            }
          },
        });
  }

}
