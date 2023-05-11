import { Component, OnInit } from "@angular/core";
import { ClassroomService } from "app/core/services/classroom.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { Classroom } from "../../core/models/classroom";
import { Router } from "@angular/router";
import { TranslationService } from "app/core/services/translation.service";
import { NotificationService } from "app/core/services/notification-service.service";
import { ProfileService } from "app/core/services/profile.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "../../dialogs/basic-dialog/basic-dialog.component";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-teacher-dashboard",
  templateUrl: "./teacher-dashboard.component.html",
  styleUrls: ["./teacher-dashboard.component.scss"],
})
export class TeacherDashboardComponent implements OnInit {
  constructor(
    private classroom: ClassroomService,
    public auth: AuthenticationService,
    private router: Router,
    public ts: TranslationService,
    public notificationService: NotificationService,
    private dialog: MatDialog,
    private profileService: ProfileService
  ) {}

  classrooms: Classroom[];
  newClassroom: Classroom = new Classroom();
  dialogRef: MatDialogRef<unknown>;

  /**
   * Redirect user to profile page if profile not filled out
   * Get classrooms for teacher and set any notifications
   */
  async ngOnInit() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) {
      this.auth.logout();
      return;
    }

    this.profileService.getForUser(this.auth.getUserDetails).subscribe({
      next: () => {},
      error: () => {console.log('no profile'); this.router.navigateByUrl("/register-profile");}
   });

    this.getClassrooms(userDetails._id);
    this.notificationService.getTeacherNotifications();
  }

  /**
   * Get classrooms for teacher and sort alphabetically
   * @param userDetails
   */
  async getClassrooms(teacherId) {
    this.classrooms = await firstValueFrom( this.classroom.getClassroomsForTeacher(teacherId) );
    console.log(this.classrooms);
    this.classrooms.sort((a, b) => (a.title < b.title ? -1 : 1));
  }

  /**
   * Route to given classroom
   * @param id classroom id
   */
  goToClassroom(id: string) {
    this.router.navigateByUrl("teacher/classroom/" + id);
  }

  /**
   * Generate a new code and create a new classroom
   */
  async createNewClassroom() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    this.newClassroom.teacherId = userDetails._id;
    this.newClassroom.date = new Date();

    let codes = await firstValueFrom(this.classroom.getAllCodes());
    let newCode: string = this.getUniqueCode(codes);
    this.newClassroom.code = newCode;

    this.classroom.createClassroom(this.newClassroom).subscribe(
      (_) => {
        this.getClassrooms(userDetails._id);
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  /**
   * Generate a new classroom code
   * @param codes string of all classrooms codes
   * @returns new code
   */
  getUniqueCode(codes: string[]): string {
    let potentialCode: string = this.classroom.generateCode();
    while (codes.includes(potentialCode)) {
      potentialCode = this.classroom.generateCode();
    }
    return potentialCode;
  }

  /**
   * Open a new dialog box for creating a new classroom
   */
  openCreateClassroomDialog() {
    this.newClassroom.title = null;
    if (this.newClassroom) {
      this.dialogRef = this.dialog.open(BasicDialogComponent, {
        data: {
          title: this.ts.l.add_new_classroom,
          message: this.ts.l.enter_title,
          type: "updateText",
          confirmText: this.ts.l.create,
          cancelText: this.ts.l.cancel,
        },
        width: "50vh",
      });

      this.dialogRef.afterClosed().subscribe((res) => {
        this.dialogRef = undefined;
        if (res) {
          this.newClassroom.title = res[0];
          this.createNewClassroom();
        }
      });
    }
  }
}
