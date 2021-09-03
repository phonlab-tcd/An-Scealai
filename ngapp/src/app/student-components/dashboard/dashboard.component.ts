import {
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { StoryService } from '../../story.service';
import { Story } from '../../story';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { AuthenticationService } from '../../authentication.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NotificationService } from '../../notification-service.service';
import { HighlightTag, } from 'angular-text-input-highlight';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { EventType } from '../../event';
import { EngagementService } from '../../engagement.service';

import {
  GrammarService,
  GrammarTag,
  TagSet,
  GramadoirTag,
  GramadoirRuleId,
} from '../../grammar.service';

import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { TranslationService } from '../../translation.service';
import { StatsService } from '../../stats.service';
import { ClassroomService } from '../../classroom.service';
import config from 'src/abairconfig.json';
import Quill from 'quill';


const Parchment = Quill.import('parchment');
const gramadoirTag =
  new Parchment.Attributor.Attribute(
    'gramadoir-tag',
    'data-gramadoir-tag', {
      scope: Parchment.Scope.INLINE
    });

Quill.register(gramadoirTag);


type QuillHighlightTag = {
  start: number;
  length: number;
  type: GramadoirRuleId;
  tooltip: typeof Tooltip;
  color: string;
  messages: {
    en: string;
    ga: string;
  };
};

const Tooltip = Quill.import('ui/tooltip');


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {

  story: Story = new Story();
  stories: Story[];
  id: string;
  storyFound: boolean;
  storySaved: boolean = true;
  feedbackVisible: boolean;
  dictionaryVisible: boolean;
  audioSource: SafeUrl;
  grammarChecked: boolean = false;
  tags: HighlightTag[] = [];
  tagSets : TagSet;
  filteredTags: Map<string, HighlightTag[]> = new Map();
  checkBox: Map<string, boolean> = new Map();
  chosenTag: GrammarTag;
  grammarLoading: boolean = false;
  grammarSelected: boolean = true;
  grammarTagsHidden = true;
  mostRecentGramadoirInput: string = null;
  currentGramadoirHighlightTags: QuillHighlightTag[] = null;
  modalClass : string = "hidden";
  modalChoice: Subject<boolean> = new Subject<boolean>();
  teacherSelectedErrors: String[] = [];
  classroomId: string;
  selectTeanglann: boolean = true;
  selectExternalLinks: boolean = false;
  showOptions: boolean = true;
  dontToggle: boolean = false;
  words: string[] = [];
  wordCount: number = 0;

  quillEditor: Quill;
  textUpdated: Subject<string> = new Subject<string>();

  downloadStoryFormat = '.pdf';

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
  
  quillToolbar = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote'/*, 'code-block'*/],
      //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      //[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      //[{ 'direction': 'rtl' }],                         // text direction
      //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      //['link', 'image', 'video']                        // link and image, video
    ]
  };
  
  constructor (
    private storyService: StoryService,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    protected sanitizer: DomSanitizer,
    private notifications: NotificationService,
    private router: Router,
    private engagement: EngagementService,
    private grammar: GrammarService,
    public ts: TranslationService,
    public statsService: StatsService,
    public classroomService: ClassroomService,
  ) {
    this.textUpdated.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(async () => {
      const textToCheck = this.story.text.replace(/\n/g, ' ');
      if (textToCheck !== this.mostRecentGramadoirInput) {
        this.updateGrammarErrors(textToCheck);
      }
      if (!this.grammarTagsHidden) {
        this.applyGramadoirTagFormatting();
      }
    });
  }

  /* set the stories array of all the student's stories 
  *  and the current story being edited given its id from url
  */
  ngOnInit() {
    console.log('typeof Tooltip', typeof Tooltip);
    this.storySaved = true;
    // Get the stories from the storyService and run
    // the following function once that data has been retrieved
    this.getStories().then(stories => {
      this.stories = stories;
      // Get the story id from the URL in the same way
      this.getStoryId().then(params => {
        this.id = params['id'];
        // loop through the array of stories and check
        // if the id in the url matches one of them
        // if no html version exists yet, create one from the plain text
        for(let story of this.stories) {
          if(story._id === this.id) {
            this.story = story;
            this.getWordCount(this.story.text);
            if(this.story.htmlText == null) {
              this.story.htmlText = this.story.text;
            }
            break;
          }
        }
      });
    });
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;
    this.classroomService.getClassroomOfStudent(this.auth.getUserDetails()._id).subscribe( (res) => {
      if(res) {
        this.classroomId = res._id;
      }
    });
  }

/*
* return the student's set of stories using the story service 
*/
  
  getStories(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storyService.getStoriesForLoggedInUser().subscribe(
        (stories: Story[]) => {
          resolve(stories);
        }
      )
    });
  }

/*
* return the story id using the routing parameters
*/
  getStoryId(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => {
          resolve(params);
      });
    });
  }


  async updateGrammarErrors(text: string) {
    // my tslint server keeps
    // asking me to brace these guys
    if (!this.quillEditor) { return; }

    // convert text to single line
    // (no paragraphs/new lines)
    // const gramadoirInputText = text; // this.story.text.replace(/\n/g, ' ');
    this.mostRecentGramadoirInput = text; // gramadoirInputText;

    const gramadoirPromiseIrish =
      this.grammar.gramadoirDirectObservable(text, 'ga')
      .toPromise();

    const grammarCheckerErrors =
      await this.grammar
          .gramadoirDirectObservable(
            text,
            'en')
          .pipe(
            map((tagData: GramadoirTag[]) =>
              tagData.map(tag =>
                ({
                  start: + tag.fromx,
                  length: + tag.tox + 1 - tag.fromx,
                  type: this.grammar.string2GramadoirRuleId(tag.ruleId),
                  tooltip: null,
                  messages: { en: tag.msg},
                }) as QuillHighlightTag
              )
            ),
          ).toPromise();

    const editorElem = this.quillEditor.root;

    this.clearAllGramadoirTags();

    const grammarCheckerErrorsIrish = await gramadoirPromiseIrish;

    grammarCheckerErrors.forEach((e, i) => {
      e.messages.ga = grammarCheckerErrorsIrish[i].msg;
    });

    this.currentGramadoirHighlightTags = grammarCheckerErrors;
    
    this.applyGramadoirTagFormatting();

    /*
    grammarCheckerErrors.forEach((error: QuillHighlightTag, errorIndex) => {
      this.quillEditor
          .formatText(
              error.start,
              error.length,
              {'gramadoir-tag': error.type, 'background': error.color}
          );
    });

    // Get the HTMLElement for the span just created by the formatText
    document
        .querySelectorAll('[data-gramadoir-tag]')
        .forEach((tagElement, index) => {
      const error = grammarCheckerErrors[index];
      this.createGrammarPopup(error, tagElement);
    });
    */

    if (this.grammarTagsHidden) {
      this.hideGrammarTags();
    }
    console.log('grammar updated');
  }

  createGrammarPopup(error, tagElement) {
    // Create a customised quill tooltip containing
    // a message about the grammar error
    const bounds = this.quillEditor.getBounds(error.start, error.length);
    error.tooltip = new Tooltip(this.quillEditor);
    error.tooltip.root.classList.add('custom-tooltip');

    // Add hover UI logic to the grammar error span element
    tagElement.addEventListener('mouseover', () => {
      this.mouseOverTagElem(this, error, bounds);
    });

    tagElement.addEventListener('mouseout', () => {
      error.tooltip.hide();
    });
  }

  clearAllGramadoirTags() {
    this.clearGramadoirTagFormatting();
    // remove any remaining custom-tooltips from the DOM.
    //  -> without doing this, a tooltip can live on past its
    //     corresponding highlight tag if the user stays hovering
    //     on the highlight tag while the grammar error is fixed.
    document.querySelectorAll('.custom-tooltip').forEach(elem => elem.remove());
  }

  applyGramadoirTagFormatting() {
    if (!this.currentGramadoirHighlightTags) { return; }

    this.currentGramadoirHighlightTags
        .forEach((error) => {
          // Add highlighting to error text
          this.quillEditor
              .formatText(
                  error.start,
                  error.length,
                  {'gramadoir-tag': error.type}
              );
        });

    const popups = document.querySelectorAll('[data-gramadoir-tag]');

    this.currentGramadoirHighlightTags.forEach((error, i) => {
      this.createGrammarPopup(error, popups[i]);
    });
  }

  clearGramadoirTagFormatting() {
    this.quillEditor.formatText(
      0, // from the very beginning of the text
      this.quillEditor.getLength(), // to the very end of the text
      {'gramadoir-tag': null} // delete all gramadoir-tag's on the parchment
    );
  }

  hideGrammarTags(){
    this.grammarTagsHidden = true;
    this.clearGramadoirTagFormatting();
  }

  showGrammarTags(){
    this.grammarTagsHidden = false;
    this.applyGramadoirTagFormatting();
  }

  mouseOverTagElem(
    that: DashboardComponent,
    error: QuillHighlightTag,
    bounds: any,
  )
  {
    console.count('MOUSOVER');
    const userFriendlyMsgs =
      that.grammar
          .userFriendlyGramadoirMessage[error.type];

    error.tooltip.root.innerHTML =
      // Prefer user friendly message
      userFriendlyMsgs ?
      userFriendlyMsgs[that.ts.l.iso_code] :
      error.messages[that.ts.l.iso_code];
    console.count('error.tooltip.show()');
    error.tooltip.show();
    error.tooltip.position(bounds);

    // Ensure that tooltip isn't cut off by the right edge of the editor
    const rightOverflow =
      (error.tooltip.root.offsetLeft + error.tooltip.root.offsetWidth) -
      that.quillEditor.root.offsetWidth;

    error.tooltip.root.style.left =
      (rightOverflow > 0) ?
      `${(error.tooltip.root.offsetLeft - rightOverflow) - 5}px` : // - 5px for right padding
      error.tooltip.root.style.left;

    // Ensure that tooltip isn't cut off by the left edge of the editor
    error.tooltip.root.style.left =
      (error.tooltip.root.offsetLeft < 0) ?
      `${(error.tooltip.root.offsetLeft - error.tooltip.root.offsetLeft) + 5}px` : // + 5px for left padding
      error.tooltip.root.style.left;
  }

  /*
  * Update story data (text and date) using story service
  * Add logged event for saved story  using engagement service
  */
  saveStory() {
    this.route.params.subscribe(
      params => {
        let updateData = {
          text : this.story.text,
          htmlText: this.story.htmlText,
          lastUpdated : new Date(),
        };
        this.storyService.updateStory(updateData, params['id']).subscribe();
        this.engagement.addEventForLoggedInUser(EventType["SAVE-STORY"], this.story);
        this.storySaved = true;
      }
    )
  }
  
  showDictionary() {
    this.dictionaryVisible = true;
    this.engagement.addEventForLoggedInUser(EventType["USE-DICTIONARY"]);
  }

/*
* Get audio feedback with function call 
* Set feedback status to seen by student and remove story from not yet seen array
* Add logged event for viewed feedback 
*/
  getFeedback() {
    this.dictionaryVisible = false;
    this.feedbackVisible = true;
    this.getFeedbackAudio();
    // set feedback status to seen by student
    if(this.story.feedback.text != "") {
      this.story.feedback.seenByStudent = true;
    }
    this.notifications.removeStory(this.story);
    this.storyService.viewFeedback(this.story._id).subscribe(() => {
      this.engagement.addEventForLoggedInUser(EventType["VIEW-FEEDBACK"], this.story);
    });
  }

/*
* set the url for the audio source feedback 
*/
  getFeedbackAudio() {
    this.storyService.getFeedbackAudio(this.story._id).subscribe((res) => {
      this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
    });
  }

  // Set story.text to most recent version of editor text and then switch to storyEditedAlt
  // WARNING THIS FUNCTION CAN ONLY BE CALLED ONCE
  storyEdited(text) {
    this.story.text = text;
    this.textUpdated.next(text);

    this.storyEdited = this.storyEditedAlt;
  }

  // THIS IS THE VALUE OF storyEdited AFTER IT'S FIRST CALL
  storyEditedAlt(text) {
    this.storySaved = false;
    this.textUpdated.next(text);
    this.story.text = text;
  }

  // Get word count of story text
  getWordCount(text) {
    let str = text.replace(/[\t\n\r\.\?\!]/gm, " ").split(" ");
    this.words = [];
    str.map((s) => {
      let trimStr = s.trim();
      if (trimStr.length > 0) {
        this.words.push(trimStr);
      }
      
    });
    this.wordCount = this.words.length;
  }

// set feedback window to false 
  closeFeedback() {
    this.feedbackVisible = false;
  }

  /**
   * Closes feedback, grammar checker, and dictionary windows,
   * setting text editor to 'default' mode.
   */
  defaultMode() {
    this.feedbackVisible = false;
    this.grammarChecked = false;
    this.dictionaryVisible = false;
  }

// return whether or not the student has viewed the feedback
  hasNewFeedback() : boolean {
    if(this.story && this.story.feedback && this.story.feedback.seenByStudent === false) {
      return true;
    }
    return false;
  }

// route to synthesis 
  goToSynthesis() {
    this.router.navigateByUrl('/synthesis/' + this.story._id);
  }
  
// route to synthesis 
  goToRecording() {
    this.router.navigateByUrl('/record-story/' + this.story._id);
  }

/*
* Set boolean variables for checking data / grammar window in interface
* Check grammar using grammar service 
* Set grammar tags using grammar service subscription and filter them by rule
* Add logged event for checked grammar
*/
  runGramadoir() {
    this.saveStory();
    this.feedbackVisible = false;
    this.grammarChecked = false;
    this.dictionaryVisible = false;
    this.grammarLoading = true;
    this.tags = [];
    this.filteredTags.clear();
    this.chosenTag = null;
    this.grammar.checkGrammar(this.story._id).subscribe((res: TagSet) => {
      this.tagSets = res;
      this.tags = this.tagSets.gramadoirTags;
      this.filterTags();
      this.grammarLoading = false;
      this.grammarChecked = true;
      this.engagement.addEventForLoggedInUser(EventType["GRAMMAR-CHECK-STORY"], this.story);
    });
  }

  /*
  * Set tags to vowel tags or grammar tags based on event value
  */
  onChangeGrammarFilter(eventValue : any) {
    this.chosenTag = null;
    if(eventValue == 'vowel') {
      this.tags = this.tagSets.vowelTags;
      this.grammarSelected = false;
    }
    if(eventValue == 'gramadoir') {
      this.tags = this.tagSets.gramadoirTags;
      this.grammarSelected = true;
    }
  }

  // set chosen tag to tag passed in parameters
  chooseGrammarTag(tag: HighlightTag) {
    this.chosenTag = new GrammarTag(tag.data);
  }

  // reset checked grammar to false, set tags array and chosen tag to null
  closeGrammar() {
    this.grammarChecked = false;
    this.tags = [];
    this.chosenTag = null;
  }

  // set the css class to hover over the tag
  addTagHoverClass(tagElement: HTMLInputElement) {
    tagElement.classList.remove("tagNotHover");
    tagElement.classList.add("tagHover");
  }

  // set the css class to not hover over the tag
  removeTagHoverClass(tagElement: HTMLInputElement) {
    tagElement.classList.remove("tagHover");
    tagElement.classList.add("tagNotHover");
  }

  /*
  * filter the grammar tags using a map
  * key: rule name 
  * value: array of tags that match the rule
  * sets checkBox map value to false (value) for each rule (key)
  */
  filterTags() {
    this.classroomService.getGrammarRules(this.classroomId).subscribe( (res) => {  
      this.teacherSelectedErrors = res;
      //loop through tags of errors found in the story
      for(let tag of this.tags) {
        let values: HighlightTag[] = [];
        let rule: string = tag.data.ruleId.substring(22);
        
        let rx = rule.match(/(\b[A-Z][A-Z]+|\b[A-Z]\b)/g);
        rule = rx[0];
      
        // check against errors that the teacher provides
        if(this.teacherSelectedErrors.length > 0) {
          if(this.teacherSelectedErrors.indexOf(rule) !== -1) {
            if(this.filteredTags.has(rule)) {
              values = this.filteredTags.get(rule);
              values.push(tag);
              this.filteredTags.set(rule, values);
            }
            else {
              values.push(tag);
              this.filteredTags.set(rule, values);
              this.checkBox.set(rule, false);
            }    
          }
        }
        // otherwise check against all grammar errors 
        else {
          if(this.filteredTags.has(rule)) {
            values = this.filteredTags.get(rule);
            values.push(tag);
            this.filteredTags.set(rule, values);
          }
          else {
            values.push(tag);
            this.filteredTags.set(rule, values);
            this.checkBox.set(rule, true);
          }
        } 
      }
      this.updateStats();
    });
  }

  downloadStoryUrl() {
    return config.baseurl +
      'story/downloadStory/' +
      this.story._id + '/' +
      this.downloadStoryFormat;
  }

  /**
   * Gets an array of HighlighTags for which the associated grammar error category
   * is selected according to the checkBox map.
   * 
   * E.g. if 'seimhiu' checkbox is selected, then this will return the array of
   * HighlightTags for seimhiu.
   */
  getSelectedTags(): HighlightTag[] {
    // Get only those filteredTags whose keys map to true in checkBox
    const selectedTagsLists = Array.from(this.filteredTags.entries()).map(entry => {
      // entry[0] is key, entry[1] is val.
      if (this.checkBox.get(entry[0])) {
        return entry[1];
      } else {
        return [];
      }
    });
    // Flatten 2d array of HighlightTags
    const selectedTags = selectedTagsLists.reduce((acc, val) => acc.concat(val), []);
    return selectedTags;
  }

  /*
  * Update the grammar error map of the stat object corresponding to the current student id
  */
  updateStats() {
    let updatedTimeStamp = new Date();
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;
    this.statsService.updateGrammarErrors(userDetails._id, this.filteredTags, updatedTimeStamp).subscribe((res) => {
    });
  }
  
  // set modalClass to visible fade 
  showModal() {
    this.modalClass = "visibleFade";
  }

  // set modalClass to hidden fade and next choice to false 
  hideModal() {
    this.modalClass = "hiddenFade";
    this.modalChoice.next(false);
  }

  // set next modal choice to true
  setModalChoice() {
    this.modalChoice.next(true);
  }

  // save story and set next modal choice to true 
  saveModal() {
    this.saveStory();
    this.modalChoice.next(true);
  }

  toggleOptions() {
    if(!this.dontToggle){
      this.showOptions = !this.showOptions;
    }
    this.dontToggle = false;
  }
}
