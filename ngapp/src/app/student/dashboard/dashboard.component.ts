import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, Subject } from "rxjs";
import { TranslationService, MessageKey, } from "app/core/services/translation.service";
import Quill from "quill";
import ImageCompress from "quill-image-compress";
import clone from "lodash/clone";
import config from 'abairconfig';
import { AuthenticationService } from "app/core/services/authentication.service";
import { StoryService } from "app/core/services/story.service";
import { EngagementService } from "app/core/services/engagement.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "../../dialogs/basic-dialog/basic-dialog.component";
import { Story } from "app/core/models/story";
import { EventType } from "app/core/models/event";
import { StoryDrawerComponent } from "../story-drawer/story-drawer.component";

Quill.register("modules/imageCompress", ImageCompress);

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: [
    "./dashboard.component.scss",
    "./../../lib/quill-highlight/gramadoir-tags.scss",
    "./../../../quill.fonts.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  // STORY VARIABLES
  stories: Story[] = [];
  story: Story = new Story();
  saveStoryDebounceId = 0;
  mostRecentAttemptToSaveStory = new Date();
  storySaved = true;
  dialogRef: MatDialogRef<unknown>;
  storiesLoaded: boolean = false;
  downloadStoryFormat = '.pdf';
  lastClickedStoryId: string = "";

  // GRAMMAR VARIABLES
  showErrorTags = false;

  // OPTIONS (to show or not to show dash menu bar)
  showOptions = true;
  dontToggle = false;
  feedbackVisibile: false;

  private textUpdated = new Subject<void | string>();
  quillEditor: Quill;
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
  };

  constructor(
    public ts: TranslationService,
    private auth: AuthenticationService,
    private storyService: StoryService,
    private dialog: MatDialog,
    private engagement: EngagementService,
    private http: HttpClient,
    private router: Router,
  ) {}

  async ngOnInit() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) {
      this.auth.logout();
      return;
    }
    if (!this.story) return;
    this.storySaved = true;
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
    source: "user" | "api" | "silent" | undefined;
  }) {
    this.story.text = q.text;
    this.getWordCount(q.text);
    switch (q.source) {
      case "user":
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
    this.quillEditor.root.setAttribute("spellcheck", "false");
    q.focus();
    //this.quillHighlighter = new QuillHighlighter(this.quillEditor, this.ts, this.engagement);
  }

  getWordCount(text) {}

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
      lastUpdated: finishedWritingTime,
    };

    this.engagement.addEventForLoggedInUser(
      EventType["SAVE-STORY"],
      this.story
    );

    // Save story to the DB
    try {
      await firstValueFrom( this.storyService.updateStory(updateData, this.story._id) );
      if (debounceId === this.saveStoryDebounceId) {
        this.storySaved = true;
      } else if (debounceId === "modal") {
        this.storySaved = true;
      }
    } catch (error) {
      window.alert("Error while trying to save story: " + error.message);
      throw error;
    }
    // Set story status to saved if dates match
    try {
      if (saveAttempt === this.mostRecentAttemptToSaveStory) {
        this.storySaved = true;
      }
    } catch (error) {
      window.alert("Error setting storySaved to true: " + error.message);
      throw error;
    }
    return;
  }

  /**
   * Get rid of highlighting markup from html text
   * @param text story html text
   */
  stripGramadoirAttributesFromHtml(text: string) {
    if (!text || !text.replace) { return ""; }
    return text
      .replace(/\s*style="([^"])+"/g, "")
      .replace(/\s*highlight-tag-type="([^"])+"/g, "")
      .replace(/\s*highlight-tag="([^"])+"/g, "");
  }

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

  hasNewFeedback() {}

  toggleGrammarButton() {
    const key: MessageKey = this.showErrorTags
      ? "hide_grammar_suggestions"
      : "show_grammar_suggestions";
    return this.ts.message(key);
  }

  toggleGrammarTags() {}

  showModal() {}

  selectedGrammarSuggestion() {
    return "test";
  }

  /* Route to record story component */
  goToRecording() {
    this.router.navigateByUrl('/student/record-story/' + this.story._id);
  }

  goToSynthesis() {}
}
