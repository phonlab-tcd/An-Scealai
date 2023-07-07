import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { StoryService } from "app/core/services/story.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { TranslationService } from "app/core/services/translation.service";
import { UserService } from "../../core/services/user.service";
import { ProfileService } from "app/core/services/profile.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { RecordingDialogComponent } from "../../dialogs/recording-dialog/recording-dialog.component";
import { BasicDialogComponent } from "app/dialogs/basic-dialog/basic-dialog.component";
import { Story } from 'app/core/models/story';
import Quill from "quill";
import config from "abairconfig";

@Component({
  selector: "app-teacher-feedback",
  templateUrl: "./teacher-feedback.component.html",
  styleUrls: ["./teacher-feedback.component.scss", "./../../../quill.fonts.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class TeacherFeedbackComponent implements OnInit {
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
  @Input() storyInput: Story;
  @Output() closeFeedbackEmitter = new EventEmitter();

  commentsList: any = [];

  story = {
    _id: '1111',
    title: 'story title',
    date: new Date(),
    lastUpdated: new Date(),
    dialect: 'munster',
    text: 'this is a test',
    htmlText: 'this is a test',
    author: 'nuage',
    studentId: '11111',
    feedback: {
        seenByStudent: false,
        text: 'great job',
        feedbackMarkup: 'Tá an ceathrú dáileog den vacsaín le tairiscint do gach duine sa stát atá 65 nó níos sine. Dheimhnigh an tAire Sláinte Stephen Donnelly ar maidin gurb í sin comhairle NIAC, an Coiste Comhairleach Náisiúnta um Imdhíonadh, agus gur ghlac sé leis an gcomhairle sin. Ag labhairt dó ar Morning Ireland ar RTÉ, dúirt Donnelly go raibh Feidhmeannacht na Seirbhíse Sláinte ag ullmhú cheana féin chun an ceathrú snáthaid a dháileadh. De réir chomhairle NIAC ba chóir an dara teanndáileog a thabhairt do dhaoine atá 12 nó níos sine atá imdhíon-lagaithe. Ba chóir a deir siad bundáileog trí shnáthaid a thabhairt do pháistí atá idir 5-11 atá imdhíon-lagaithe. Maidir leis an gceathrú snáthaid do dhaoine os cionn 65 is í comhairle NIAC ná go bhfágfaí sé mhí idir an tríú dáileog agus an ceann nua, ach go deir siad bhféadfadh go mbeadh ceithre mhí inmholta i gcásanna áirithe. Dúirt Stephen Donnelly go rabhthas ag súil moltaí NIAC a chur i gcrích “an sciobtha”. Dhéanfaí scagadh anois ar ar cheart vacsaín eile a dháileadh ar dhaoine in aoisghrúpaí eile, a dúirt sé.',
        audioId: '11111',
    },
    activeRecording: '1111',
    createdWithPrompts: false,
  };

  /**
   * Create a new comment where the user selects the text
   */
  createComment() {
    const commentInput = window.prompt("Please enter Comment", "");
  
    if (commentInput != null && commentInput !== "") {
      let range = this.quillEditor.getSelection();

      // comment regarding entire text, no highlighting applied
      if (!range || range.length === 0) {
        range = {index: 0, length: 0}
      }

      let commentObj = { range: range, comment: commentInput };
      this.commentsList.push(commentObj);

      this.quillEditor.formatText(range.index, range.length, {
        background: "#fff72b"
      });

      this.drawComment(commentObj.comment);
    } 
  }


  /**
   * Adds the comment ot this list of comments on the side of the editor
   * @param comment comment text to show on screen
   */
  drawComment(comment: string) {
    const commentContainer = document.getElementById("comments-container");
    if (commentContainer) {
      const buttonElement = document.createElement('div');
      buttonElement.textContent = comment;
      buttonElement.setAttribute('data-index', (this.commentsList.length - 1).toString());
      buttonElement.classList.add('comment')
      buttonElement.addEventListener('click', (event) => this.showCommentInQuill(event.target as HTMLElement));
      commentContainer.appendChild(buttonElement);
    }
  }

  /**
   * Show where in quill the clicked comment is refering to
   * @param commentElement comment HTML element clicked on
   */
  showCommentInQuill(commentElement: HTMLElement) {
    let index = commentElement.getAttribute('data-index');
    let commentData = this.commentsList[index];
    this.quillEditor.setSelection(commentData.range.index, commentData.range.length);
  }





  ngOnInit() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;
  }

  ngOnChanges(_) {
    this.getStoryData();
  }

  /*
   * Use url parameters to get the story and its audio feedback, the author's name
   * with possessive ending, and the user's id
   */
  getStoryData() {
    if (this.story) {
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
    }

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
