import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslationService } from "app/core/services/translation.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FeedbackCommentService } from "app/core/services/feedback-comment.service";
import { FeedbackComment } from "app/core/models/feedbackComment";
import { Story } from "app/core/models/story";
import Quill from "quill";

@Component({
  selector: 'app-story-feedback',
  templateUrl: './story-feedback.component.html',
  styleUrls: ['./story-feedback.component.scss', "./../../../quill.fonts.scss",],   encapsulation: ViewEncapsulation.None,
})
export class StoryFeedbackComponent implements OnInit {

  constructor(
    protected sanitizer: DomSanitizer,
    public ts: TranslationService,
    public auth: AuthenticationService,
    private feedbackCommentService: FeedbackCommentService
  ) {}

  quillEditor: Quill;
  commentsList: FeedbackComment[] = [];
  isTeacher: boolean = true;
  @Input() story: Story;
  @Output() closeFeedbackEmitter = new EventEmitter();
  storyUpdated: boolean = false;

  ngOnInit() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;
    if (userDetails.role === 'STUDENT') this.isTeacher = false;
  }

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

  loadStory() {
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

    this.commentsList = [];

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
      },
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

  /**
   * Create a new comment object where the user selects the text,
   * and highlight the text in quill that the comment refers to
   */
  async createComment() {
    let range = this.quillEditor.getSelection();

    // default range for entire text, no highlighting applied
    if (!range || range.length === 0) {
      range = { index: 0, length: 0 };
    }

    // creates a new feedback-comment component
    this.feedbackCommentService
      .createNewComment(new FeedbackComment(range, this.story._id))
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
   * Create and display a comment button when the user selects a range of text
   * @param event quill on-select event
   */
  showInlineCommentButton(event) {
    let range = event.range;
    if (range && range.length > 0 && event.source == "user") {
      // don't want to create button when highlightCommentReferenceInQuill() is fired
      const length = range.length;
      // get bounds of selected text
      const bounds = this.quillEditor.getBounds(range.index, length);
      // get bounds of entire quill editor
      const editorContainer = this.quillEditor.root.parentNode as HTMLElement;
      const { top } = editorContainer.getBoundingClientRect();

      // delete any existing comment buttons
      this.deleteExistingCommentButton();

      const buttonElement = document.createElement("button");
      buttonElement.addEventListener("click", () => {
        this.createComment();
        this.deleteExistingCommentButton();
      });
      buttonElement.classList.add("commentButton");
      buttonElement.style.position = "absolute";
      buttonElement.id = "commentButton";
      buttonElement.style.left = `${bounds.right}px`;
      buttonElement.style.top = `${top + bounds.bottom}px`;

      // create icon inside button
      const iconElement = document.createElement("i");
      iconElement.classList.add("fa-solid", "fa-message");
      buttonElement.appendChild(iconElement);

      document.body.appendChild(buttonElement);
    } else {
      // remove any previous comment button added
      this.deleteExistingCommentButton();
    }
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
   * Remove any existing comment buttons that might be in the quill editor
   */
  deleteExistingCommentButton() {
    let buttonElement = document.getElementById("commentButton");
    if (buttonElement) {
      buttonElement.remove();
    }
  }

  /**
   * Delete comment and remove any highlighting in quill
   * @param indexToDelete index of comment to delete
   */
  removeComment(indexToDelete: number, comment: FeedbackComment) {
    this.quillEditor.removeFormat(comment.range.index, comment.range.length);
    this.commentsList.splice(indexToDelete, 1);
  }

}
