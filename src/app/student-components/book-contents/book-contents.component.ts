import { Component, OnInit } from '@angular/core';
import { Story } from '../../story';
import { StoryService } from '../../story.service';
import { AuthenticationService, TokenPayload } from '../../authentication.service';
import { EventType } from '../../event';
import { EngagementService } from '../../engagement.service';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'app-book-contents',
  templateUrl: './book-contents.component.html',
  styleUrls: ['./book-contents.component.css']
})
export class BookContentsComponent implements OnInit {
  
  stories: Story[];
  deleteMode: Boolean;
  editMode : boolean;
  toBeDeleted: String[];

  constructor(private storyService: StoryService, private auth: AuthenticationService,
    private engagement: EngagementService, private ts : TranslationService) { }

  ngOnInit() {
    this.storyService
    .getStoriesForLoggedInUser()
    .subscribe((data: Story[]) => {
      this.stories = data;
    });
    this.deleteMode = false;
    this.toBeDeleted = [];
  }

  chooseStory(story: Story) {
    this.storyService.chosenStory = story;
  }

  toggleDeleteMode() {
    if(this.deleteMode && this.toBeDeleted.length > 0) {
      for(let id of this.toBeDeleted) {
        this.engagement.addEventForLoggedInUser(EventType["DELETE-STORY"], {_id: id});
        this.storyService.deleteStory(id).subscribe(
          res => {
            console.log('Deleted: ', id);
            this.ngOnInit();
          }
        )
      }
    } else if(this.deleteMode && this.toBeDeleted.length === 0) {
      this.deleteMode = false;
    } else {
      this.deleteMode = true;
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  toggleDelete(id: String) {
    if(this.toBeDeleted.includes(id)) {
      var indexToRemove = this.toBeDeleted.indexOf(id);
      this.toBeDeleted.splice(indexToRemove, 1);
    } else {
      this.toBeDeleted.push(id);
    }
  }

}
