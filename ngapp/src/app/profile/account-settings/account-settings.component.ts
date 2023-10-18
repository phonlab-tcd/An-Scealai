import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ClassroomService } from "app/core/services/classroom.service";
import { UntypedFormControl } from "@angular/forms";
import { Classroom } from "app/core/models/classroom";
import { TranslationService } from "app/core/services/translation.service";
import { StoryService } from "app/core/services/story.service";
import { FeedbackCommentService } from "app/core/services/feedback-comment.service";
import { Story } from "app/core/models/story";
import { User } from "app/core/models/user";
import { ProfileService } from "app/core/services/profile.service";
import { MessageService } from "app/core/services/message.service";
import { UserService } from "app/core/services/user.service";
import { RecordingService } from "app/core/services/recording.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "app/dialogs/basic-dialog/basic-dialog.component";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-account-settings",
  templateUrl: "./account-settings.component.html",
  styleUrls: ["./account-settings.component.scss"],
})
export class AccountSettingsComponent implements OnInit {
  classroomCodeOutput: string = "";
  codeInput: UntypedFormControl;
  foundClassroom: Classroom | null = null;
  classroom: Classroom | null = null;
  updatedUsername: string = "";
  errorMessage: string = "";
  newPassword: string = "";
  newPasswordConfirm: string = "";
  dialogRef: MatDialogRef<unknown> | undefined = undefined;
  user: User;
  dialectPreference: string = "";
  dialectPreferences : string[] = [
    "Gaeilge Uladh",
    "Gaeilge Chonnact",
    "Gaolainn na Mumhan",
    "Other"
  ];

  constructor(
    public auth: AuthenticationService,
    private classroomService: ClassroomService,
    public ts: TranslationService,
    public storyService: StoryService,
    public profileService: ProfileService,
    public messageService: MessageService,
    public userService: UserService,
    public recordingService: RecordingService,
    private feedbackCommentService: FeedbackCommentService,
    private dialog: MatDialog
  ) {
      // create new form control for joining a classroom
      this.codeInput = new UntypedFormControl();
  }

  /**
   * Get logged-in user
   * Get possible classroom codes if user is a student
   */
  async ngOnInit() {

    const user = this.auth.getUserDetails();
    if (!user) return;

    // get logged-in user details
    this.user = await firstValueFrom( this.userService.getUserById(user._id) );
    if (!this.user) return;

    // set dialect preference - To be integrated if we want this to be an option
    // this.profileService.getForUser(this.user._id).subscribe({
    //   next: (profile) => {
    //     (<HTMLInputElement>document.getElementById("dialectSelect")).value = profile.profile.dialectPreference;
    //     this.dialectPreference = profile.profile.dialectPreference;
    // }})

    // get possible classroom codes if user is a student
    if (this.user.role === "STUDENT") {
      this.getClassroom();
      this.listenForClassroomCodeInput();
    }
  }

  /**
   * Check if classroom found for input code and return either
   * 'not found' message or the found classroom title
   */
  listenForClassroomCodeInput() {
    this.codeInput.valueChanges.subscribe((code) => {
      if (code.length > 0) {
        this.classroomService.getClassroomFromCode(code).subscribe((res) => {
          if (res.found) {
            this.classroomCodeOutput = "";
            this.foundClassroom = res.classroom;
          } else {
            this.foundClassroom = null;
            this.classroomCodeOutput = res.message;
          }
        });
      } else {
        this.classroomCodeOutput = "";
      }
    });
  }

  /*
   * Join a classroom with a given classroom code
   */
  joinClassroom() {
    this.classroomService.addStudentToClassroom( this.foundClassroom._id, this.user._id ).subscribe((res) => {
      if (res.status === 200) {
        this.classroom = this.foundClassroom;
        this.foundClassroom = null;
      }
    });
  }

  /**
   * Get classroom of student if they have joined one
   */
  getClassroom() {
    this.classroomService.getAllClassrooms().subscribe((res: Classroom[]) => {
      for (let classroom of res) {
        if (classroom.studentIds.includes(this.user._id)) {
          this.classroom = classroom;
        }
      }
    });
  }

  /**
   * Remove studenet from classroom
   */
  leaveClassroom() {
    if (!this.classroom) {
      console.log("Cannot leave classroom, classroom is null");
      return;
    }
 
    this.classroomService.removeStudentFromClassroom(this.classroom._id, this.user._id).subscribe({
      next: () => {
        this.classroom = null;
        this.codeInput = new UntypedFormControl();
        this.listenForClassroomCodeInput();
      },
      error: (err) => {
        console.error("Error trying to leave classroom", err);
      }
    })
  }

  /*
   * Delete user account and all data associated with the user
   */
  async deleteAccount() {
    if (!this.user) {
      console.log("Cannot delete account, user is null");
      return;
    }

    try {
      if (this.user.role === "STUDENT") {
        if (this.classroom) {
          this.leaveClassroom();
        }
  
        this.storyService.getStoriesFor(this.user.username).subscribe((res: Story[]) => {
          for (let story of res) {
            this.recordingService.deleteStoryRecordingAudio(story._id).subscribe({next: () => {console.log('deleted audio')}, error: (err) => {console.error(err)}});
            this.recordingService.deleteStoryRecording(story._id).subscribe({next: () => {console.log('deleted recording object')}, error: (err) => {console.error(err)}})
            this.feedbackCommentService.deleteFeedbackCommentsForStory(story._id).subscribe({next: ()=> {console.log('deleted feedback comments for story')}, error: (err) => {console.error(err)}});
          }
        });
       this.storyService.deleteAllStories(this.user._id).subscribe({next: ()=> {console.log('deleted all stories')}, error: (err) => {console.error(err)}});
      }
  
      if (this.user.role === "TEACHER") {
        this.feedbackCommentService.deleteFeedbackCommentsForOwner(this.user._id).subscribe({next: ()=> {console.log('deleted feedback comments for teacher')}, error: (err) => {console.error(err)}});
        this.classroomService.deleteClassroomsForTeachers(this.user._id).subscribe({next: ()=> {console.log('deleted classrooms')}, error: (err) => {console.error(err)}});
      }
  
      this.messageService.deleteAllMessages(this.user._id).subscribe({next: ()=> {console.log('deleted messages')}, error: (err) => {console.error(err)}});
      this.profileService.deleteProfile(this.user._id).subscribe({next: ()=> {console.log('deleted profile')}, error: (err) => {console.error(err)}});
      this.userService.deleteUser(this.user).subscribe({next: ()=> {console.log('deleted user')}, error: (err) => {console.error(err)}});
      this.auth.logout();
    }
    catch (error) {
      console.error(error);
    }
  }

  /*
   * Update account username and all data associated with it
   */
  async updateUsername() {
    console.log(this.updatedUsername);
    if (!this.updatedUsername) {
      this.errorMessage = this.ts.l.please_input_a_new_username;
      return;
    }

    if (!this.updatedUsername.match("^[A-Za-z0-9]+$")) {
      this.errorMessage = this.ts.l.username_no_special_chars;
      return;
    }

    this.userService.updateUsername(this.user._id, this.updatedUsername).subscribe({
      next: () => { this.auth.logout(); },
      error: (error) => { 
        if (error.error.code == "11000") {
          this.errorMessage = this.ts.l.username_in_use;
          this.updatedUsername = "";
        } else {
          this.errorMessage = "An error occured"; 
        }
      },
    });
  }

  /**
   * Update user password
   */
  updatePassword() {
    if (this.newPassword && this.newPasswordConfirm) {
      if (this.newPassword === this.newPasswordConfirm) {
        if (this.newPassword.length < 5) {
          this.errorMessage = this.ts.l.passwords_5_char_long;
        } else {
          this.errorMessage = "";
          this.userService.updatePassword(this.user._id, this.newPassword).subscribe((_) => {});
          // TODO: is it necessary to log the user out here? If it is, shouldn't we wait for the password update to succeed before logging out?
          this.auth.logout();
        }
      } else {
        this.errorMessage = this.ts.l.passwords_must_match;
      }
    } else {
      this.errorMessage = this.ts.l.please_input_a_new_password_confirm;
    }
  }

  openUpdateUsernameDialog() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.change_username,
        message: this.ts.l.you_will_have_to_login,
        type: "updatUsername",
        confirmText: this.ts.l.save,
        cancelText: this.ts.l.cancel,
      },
      width: "50vh",
    });

    this.dialogRef.afterClosed().subscribe((res) => {
      this.dialogRef = undefined;
      this.errorMessage = "";
      if (res) {
        this.updatedUsername = res[0];
        this.updateUsername();
      }
    });
  }

  openDeleteDialog() {
    const userDetails = this.auth.getUserDetails();
    if(!userDetails) return;
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.are_you_sure,
        message:
          userDetails.role === "STUDENT"
            ? this.ts.l.this_includes_story_data
            : this.ts.l.this_includes_personal_data,
        type: "",
        confirmText: this.ts.l.yes,
        cancelText: this.ts.l.no,
      },
      width: "50vh",
    });

    this.dialogRef.afterClosed().subscribe((res) => {
      this.dialogRef = undefined;
      if (res) {
        this.deleteAccount();
      }
    });
  }

  openUpdatePasswordDialog() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.change_password,
        message: this.ts.l.you_will_have_to_login_password,
        type: "updatePassword",
        confirmText: this.ts.l.save,
        cancelText: this.ts.l.cancel,
      },
      width: "50vh",
    });

    this.dialogRef.afterClosed().subscribe((res) => {
      this.dialogRef = undefined;
      this.errorMessage = "";
      if (res) {
        this.newPassword = res[0];
        this.newPasswordConfirm = res[1];
        this.updatePassword();
      }
    });
  }

  openLeaveClassroomDialog() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.leave_classroom,
        message: this.ts.l.are_you_sure_leave_classroom,
        confirmText: this.ts.l.leave,
        cancelText: this.ts.l.cancel,
      },
      width: "50vh",
    });

    this.dialogRef.afterClosed().subscribe((res) => {
      this.dialogRef = undefined;
      this.errorMessage = "";
      if (res) {
        this.classroomCodeOutput = "";
        this.leaveClassroom();
      }
    });
  }
}
