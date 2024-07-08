import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { StoryService } from "app/core/services/story.service";
import { EngagementService } from "app/core/services/engagement.service";
import { NotificationService } from "app/core/services/notification-service.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Story } from "app/core/models/story";
import { EventType } from "app/core/models/event";

@Component({
  selector: "app-bat-mirialta-drawer",
  templateUrl: "./bat-mirialta-drawer.component.html",
  styleUrls: ["./bat-mirialta-drawer.component.scss"],
})
export class BatMirialtaDrawerComponent implements OnInit {
  @Output() closeEmitter = new EventEmitter();
  @Input() story: Story;
  @Input() hasBatmirialta: boolean;
  audioSource: SafeUrl | null = null;

  constructor(
    protected ts: TranslationService,
    protected sanitizer: DomSanitizer,
    private storyService: StoryService,
    private engagement: EngagementService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: any) {
    if (!this.hasBatmirialta) {
      this.closeEmitter.next(true)
    }
  }
}
