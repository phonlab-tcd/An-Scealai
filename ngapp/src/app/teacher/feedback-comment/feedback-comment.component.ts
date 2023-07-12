import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { FeedbackComment } from "app/core/models/feedbackComment";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { RecordAudioService } from "app/core/services/record-audio.service";

@Component({
  selector: "app-feedback-comment",
  templateUrl: "./feedback-comment.component.html",
  styleUrls: ["./feedback-comment.component.scss"],
})
export class FeedbackCommentComponent implements OnInit, AfterViewInit {
  @Input("comment") comment: FeedbackComment;
  @Output() deleteEmitter = new EventEmitter();
  @Output() editTextEmitter = new EventEmitter();

  @ViewChild("commentTextArea", { static: false }) commentTextArea: ElementRef;

  isEditing = true;
  audioSource: SafeUrl;
  isRecording: boolean = false;

  constructor(
    public ts: TranslationService,
    protected sanitizer: DomSanitizer,
    private recordAudioService: RecordAudioService
  ) {}

  ngOnInit(): void {}

  /**
   * Focus the text editor
   */
  ngAfterViewInit(): void {
    this.commentTextArea.nativeElement.focus();
  }

  /**
   * Enable editing and set cursor focus
   */
  editCommentText() {
    this.isEditing = true;
    this.commentTextArea.nativeElement.focus();
  }

  /**
   * Send edited comment changes to the parent component
   * if comment has text
   */
  saveCommentText() {
    if (this.commentTextArea.nativeElement.value.trim().length > 0) {
      this.editTextEmitter.next(this.comment.text);
      this.isEditing = false;
    } else {
      this.deleteComment();
    }
  }

  /**
   * Send delete event to the parent component
   */
  deleteComment() {
    this.deleteEmitter.next(null);
  }

  /**
   * Start or stop recording audio
   */
  async recordFeedbackMessage() {
    if (this.isRecording) {
      this.recordAudioService.stopRecording();
      setTimeout(() => {
        this.audioSource = this.recordAudioService.playbackAudio();
        console.log(this.audioSource);
      }, 500);
    } else {
      this.recordAudioService.recordAudio();
    }
    this.isRecording = !this.isRecording;
  }
}
