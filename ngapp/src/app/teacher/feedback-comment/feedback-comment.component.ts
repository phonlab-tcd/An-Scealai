import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { FeedbackComment } from "app/core/models/feedbackComment";

@Component({
  selector: "app-feedback-comment",
  templateUrl: "./feedback-comment.component.html",
  styleUrls: ["./feedback-comment.component.scss"],
})
export class FeedbackCommentComponent implements OnInit, AfterViewInit {
  @Input("comment") comment: FeedbackComment;
  @Output() deleteEmitter = new EventEmitter();
  @Output() editTextEmitter = new EventEmitter();

  @ViewChild("commentIndex", { static: false }) commentTextElement: ElementRef;

  isEditing = true;

  constructor(public ts: TranslationService) {}

  ngOnInit(): void {
  }

  /**
   * Focus the text editor
   */
  ngAfterViewInit(): void {
    this.commentTextElement.nativeElement.focus();
  }

  /**
   * Enable editing and set cursor focus
   */
  editCommentText() {
    this.isEditing = true;
    this.commentTextElement.nativeElement.focus();
  }

  /**
   * Send edited comment changes to the parent component
   * if comment has text
   */
  saveCommentText() {
    if (this.commentTextElement.nativeElement.value.trim().length > 0) {
      this.editTextEmitter.next(this.comment.text);
      this.isEditing = false;
    }
    else {
      this.deleteComment();
    }
  }

  deleteComment() {
    this.deleteEmitter.next(null)
  }
}
