import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslationService } from "app/core/services/translation.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FeedbackComment } from "app/core/models/feedbackComment";
import Quill from "quill";

@Component({
  selector: "app-teacher-feedback",
  templateUrl: "./teacher-feedback.component.html",
  styleUrls: [
    "./teacher-feedback.component.scss",
    "./../../../quill.fonts.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TeacherFeedbackComponent implements OnInit {
  constructor(
    protected sanitizer: DomSanitizer,
    public ts: TranslationService,
    private auth: AuthenticationService
  ) {}

  quillEditor: Quill;
  config = {
    toolbar: [
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike"],
    ],
  };

  commentsList: FeedbackComment[] = [];

  // dummy story object
  story = {
    _id: "1111",
    title: "story title",
    date: new Date(),
    lastUpdated: new Date(),
    dialect: "munster",
    text: "this is a test",
    htmlText: "this is a test",
    author: "nuage",
    studentId: "11111",
    feedback: {
      seenByStudent: false,
      text: "great job",
      feedbackMarkup:
        "Tá an ceathrú dáileog den vacsaín le tairiscint do gach duine sa stát atá 65 nó níos sine. Dheimhnigh an tAire Sláinte Stephen Donnelly ar maidin gurb í sin comhairle NIAC, an Coiste Comhairleach Náisiúnta um Imdhíonadh, agus gur ghlac sé leis an gcomhairle sin. Ag labhairt dó ar Morning Ireland ar RTÉ, dúirt Donnelly go raibh Feidhmeannacht na Seirbhíse Sláinte ag ullmhú cheana féin chun an ceathrú snáthaid a dháileadh. De réir chomhairle NIAC ba chóir an dara teanndáileog a thabhairt do dhaoine atá 12 nó níos sine atá imdhíon-lagaithe. Ba chóir a deir siad bundáileog trí shnáthaid a thabhairt do pháistí atá idir 5-11 atá imdhíon-lagaithe. Maidir leis an gceathrú snáthaid do dhaoine os cionn 65 is í comhairle NIAC ná go bhfágfaí sé mhí idir an tríú dáileog agus an ceann nua, ach go deir siad bhféadfadh go mbeadh ceithre mhí inmholta i gcásanna áirithe. Dúirt Stephen Donnelly go rabhthas ag súil moltaí NIAC a chur i gcrích “an sciobtha”. Dhéanfaí scagadh anois ar ar cheart vacsaín eile a dháileadh ar dhaoine in aoisghrúpaí eile, a dúirt sé.",
      audioId: "11111",
    },
    activeRecording: "1111",
    createdWithPrompts: false,
  };

  // dummy comment object
  testComment = {
    range: {
      index: 0,
      length: 20,
    },
    text: "lkajdfl;sajflk;sdjf;lkasjfdlskjflk;asjf;ldksjfakljflkdajsd;fj;alksjdfioa;sdjfkasjdfi;lakfjja;sfldjf;lajsdlkfjalksdjfkladsjfaksdjf",
  };

  ngOnInit() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;
    this.commentsList.push(this.testComment);
  }

  /*
   * Initialise quill editor
   */
  onEditorCreated(q: Quill) {
    this.quillEditor = q;
    this.quillEditor.root.setAttribute("spellcheck", "false");
  }

  /**
   * Create a new comment object where the user selects the text,
   * and highlight the text in quill that the comment refers to
   */
  createComment() {
    let range = this.quillEditor.getSelection();

    // default range for entire text, no highlighting applied
    if (!range || range.length === 0) {
      range = { index: 0, length: 0 };
    }

    // creates a new feedback-comment component
    this.commentsList.push({ range: range, text: "" });

    // highlight text in quill
    this.quillEditor.formatText(range.index, range.length, {
      background: "#fff72b",
    });
  }

  /**
   * Create and display a comment button when the user selects a range of text
   * @param event quill on-select event
   */
  showInlineCommentButton(event) {
    let range = this.quillEditor.getSelection();
    if (range && range.length > 0 && event.source == "user") { // don't want to create button when showCommentInQuill() is fired
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
    let commentData = this.commentsList[index];
    this.quillEditor.setSelection( commentData.range.index, commentData.range.length );
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
  deleteComment(indexToDelete: number, comment: FeedbackComment) {
    this.quillEditor.removeFormat(comment.range.index, comment.range.length);
    this.commentsList.splice(indexToDelete, 1);
  }

  /**
   * Save updated comment to the DB
   * @param comment comment to update
   */
  saveComment(comment: FeedbackComment) {
    // TODO: save updated comment to the DB
  }
}
