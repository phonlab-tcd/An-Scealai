import { Component, OnInit } from '@angular/core';
import { StoryService } from '../story.service';
import { Story } from '../story';
import { ActivatedRoute } from '@angular/router';
import { CompileTemplateMetadata } from '@angular/compiler';
import { AuthenticationService, TokenPayload } from '../authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  story: Story;
  stories: Story[];
  id: String;
  storyFound: Boolean;
  storySaved: Boolean;

  constructor(private storyService: StoryService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.storySaved = true;
    // Get the stories from the storyService, and run
    // the following function once that data has
    // been retrieved.
    this.getStories().then(stories => {
      this.stories = stories;
      console.log(stories);
      // Get the story id from the URL in the same way
      this.getStoryId().then(params => {
        this.id = params['id'];
        // loop through the array of stories and check
        // if the id in the url matches one of them
        for(let story of this.stories) {
          if(story.id === this.id) {
            this.story = story;
            break;
          }
        }
      });
    });
  }

  getStories(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storyService.getStory().subscribe(
        (stories: Story[]) => {
          resolve(stories);
        }
      )
    });
  }

  getStoryId(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => {
          resolve(params);
      });
    });
  }

  saveStory(text) {
    this.route.params.subscribe(
      params => {
        this.storyService.updateStory(text, params['id']);
        this.storySaved = true;
      }
    )
  }

  storyEdited() {
    this.storySaved = false;
  }

}
