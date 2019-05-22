import { Component, OnInit } from '@angular/core';
import { Story } from '../story';
import { StoryService } from '../story.service';

@Component({
  selector: 'app-book-contents',
  templateUrl: './book-contents.component.html',
  styleUrls: ['./book-contents.component.css']
})
export class BookContentsComponent implements OnInit {
  
  stories: Story[];

  constructor(private storyService: StoryService) { }

  ngOnInit() {
    this.storyService
    .getStory()
    .subscribe((data: Story[]) => {
      this.stories = data;
    });
  }

  chooseStory(story: Story) {
    this.storyService.chosenStory = story;
  }

}
