import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { StoryService } from "../../story.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { TranslationService } from "../../translation.service";
import { UserService } from "../../user.service";
import { ProfileService } from "../../profile.service";
import { AuthenticationService } from "../../authentication.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { RecordingDialogComponent } from "../../dialogs/recording-dialog/recording-dialog.component";
import { BasicDialogComponent } from "app/dialogs/basic-dialog/basic-dialog.component";
import Quill from "quill";
import config from "abairconfig";

@Component({
  selector: "app-teacher-story",
  templateUrl: "./teacher-story.component.html",
  styleUrls: ["./teacher-story.component.scss", "./../../../quill.fonts.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class TeacherStoryComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private storyService: StoryService,
    protected sanitizer: DomSanitizer,
    public ts: TranslationService,
    private router: Router,
    private userService: UserService,
    private profileService: ProfileService,
    private auth: AuthenticationService,
    private dialog: MatDialog
  ) {}

  story: any;
  audioSource: SafeUrl;
  feedbackText: string;
  authorPossessive: string;
  feedbackSent: boolean = false;
  userId: string;
  isFromAmerica: boolean = false;
  dialogRef: MatDialogRef<unknown>;
  baseUrl: string = config.baseurl;
  quillEditor: Quill;
  storyUpdated: boolean = false;
  initialMarkupText: string;
  config = {
    toolbar: [
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike"],
    ],
  };

  ngOnInit() {
    this.getStoryData();
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    //set date format
    this.profileService.getForUser(userDetails._id).subscribe((res) => {
      let p = res.profile;
      let country = p.country;
      if (
        country == "United States of America" ||
        country == "America" ||
        country == "USA" ||
        country == "United States"
      ) {
        this.isFromAmerica = true;
      } else {
        this.isFromAmerica = false;
      }
    });
  }

  /*
   * Use url parameters to get the story and its audio feedback, the author's name
   * with possessive ending, and the user's id
   */
  getStoryData() {
    this.http
      .get(this.baseUrl + "story/viewStory/" + this.route.snapshot.params["id"])
      .subscribe((res) => {
        this.story = res[0];
        // get story text from previous markup if it exists, otherwise just get story html
        if (this.story.feedback.feedbackMarkup == null) {
          this.story.feedback.feedbackMarkup =
            this.story.htmlText || this.story.text;
        }
        // check if student has updated story since last teacher edits made, if so refresh button is displayed
        else {
          this.storyUpdated = this.checkTextDifference(
            this.story.feedback.feedbackMarkup,
            this.story.text
          );
        }
        // set variable to initial markup text to check for saving changes before leaving page
        this.initialMarkupText = this.story.feedback.feedbackMarkup;
        this.getFeedbackAudio();
        this.getAuthorPossessive();
        this.getUserId();
      });
  }

  /* 
  * Returns true if the texts are different, otherwise return false 
  */
  checkTextDifference(text1: string, text2: string) {
    let stripped1 = text1.replace(/(<([^>]+)>)/gi, "").replace(/[\s,\.]+/g, "");
    let stripped2 = text2.replace(/(<([^>]+)>)/gi, "").replace(/[\s,\.]+/g, "");
    return stripped1 !== stripped2;
  }

  /*
   * Add the possessive 's' ending to the author's name
   */
  getAuthorPossessive() {
    let name: string = this.story.author;
    this.authorPossessive =
      name + "'" + (name[name.length - 1] === "s" ? "" : "s");
  }

  /*
   * Get the id of the author using the user service
   * Set date format dependng on where the user is from using the profile service
   */
  getUserId() {
    this.userService.getUserByUsername(this.story.author).subscribe((res) => {
      this.userId = res[0]._id;
    });
  }

  /*
   * Get audio feedback from the database using the story service
   */
  getFeedbackAudio() {
    this.storyService.getFeedbackAudio(this.story._id).subscribe((res) => {
      if (res.type == "audio/mp3") {
        this.audioSource = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(res)
        );
      }
    });
  }

  /*
   * Add feedback text to the story using the story service
   */
  sendFeedback() {
    let markupText = null;
    // check if the teacher added any markup to the story text, if so save to DB
    if (this.story.htmlText !== this.story.feedback.feedbackMarkup) {
      markupText = this.story.feedback.feedbackMarkup;
    }
    this.storyService
      .addFeedback(this.story._id, this.story.feedback.text, markupText)
      .subscribe((res) => {
        this.feedbackSent = true;
      });
    this.initialMarkupText = markupText;
  }

  /*
   * Open Recording Dialog Box
   */
  openRecordingDialog() {
    this.dialogRef = this.dialog.open(RecordingDialogComponent, {
      data: {
        type: "feedbackAudio",
        id: this.story._id,
        confirmButton: this.ts.l.save,
      },
      width: "30vh",
    });

    this.dialogRef.afterClosed().subscribe((res) => {
      this.dialogRef = undefined;
      if (res) {
        this.getFeedbackAudio();
      }
    });
  }

  /*
   * Open update story markup dialog box
   */
  openUpdateStoryTextDialog() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.story_updated,
        message: (this.ts.l.student_has_made_changes_since_feedback).replace('#', this.story.author),
        confirmText: this.ts.l.yes,
        cancelText: this.ts.l.no,
      },
      width: "60vh",
    });

    this.dialogRef.afterClosed().subscribe((res) => {
      this.dialogRef = undefined;
      if (res) {
        this.storyService
          .updateFeedbackMarkup(this.story._id, null)
          .subscribe();
        this.story.feedback.feedbackMarkup = this.story.htmlText;
      }
    });
  }

  /* 
  * Initialise quill editor 
  */
  onEditorCreated(q: Quill) {
    this.quillEditor = q;
    this.quillEditor.root.setAttribute("spellcheck", "false");
  }

  /*
  * Check if any changes need to be saved and prompt, otherwise go back
  */
  goBack() {
    if (this.initialMarkupText !== this.story.feedback.feedbackMarkup) {
      this.dialogRef = this.dialog.open(BasicDialogComponent, {
        data: {
          title: this.ts.l.save_changes,
          message: this.ts.l.would_you_like_save_feedback_changes,
          confirmText: this.ts.l.yes,
          cancelText: this.ts.l.no,
        },
        width: "60vh",
      });

      this.dialogRef.afterClosed().subscribe((res) => {
        this.dialogRef = undefined;
        if (res) {
          this.sendFeedback();
        }
        this.router.navigateByUrl("teacher/student/" + this.userId);
      });
    } else {
      this.router.navigateByUrl("teacher/student/" + this.userId);
    }
  }
}
