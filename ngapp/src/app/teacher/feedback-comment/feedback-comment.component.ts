import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { FeedbackComment } from "app/core/models/feedbackComment";

@Component({
  selector: "app-feedback-comment",
  templateUrl: "./feedback-comment.component.html",
  styleUrls: ["./feedback-comment.component.scss"],
})
export class FeedbackCommentComponent implements OnInit {
  @Input("comment") comment: FeedbackComment;
  @Input("commentIndex") commentIndex: string;
  @Output() deleteEmitter = new EventEmitter();
  @Output() editTextEmitter = new EventEmitter();

  @ViewChild("commentIndex", { static: false }) commentTextElement: ElementRef;

  isEditing = false;

  constructor(public ts: TranslationService) {}

  ngOnInit(): void {
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
   */
  saveCommentText() {
    this.editTextEmitter.next(this.comment.comment);
    this.isEditing = false;
  }
}
