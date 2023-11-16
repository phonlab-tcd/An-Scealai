import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { TranslationService } from "app/core/services/translation.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ClassroomService } from "app/core/services/classroom.service";
import { NotificationService } from "app/core/services/notification-service.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "../../dialogs/basic-dialog/basic-dialog.component";
import { Classroom } from "app/core/models/classroom";
import { EventType } from "app/core/models/event";
import { EngagementService } from "app/core/services/engagement.service";

@Component({
  selector: "app-classroom-drawer",
  templateUrl: "./classroom-drawer.component.html",
  styleUrls: ["./classroom-drawer.component.scss"],
})
export class ClassroomDrawerComponent implements OnInit {
  classrooms: Classroom[] = [];
  dialogRef: MatDialogRef<unknown> | undefined;
  lastClickedClassroomId: string = "";
  searchText: string = ""; // used to filter classrooms in search bar
  @Output() classroomEmitter = new EventEmitter<Classroom>();
  @Output() titleUpdated = new EventEmitter<string>();
  @Output() classroomsLoaded = new EventEmitter<boolean>();

  constructor(
    public ts: TranslationService,
    private auth: AuthenticationService,
    private classroomService: ClassroomService,
    public notificationService: NotificationService,
    private dialog: MatDialog,
    private engagement: EngagementService
  ) {}

  /**
   * Get list of classrooms and set any notifications
   */
  ngOnInit() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) {
      this.auth.logout();
      return;
    }

    this.getClassrooms(userDetails._id);
    this.notificationService.getTeacherNotifications();
  }

  /**
   * Get classrooms for teacher and sort alphabetically
   * Set the current classroom to the first in the list
   * @param teacherId
   */
  async getClassrooms(teacherId: string) {
    this.classrooms = await firstValueFrom( this.classroomService.getClassroomsForTeacher(teacherId) );

    if (this.classrooms.length > 0) {
      this.classrooms.sort((a, b) => (a.date > b.date ? -1 : 1));
      this.lastClickedClassroomId = this.classrooms[0]._id;
      // delay seting the currently selected classroom until the next tick of the event loop
      setTimeout(() => {
        this.setClassroom(this.classrooms[0]);
      });
    }
    this.classroomsLoaded.emit(true);
  }

  /**
   * Set the current classroom to the selected one from the classroom list
   * @param classroom Selected classroom from HTML
   */
  setClassroom(classroom: Classroom) {
    // emit selected classroom to dashboard
    this.classroomEmitter.emit(classroom);

    // set css for selecting a classroom in the side nav
    let id = classroom._id;
    let classroomElement = document.getElementById(id);

    if (classroomElement) {
      // remove css highlighting for currently highlighted classroom
      if (this.lastClickedClassroomId) {
        document.getElementById(this.lastClickedClassroomId)?.classList.remove("clickedresultCard");
      }
      this.lastClickedClassroomId = id;
      // add css highlighting to the newly clicked classroom
      classroomElement.classList.add("clickedresultCard");
    }
  }

  /**
   * Create a new classroom
   */
  createNewClassroom() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.add_new_classroom,
        type: "updateText",
        confirmText: this.ts.l.create,
        cancelText: this.ts.l.cancel,
      },
      width: "50vh",
    });

    this.dialogRef.afterClosed().subscribe(async (res) => {
      this.dialogRef = undefined;
      if (res) {
        const userDetails = this.auth.getUserDetails();
        if (!userDetails) return;

        let newClassroom = new Classroom();

        newClassroom.title = res[0];
        newClassroom.teacherId = userDetails._id;
        newClassroom.date = new Date();

        let codes = await firstValueFrom(this.classroomService.getAllCodes());
        let newCode: string = this.getUniqueCode(codes);
        newClassroom.code = newCode;

        this.classroomService.createClassroom(newClassroom).subscribe({
          next: () => { this.getClassrooms(userDetails._id); },
          error: () => { alert("Not able to create a new classroom"); },
        });
      }
    });
  }

  /**
   * Generate a new classroom code
   * @param codes string of all classrooms codes
   * @returns new code
   */
  getUniqueCode(codes: string[]): string {
    let potentialCode: string = this.classroomService.generateCode();
    while (codes.includes(potentialCode)) {
      potentialCode = this.classroomService.generateCode();
    }
    return potentialCode;
  }

  /**
   * Open a dialog asking the user if they really want to delte their classroom
   * Call the function to delete the classroom if the user clicks 'yes'
   * @param id classroom id to be deleted
   */
  openDeleteClassroomDialog(id: string) {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.sure_you_want_to_delete_code,
        type: "simpleConfirm",
        confirmText: this.ts.l.delete,
        cancelText: this.ts.l.cancel,
      },
      width: "50vh",
    });

    this.dialogRef.afterClosed().subscribe((res) => {
      this.dialogRef = undefined;
      if (res) {
        this.deleteClassroom(id);
      }
    });
  }

  /**
   * Delete the given classroom and any associated data
   * Set the new 'current classroom' => next one in the list, or first one
   * if the last classroom in the list was deleted
   * @param id classroom id to be deleted
   */
  deleteClassroom(id: string) {
    // get index of classroom to be deleted within classroom list
    const classroomIndex = this.classrooms.findIndex( (classroom) => classroom._id === id );

    // delete the classroom
    this.classroomService.deleteClassroom(id).subscribe((_) => {
      this.engagement.addEventForLoggedInUser(EventType["DELETE-CLASSROOM"], { classroomId: id });

      // reset the classroom list to empty if list contains only one classroom
      // If we have 2+ classrooms, delete the classroom for deletion, and set the new current classroom to the first in the list
      this.classrooms.splice(classroomIndex, 1);
      this.classrooms.length
        ? this.setClassroom(this.classrooms[0])
        : this.classroomEmitter.emit();
    });
  }

  /**
   * Make the div containing the classroom title editable so the student can
   * rename their classroom. Autofocus this editable div after making editable
   * @param divId id of the div for the classroom title
   */
  makeTitleDivEditable(divId: number) {
    const contentEditableDiv = document.getElementById(String(divId)) as HTMLDivElement;
    contentEditableDiv.setAttribute("contenteditable", "true");
    // auto-focus the div for editing, need to use setTimeout so event is applied
    window.setTimeout(() => contentEditableDiv.focus(), 0);
  }

  /**
   * Remove the editable attribute from the div containing the classroom title
   * Save the updated title for the classroom if changes were made
   * @param divId id of the div for the classroom title
   */
  saveClassroomTitle(divId: number, selectedClassroom: Classroom) {
    const contentEditableDiv = document.getElementById(String(divId)) as HTMLDivElement;
    contentEditableDiv.setAttribute("contenteditable", "false");
    if (!contentEditableDiv || !selectedClassroom) return;
    // only update the title if changes have been made
    if (
      selectedClassroom.title.trim() != contentEditableDiv!.textContent!.trim()
    ) {
      selectedClassroom.title = contentEditableDiv.textContent!;

      this.classroomService.editTitle(selectedClassroom._id, selectedClassroom.title.trim()).subscribe({
        next: () => { this.ngOnInit(); },
        error: () => { alert("Not able to save new classroom title"); },
      });
    }
  }
}
