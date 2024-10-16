import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { SafeUrl } from "@angular/platform-browser";
import { firstValueFrom, Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { TranslationService } from "app/core/services/translation.service";
import Quill from "quill";
import { Delta } from "quill";
import ImageCompress from "quill-image-compress";
import {clone} from "lodash";
import config from "abairconfig";
import { AuthenticationService } from "app/core/services/authentication.service";
import { StoryService } from "app/core/services/story.service";
import { EngagementService } from "app/core/services/engagement.service";
import { RecordAudioService } from "app/core/services/record-audio.service";
import { ClassroomService } from "app/core/services/classroom.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "../../dialogs/basic-dialog/basic-dialog.component";
import { Story } from "app/core/models/story";
import { EventType } from "app/core/models/event";
import { GrammarEngine } from "lib/grammar-engine/grammar-engine";
import { QuillHighlighter } from "lib/quill-highlight/quill-highlight";
import { HighlightTag } from "lib/quill-highlight/quill-highlight";
import { leathanCaolChecker } from "lib/grammar-engine/checkers/leathan-caol-checker";
import { anGramadoir } from "lib/grammar-engine/checkers/an-gramadoir";
import { relativeClauseChecker } from "lib/grammar-engine/checkers/relative-clause-checker";
import { CHECKBOXES, ERROR_TYPES, ErrorTag, GrammarChecker } from "lib/grammar-engine/types";
import stripQuillAttributesFromHTML from "lib/strip-quill-attributes-from-html";
import { MatDrawer } from "@angular/material/sidenav";
import { NotificationService } from "app/core/services/notification-service.service";
import synth from "lib/synth";
import Buttons from "lib/synth/buttons";
import "lib/quill-tooltip-shim";
import { SynthesisService } from "app/core/services/synthesis.service";

Quill.register("modules/imageCompress", ImageCompress);
Quill.register("modules/spellcheck", true);

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: [
    "./dashboard.component.scss",
    "./../../../lib/quill-highlight/gramadoir-tags.scss",
    "./../../../quill.fonts.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  // STORY VARIABLES
  story: Story;
  saveStoryDebounceId = 0;
  mostRecentAttemptToSaveStory = new Date();
  storySaved = true;
  dialogRef: MatDialogRef<unknown> | undefined;
  storiesLoaded: boolean = false;
  isFirstStory: boolean = false;
  downloadStoryFormat = ".pdf";
  hasFeedback: boolean = false;
  updatedTitle: string = "";

  // GRAMMAR VARIABLES
  grammarEngine: GrammarEngine;
  grammarLoaded: boolean = false;
  showErrorTags = false;
  grammarCheckerOptions: {[key: string]: GrammarChecker} = {
    anGramadoir: anGramadoir,
    relativeClause: relativeClauseChecker,
    //'genitive': genitiveChecker,
    broadSlender: leathanCaolChecker,
  };
  checkBoxes = CHECKBOXES;
  grammarErrorsTypeDict: Object = {};

  // OPTIONS (show menu bar, drawer, etc)
  showOptions = true;
  dontToggle = false;
  @ViewChild("rightDrawer") rightDrawer: MatDrawer;
  rightDrawerOpened: boolean = false;
  selectedDrawer: "grammar" | "dictionary" | "feedback" | "synthesis" | "bat-mirialta" = "grammar";

  // WORD COUNT
  words: string[] = [];
  wordCount = 0;

  textUpdated = new Subject<void | string>();
  quillEditor: Quill;
  quillHighlighter: QuillHighlighter;
  quillToolbar = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ align: [] }],
      ["clean"],
      ["image"],
    ],
    imageCompress: {
      // used to compress any images added to the story
      quality: 0.7,
      maxWidth: 500,
      maxHeight: 500,
      imageType: "image/png",
      debug: false, // console logs
      suppressErrorLogging: false,
      insertIntoEditor: undefined,
    },
    spellcheck: false
  };

  // SPEECH TO TEXT
  audioSourceASR: SafeUrl | null = null;
  isRecording: boolean = false;
  isTranscribing: boolean = false;

  // TEXT TO SPEECH
  synthButtons: Buttons | undefined;
  synthSettings = new synth.Settings();
  
  constructor(
    public ts: TranslationService,
    private auth: AuthenticationService,
    private storyService: StoryService,
    private recordAudioService: RecordAudioService,
    private engagement: EngagementService,
    private classroomService: ClassroomService,
    private dialog: MatDialog,
    public http: HttpClient,
    private router: Router,
    private notificationService: NotificationService,
    private synthService: SynthesisService
  ) {
    this.setUpGrammarChecking();
  }

  async ngOnInit() { }

  /**
   * Initialise the Grammar Engine and Highlighting services
   * Update any error tags/highlighting when the user makes changes to their story
   */
  async setUpGrammarChecking() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) {
      console.error("CANNOT SET UP GRAMMAR CHECKING, USER IS NULL");
      return
    };

    // get student classroom to see if any grammar checkers were specified in classroom settings
    const classroom_cache = localStorage.getItem("classroom");
    const classroom = classroom_cache ? JSON.parse(classroom_cache) : await firstValueFrom( this.classroomService.getClassroomOfStudent(userDetails._id) );

    // populate an array of checkers from classroom settings to pass into the grammar engine
    let checkers: GrammarChecker[] = [];
    if (
      classroom &&
      classroom.grammarCheckers &&
      classroom.grammarCheckers.length > 0
    ) {
      classroom.grammarCheckers.forEach((checkerName: string) => {
        if (this.grammarCheckerOptions[checkerName])
          checkers.push(this.grammarCheckerOptions[checkerName]);
      });
    }
    // pass all checkers to the grammar engine if no classroom specifications
    else {
      checkers = Object.values(this.grammarCheckerOptions);
    }

    this.grammarEngine = new GrammarEngine(checkers, this.http, this.auth);

    // subscribe to any changes made to the story text and check for grammar errors
    this.textUpdated.pipe(distinctUntilChanged()).subscribe(async () => {
      this.runGrammarCheck();
    });
  }

  runGrammarCheck() {
    this.grammarLoaded = false;
    this.quillHighlighter?.hideAll();
    const textToCheck = this.story.text.replace(/\n/g, " ");
      if (!textToCheck) return;

      try {
        // check text for grammar errors
        this.grammarEngine.check$(this.story.text).subscribe({
          next: (tag: ErrorTag) => {
            // show error highlighting if button on
            if (this.showErrorTags) {
              this.quillHighlighter.addTag(tag);
            }
          },
          error: function (err) {console.error("ERROR GETTING THE 'CHECK()' RES: ", err)},
          complete: () => {
            if (!this.quillHighlighter) return;

            //save any grammar errors with associated sentences to DB
            //this.grammarEngine.saveErrorsWithSentences(this.story._id).then(console.log, console.error);
            this.grammarLoaded = true;
          },
        });
      } catch (updateGrammarErrorsError) {
        console.error("ERROR RUNNING THE GRAMMAR CHECKERS")
        console.error(updateGrammarErrorsError);
      }
  }

  /**
   * Toggles the right drawer open/closed
   * Drawer content is set by 'selectedDrawer' variable which is determined in the HTML
   * Hides/shows the grammar highlighting if the grammar drawer is selected
   * @param selectedContent Indicates which component to be injected into the drawer
   */
  toggleRightDrawer(selectedDrawer: 'dictionary' | 'grammar' | 'feedback' | 'synthesis') {
    if (this.rightDrawerOpened) {
      // close the drawer if the same button has been pressed (i.e. the user clicked 'dictionary'
      // once to open the dictionary, and clicked 'dictionary' again to close the drawer
      // otherwise the drawer stays open and the content changes to whichever other button the user clicked
      // (i.e. if the user clicked 'dictionary' and then 'grammar check', the drawer doesn't close but content is updated)
      if (this.selectedDrawer === selectedDrawer) {
        this.rightDrawer.close();
        this.rightDrawerOpened = false;
      } 
    } else {
      // open the drawer
      this.rightDrawer.open();
      this.rightDrawerOpened = true;
      // add view feedback event to DB
      if (selectedDrawer == 'feedback') {
        this.storyService.viewFeedback(this.story._id).subscribe(() => {
          this.story.feedback.seenByStudent = true;
          this.engagement.addEvent( EventType["VIEW-FEEDBACK"], {storyObject: this.story} );
          this.notificationService.getStudentNotifications();
        });
      }
    }

    // sets the variable used to display the selected component in the drawer
    this.selectedDrawer = selectedDrawer;

    // shows/hides the grammar errors if grammar drawer is selected
    if (this.selectedDrawer == "grammar" && this.rightDrawerOpened) {
      this.showErrorTags = true;
      this.runGrammarCheck();
      this.toggleGrammarTags();
      this.engagement.addEvent( EventType["USE-GRAMMAR-CHECKER"] );
    } else {
      this.showErrorTags = false;
      this.toggleGrammarTags();
    }
  }

  /**
   * Set the current story displayed and calculate word count
   * @param story Story selected from the story drawer
   */
  setCurrentStory(story: Story) {
    this.story = story;
    if (!this.story) return;

    // set story settings
    this.storySaved = true;
    this.updatedTitle = this.story.title;
    this.getWordCount(this.story.text);
    this.textUpdated.next(story.text);
    localStorage.setItem("currentStoryId", this.story._id);

    
    // set synth settigs
    const voice = this.synthService.getVoiceForDialect(this.story.dialect);
    this.synthSettings.voice = voice;
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
    delta: Delta;
    oldDelta: Delta;
    source: "user" | "api" | "silent" | undefined;
  }) {
    this.story.text = q.text;
    this.getWordCount(q.text);

    if (q.source === "user") {
      this.storySaved = false;
      this.textUpdated.next(q.text);
      this.debounceSaveStory();
    }
  }

  /**
   * Initialise quill editor and highlighter
   * @param q quill editor
   */
  onEditorCreated(q: Quill) {
    q["history"].options.userOnly = true; // prevent ctrl z from deleting text
    this.quillEditor = q;

    this.synthButtons = new synth.Buttons(this.quillEditor, this.synthSettings, this.engagement);

    this.quillEditor.root.setAttribute("spellcheck", "false");
    q.focus();

    const renderer = (function (ht: HighlightTag) {
        const [name, message] = this.ts.l.iso_code == 'en' ? 
          [ht.nameEN, ht.messageEN] : 
          [ht.nameGA, ht.messageGA];
        return `<div style="white-space: pre-wrap; text-align: left;"><span class="circle" style="background: ${ht.color}"></span> ${name}: ${message}</div>`;
    }).bind(this)
    this.quillHighlighter = new QuillHighlighter(
      this.quillEditor,
      renderer,
      this.engagement
    );
  }

  /**
   * Get word count of story text (CURRENTLY NOT USED OR SHOWN IN HTML)
   * @param text story text
   */
  getWordCount(text: string) {
    if (!text) { this.wordCount = 0; }
    const str = text.replace(/[\t\n\r\.\?\!]/gm, " ").split(" ");
    this.words = [];
    str.map((s: string) => {
      const trimStr = s.trim();
      if (trimStr.length > 0) {
        this.words.push(trimStr);
      }
    });
    this.wordCount = this.words.length;
  }

  /**
   * Set the word count to the number of words the user has selected
   * @param event quill selection event
   */
  getWordCountSelectedText(event: any) {
    let range = event.range;
    if(!range  ||  !(range.length > 0) || !(event.source == "user")) {
      return;
    }
    const selectedText = this.quillEditor.getText(range.index, range.length);
    this.getWordCount(selectedText);
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
  async saveStory(debounceId: number | "modal", finishedWritingTime: Date) {
    const saveAttempt = new Date();
    this.mostRecentAttemptToSaveStory = saveAttempt;

    if (!this.story._id) {
      return window.alert("Cannot save story. The id is not known");
    }

    // get story html text without highlighting markup
    const unhighlightedHtmlText = this.stripGramadoirAttributesFromHtml( clone(this.story.htmlText) );

    const updateData = {
      title: this.story.title,
      dialect: this.story.dialect,
      text: this.story.text,
      htmlText: unhighlightedHtmlText,
    };

    this.engagement.addSaveStoryEvent(this.story);

    // Save story to the DB
    try {
      await firstValueFrom( this.storyService.updateStory(updateData, this.story._id) );
      if (debounceId === this.saveStoryDebounceId) {
        this.storySaved = true;
      } else if (debounceId === "modal") {
        this.storySaved = true;
      }
    } catch (error) {
      window.alert("Error while trying to save story: " + (error as Error).message);
      throw error;
    }
    // Set story status to saved if dates match
    try {
      if (saveAttempt === this.mostRecentAttemptToSaveStory) {
        this.storySaved = true;
      }
    } catch (error) {
      window.alert("Error setting storySaved to true: " + (error as Error).message);
      throw error;
    }
    return;
  }

  /**
   * Get rid of highlighting markup from html text
   */
  stripGramadoirAttributesFromHtml = stripQuillAttributesFromHTML;

  /* Toggle upper menu buttons */
  toggleOptions() {
    if (!this.dontToggle) {
      this.showOptions = !this.showOptions;
    }
    this.dontToggle = false;
  }

  /* If story not saved, make title italic */
  titleStyle() {
    return { "font-style": this.storySaved ? "normal" : "italic" };
  }

  /**
   * Update the story title (called from HTML blur() function)
   */
  updateStoryTitle() {
    if (this.updatedTitle != this.story.title) {
      this.storySaved = false;
      this.story.title = this.updatedTitle;
      this.storyService
        .updateTitle(this.story._id, this.story.title)
        .subscribe({
          next: () => {
            this.storySaved = true;
            console.log("title updated");
          },
          error: (err) => console.error("error updating story title: ", err),
        });
    }
  }

  /* Download story in selected format */
  downloadStory() {
    this.debounceSaveStory();
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.download,
        type: "select",
        data: [this.story.title, [".pdf", ".docx", ".txt", ".odt"]],
        confirmText: this.ts.l.download,
        cancelText: this.ts.l.cancel,
      },
      width: "50vh",
    });

    this.dialogRef.afterClosed().subscribe((res) => {
      this.dialogRef = undefined;
      // res[0] is download title, res[1] is download format
      if (res) {
        res[1]
          ? (this.downloadStoryFormat = res[1])
          : (this.downloadStoryFormat = ".pdf");
        this.http
          .get(this.downloadStoryUrl(), { responseType: "blob" })
          .subscribe((data) => {
            const elem = window.document.createElement("a");
            elem.href = window.URL.createObjectURL(data);
            res[0]
              ? (elem.download = res[0])
              : (elem.download = this.story.title);
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
          });
      }
    });
  }

  /* Create story download url with chosen format */
  downloadStoryUrl() {
    return ( config.baseurl + "story/downloadStory/" + this.story._id + "/" + this.downloadStoryFormat );
  }

  /* Show or hide error highlighting in the story text */
  async toggleGrammarTags() {
    if(this.showErrorTags) {
      for(const type of ERROR_TYPES ) {
        if(this.checkBoxes[type]) {
          const tagsToAdd = this.grammarEngine.errorStoreForLatestCheck.getType(type);
          this.quillHighlighter?.show(tagsToAdd);
        }
      }
      // this.quillHighlighter.show(this.grammarErrors.filter((tag) => this.checkBoxes[tag.type]).map(ErrorTag2HighlightTag) );
    } else {
      this.quillHighlighter.hideAll();
    }
  }

  /* Route to record story component */
  goToRecording() {
    this.router.navigateByUrl("/student/record-story/" + this.story._id);
  }

  /* Stop recording if already recording, otherwise start recording; get transcription */
  async speakStory() {
    if (this.isRecording) {
      this.isTranscribing = true;
      this.recordAudioService.stopRecording();
      const transcription = await this.recordAudioService.getAudioTranscription();
      this.isTranscribing = false;
      if (transcription) {
        // get cursor position for inserting the transcription
        let selection = this.quillEditor.getSelection(true);
        this.quillEditor.insertText(selection.index, transcription + ".");

        // update the text and html text with inserted transcription
        this.story.text = this.quillEditor.getText();
        this.story.htmlText = this.quillEditor.root.innerHTML;

        // save story
        this.getWordCount(transcription);
        this.storySaved = false;
        //this.textUpdated.next();
        this.debounceSaveStory();
      }
      else alert("No audio detected");
    } else {
      this.recordAudioService.recordAudio();
    }
    this.isRecording = !this.isRecording;
  }
}
