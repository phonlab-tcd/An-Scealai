import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StoryService } from './story.service';
import { Story } from './story';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  private _stories: BehaviorSubject<Story[]>;
  private dataStore: {
    stories: Story[]
  }

  constructor(private storyService : StoryService) {
    this.dataStore = { stories: [] };
    this._stories = <BehaviorSubject<Story[]>>new BehaviorSubject([]);
    this.getNotifications();
  }

  getNotifications() {
    this.storyService.getStoriesForLoggedInUser().subscribe((res : Story[]) => {
      let stories = res;
      for(let story of stories) {
        if(story.feedback.seenByStudent === false) {
          this.dataStore.stories.push(story);
        }
      }
      this.loadObservable();
    });
  }

  private loadObservable() {
    this._stories.next(Object.assign({}, this.dataStore).stories);
    console.log("ran");
  }

  getStories() {
    return this._stories.asObservable();
  }

  removeStory(story: Story) {
    for(let s of this.dataStore.stories) {
      if(s._id === story._id) {
        let i = this.dataStore.stories.indexOf(s);
        this.dataStore.stories.splice(i, 1);
        this.loadObservable();
      }
    }
  }

}
