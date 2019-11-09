import { Component, OnInit, HostListener, ViewEncapsulation, Renderer2 } from '@angular/core';
import { StoryService } from '../../story.service';
import { Story } from '../../story';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { AuthenticationService } from '../../authentication.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NotificationService } from '../../notification-service.service';
import { HighlightTag, } from 'angular-text-input-highlight';
import { Subject } from 'rxjs';
import { EventType } from '../../event';
import { EngagementService } from '../../engagement.service';
import { GrammarService, GrammarTag, TagSet } from '../../grammar.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  story: Story;
  stories: Story[];
  id: string;
  storyFound: boolean;
  storySaved: boolean;
  popupVisible: boolean;
  feedbackVisible: boolean;
  audioSource: SafeUrl;
  grammarChecked: boolean = false;
  tags: HighlightTag[] = [];
  tagSets : TagSet;
  visibleTags: HighlightTag[] = [];
  tagFilters: Array<string> = [];
  chosenTag: GrammarTag;
  grammarLoading: boolean = false;
  modalClass : string = "hidden";

  constructor(private storyService: StoryService, private route: ActivatedRoute,
    private auth: AuthenticationService, protected sanitizer: DomSanitizer,
    private notifications: NotificationService, private router: Router,
    private engagement: EngagementService, private grammar: GrammarService) {

    }

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
        this.engagement.addEventForLoggedInUser(EventType["SAVE-STORY"], this.story);
        this.storySaved = true;
        console.log("Story saved");
      }
    )
  }

  getFeedback() {
    this.popupVisible = false;
    this.feedbackVisible = true;
    this.getFeedbackAudio();
    this.story.feedback.seenByStudent = true;
    this.notifications.removeStory(this.story);
    this.storyService.viewFeedback(this.story._id).subscribe(() => {
      this.engagement.addEventForLoggedInUser(EventType["VIEW-FEEDBACK"], this.story);
    });
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
    this.saveStory();
    this.feedbackVisible = false;
    this.popupVisible = false;
    this.grammarChecked = false;
    this.grammarLoading = true;
    this.tags = [];
    this.chosenTag = null;
    this.grammar.checkGrammar(this.story._id).subscribe((res: TagSet) => {
      this.tagSets = res;
      this.tags = this.tagSets.gramadoirTags;
      this.grammarLoading = false;
      this.grammarChecked = true;
      this.engagement.addEventForLoggedInUser(EventType["GRAMMAR-CHECK-STORY"], this.story);
    });
  }

  onChangeGrammarFilter(eventValue : any) {
    this.chosenTag = null;
    if(eventValue == 'vowel') {
      this.tags = this.tagSets.vowelTags;
    }
    if(eventValue == 'gramadoir') {
      this.tags = this.tagSets.gramadoirTags;
    }
  }

  chooseGrammarTag(tag: HighlightTag) {
    this.chosenTag = new GrammarTag(tag.data);
  }

  closeGrammar() {
    this.grammarChecked = false;
    this.tags = [];
    this.chosenTag = null;
  }

  addTagHoverClass(tagElement: HTMLInputElement) {
    tagElement.classList.remove("tagNotHover");
    tagElement.classList.add("tagHover");
  }

  removeTagHoverClass(tagElement: HTMLInputElement) {
    tagElement.classList.remove("tagHover");
    tagElement.classList.add("tagNotHover");
  }

  addTagFilter(filter: string) {
    this.tagFilters.push(filter);
    //this.refreshHighlights();
  }

  removeTagFilter(filter: string) {
    let i = this.tagFilters.indexOf(filter);
    if(i > -1) {
      this.tagFilters.splice(i, 1);
    }
    //this.refreshHighlights();
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
  
  showModal() {
    this.modalClass = "visibleFade";
  }

  hideModal() {
    this.modalClass = "hiddenFade";
    this.modalChoice.next(false);
  }

  modalChoice: Subject<boolean> = new Subject<boolean>();

  setModalChoice() {
    this.modalChoice.next(true);
  }

  saveModal() {
    this.saveStory();
    this.modalChoice.next(true);
  }

}