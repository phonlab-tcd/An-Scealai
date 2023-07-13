import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { FeedbackComment } from "app/core/models/feedbackComment";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { RecordAudioService } from "app/core/services/record-audio.service";
import { FeedbackCommentService } from "app/core/services/feedback-comment.service";

@Component({
  selector: "app-feedback-comment",
  templateUrl: "./feedback-comment.component.html",
  styleUrls: ["./feedback-comment.component.scss"],
})
export class FeedbackCommentComponent implements OnInit, AfterViewInit {
  @Input("comment") comment: FeedbackComment;
  @Output() deleteEmitter = new EventEmitter();

  @ViewChild("commentTextArea", { static: false }) commentTextArea: ElementRef;

  isEditing = true;
  audioSource: SafeUrl;
  isRecording: boolean = false;

  constructor(
    public ts: TranslationService,
    protected sanitizer: DomSanitizer,
    private recordAudioService: RecordAudioService,
    private feedbackCommentService: FeedbackCommentService
  ) {}

  ngOnInit(): void {}

  /**
   * Focus the text editor if new comment
   * Show text/audio data for existing comment
   */
  ngAfterViewInit(): void {
    if (!this.comment.text && !this.comment.audioId) {
      this.isEditing = true;
      this.commentTextArea.nativeElement.focus();
    } else {
      this.isEditing = false;
      if (this.comment.audioId) {
        this.feedbackCommentService.getAudioFeedback(this.comment.audioId).subscribe({
          next: (res) => {
            if (res.type == "audio/mp3") {
              this.audioSource = this.sanitizer.bypassSecurityTrustUrl( URL.createObjectURL(res) );
            }
          },
        });
      }
    }
    this.adjustTextAreaHeight();
  }

  /**
   * Enable editing and set cursor focus
   */
  editComment() {
    this.isEditing = true;
    this.commentTextArea.nativeElement.focus();
  }

  /**
   * Save comment to DB
   */
  saveComment() {
    if (this.comment.text || this.audioSource) {
      this.isEditing = false;
      // save audio data
      if (this.audioSource) {
        let audioBlob = this.recordAudioService.getAudioBlob();
        if (audioBlob) {
          this.feedbackCommentService.addAudioFeedback(this.comment._id, audioBlob).subscribe({
            next: () => {},
            error: () => {},
          });
        }
      }
      // save rest of the data
      this.feedbackCommentService.updateFeedbackComment(this.comment).subscribe({
        next: () => { this.adjustTextAreaHeight(); },
      });
    } else {
      this.deleteComment();
    }
  }

  /**
   * Set textarea height depending on text length, with max height of 100px
   */
  adjustTextAreaHeight() {
    this.commentTextArea.nativeElement.style.height = `${Math.min(this.commentTextArea.nativeElement.scrollHeight, 100)}px`;
  }

  /**
   * Delete comment (and any associated audio)
   */
  deleteComment() {
    this.feedbackCommentService.deleteFeedbackComment(this.comment._id).subscribe({
      next: () => { this.deleteEmitter.next(null); },
      error: () => { },
    });
  }

  /**
   * Start or stop recording audio
   */
  async recordFeedbackMessage() {
    if (this.isRecording) {
      this.recordAudioService.stopRecording();
      setTimeout(() => {
        this.audioSource = this.recordAudioService.playbackAudio();
      }, 500);
    } else {
      this.recordAudioService.recordAudio();
      this.isEditing = true;
    }
    this.isRecording = !this.isRecording;
  }
}
