import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { TranslationService } from "app/core/services/translation.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { StoryService } from "app/core/services/story.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "../../dialogs/basic-dialog/basic-dialog.component";
import { Story, StoryMetaData } from "app/core/models/story";

@Component({
  selector: "app-story-drawer",
  templateUrl: "./story-drawer.component.html",
  styleUrls: ["./story-drawer.component.scss"],
})
export class StoryDrawerComponent implements OnInit {
  // stories: Story[] = [];
  storiesMetaData: StoryMetaData[] = [];
  dialogRef: MatDialogRef<unknown>;
  lastClickedStoryId: string = "";
  @Output() storySelectionEmitter = new EventEmitter<StoryMetaData>();
  @Output() hasFeedback = new EventEmitter<Boolean>();
  @Output() storiesMetaDataLoadedEmitter = new EventEmitter<Boolean>();

  constructor(
    public ts: TranslationService,
    private auth: AuthenticationService,
    private storyService: StoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getStories();
  }

  /**
   * Get list of stories for the user and emit when done loading
   */
  async getStories() {
    this.storiesMetaData = (await firstValueFrom(this.storyService.getStoriesMetaDataForLoggedInUser()))
      .map(function (storyData) { return new StoryMetaData().fromJSON(storyData) });

    if (this.storiesMetaData.length > 0) {
      this.storiesMetaData.sort((a, b) => (a.date > b.date ? -1 : 1));
      this.setStory(this.storiesMetaData[0]);
      this.storiesMetaDataLoadedEmitter.emit(true);
    }
  }

  /**
   * Set the current story to the selected one from the story list
   * @param story Selected story from HTML
   */
  setStory(story: StoryMetaData) {
    // if (story.htmlText == null) {
    //   story.htmlText = story.text;
    // }
    // emit selected story to dashboard
    this.storySelectionEmitter.emit(story);

    // emit whether or not the story has any feedback
    story.feedback.text ||
    story.feedback.audioId ||
    story.feedback.feedbackMarkup
      ? this.hasFeedback.emit(true)
      : this.hasFeedback.emit(false);

    // set css for selecting a story in the side nav
    let id = story._id;
    let storyElement = document.getElementById(id);
    if (storyElement) {
      // remove css highlighting for currently highlighted recording (from archive)
      if (this.lastClickedStoryId) {
        document.getElementById(this.lastClickedStoryId).classList.remove("clickedresultCard");
      }
      this.lastClickedStoryId = id;
      // add css highlighting to the newly clicked recording
      storyElement.classList.add("clickedresultCard");
    }
  }

  /**
   * Create a new story
   */
  createNewStory() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.story_details,
        type: "select",
        data: [
          this.ts.l.enter_title,
          [this.ts.l.connacht, this.ts.l.munster, this.ts.l.ulster],
          [this.ts.l.title, this.ts.l.dialect],
        ],
        confirmText: this.ts.l.save_details,
        cancelText: this.ts.l.cancel,
      },
      width: "50vh",
    });

    this.dialogRef.afterClosed().subscribe(async (res) => {
      this.dialogRef = undefined;
      if (res) {
        if (res[0]) {
          let dialect = "connemara";
          if (res[1] == this.ts.l.munster) dialect = "kerry";
          if (res[1] == this.ts.l.ulster) dialect = "donegal";
          this.storyService
            .saveStory( this.auth.getUserDetails()._id, res[0], new Date(), dialect, "", this.auth.getUserDetails().username, false )
            .subscribe({
              next: () => {
                this.getStories();
              },
              error: () => {
                alert("Not able to create a new story");
              },
            });
        } else {
          alert(this.ts.l.title_required);
        }
      }
    });
  }
}
