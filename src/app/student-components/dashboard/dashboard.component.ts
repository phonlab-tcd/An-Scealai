import { Component, OnInit, HostListener, ViewEncapsulation, ViewChild } from '@angular/core';
import { StoryService } from '../../story.service';
import { Story } from '../../story';
import { ActivatedRoute, Router } from '@angular/router';
import { CompileTemplateMetadata } from '@angular/compiler';
import { AuthenticationService, TokenPayload } from '../../authentication.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NotificationService } from '../../notification-service.service';
import { HighlightTag, TextInputHighlightModule } from 'angular-text-input-highlight';
import { TextInputHighlightComponent } from 'angular-text-input-highlight/text-input-highlight.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  story: Story;
  stories: Story[];
  id: String;
  storyFound: Boolean;
  storySaved: Boolean;
  popupVisible: boolean;
  feedbackVisible: boolean;
  audioSource: SafeUrl;
  grammarChecked: boolean = false;
  tags: HighlightTag[] = [];
  @ViewChild('highlightElement') highlightElement: TextInputHighlightComponent;

  constructor(private storyService: StoryService, private route: ActivatedRoute,
    private auth: AuthenticationService, protected sanitizer: DomSanitizer,
    private notifications: NotificationService, private router: Router) { }

  ngOnInit() {
    this.storySaved = true;
    // Get the stories from the storyService, and run
    // the following function once that data has
    // been retrieved.
    this.getStories().then(stories => {
      this.stories = stories;
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
      this.storyService.getStoriesForLoggedInUser().subscribe(
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

  saveStory() {
    this.route.params.subscribe(
      params => {
        console.log(this.story.text);
        this.storyService.updateStory(this.story.text, params['id']);
        this.storySaved = true;
      }
    )
  }

  getFeedback() {
    this.popupVisible = false;
    this.feedbackVisible = true;
    this.getFeedbackAudio();
    this.story.feedback.seenByStudent = true;
    this.notifications.removeStory(this.story);
    this.storyService.viewFeedback(this.story._id).subscribe();
  }

  getFeedbackAudio() {
    this.storyService.getFeedbackAudio(this.story._id).subscribe((res) => {
      this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
    });
  }

  storyEdited() {
    this.storySaved = false;
  }

  closeFeedback() {
    this.feedbackVisible = false;
  }

  hasNewFeedback() : boolean {
    if(this.story && this.story.feedback.seenByStudent === false) {
      return true;
    }
    return false;
  }

  goToSynthesis() {
    this.router.navigateByUrl('/synthesis/' + this.story.id);
  }

  runGramadoir() {
    this.storyService.gramadoir(this.story._id).subscribe((res) => {
      res.forEach(g => {
        console.log(g);
        let tag : HighlightTag = {
          indices: {
            start: +g.fromx,
            end: +g.tox+1,
          },
          cssClass: "bg-blue",
        };
        this.tags.push(tag);
        console.log(this.tags);
      });
      console.log(this.highlightElement);
      this.grammarChecked = true;
    });
  }

  wasInside : boolean = false;
  
  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }
  
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.popupVisible = false;
    }
    this.wasInside = false;
  }

}
