import {
  ComponentFactoryResolver,
  ComponentFactory,
  Component,
  OnInit,
  // HostListener,
  ViewEncapsulation,
  // Renderer2,
  ViewChild,
  AfterViewInit} from '@angular/core';
import { StoryService } from '../../story.service';
import { Story } from '../../story';
import {
  ActivatedRoute,
  Router,
  // NavigationEnd,
  // NavigationStart,
  } from '@angular/router';
import { AuthenticationService } from '../../authentication.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NotificationService } from '../../notification-service.service';
import { HighlightTag, } from 'angular-text-input-highlight';
import { Subject } from 'rxjs';
import { EventType } from '../../event';
import { EngagementService } from '../../engagement.service';
import { GrammarService, GrammarTag, TagSet } from '../../grammar.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { TranslationService } from '../../translation.service';
import { StatsService } from '../../stats.service';
import { ClassroomService } from '../../classroom.service';
import {
  AbairAPIv2Voice,
  AbairAPIv2AudioEncoding,
  SynthRequestObject,
  Dialect,
  SynthesisService,
  } from '../../services/synthesis.service';
import { QuillEditorComponent } from 'ngx-quill';
import * as Quill from 'quill';
import { TextProcessingService } from 'src/app/services/text-processing.service';
import { SynthesisPlayerComponent } from 'src/app/student-components/synthesis-player/synthesis-player.component';


interface SynthesisedSentence {
  url: string;
  sentence: string;
}

type SynthesisSentenceBySentence = {
  date: Date,
  // The synthesised sentences should be in the order they appear in the text.
  // I don't think this can't be enforced with static type checking.
  // (Neimhin Mon 19 July 2021)
  sentences: SynthesisedSentence[],
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit, AfterViewInit {

  story: Story = new Story();
  stories: Story[];
  id: string;
  storyFound: boolean;
  storySaved = true;
  feedbackVisible: boolean;
  dictionaryVisible: boolean;
  audioSource: SafeUrl;
  grammarChecked = false;
  tags: HighlightTag[] = [];
  tagSets: TagSet;
  filteredTags: Map<string, HighlightTag[]> = new Map();
  checkBox: Map<string, boolean> = new Map();
  chosenTag: GrammarTag;
  grammarLoading = false;
  grammarSelected = true;
  modalClass: ('hidden' | 'hiddenFade' | 'visibleFade') = 'hidden';
  modalChoice: Subject<boolean> = new Subject<boolean>();
  teacherSelectedErrors: string[] = [];
  classroomId: string;
  selectTeanglann = true;
  selectExternalLinks = false;
  showOptions = true;
  dontToggle = false;
  words: string[] = [];
  wordCount = 0;

  audioSources = [];

  sentences: string[];
  htmlDataIsReady = false;

  quillToolbar = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote'/*, 'code-block'*/],
      // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ list: 'ordered'}, { list: 'bullet' }],
      // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      // [{ 'direction': 'rtl' }],                         // text direction
      // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],                                         // remove formatting button
      // ['link', 'image', 'video']                        // link and image, video
    ]
  };

  dialects = [
    {
      code : 'connemara',
      name : this.ts.l.connacht
    },
    {
      code : 'kerry',
      name : this.ts.l.munster
    },
    {
      code : 'donegal',
      name : this.ts.l.ulster
    }
  ];

  @ViewChild('myQuillEditor') quillEditor: any;
  divQuill: any;

  constructor(private storyService: StoryService,
              private synth: SynthesisService,
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
              private textProcessor: TextProcessingService,
             ) {}

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    console.dir(this.quillEditor);
    console.log(Object.getOwnPropertyNames(this.quillEditor).filter(item => typeof this.quillEditor[item] === 'function'));
    console.dir(this.quillEditor.textChangeHandler);

    this.divQuill = new Quill('#myDivQuill', { theme: 'snow'});
  }

  printLines(){
    for (const obj of this.divQuill.getLines()) {
      console.dir(obj.children.head.text);
    }
  }

  async synthesiseQuillTextSentenceBySentence() {
    const sentences =
      // Split the html into an array of sentences (based on English). Won't work perfectly
      this.textProcessor.sentences(
        // Convert the html to plain text
        this.textProcessor.convertHtmlToPlainText(
          // Reference the ngModel'd quill editor input text
          this.story.htmlText));
    console.log('dashboard sentences', sentences);


    const newSynthesis: SynthesisSentenceBySentence = {
      date: new Date(),
      sentences: [],
    }

    for (let i = 0; i < sentences.length; i++) {
      const thisSentence: SynthesisedSentence = {
        url: 'waiting',
        sentence: sentences[i],
      };
      newSynthesis.sentences.push(thisSentence);
      this.synth.synthesiseText(sentences[i], this.story.dialect as Dialect)
          .then(url => {
            thisSentence.url  = url;
          });
    }

    this.audioSources.unshift(newSynthesis as SynthesisSentenceBySentence);
  }

  stringifySynth(i: number) {
    if (this.audioSources[i]) {
      return JSON.stringify(this.audioSources[i]);
    }
    return 'not defined';
  }

  /*
  * set the stories array of all the student's stories
  * and the current story being edited given its id from url
  */
  ngOnInit() {
    this.storySaved = true;
    // Get the stories from the storyService and run
    // the following function once that data has been retrieved
    this.getStories().then(stories => {
      this.stories = stories;
      // Get the story id from the URL in the same way
      this.getStoryId().then(params => {
        this.id = params.id;
        // loop through the array of stories and check
        // if the id in the url matches one of them
        // if no html version exists yet, create one from the plain text
        // TODO Woah that's gotta be slow (Neimhin 15 July 2021)
        for (const story of this.stories) {
          if (story._id === this.id) {
            this.story = story;
            this.getWordCount(this.story.text);
            if (!this.story.htmlText) {
              this.story.htmlText = this.story.text;
            }
            this.sentences =
              this.textProcessor
                  .convertHtmlTextToArrayOfSentences(
                      this.story.htmlText);
            this.htmlDataIsReady = true;
            break;
          }
        }
      });
    });

    const userDetails = this.auth.getUserDetails();
    if (!userDetails) {
      return;
    }
    this.classroomService
      .getClassroomOfStudent(
        userDetails._id)
        .subscribe( (res) => {
        if (res && res._id) {
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
        },
        (err) => {
          reject(err);
        }
      );
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
        },
        (err) => {
          reject(err);
        });
    });
  }

  /*
  * Update story data (text and date) using story service
  * Add logged event for saved story  using engagement service
  */
  saveStory() {
    console.dir(this.audioSources);
    this.synthesiseQuillTextSentenceBySentence();
    this.route.params.subscribe(
      params => {
        const updateData = {
          text : this.story.text,
          htmlText: this.story.htmlText,
          lastUpdated : new Date(),
        };
        this.storyService.updateStory(updateData, params.id).subscribe();
        this.engagement.addEventForLoggedInUser(EventType['SAVE-STORY'], this.story);
        this.storySaved = true;
      }
    );
  }

  showDictionary() {
    this.dictionaryVisible = true;
    this.engagement.addEventForLoggedInUser(EventType['USE-DICTIONARY']);
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
    if (this.story.feedback.text !== '') {
      this.story.feedback.seenByStudent = true;
    }
    this.notifications.removeStory(this.story);
    this.storyService.viewFeedback(this.story._id).subscribe(() => {
      this.engagement.addEventForLoggedInUser(EventType['VIEW-FEEDBACK'], this.story);
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

// Set story saved to false and call word count function
  storyEdited(text) {
    this.story.text = text;
    this.storySaved = false;
    
  }
  
// Get word count of story text
  getWordCount(text) {
    let str = text.replace(/[\t\n\r\.\?\!]/gm, " ").split(" ");
    this.words = [];
    str.map((s) => {
      const trimStr = s.trim();
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
      console.log(res);
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
