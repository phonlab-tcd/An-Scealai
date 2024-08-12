import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { TranslationService } from "app/core/services/translation.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { DigitalReaderStoryService } from "app/core/services/dr-story.service";
import { EngagementService } from "app/core/services/engagement.service";
import { RecordingService } from "../../core/services/recording.service";
import { FeedbackCommentService } from "app/core/services/feedback-comment.service";
import { EventType } from "../../core/models/event";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "../../dialogs/basic-dialog/basic-dialog.component";
import { DigitalReaderStory } from "app/core/models/drStory";
import { Router } from "@angular/router";

//import { UserService } from "app/core/services/user.service";

@Component({
  selector: "app-dr-story-drawer",
  templateUrl: "./dr-story-drawer.component.html",
  styleUrls: ["./dr-story-drawer.component.scss"],
})
export class DigitalReaderStoryDrawerComponent implements OnInit {
  stories: DigitalReaderStory[] = [];
  dialogRef: MatDialogRef<unknown>;
  lastClickedStoryId: string = "";
  searchText: string = ""; // used to filter stories in search bar

  //user;

  @Output() drStoryEmitter = new EventEmitter<DigitalReaderStory>();
  @Output() hasFeedback = new EventEmitter<boolean>();
  @Output() titleUpdated = new EventEmitter<string>();
  @Output() storiesLoaded = new EventEmitter<boolean>();
  @Output() isFirstStory = new EventEmitter<boolean>();

  @Input() title = '';
  @Input() storyList = [];
  @Input() user:any;

  constructor(
    public ts: TranslationService,
    private auth: AuthenticationService,
    private drStoryService: DigitalReaderStoryService,
    private router: Router,
    //private userService: UserService,
    private engagement: EngagementService,
    private recordingService: RecordingService,
    private feedbackCommentService: FeedbackCommentService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    //this.getStories();
  }

  /**
   * Get list of stories for the user and emit when done loading
   */
  async getStories() {
    this.stories = (
      await firstValueFrom(this.drStoryService.getDRStoriesForLoggedInUser())
    ).map((storyData) => new DigitalReaderStory().fromJSON(storyData));

    /*if (this.stories.length > 0) {
      this.lastClickedStoryId = this.stories[0]._id;
      // delay seting the currently selected story until the next tick of the event loop
      setTimeout(() => {
        this.setStory(this.stories[0]);
      });
    }*/
    setTimeout(() => {
      this.storiesLoaded.emit(true);
    });
  }

  /**
   * Set the current story to the selected one from the story list
   * @param story Selected story from HTML
   */
  //setStory(story: DigitalReaderStory){}
  openStory(story: DigitalReaderStory){
    this.router.navigateByUrl('dr-story-viewer?storyId=' + story._id)
  }
  /*setStory(story: Story) {
    if (story.htmlText == null) {
      story.htmlText = story.text;
    }
    // emit selected story to dashboard
    this.storyEmitter.emit(story);

    // emit whether or not the story has any feedback
    this.hasFeedback.emit(this.storyHasFeedback(story))

    // set css for selecting a story in the side nav
    let id = story._id;
    let storyElement = document.getElementById(id);

    if (storyElement) {
      // remove css highlighting for currently highlighted story
      if (this.lastClickedStoryId) {
        document.getElementById(this.lastClickedStoryId)?.classList.remove("clickedresultCard");
      }
      this.lastClickedStoryId = id;
      // add css highlighting to the newly clicked story
      storyElement.classList.add("clickedresultCard");
    }
  }*/

  /**
   * Returns true if the story has feedback left from the teacher
   * @param story story selected from list
   * @returns true or false
   */
  /*storyHasFeedback(story: Story): boolean {
    return story.feedback.hasComments || story.feedback.feedbackMarkup != null
  }*/

  /**
   * Create a new story
   */
  createNewStory(){}
  /*createNewStory() {
    this.isFirstStory.emit(this.stories.length == 0);
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

    this.dialogRef.afterClosed().subscribe(async (res: any) => {
      this.dialogRef = undefined;
      console.log(res)
      if (res) {
        if (res[0]) {
          let dialect = "connemara";
          if (res[1] == this.ts.l.munster) dialect = "kerry";
          if (res[1] == this.ts.l.ulster) dialect = "donegal";
          const user = this.auth.getUserDetails();
          if (!user) {
            console.log("Can't save story, current user is null");
            return;
          }
          this.storyService
            .saveStory(res[0], new Date(), dialect, "", user.username, false )
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
  }*/

  /**
   * Open a dialog asking the user if they really want to delte their story
   * Call the function to delete the story if the user clicks 'yes'
   * @param id story id to be deleted
   */
  /*openDeleteStoryDialog(id: string) {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.delete_story,
        message: this.ts.l.are_you_sure_delete_story,
        confirmText: this.ts.l.yes,
        cancelText: this.ts.l.no,
      },
      width: "50vh",
    });

    this.dialogRef.afterClosed().subscribe(async (res: any) => {
      this.dialogRef = undefined;
      if (res) {
        this.deleteStory(id);
      }
    });
  }*/

  /**
   * Delete the given story and any associated recordings
   * Set the new 'current story' => next one in the list, or first one
   * if the last story in the list was deleted
   * @param id story id to be deleted
   */
  /*deleteStory(id: string) {
    // remove any associated recordings
    this.recordingService.deleteStoryRecordingAudio(id).subscribe((_) => {});
    this.recordingService.deleteStoryRecording(id).subscribe((_) => {});

    // remove any associated feedback comments
    this.feedbackCommentService.deleteFeedbackCommentsForStory(id).subscribe((_) => {});

    // get index of story to be deleted within story list
    const storyIndex = this.stories.findIndex((story) => story._id === id);

    // delete the story
    this.storyService.deleteStory(id).subscribe((_) => {
      this.engagement.addEvent(EventType["DELETE-STORY"], { storyId: id });

      // reset the story list to empty if list contains only one story
      // If we have 2+ stories, delete the story for deletion, and set the new current story to the first in the list
      this.stories.splice(storyIndex, 1);
      this.stories.length ? this.setStory(this.stories[0]) : this.storyEmitter.emit();
    });
  }*/

  /**
   * Make the div containing the story title editable so the student can
   * rename their story. Autofocus this editable div after making editable
   * @param divId id of the div for the story title
   */
  /*makeTitleDivEditable(divId: number) {
    console.log(typeof divId)
    const contentEditableDiv = document.getElementById(String(divId)) as HTMLDivElement;
    contentEditableDiv.setAttribute("contenteditable", "true");
    // auto-focus the div for editing, need to use setTimeout so event is applied
    window.setTimeout(() => contentEditableDiv.focus(), 0);
  }*/

  /**
   * Remove the editable attribute from the div containing the story title
   * Save the updated title for the story if changes were made
   * @param divId id of the div for the story title
   */
  saveStoryTitle(divId: number, selectedStory: DigitalReaderStory){}
  /*saveStoryTitle(divId: number, selectedStory: Story) {
    const contentEditableDiv = document.getElementById(String(divId)) as HTMLDivElement;
    if (!contentEditableDiv || !selectedStory) return;
    contentEditableDiv.setAttribute("contenteditable", "false");
    // only update the title if changes have been made
    if (selectedStory.title.trim() != contentEditableDiv!.textContent!.trim()) {
      selectedStory.title = contentEditableDiv.textContent!;
      this.storyService.updateTitle(selectedStory._id, selectedStory.title.trim())
        .subscribe({
          next: () => { this.titleUpdated.emit(selectedStory.title.trim()); },
          error: () => console.log("error updating title"),
        });
    }
  }*/
}
