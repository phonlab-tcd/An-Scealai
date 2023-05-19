import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { StoryService } from "app/core/services/story.service";
import { EngagementService } from "app/core/services/engagement.service";
import { NotificationService } from "app/core/services/notification-service.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Story } from "app/core/models/story";
import { EventType } from "app/core/models/event";

@Component({
  selector: "app-feedback-drawer",
  templateUrl: "./feedback-drawer.component.html",
  styleUrls: ["./feedback-drawer.component.scss"],
})
export class FeedbackDrawerComponent implements OnInit {
  @Output() closeFeedbackEmitter = new EventEmitter();
  @Input() story: Story;
  audioSource: SafeUrl;

  constructor(
    protected ts: TranslationService,
    protected sanitizer: DomSanitizer,
    private storyService: StoryService,
    private engagement: EngagementService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: any) {
    if (
      this.story &&
      (this.story.feedback.text ||
      this.story.feedback.audioId ||
      this.story.feedback.feedbackMarkup)
    ) {
      this.getFeedback();
    }
  }

  /* Get audio feedback with function call
   * Set feedback status to seen by student
   * Update feedback notifications
   * Add logged event for viewed feedback
   */
  getFeedback() {
    if (this.story.feedback.audioId) {
      this.getFeedbackAudio();
    }

    // set feedback status to seen by student
    if (this.story.feedback.text !== "") {
      this.story.feedback.seenByStudent = true;
    }

    // add event log to DB and update notifications
    this.storyService.viewFeedback(this.story._id).subscribe(() => {
      this.engagement.addEventForLoggedInUser( EventType["VIEW-FEEDBACK"], this.story );
      this.notificationService.getStudentNotifications();
    });
  }

  /* Set the url for the audio source feedback */
  getFeedbackAudio() {
    this.storyService.getFeedbackAudio(this.story._id).subscribe((res) => {
      this.audioSource = this.sanitizer.bypassSecurityTrustUrl( URL.createObjectURL(res) );
      console.log(this.audioSource);
    });
  }
}
