import { Component          } from '@angular/core';
import { OnInit             } from '@angular/core';
import { ElementRef         } from '@angular/core';

import { Observable         } from 'rxjs';

import { TranslationService } from 'app/translation.service';
import { StoryService       } from 'app/story.service';
import { Story              } from 'app/story';

@Component({
  selector: 'record-yourself-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./module.css'],
})
export class RecordYourselfNav implements OnInit {
  constructor(
    public  story:  StoryService,
    public  ts:     TranslationService,
  ){};
  stories: Observable<Story[]>;
  activatedComponentRef: ElementRef;
  ngOnInit() {
    this.stories = this.story.getStoriesForLoggedInUser();
  }
}
