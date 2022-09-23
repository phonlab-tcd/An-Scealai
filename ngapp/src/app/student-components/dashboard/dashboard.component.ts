import { Component                } from '@angular/core';
import { OnInit                   } from '@angular/core';
import { ViewEncapsulation        } from '@angular/core';
import { ViewChild                } from '@angular/core';
import { ActivatedRoute           } from '@angular/router';
import { Router                   } from '@angular/router';
import { SafeUrl                  } from '@angular/platform-browser';
import { DomSanitizer             } from '@angular/platform-browser';
import { HttpClient               } from '@angular/common/http';
import { Subject                  } from 'rxjs';
import { distinctUntilChanged     } from 'rxjs/operators';
import { HighlightTag             } from 'angular-text-input-highlight';
import   Quill                      from 'quill';

import { EventType                } from 'app/event';
import { Story                    } from 'app/story';

import { StoryService             } from 'app/story.service';
import { EngagementService        } from 'app/engagement.service';
import { AuthenticationService    } from 'app/authentication.service';
import { NotificationService      } from 'app/notification-service.service';
import { GramadoirRuleId          } from 'app/grammar.service';
import { GrammarService           } from 'app/grammar.service';
import { ReadableGramadoirRuleIds } from 'app/grammar.service';


import { TranslationService       } from 'app/translation.service';
import { MessageKey               } from 'app/translation.service';
import { StatsService             } from 'app/stats.service';
import { ClassroomService         } from 'app/classroom.service';
import { SynthesisPlayerComponent } from 'app/student-components/synthesis-player/synthesis-player.component';
import { QuillHighlightService    } from 'app/services/quill-highlight.service';
import   clone                      from 'lodash/clone';
import   config                     from 'abairconfig';

const Parchment = Quill.import('parchment');
const gramadoirTag =
  new Parchment.Attributor.Attribute(
    'gramadoir-tag',
    'data-gramadoir-tag', {
      scope: Parchment.Scope.INLINE
    });

Quill.register(gramadoirTag);

const Tooltip = Quill.import('ui/tooltip');

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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.scss',
    './../../gramadoir-tags.scss',
    './../../../quill.fonts.scss',
  ],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit{
  constructor(
    private http: HttpClient,
    protected sanitizer: DomSanitizer,
    private storyService: StoryService,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private notifications: NotificationService,
    private router: Router,
    private engagement: EngagementService,
    private grammar: GrammarService,
    public ts: TranslationService,
    public statsService: StatsService,
    public classroomService: ClassroomService,
    public quillHighlightService: QuillHighlightService,
  ) {
    this.textUpdated.pipe(
      distinctUntilChanged(),
    ).subscribe(async () => {
      const textToCheck = this.story.text.replace(/\n/g, ' ');
      if(!textToCheck) return;
      const grammarCheckerTime = new Date();
      this.mostRecentGramadoirRequestTime = grammarCheckerTime;
      this.grammarLoading = true;
      try {
        await this.quillHighlightService
          .updateGrammarErrors(this.quillEditor, textToCheck, this.story._id)
          .then((errTypes: object) => {
            console.dir(errTypes);
            this.currentGrammarErrorTypes = errTypes;
            Object.keys(errTypes).forEach((k) => {
              this.grammarTagFilter[k] !== undefined ?
              this.grammarTagFilter[k] = this.grammarTagFilter[k] :
              this.grammarTagFilter[k] = true;
            });
            this.quillHighlightService
                .filterGramadoirTags(this.grammarTagFilter);
            this.grammarTagsHidden ?
            this.quillHighlightService
                .clearAllGramadoirTags(this.quillEditor) :
            this.quillHighlightService
                .applyGramadoirTagFormatting(this.quillEditor);
          });
      } catch (updateGrammarErrorsError) {
        if ( !this.grammarTagsHidden) {
          window.alert(
            'There was an error while trying to fetch grammar ' +
            'suggestions from the Gramadóir server:\n' +
            updateGrammarErrorsError.message + '\n' +
            'See the browser console for more information');
        }
        console.dir(updateGrammarErrorsError);
      }
      if (grammarCheckerTime === this.mostRecentGramadoirRequestTime) {
        this.grammarLoading = false;
      }
    });
  }


  downloadMimeType() {
    return 'application/' + this.downloadStoryFormat.split('.')[1];
  }

  downloadStory() {
    this.http.get(this.downloadStoryUrl(), {responseType: 'blob'})
      .subscribe(data=>{
        console.log(data);
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(data);
        elem.download = this.story.title;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      });
  }

  @ViewChild('mySynthesisPlayer')
  synthesisPlayer: SynthesisPlayerComponent;

  ReadableGramadoirRuleIds = ReadableGramadoirRuleIds;

  titleStyle() {
    return {
      'font-style': this.storySaved ? 'normal' : 'italic'
    };
  }

  story: Story = new Story();
  mostRecentAttemptToSaveStory = new Date();
  stories: Story[];
  saveStoryDebounceId = 0;
  id: string;
  storyFound: boolean;
  storySaved = true;
  feedbackVisible: boolean;
  dictionaryVisible: boolean;
  audioSource: SafeUrl;
  filteredTags: Map<string, HighlightTag[]> = new Map();
  checkBox: Map<string, boolean> = new Map();
  mostRecentGramadoirRequestTime = null;
  grammarLoading = true;
  grammarSelected = true;
  grammarTagsHidden = true;
  grammarSettingsHidden = false;
  mostRecentGramadoirInput: string = null;
  currentGramadoirHighlightTags: QuillHighlightTag[] = null;
  grammarTagFilter: object = {};
  currentGrammarErrorTypes = {};
  modalClass = 'hidden';
  modalChoice: Subject<boolean> = new Subject<boolean>();
  teacherSelectedErrors: string[] = [];
  classroomId: string;
  selectTeanglann = true;

  downloadStoryFormat = '.pdf';

  gramadoirResponse: string;

  // OPTIONS (to show or not to show)
  showOptions = true;
  dontToggle = false;

  // WORD COUNT
  words: string[] = [];
  wordCount = 0;

  audioSources = [];

  htmlDataIsReady = false;
  quillEditor: Quill;
  private textUpdated= new Subject<void | string>();

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

  quillToolbar = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote'/*, 'code-block'*/],
      //  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ list: 'ordered'}, { list: 'bullet' }],
      //  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      //  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      //  [{ 'direction': 'rtl' }],                         // text direction
      //  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
      [{ font: ['sans-serif', 'serif', 'monospace', 'arial', 'times-new-roman'] }],
      [{ align: [] }],
      ['clean'],                                         // remove formatting button
      //  ['link', 'image', 'video']                        // link and image, video
    ],
    // scrollingContainer: false,
  };

  stringifySynth(i: number) {
    if (this.audioSources[i]) {
      return JSON.stringify(this.audioSources[i]);
    }
    return 'not defined';
  }

  onEditorCreated(q: Quill) {
    this.quillEditor = q;
  }

  getSelectedMessage() {
    return this.quillHighlightService.getMostRecentMessage();
  }

  grammarCheckBoxEvent(key: string, event: boolean) {
    this.grammarTagFilter[key] = event;
    this.quillHighlightService
        .filterGramadoirTags(this.grammarTagFilter);
    this.quillHighlightService
        .clearAllGramadoirTags(this.quillEditor);
    if (!this.grammarTagsHidden) {
      this.quillHighlightService
          .applyGramadoirTagFormatting(this.quillEditor);
    }
  }

  leathanCaolCheckBox(event: boolean) {
    this.quillHighlightService.showLeathanCaol = event;
    console.log(this.quillHighlightService.showLeathanCaol, event);
    this.quillHighlightService
        .clearAllGramadoirTags(this.quillEditor);
    if (!this.grammarTagsHidden) {
      this.quillHighlightService
          .applyGramadoirTagFormatting(this.quillEditor);
    }
  }

  genitiveCheckBox(event: boolean) {
    this.quillHighlightService.showGenitive = event;
    this.quillHighlightService
        .clearAllGramadoirTags(this.quillEditor);
    if (!this.grammarTagsHidden) {
      this.quillHighlightService
          .applyGramadoirTagFormatting(this.quillEditor);
    }
  }

  setAllCheckBoxes(value: boolean) {
    this.quillHighlightService
        .showLeathanCaol = value;
    this.quillHighlightService
        .showGenitive = value;
    Object.keys(this.grammarTagFilter)
        .forEach((k) => {
          this.grammarTagFilter[k] = value;
        });
    this.quillHighlightService
        .filterGramadoirTags(this.grammarTagFilter);
    this.quillHighlightService
        .clearAllGramadoirTags(this.quillEditor);
    if (!this.grammarTagsHidden) {
      this.quillHighlightService
          .applyGramadoirTagFormatting(this.quillEditor);
    }
  }

  // set the stories array of all the student's stories
  // set the stories array of all the student's stories w
  // and the current story being edited given its id from url
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
            this.textUpdated.next();
            this.getWordCount(this.story.text);
            if (this.story.htmlText == null) {
              this.story.htmlText = this.story.text;
            }
            this.htmlDataIsReady = true;
            break;
          }
        }
        }).catch(error => {
          this.story.text = JSON.stringify(error);
          throw error;
      }).catch(error => {
        this.story.text = JSON.stringify(error);
      });
    });


    // GET CLASSROOM ID
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) {
      return;
    }
    this.classroomService
        .getClassroomOfStudent(
          userDetails._id)
        .subscribe(
          (res) => {
            if (res) {
              this.classroomId = res._id;
            }
          });
  }

  // return the student's set of
  // stories using the story service
  getStories(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storyService
          .getStoriesForLoggedInUser()
          .subscribe({
            next: (stories: Story[]) => {
              resolve(stories);
            },
            error: (error: Error) => {
              reject(error);
            },
          });
    });
  }

  // return the url params (which contains the id,
  // presuming dashboard component is only
  // used on a url with a story id) using
  // the routing parameters
  getStoryId(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => resolve(params),
        error => reject(error)
      );
    });
  }

  instructionMessage() {
    const key: MessageKey = 'hover_over_a_highlighted_word_for_a_grammar_suggestion';
    return this.ts.message(key);
  }

  selectedGrammarSuggestion() {
    return this.quillHighlightService.mostRecentHoveredMessage() ??
            this.instructionMessage();
  }

  toggleGrammarButton() {
    const key: MessageKey = this.grammarTagsHidden ?
      'show_grammar_suggestions' :
      'hide_grammar_suggestions' ;
    return this.ts.message(key);
  }

  toggleGrammarTags() {
    this.grammarTagsHidden ? this.showGrammarTags() : this.hideGrammarTags();
  }

  hideGrammarTags() {
    this.grammarTagsHidden = true;
    this.quillHighlightService
        .clearAllGramadoirTags(this.quillEditor);
  }

  showGrammarTags(){
    this.grammarTagsHidden = false;
    this.quillHighlightService
        .applyGramadoirTagFormatting(this.quillEditor);
  }

  // Update story data (text and date) using story service
  // Add logged event for saved story  using engagement service
  async saveStory(debounceId: number | 'modal', finishedWritingTime: Date) {
    const saveAttempt = new Date();
    this.mostRecentAttemptToSaveStory = saveAttempt;

    if (! this.story._id) {
      return window.alert('Cannot save story. The id is not known');
    }

    const unhighlightedHtmlText =
      this.stripGramadoirAttributesFromHtml(
        clone(this.story.htmlText));

    const updateData = {
      title: this.story.title,
      dialect: this.story.dialect,
      text : this.story.text,
      htmlText: unhighlightedHtmlText,
      lastUpdated : finishedWritingTime,
    };

    this.engagement
        .addEventForLoggedInUser(
          EventType['SAVE-STORY'],
          this.story);

    const saveStoryPromise = this
        .storyService
        .updateStory(updateData, this.story._id)
        .toPromise();

    try {
      await saveStoryPromise;
      if (debounceId === this.saveStoryDebounceId) {
        this.storySaved = true;
        console.count('STORY SAVED');
        console.log(debounceId);
      } else if (debounceId === 'modal') {
        this.storySaved = true;
      }
    }
    catch (error) {
      window.alert('Error while trying to save story: ' + error.message);
      throw error;
    }

    try {
      if (saveAttempt === this.mostRecentAttemptToSaveStory) {
        this.storySaved = true;
      }
    } catch (error) {
      window.alert('Error setting storySaved to true: ' + error.message);
      throw error;
    }
    return;
  }

  stripGramadoirAttributesFromHtml(text: string){
    return text
        .replace(
            /\s*data-gramadoir-tag(-style-type)?="([^"])+"/g,
            '')
        .replace(
            /\s*data-vowel-agreement-tag="([^"])+"/g,
            '')
        .replace(
          /\s*data-genitive-tag="([^"])+"/g,
          '');
  }

  debounceSaveStory() {
    this.saveStoryDebounceId++;
    const myId = this.saveStoryDebounceId;
    const finishedWritingTime = new Date();
    setTimeout(() => {
      this.saveStoryDebounceCallback(myId, finishedWritingTime);
    }, 1000);
  }

  saveStoryDebounceCallback(myId: number, finishedWritingTime: Date) {
    if (myId === this.saveStoryDebounceId) {
      this.saveStory(myId, finishedWritingTime);
    }
  }

  showDictionary() {
    if (!!this.dictionaryVisible === false) {
      this.engagement.addEventForLoggedInUser(EventType['USE-DICTIONARY']);
    }
    this.dictionaryVisible = !this.dictionaryVisible;
  }

  // Get audio feedback with function call
  // Set feedback status to seen by student
  // and remove story from not yet seen array
  // Add logged event for viewed feedback
  getFeedback() {
    this.feedbackVisible = !this.feedbackVisible;
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

  // Set story.text to most recent version of
  // editor text and then switch to storyEditedAlt
  onContentChanged(q: {
    editor: Quill;
    html: string;
    text: string;
    content: any;
    delta: any; // TODO actual type is Quill Delta
    oldDelta: any; // TODO actual type is Quill Delta
    source: 'user'|'api'|'silent'|undefined
  }) {
    this.story.text = q.text;
    this.getWordCount(q.text);
    switch(q.source) {
      case 'user':
        this.storySaved = false;
        this.textUpdated.next(q.text);
        this.debounceSaveStory();
    }
  }


  downloadStoryUrl() {
    return config.baseurl +
      'story/downloadStory/' +
      this.story._id + '/' +
      this.downloadStoryFormat;
  }

  // Get word count of story text
  getWordCount(text: string) {
    if (!text) { return 0; }
    const str = text.replace(/[\t\n\r\.\?\!]/gm, ' ').split(' ');
    this.words = [];
    str.map((s: string) => {
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
    this.dictionaryVisible = false;
  }

// return whether or not the student has viewed the feedback
  hasNewFeedback(): boolean {
    if (
      this.story &&
      this.story.feedback &&
      this.story.feedback.seenByStudent === false) {
      return true;
    }
    return false;
  }

  // route to synthesis
  goToSynthesis() {
    this.synthesisPlayer.toggleHidden();
    // this.router.navigateByUrl('/synthesis/' + this.story._id);
  }

  // route to synthesis
  goToRecording() {
    this.router.navigateByUrl('/record-story/' + this.story._id);
  }

  // set modalClass to visible fade
  showModal() {
    this.modalClass = 'visibleFade';
  }

  // set modalClass to hidden fade and next choice to false
  hideModal() {
    this.modalClass = 'hiddenFade';
    this.modalChoice.next(false);
  }

  // set next modal choice to true
  setModalChoice() {
    this.modalChoice.next(true);
  }

  // save story and set next modal choice to true
  async saveModal() {
    try {
      await this.saveStory('modal', new Date());
      this.modalChoice.next(true);
    } catch (error) {
      window.alert('Your story was not saved. You should copy your story to another program to save it. Otherwise it may be lost.');
      this.hideModal();
    }
  }

  toggleOptions() {
    if  (!this.dontToggle){
      this.showOptions = !this.showOptions;
    }
    this.dontToggle = false;
  }

  // handleGrammarCheckerOptionClick() {
  //   this.dontToggle = true;
  //   this.defaultMode();
  //   this.grammarChecker.hideEntireGrammarChecker =
  //     !this.grammarChecker.hideEntireGrammarChecker;
  // }

  storySavedByGrammarChecker(story: Story) {
    if (this.story.htmlText === story.htmlText) {
      this.storySaved = true;
    }
  }
}
