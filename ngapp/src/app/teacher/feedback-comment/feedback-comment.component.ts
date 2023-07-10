import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslationService } from "app/core/services/translation.service";
import { FeedbackComment } from 'app/core/models/feedbackComment';


@Component({
  selector: 'app-feedback-comment',
  templateUrl: './feedback-comment.component.html',
  styleUrls: ['./feedback-comment.component.scss']
})
export class FeedbackCommentComponent implements OnInit {

  @Input('comment') comment: FeedbackComment;
  @Input('commentIndex') commentIndex: string;
  @Output() deleteEmitter = new EventEmitter();
  @Output() editTextEmitter = new EventEmitter();

  propagateEvent = true;

  constructor(public ts: TranslationService,) { }

  ngOnInit(): void {
  }

  editCommentText() {
    const contentEditableDiv = document.getElementById(this.commentIndex) as HTMLDivElement;
    contentEditableDiv.setAttribute("contenteditable", "true");
    // auto-focus the div for editing, need to use setTimeout so event is applied
    window.setTimeout(() => contentEditableDiv.focus(), 0);
  }

  /**
   * Send edited comment changes to the parent component
   */
  saveCommentText() {
    const contentEditableDiv = document.getElementById(this.commentIndex) as HTMLDivElement;
    contentEditableDiv.setAttribute("contenteditable", "false");
    this.editTextEmitter.next(this.comment.comment);
  }  
}
