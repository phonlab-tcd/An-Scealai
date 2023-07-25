import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslationService } from "app/core/services/translation.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { StoryService } from "app/core/services/story.service";
import { FeedbackCommentService } from "app/core/services/feedback-comment.service";
import { FeedbackComment } from "app/core/models/feedbackComment";
import { Story } from "app/core/models/story";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "app/dialogs/basic-dialog/basic-dialog.component";
import Quill from "quill";

@Component({
  selector: "app-story-feedback",
  templateUrl: "./story-feedback.component.html",
  styleUrls: ["./story-feedback.component.scss", "./../../../quill.fonts.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class StoryFeedbackComponent implements OnInit {
  constructor(
    protected sanitizer: DomSanitizer,
    public ts: TranslationService,
    public auth: AuthenticationService,
    private feedbackCommentService: FeedbackCommentService,
    private storyService: StoryService,
    private dialog: MatDialog
  ) {}

  @Input() story: Story;
  @Output() closeFeedbackEmitter = new EventEmitter();
  quillEditor: Quill;
  commentsList: FeedbackComment[] = [];
  commentButton: HTMLButtonElement;
  isTeacher: boolean = false;
  storyUpdated: boolean = false; // TODO implement refresh button if student has udpated text
  initialStoryTextWithMarkup: string;
  storyTextWithMarkup: string;
  feedbackSent: boolean = false;
  dialogRef: MatDialogRef<unknown>;

  /**
   * Set variable if user is student, hides certain views in HTML
   * Create an inline comment button if user is teacher
   */
  ngOnInit() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;
    if (userDetails.role === "TEACHER") {
      this.isTeacher = true;
      this.createInlineCommentButton();
    }
  }

  /**
   * Load any feedback if story selected from parent component
   */
  ngOnChanges(_) {
    if (this.story) {
      this.loadStory();
    }
  }

  /*
   * Initialise quill editor
   */
  onEditorCreated(q: Quill) {
    this.quillEditor = q;
    this.quillEditor.root.setAttribute("spellcheck", "false");
  }

  /**
   * Load in the story and feedback
   */
  loadStory() {
    // get previous feedback markup if it exists, otherwise just get story html
    if (this.story.feedback.feedbackMarkup == null) {
      this.feedbackSent = false;
      this.storyTextWithMarkup = this.story.htmlText || this.story.text;
    }
    // check if student has updated story since last teacher edits made, if so refresh button is displayed => TODO
    else {
      this.feedbackSent = true;
      this.storyTextWithMarkup = this.story.feedback.feedbackMarkup;
      this.storyUpdated = this.checkTextDifference(
        this.story.feedback.feedbackMarkup,
        this.story.text
      );
    }

    // set variable to initial markup text to check for saving changes before leaving page
    this.initialStoryTextWithMarkup = this.storyTextWithMarkup;
    this.loadComments();
  }

  /**
   * Load in any comments left on story
   */
  loadComments() {
    this.commentsList = [];
    if (this.story.feedback.hasComments) {
      this.feedbackCommentService.getFeedbackComments(this.story._id).subscribe({
        next: (comments) => {
          comments.forEach((comment) => {
            this.quillEditor.formatText(
              comment.range.index,
              comment.range.length,
              { background: "#fff72b" }
            );
            this.commentsList.push(comment);
          });
          if (this.commentsList.length > 0) {
            this.feedbackSent = true;
          }
        },
      });
    }
  }

  /*
   * Returns true if the texts are different, otherwise returns false
   */
  checkTextDifference(text1: string, text2: string) {
    let stripped1 = text1.replace(/(<([^>]+)>)/gi, "").replace(/[\s,\.]+/g, "");
    let stripped2 = text2.replace(/(<([^>]+)>)/gi, "").replace(/[\s,\.]+/g, "");
    return stripped1 !== stripped2;
  }

  /**
   * Create comment button that appears when teacher highlights the text
   */
  createInlineCommentButton() {
    this.commentButton = document.createElement("button");
    this.commentButton.id = "commentButton";
    this.commentButton.addEventListener("click", () => {
      this.createComment();
      this.hideExistingCommentButton();
    });
    this.commentButton.classList.add("commentButton");
    this.commentButton.style.visibility = "hidden";

    // create icon inside button
    const iconElement = document.createElement("i");
    iconElement.classList.add("fa-solid", "fa-message");
    this.commentButton.appendChild(iconElement);

    document.body.appendChild(this.commentButton);
  }

  /**
   * Create a new comment object where the user selects the text,
   * and highlight the text in quill that the comment refers to
   */
  async createComment() {
    if (this.feedbackSent) this.feedbackSent = false;

    let range = this.quillEditor.getSelection();

    // default range for entire text, no highlighting applied
    if (!range || range.length === 0) {
      range = { index: 0, length: 0 };
    }

    // creates a new feedback-comment component
    this.feedbackCommentService
      .createNewComment(new FeedbackComment(this.auth.getUserDetails()._id, range, this.story._id))
      .subscribe({
        next: (comment) => {
          // highlight text in quill
          this.quillEditor.formatText(range.index, range.length, {
            background: "#fff72b",
          });
          this.commentsList.push(comment);
        },
        error: () => {},
      });
  }

  /**
   * Move and display the comment button where the user selects a range of text
   * @param event quill on-select event
   */
  showInlineCommentButton(event) {
    let range = event.range;

    if(!range  ||  !(range.length > 0) || !(event.source == "user")) {
      this.hideExistingCommentButton();
      return;
    }

    // don't want to create button when highlightCommentReferenceInQuill() is fired
    const length = range.length;
    // get bounds of selected text
    const bounds = this.quillEditor.getBounds(range.index + length, 0);
    // get bounds of entire quill editor
    const editorContainer = this.quillEditor.root.parentNode as HTMLElement;
    const editorRect = editorContainer.getBoundingClientRect();
    // set the location of the button
    this.commentButton.style.left = `${editorRect.left + bounds.right}px`;
    this.commentButton.style.top = `${editorRect.top + bounds.bottom}px`;
    this.commentButton.style.visibility = "visible";
  }

  /**
   * Hide the inline comment button from view
   */
  hideExistingCommentButton() {
    this.commentButton.style.visibility = "hidden";
  }

  /**
   * Show where in quill the clicked comment is refering to
   * @param commentElement clicked on comment HTML element
   */
  highlightCommentReferenceInQuill(index: number) {
    const commentData = this.commentsList[index];
    this.quillEditor.setSelection(
      commentData.range.index,
      commentData.range.length
    );
  }

  /**
   * Delete comment and remove any highlighting in quill
   * @param indexToDelete index of comment to delete
   */
  removeComment(indexToDelete: number, comment: FeedbackComment) {
    this.quillEditor.removeFormat(comment.range.index, comment.range.length);
    this.commentsList.splice(indexToDelete, 1);
  }

  /**
   * Check if any feedback was given and if so
   * prompt user to send feedback before closing the component
   */
  closeFeedback() {
    if (
      (this.commentsList.length > 0 ||
        this.initialStoryTextWithMarkup !== this.storyTextWithMarkup) &&
      !this.feedbackSent
    ) {
      this.dialogRef = this.dialog.open(BasicDialogComponent, {
        data: {
          title: this.ts.l.save_changes,
          message: `${this.ts.l.would_you_like_send_feedback} ${this.story.author}?`,
          confirmText: this.ts.l.yes,
          cancelText: this.ts.l.no,
        },
        width: "60vh",
      });

      this.dialogRef.afterClosed().subscribe((res) => {
        this.dialogRef = undefined;
        if (res) {
          this.sendFeedback();
        } else {
          this.closeFeedbackEmitter.next(true);
        }
      });
    } else {
      this.closeFeedbackEmitter.next(true);
    }
  }

  /*
   * Save feedback changes and update status
   */
  sendFeedback() {
    const hasComments = this.commentsList.length > 0 ? true : false;
    this.story.feedback.hasComments = hasComments;
    if (this.initialStoryTextWithMarkup !== this.storyTextWithMarkup) this.story.feedback.feedbackMarkup = this.storyTextWithMarkup;
    
    this.storyService.updateFeedbackStatus( this.story._id, this.story.feedback.feedbackMarkup, hasComments ).subscribe({
      next: () => {
        this.feedbackSent = true;
        this.story.feedback.seenByStudent = false;
      },
      error: () => {
        console.error("error saving feedback");
      },
    });
  }
}
