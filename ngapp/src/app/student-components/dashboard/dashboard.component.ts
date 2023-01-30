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
import { MessageKey               } from 'app/translation.service';

import { EventType                } from 'app/event';
import { Story                    } from 'app/story';

import { StoryService             } from 'app/story.service';
import { EngagementService        } from 'app/engagement.service';
import { AuthenticationService    } from 'app/authentication.service';
import { NotificationService      } from 'app/notification-service.service';

import { TranslationService       } from 'app/translation.service';
import { StatsService             } from 'app/stats.service';
import { SynthesisPlayerComponent } from 'app/student-components/synthesis-player/synthesis-player.component';
import   clone                      from 'lodash/clone';
import   config                     from 'abairconfig';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasicDialogComponent } from '../../dialogs/basic-dialog/basic-dialog.component';

import { GrammarEngine } from '../../lib/grammar-engine/grammar-engine';
import { QuillHighlighter } from '../../lib/quill-highlight/quill-highlight';
import { HighlightTag } from '../../lib/quill-highlight/quill-highlight';
import { leathanCaolChecker } from '../../lib/grammar-engine/checkers/leathan-caol-checker';
import { anGramadoir } from '../../lib/grammar-engine/checkers/an-gramadoir';
import { genitiveChecker } from '../../lib/grammar-engine/checkers/genitive-checker';
import { relativeClauseChecker } from '../../lib/grammar-engine/checkers/relative-clause-checker';
import { gaelSpell } from '../../lib/grammar-engine/checkers/gaelspell-checker';


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
  previousTextToCheck: string;
  saveStoryDebounceId = 0;
  storySaved = true;
  audioSource: SafeUrl;
  downloadStoryFormat = '.pdf';
  dialogRef: MatDialogRef<unknown>;
  
  // GRAMMAR VARIABLES
  grammarEngine: GrammarEngine;
  mostRecentGramadoirRequestTime = null;
  mostRecentGramadoirInput: string = null;
  grammarLoaded: boolean = false;
  grammarErrors: any = [];
  grammarErrorsTypeDict: Object = {};
  showErrorTags: boolean = false;
  checkBoxes: Object = {'showAll': true};
  
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
  
  // DICTIONARY LOOKUPS
  wordLookedUp:string = '';
  defaultDictIframeText = this.sanitizer.bypassSecurityTrustResourceUrl(
    `data:text/html;charset=utf-8,` +
    this.ts.l.search_for_words_in_dictionary
  );
  
  @ViewChild('mySynthesisPlayer')
  synthesisPlayer: SynthesisPlayerComponent;
  
  // SPEECH TO TEXT
  url_ASR_API = "https://phoneticsrv3.lcs.tcd.ie/asr_api/recognise";
  recorder;
  stream;
  audioSourceASR : SafeUrl;
  chunks: any[] = [];
  isRecording: boolean = false;
  
  constructor(
    private http: HttpClient,
    protected sanitizer: DomSanitizer,
    private storyService: StoryService,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private notifications: NotificationService,
    private router: Router,
    private engagement: EngagementService,
    public ts: TranslationService,
    public statsService: StatsService,
    private dialog: MatDialog
  ) {
    this.grammarEngine = new GrammarEngine([ leathanCaolChecker, genitiveChecker, relativeClauseChecker], this.http, this.auth);
    
    // subscribe to any changes made to the story text and check for grammar errors
    this.textUpdated.pipe(distinctUntilChanged()).subscribe(async () => {
      this.grammarLoaded = false;

      const textToCheck = this.story.text.replace(/\n/g, ' ');
      if(!textToCheck) return;
      
      const grammarCheckerTime = new Date();
      this.mostRecentGramadoirRequestTime = grammarCheckerTime;
      
      try {
        // check text for grammar errors
        this.grammarErrors = [];
        this.grammarEngine.check$(this.story.text).subscribe({
          next: (tag) => {
            this.grammarErrors.push(tag);
            
            // show error highlighting if button on
            if(this.showErrorTags) {
              this.quillHighlighter.show([tag as HighlightTag]);
            }
          },
          error: function () {},
          complete: () => {
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
  
  /* Get story from params id and initialise variables */
  async ngOnInit() {
    this.storySaved = true;
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;
    
    this.story = await firstValueFrom(this.storyService.getStory(this.route.snapshot.params['id']));
    if(!this.story) return;
    
    this.previousTextToCheck = this.story.text;
    this.textUpdated.next();
    this.getWordCount(this.story.text);
    if (this.story.htmlText == null) {
      this.story.htmlText = this.story.text;
    }
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
      this.saveStoryDebounceCallback(myId, finishedWritingTime);
    }, 1000);
  }

  saveStoryDebounceCallback(myId: number, finishedWritingTime: Date) {
    if (myId === this.saveStoryDebounceId) {
      this.saveStory(myId, finishedWritingTime);
    }
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

    const saveStoryPromise = this.storyService.updateStory(updateData, this.story._id).toPromise();

    // Save story to the DB
    try {
      await saveStoryPromise;
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
  
  /* Initialise quill editor and highlighter */
  onEditorCreated(q: Quill) {
    this.quillEditor = q;
    this.quillEditor.root.setAttribute("spellcheck", "false");
    this.quillHighlighter = new QuillHighlighter(this.quillEditor, this.ts, this.engagement);
  }
  
  /* If story not saved, make title italic */
  titleStyle() {
    return {'font-style': this.storySaved ? 'normal' : 'italic'};
  }
  
  /* apply error highlighting depending on which errors are checked to display */
  setCheckBox(tags, boxChecked: boolean) {
    if(boxChecked) {
      this.quillHighlighter.show(tags);
    }
    else {
      this.quillHighlighter.hide(tags);
    }
  }
  
  /* apply error highlighting to all or none of the errors */
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
        this.quillHighlighter.hide(this.grammarErrors):
        this.quillHighlighter.show(this.grammarErrors);
      this.showErrorTags = !this.showErrorTags;
  }
  
  /* get rid of highlighting markup from html text */
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
  
  /* clear the dictionary input box */
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
    this.notifications.removeStory(this.story);
    this.storyService.viewFeedback(this.story._id).subscribe(() => {
      this.engagement.addEventForLoggedInUser(EventType['VIEW-FEEDBACK'], this.story);
    });
  }

  /* set the url for the audio source feedback */
  getFeedbackAudio() {
    this.storyService.getFeedbackAudio(this.story._id).subscribe((res) => {
      this.audioSource = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
    });
  }


  /* Download story */
  downloadStory() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.download,
        type: 'select',
        data: [this.story.title, ['.pdf', '.docx', '.txt', '.odt', '.pptx', '.html', '.md', '.latex', '.json']],
        confirmText: this.ts.l.download,
        cancelText: this.ts.l.cancel
      },
      width: '50vh',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        if(res) {
          console.log(res[0])
          res[1] ? this.downloadStoryFormat = res[1] : this.downloadStoryFormat = '.pdf'
          this.http.get(this.downloadStoryUrl(), {responseType: 'blob'})
              .subscribe(data=>{
                console.log(data);
                const elem = window.document.createElement('a');
                elem.href = window.URL.createObjectURL(data);
                res[0] ? elem.download = res[0] : elem.download = this.story.title;
                document.body.appendChild(elem);
                elem.click();
                document.body.removeChild(elem);
              });
          console.log(res);
        }
    });
  }
  
  /* Create story download url with chosen format */
  downloadStoryUrl() {
    return config.baseurl + 'story/downloadStory/' + this.story._id + '/' + this.downloadStoryFormat;
  }

  /* Get word count of story text */
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
    if (!this.dontToggle){
      this.showOptions = !this.showOptions;
    }
    this.dontToggle = false;
  }

  /* Stop recording if already recording, otherwise start recording */
  speakStory() {
    this.isRecording ? this.stopRecording() : this.recordAudio();
  }
  
  /* Record audio */
  recordAudio() {
    console.log('Record audio:');
    let media = {
      tag: 'audio',
      type: 'audio/mp3',
      ext: '.mp3',
      gUM: {audio: true}
    }
    this.isRecording = true;
    navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
      this.stream = _stream;
      this.recorder = new MediaRecorder(this.stream);
      this.chunks = [];
      this.recorder.start();
      this.recorder.ondataavailable = e => {
        this.chunks.push(e.data);
        if(this.recorder.state == 'inactive') {
        };
      };
    }).catch();
  }
  
  /* stop recording stream and convert audio to base64 to send to ASR */
  stopRecording() {
    this.recorder.stop();
    this.isRecording = false;
    this.stream.getTracks().forEach(track => track.stop());
    setTimeout(() => {
      const blob = new Blob(this.chunks, {type: 'audio/mp3'});
      this.audioSourceASR = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        let encodedAudio = (<string>reader.result).split(";base64,")[1];   // convert audio to base64
        this.getTranscription(encodedAudio);
      }.bind(this);
    }, 500);
  }
  
  /* send audio to the ASR system and get transcription */
  getTranscription(audioData:string) {
    const rec_req = {
      recogniseBlob: audioData,
      developer: true,
    };
    fetch(this.url_ASR_API, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rec_req),
    })
      .then((response) => response.json())
      .then((data) => {
      let transcription = data["transcriptions"][0]["utterance"];
      this.story.text = this.story.text + "\n" + transcription;
      this.story.htmlText = this.story.htmlText + "<p>" + transcription + "</p>";
      this.getWordCount(transcription);
      this.storySaved = false; 
      this.textUpdated.next(transcription);
      this.debounceSaveStory();
    });
  }
  
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
  
}
