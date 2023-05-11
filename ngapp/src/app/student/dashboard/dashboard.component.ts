import { Component                } from '@angular/core';
import { OnInit                   } from '@angular/core';
import { ViewEncapsulation        } from '@angular/core';
import { ViewChild                } from '@angular/core';
import { ActivatedRoute           } from '@angular/router';
import { Router                   } from '@angular/router';
import { SafeUrl                  } from '@angular/platform-browser';
import { DomSanitizer             } from '@angular/platform-browser';
import { HttpClient               } from '@angular/common/http';
import { firstValueFrom, Subject  } from 'rxjs';
import { distinctUntilChanged     } from 'rxjs/operators';
import   Quill                      from 'quill';
import { MessageKey               } from 'app/core/services/translation.service';

import { EventType                } from 'app/core/models/event';
import { Story                    } from 'app/core/models/story';

import { StoryService             } from 'app/core/services/story.service';
import { ClassroomService         } from 'app/core/services/classroom.service';
import { EngagementService        } from 'app/core/services/engagement.service';
import { AuthenticationService    } from 'app/core/services/authentication.service';
import { NotificationService      } from 'app/core/services/notification-service.service';
import { TranslationService       } from 'app/core/services/translation.service';
import { SynthesisPlayerComponent } from 'app/student/synthesis-player/synthesis-player.component';
import   clone                      from 'lodash/clone';
import   config                     from 'abairconfig';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasicDialogComponent } from '../../dialogs/basic-dialog/basic-dialog.component';
import { RecordAudioService     } from 'app/core/services/record-audio.service'

import { GrammarEngine } from '../../lib/grammar-engine/grammar-engine';
import { QuillHighlighter } from '../../lib/quill-highlight/quill-highlight';
import { HighlightTag } from '../../lib/quill-highlight/quill-highlight';
import { leathanCaolChecker } from '../../lib/grammar-engine/checkers/leathan-caol-checker';
import { anGramadoir } from '../../lib/grammar-engine/checkers/an-gramadoir';
import { genitiveChecker } from '../../lib/grammar-engine/checkers/genitive-checker';
import { relativeClauseChecker } from '../../lib/grammar-engine/checkers/relative-clause-checker';
import { ErrorTag } from '../../lib/grammar-engine/types';
import ImageCompress from 'quill-image-compress';

Quill.register('modules/imageCompress', ImageCompress);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.scss',
    './../../lib/quill-highlight/gramadoir-tags.scss',
    './../../../quill.fonts.scss',
  ],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {

  // STORY VARIABLES
  story: Story = new Story();
  mostRecentAttemptToSaveStory = new Date();
  saveStoryDebounceId = 0;
  storySaved = true;
  audioSource: SafeUrl;
  downloadStoryFormat = '.pdf';
  dialogRef: MatDialogRef<unknown>;
  
  // GRAMMAR VARIABLES
  grammarEngine: GrammarEngine;
  grammarLoaded: boolean = false;
  grammarErrors: ErrorTag[] = [];
  grammarErrorsTypeDict: Object = {};
  showErrorTags: boolean = false;
  checkBoxes: Object = {'showAll': true};
  grammarCheckerOptions: Object = {
    'anGramadoir': anGramadoir,
    'relativeClause': relativeClauseChecker,
    //'genitive': genitiveChecker,
    'broadSlender': leathanCaolChecker,
  }
  
  // OPTIONS (to show or not to show dash menu bar)
  showOptions = true;
  dontToggle = false;
  selectTeanglann = true;
  feedbackVisible: boolean;
  dictionaryVisible: boolean;
  modalClass = 'hidden';
  modalChoice: Subject<boolean> = new Subject<boolean>();

  // WORD COUNT
  words: string[] = [];
  wordCount = 0;

  quillEditor: Quill;
  quillHighlighter: QuillHighlighter;
  private textUpdated= new Subject<void | string>();
  quillToolbar = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ list: 'ordered'}, { list: 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      //[{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean'],
      ['image']
    ],
    imageCompress: { // used to compress any images added to the story
      quality: 0.7,
      maxWidth: 500,
      maxHeight: 500,
      imageType: 'image/png',
      debug: false, // console logs
      suppressErrorLogging: false,
      insertIntoEditor: undefined,
    }
  };
  
  // DICTIONARY LOOKUPS
  wordLookedUp:string = '';
  defaultDictIframeText = this.sanitizer.bypassSecurityTrustResourceUrl(
    `data:text/html;charset=utf-8,` +
    this.ts.l.search_for_words_in_dictionary
  );
  
  @ViewChild('mySynthesisPlayer')
  synthesisPlayer: SynthesisPlayerComponent;
  
  // SPEECH TO TEXT
  audioSourceASR : SafeUrl;
  isRecording: boolean = false;
  isTranscribing: boolean = false;
  
  constructor(
    private http: HttpClient,
    protected sanitizer: DomSanitizer,
    private storyService: StoryService,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private notificationService: NotificationService,
    private router: Router,
    private engagement: EngagementService,
    public ts: TranslationService,
    private dialog: MatDialog,
    private recordAudioService: RecordAudioService,
    private classroomService: ClassroomService,
  ) {
    this.setUpGrammarChecking();
  }
  
  /* Get story from params id and initialise variables */
  async ngOnInit() {
    this.storySaved = true;
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;
    
    this.story = await firstValueFrom(this.storyService.getStory(this.route.snapshot.params['id']));
    if(!this.story) return;
    console.log(this.story)
    this.textUpdated.next();
    this.getWordCount(this.story.text);
    if (this.story.htmlText == null) {
      this.story.htmlText = this.story.text;
    }
  }

  /**
   * Initialise the Grammar Engine and Highlighting services
   * Update any error tags/highlighting when the user makes changes to their story
   */
  async setUpGrammarChecking() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    // get student classroom to see if any grammar checkers were specified in classroom settings
    let classroom = (await firstValueFrom(this.classroomService.getClassroomOfStudent(userDetails._id)));

    // populate an array of checkers from classroom settings to pass into the grammar engine
    let checkers = [];
    if (classroom && classroom.grammarCheckers && classroom.grammarCheckers.length > 0) {
      classroom.grammarCheckers.forEach( checker => {
        if (this.grammarCheckerOptions[checker])
          checkers.push(this.grammarCheckerOptions[checker]);
      })
    }
    // pass all checkers to the grammar engine if no classroom specifications (or do we want to leave it empty?)
    else {
      checkers = Object.values(this.grammarCheckerOptions);
    }
  
    this.grammarEngine = new GrammarEngine(checkers, this.http, this.auth);
    
    // subscribe to any changes made to the story text and check for grammar errors
    this.textUpdated.pipe(distinctUntilChanged()).subscribe(async () => {
      this.grammarLoaded = false;

      const textToCheck = this.story.text.replace(/\n/g, ' ');
      if(!textToCheck) return;
      
      try {
        // check text for grammar errors
        this.grammarErrors = [];
        this.grammarEngine.check$(this.story.text).subscribe({
          next: (tag: ErrorTag) => {
            this.grammarErrors.push(tag);
            
            // show error highlighting if button on
            if(this.showErrorTags) {
              this.quillHighlighter.show([tag as HighlightTag]);
            }
          },
          error: function () {},
          complete: () => {
            if (!this.quillHighlighter) return;
            // We need to hide all tags to get rid of any old errors that were fixed by the changes
            this.quillHighlighter.hideAll();
            // and then re-show all the latest error tags if button on
            if(this.showErrorTags) {
              this.quillHighlighter.show(this.grammarErrors.filter(tag => this.checkBoxes[tag.type] || this.checkBoxes['showAll']));
            }
            
            //save any grammar errors with associated sentences to DB
            if(this.grammarErrors) {
              this.grammarEngine.saveErrorsWithSentences(this.story._id).then(console.log, console.error);
            }
          
            // create a dictionary of error type and tags for checkbox filtering
            this.grammarErrorsTypeDict = this.grammarErrors.reduce(function(map:Object, tag:any) {
                if(!map[tag.type]) {
                  map[tag.type] = [];
                }
                map[tag.type].push(tag);
                return map;
            }, {});
            
            // initialise all error checkboxes to true
            for (const key of Object.keys(this.grammarErrorsTypeDict)) {
              this.checkBoxes[key] = true;
            }
            this.grammarLoaded = true;
          },
        });
        
      } catch (updateGrammarErrorsError) {
        if ( !this.grammarErrors) {
          window.alert(
            'There was an error while trying to fetch grammar ' +
            'suggestions from the Gramadóir server:\n' +
            updateGrammarErrorsError.message + '\n' +
            'See the browser console for more information');
        }
        console.dir(updateGrammarErrorsError);
      }
    });
  }
  
  /* 
   * Update story text with what the student has written with quill
   * Call functions to save story to DB
  */
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
  
  /* Call the saveStory function after increasing a debounce id counter */
  debounceSaveStory() {
    this.saveStoryDebounceId++;
    const myId = this.saveStoryDebounceId;
    const finishedWritingTime = new Date();
    setTimeout(() => {
      if (myId === this.saveStoryDebounceId) {
        this.saveStory(myId, finishedWritingTime);
      }
    }, 1000);
  }

  /* Update story data (text and date) using story service
   * Add logged event for saved story using engagement service 
  */
  async saveStory(debounceId: number | 'modal', finishedWritingTime: Date) {
    const saveAttempt = new Date();
    this.mostRecentAttemptToSaveStory = saveAttempt;

    if (! this.story._id) {
      return window.alert('Cannot save story. The id is not known');
    }
    
    // get story html text without highlighting markup
    const unhighlightedHtmlText = this.stripGramadoirAttributesFromHtml(clone(this.story.htmlText));

    const updateData = {
      title: this.story.title,
      dialect: this.story.dialect,
      text : this.story.text,
      htmlText: unhighlightedHtmlText,
      lastUpdated : finishedWritingTime,
    };

    this.engagement.addEventForLoggedInUser(EventType['SAVE-STORY'], this.story);

    // Save story to the DB
    try {
      await firstValueFrom(this.storyService.updateStory(updateData, this.story._id));
      if (debounceId === this.saveStoryDebounceId) {
        this.storySaved = true;
      } else if (debounceId === 'modal') {
        this.storySaved = true;
      }
    }
    catch (error) {
      window.alert('Error while trying to save story: ' + error.message);
      throw error;
    }
    // Set story status to saved if dates match 
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
  
  /**
   * Initialise quill editor and highlighter
   * @param q quill editor
   */
  onEditorCreated(q: Quill) {
    console.log(q)
    q['history'].options.userOnly = true; // prevent ctrl z from deleting text
    this.quillEditor = q;
    this.quillEditor.root.setAttribute("spellcheck", "false");
    this.quillHighlighter = new QuillHighlighter(this.quillEditor, this.ts, this.engagement);
  }
  
  /* If story not saved, make title italic */
  titleStyle() {
    return {'font-style': this.storySaved ? 'normal' : 'italic'};
  }
  
  /**
   * Apply error highlighting depending on which errors are checked to display
   * @param tags grammar errors
   * @param boxChecked true if box checked, false otherwise
   */
  setCheckBox(key, tags) {
    this.checkBoxes[key] = !this.checkBoxes[key];
    if (this.checkBoxes['showAll']) this.checkBoxes['showAll'] = false;
    
    if(this.checkBoxes[key]) {
      this.quillHighlighter.show(tags);
      document.getElementById(key).classList.remove("hideLegendItem");
    }
    else {
      this.quillHighlighter.hide(tags);
      document.getElementById(key).classList.add("hideLegendItem");
    }
  }
  
  /* Apply error highlighting to all or none of the errors */
  setAllCheckBoxes() {
    if(this.checkBoxes['showAll']) {
      this.quillHighlighter.show(this.grammarErrors);
    }
    else {
      this.quillHighlighter.hideAll();
    }
    Object.keys(this.checkBoxes).forEach(key => {
      this.checkBoxes[key] = this.checkBoxes['showAll']; // reset all error checkboxes
    });
  }

  /* Sets text for bottom blue bar of grammar checker */
  selectedGrammarSuggestion() {
    if (this.quillHighlighter)
      return this.quillHighlighter.getGrammarMessage(this.grammarLoaded)
    else
      return '';
  }

  /* Show/hide grammar checker button text on dashboard */
  toggleGrammarButton() {
    const key: MessageKey = this.showErrorTags ?
      'hide_grammar_suggestions': 
      'show_grammar_suggestions';
    return this.ts.message(key);
  }

  /* Show or hide error tags */
  async toggleGrammarTags() {
      this.showErrorTags ? 
        this.quillHighlighter.hideAll() :
        this.quillHighlighter.show(this.grammarErrors.filter(tag => this.checkBoxes[tag.type] || this.checkBoxes['showAll']));
      this.showErrorTags = !this.showErrorTags;
  }
  
  /**
   * Get rid of highlighting markup from html text
   * @param text story html text
   */
  stripGramadoirAttributesFromHtml(text: string){
    if (!text || !text.replace) {return '';}
    return text.replace(/\s*style="([^"])+"/g,'')
                .replace(/\s*highlight-tag-type="([^"])+"/g,'')
                .replace(/\s*highlight-tag="([^"])+"/g,'')
  }

  /* Set html for dictionary iframe and log looked-up word to DB */
  async lookupWord() {
    if(this.wordLookedUp) {
      const teanglannRequest = this.http.post(config.baseurl + 'proxy/', {url: `https://www.teanglann.ie/en/fgb/${this.wordLookedUp}`});
      const teanglannHtml = await firstValueFrom(teanglannRequest) as string;
      const teanglannDoc = new DOMParser().parseFromString(teanglannHtml, 'text/html');
      
      // The links by default will point to localhost/en/fgb/<...> instead of teanglann/en/fgb/<...>
      const exampleLinks = teanglannDoc.querySelectorAll('.ex > .head > a');
      exampleLinks.forEach((link: HTMLAnchorElement) => link.href =
      `https://www.teanglann.ie${link.href.slice(link.href.lastIndexOf('/en/'))}`);

      const moreExamplesLink = teanglannDoc.querySelector('.moar');
      moreExamplesLink?.remove(); // this requires teanglann javascript to work, so can just remove.
      
      const resultsContainer = teanglannDoc.querySelector('.listings') as HTMLDivElement;
      resultsContainer.style.cssText += 'margin-right: 0px; padding: 10px;';

      const frameObj = document.getElementById('dictiframe') as HTMLIFrameElement;
      frameObj.src = 
        "data:text/html;charset=utf-8," +
        `<link type="text/css" rel="stylesheet" href="https://www.teanglann.ie/furniture/template.css">` +
        `<link type="text/css" rel="stylesheet" href="https://www.teanglann.ie/furniture/fgb.css">` +
        resultsContainer.outerHTML;

      this.engagement.addEventForLoggedInUser(EventType['USE-DICTIONARY'], null, this.wordLookedUp);
    }
    else {
      alert(this.ts.l.enter_a_word_to_lookup);
    }
  }
  
  /* Clear the dictionary input box */
  clearDictInput() {
    if(this.wordLookedUp) {
      this.wordLookedUp = "";
    }
  }

  /* Get audio feedback with function call
   * Set feedback status to seen by student
   * Update feedback notifications
   * Add logged event for viewed feedback
  */
  getFeedback() {
    this.feedbackVisible = !this.feedbackVisible;
    this.getFeedbackAudio();
    // set feedback status to seen by student
    if (this.story.feedback.text !== '') {
      this.story.feedback.seenByStudent = true;
    }
    // add event log to DB and update notifications
    this.storyService.viewFeedback(this.story._id).subscribe(() => {
      this.engagement.addEventForLoggedInUser(EventType['VIEW-FEEDBACK'], this.story);
      this.notificationService.getStudentNotifications();
    });
  }

  /* Set the url for the audio source feedback */
  getFeedbackAudio() {
    this.storyService.getFeedbackAudio(this.story._id).subscribe((res) => {
      this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
    });
  }

  /* Download story in selected format */
  downloadStory() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.download,
        type: 'select',
        data: [this.story.title, ['.pdf', '.docx', '.txt', '.odt']],
        confirmText: this.ts.l.download,
        cancelText: this.ts.l.cancel
      },
      width: '50vh',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        // res[0] is download title, res[1] is download format
        if(res) {
          res[1] ? this.downloadStoryFormat = res[1] : this.downloadStoryFormat = '.pdf'
          this.http.get(this.downloadStoryUrl(), {responseType: 'blob'})
              .subscribe(data=>{
                const elem = window.document.createElement('a');
                elem.href = window.URL.createObjectURL(data);
                res[0] ? elem.download = res[0] : elem.download = this.story.title;
                document.body.appendChild(elem);
                elem.click();
                document.body.removeChild(elem);
              });
        }
    });
  }
  
  /* Create story download url with chosen format */
  downloadStoryUrl() {
    return config.baseurl + 'story/downloadStory/' + this.story._id + '/' + this.downloadStoryFormat;
  }

  /**
   * Get word count of story text
   * @param text story text
   */
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

  /* Set feedback window to false */
  closeFeedback() {
    this.feedbackVisible = false;
  }

  /**
   * Return whether or not the student has viewed the feedback
   * @returns true if student has viewed feedback
   */
  hasNewFeedback(): boolean {
    if (
      this.story &&
      this.story.feedback &&
      this.story.feedback.seenByStudent === false) {
      return true;
    }
    return false;
  }

  /* Toggle synthesis */
  goToSynthesis() {
    this.synthesisPlayer.toggleHidden();
  }

  /* Route to record story component */
  goToRecording() {
    this.router.navigateByUrl('/record-story/' + this.story._id);
  }

  /* Set modalClass to visible fade */
  showModal() {
    this.modalClass = 'visibleFade';
  }

  /* Set modalClass to hidden fade and next choice to false */
  hideModal() {
    this.modalClass = 'hiddenFade';
    this.modalChoice.next(false);
  }

  /* Save story and set next modal choice to true */
  async saveModal() {
    try {
      await this.saveStory('modal', new Date());
      this.modalChoice.next(true);
    } catch (error) {
      window.alert('Your story was not saved. You should copy your story to another program to save it. Otherwise it may be lost.');
      this.hideModal();
    }
  }

  /* Toggle upper menu buttons */
  toggleOptions() {
    if (!this.dontToggle){
      this.showOptions = !this.showOptions;
    }
    this.dontToggle = false;
  }
  
  /* Open dialog for editing story title/dialect */
  editStoryTitle() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.story_details,
        type: 'select',
        data: [this.story.title, [this.ts.l.connacht, this.ts.l.munster, this.ts.l.ulster]],
        confirmText: this.ts.l.save_details,
        cancelText: this.ts.l.cancel
      },
      width: '50vh',
    });
    
    this.dialogRef.afterClosed().subscribe( async (res) => {
        this.dialogRef = undefined;
        if(res) {
          this.storyService.updateStoryTitleAndDialect(this.story, res[0], res[1]).subscribe({
                complete: () => {
                  this.ngOnInit();
                },
              });
        }
    });
  }

  /* Stop recording if already recording, otherwise start recording; get transcription */
  async speakStory() {
    if (this.isRecording) {
      this.isTranscribing = true;
      this.recordAudioService.stopRecording();
      let transcription = await this.recordAudioService.getAudioTranscription();
      this.isTranscribing = false;
      if(transcription) {
        // get cursor position for inserting the transcription
        let selection = this.quillEditor.getSelection(true);
        this.quillEditor.insertText(selection.index, transcription + ".");

        // update the text and html text with inserted transcription
        this.story.text = this.quillEditor.getText();
        this.story.htmlText = this.quillEditor.root.innerHTML;
        
        // save story
        this.getWordCount(transcription);
        this.storySaved = false; 
        this.textUpdated.next();
        this.debounceSaveStory();
      }
    }
    else {
      this.recordAudioService.recordAudio();
    }
    this.isRecording = !this.isRecording;
  }
}
