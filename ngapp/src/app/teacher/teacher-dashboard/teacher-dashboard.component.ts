import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslationService } from "app/core/services/translation.service";
import { ClassroomService } from "app/core/services/classroom.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "../../dialogs/basic-dialog/basic-dialog.component";
import { Classroom } from "../../core/models/classroom";

@Component({
  selector: "app-teacher-dashboard",
  templateUrl: "./teacher-dashboard.component.html",
  styleUrls: ["./teacher-dashboard.component.scss"],
})
export class TeacherDashboardComponent implements OnInit {
  showOptions = true;
  dontToggle = false;
  classrooms: Classroom[];
  classroom: Classroom;
  updatedTitle: string = "";
  classroomsLoaded: boolean = true;
  dialogRef: MatDialogRef<unknown>;

  constructor(
    public ts: TranslationService,
    private classroomService: ClassroomService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  async ngOnInit() {}

  /* Toggle upper menu buttons */
  toggleOptions() {
    if (!this.dontToggle) {
      this.showOptions = !this.showOptions;
    }
    this.dontToggle = false;
  }

  /**
   * Set the current classroom displayed in the main window
   * @param classroom Classroom selected from the classroom drawer
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
      this.classroomService
        .editTitle(this.classroom._id, this.classroom.title)
        .subscribe({
          next: () => {
            console.log("title updated");
          },
          error: () => {
            alert("Not able to save new classroom title");
          },
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
        type: "classCode",
        data: this.classroom.code,
        confirmText: this.ts.l.done,
      },
      width: "15vh",
    });

    this.dialogRef.afterClosed().subscribe(() => (this.dialogRef = undefined));
  }

  goToMessages() {
    this.router.navigateByUrl("/messages/" + this.classroom._id);
  }

  goToStats() {
    this.router.navigateByUrl("/stats-dashboard/" + this.classroom._id);
  }

  goToSettings() {
    this.router.navigateByUrl(
      "/teacher/teacher-settings/" + this.classroom._id
    );
  }

  goToDictogloss() {
    this.router.navigateByUrl(
      "/teacher/teacher-dictogloss/" + this.classroom._id
    );
  }
}
