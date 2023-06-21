import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { SafeUrl } from "@angular/platform-browser";
import { firstValueFrom, Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { TranslationService } from "app/core/services/translation.service";
import Quill from "quill";
import ImageCompress from "quill-image-compress";
import {clone, isEmpty} from "lodash";
import config from "abairconfig";
import { AuthenticationService } from "app/core/services/authentication.service";
import { StoryService } from "app/core/services/story.service";
import { ClassroomService } from "app/core/services/classroom.service";
import { EngagementService } from "app/core/services/engagement.service";
import { RecordAudioService } from "app/core/services/record-audio.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "../../dialogs/basic-dialog/basic-dialog.component";
import { Story } from "app/core/models/story";
import { Classroom } from "../../core/models/classroom";
import { EventType } from "app/core/models/event";
import { MatDrawer } from "@angular/material/sidenav";

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent implements OnInit {

  showOptions = true;
  dontToggle = false;
  feedbackVisibile: false;
  @ViewChild("rightDrawer") rightDrawer: MatDrawer;
  rightDrawerOpened: boolean = false;
  selectedDrawer: "grammar" | "dictionary" | "feedback" = "grammar";
  story = null;
  storiesLoaded: boolean = true;
  classrooms: Classroom[];
  classroom: Classroom;
  updatedTitle: string = "";
  classroomsLoaded: boolean = true;
  dialogRef: MatDialogRef<unknown>;

  constructor(
    public ts: TranslationService,
    private auth: AuthenticationService,
    private storyService: StoryService,
    private classroomService: ClassroomService,
    private recordAudioService: RecordAudioService,
    private engagement: EngagementService,
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
  ) {}

  /**
   * Redirect user to profile page if profile not filled out
   * Get classrooms for teacher and set any notifications
   */
  async ngOnInit() {
  }




    /**
   * Toggles the right drawer open/closed
   * Drawer content is set by 'selectedDrawer' variable which is determined in the HTML
   * Hides/shows the grammar highlighting if the grammar drawer is selected
   * @param selectedContent Indicates which component to be injected into the drawer
   */
    toggleRightDrawer(selectedDrawer: 'dictionary' | 'grammar' | 'feedback') {
      if (this.rightDrawerOpened) {
        // close the drawer if the same button has been pressed (i.e. the user clicked 'dictionary'
        // once to open the dictionary, and clicked 'dictionary' again to close the drawer
        // otherwise the drawer stays open and the content changes to whichever other button the user clicked
        // (i.e. if the user clicked 'dictionary' and then 'grammar check', the drawer doesn't close but content is updated)
        if (this.selectedDrawer === selectedDrawer) {
          this.rightDrawer.close();
          this.rightDrawerOpened = false;
        } 
      } else {
        // open the drawer
        this.rightDrawer.open();
        this.rightDrawerOpened = true;
      }
  
      // sets the variable used to display the selected component in the drawer
      this.selectedDrawer = selectedDrawer;
  
      // shows/hides the grammar errors if grammar drawer is selected
      if (this.selectedDrawer == "grammar" && this.rightDrawerOpened) {
        // this.showErrorTags = true;
        // this.runGrammarCheck();
        // this.toggleGrammarTags();
      } else {
        // this.showErrorTags = false;
        // this.toggleGrammarTags();
      }
    }

      /* Toggle upper menu buttons */
  toggleOptions() {
    if (!this.dontToggle) {
      this.showOptions = !this.showOptions;
    }
    this.dontToggle = false;
  }

  /**
   * Set the current story displayed and calculate word count
   * @param story Story selected from the story drawer
   */
  setCurrentClassroom(classroom: Classroom) {
    this.classroom = classroom;
    if (!this.classroom) return;
    this.updatedTitle = this.classroom.title;
  }

    /**
   * Update the classroom title (called from HTML blur() function)
   */
    updateClassroomTitle() {
      if (this.updatedTitle != this.classroom.title) {
        this.classroom.title = this.updatedTitle;
        this.classroomService.editTitle(this.classroom._id, this.classroom.title).subscribe({
          next: () => { console.log("title updated"); },
          error: () => { alert("Not able to save new classroom title"); },
        });
      }
    }

    /**
     * Open the dialog displaying the current classroom's code
     */
    openCodeDialog() {    
      this.dialogRef = this.dialog.open(BasicDialogComponent, {
        data: {
          title: this.ts.l.classroom_code,
          type: 'classCode',
          data: this.classroom.code,
          confirmText: this.ts.l.done,
        },
        width: '15vh',
      });
      
      this.dialogRef.afterClosed().subscribe( () => this.dialogRef = undefined);
    }

    goToMessages() {
      this.router.navigateByUrl('/messages/' + this.classroom._id);
    }
    
    goToStats() {
      this.router.navigateByUrl('/stats-dashboard/' + this.classroom._id);
    }
    
    goToSettings() {
      this.router.navigateByUrl('/teacher/teacher-settings/' + this.classroom._id);
    }
  
    goToDictogloss() {
      this.router.navigateByUrl('/teacher/teacher-dictogloss/' + this.classroom._id);
    }
    

}
