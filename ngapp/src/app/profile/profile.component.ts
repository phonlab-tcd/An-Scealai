import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { ClassroomService } from '../classroom.service';
import { UntypedFormControl } from '@angular/forms';
import { Classroom } from '../core/models/classroom';
import { EngagementService } from '../engagement.service';
import { EventType } from '../core/models/event';
import { TranslationService } from '../translation.service';
import { StoryService } from '../story.service';
import { Story } from '../core/models/story';
import { ProfileService } from '../profile.service';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';
import { RecordingService } from '../recording.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasicDialogComponent } from '../dialogs/basic-dialog/basic-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  classroomCodeOutput: string;
  codeInput : UntypedFormControl;
  foundClassroom: Classroom;
  classroom: Classroom;
  updatedUsername: string;
  errorMessage = '';
  newPassword: string;
  newPasswordConfirm: string;
  dialogRef: MatDialogRef<unknown>;

  constructor(public auth: AuthenticationService,
              private classroomService: ClassroomService,
              private engagement: EngagementService,
              public ts: TranslationService,
              public storyService: StoryService,
              public profileService: ProfileService,
              public messageService: MessageService,
              public userService: UserService,
              public recordingService: RecordingService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.codeInput = new UntypedFormControl();
    this.getClassroom();
    this.codeInput.valueChanges.subscribe(
      (code) => {
        if (code.length > 0) {
          this.classroomService.getClassroomFromCode(code).subscribe(
            (res) => {
              if (res.found) {
                this.classroomCodeOutput = null;
                this.foundClassroom = res.classroom;
              } else {
                this.foundClassroom = null;
                this.classroomCodeOutput = res.message;
              }
            });
        } else {
          this.classroomCodeOutput = null;
        }
      });
  }

/*
* Join a classroom with a given classroom code
*/
  joinClassroom() {
    this.classroomService.addStudentToClassroom(this.foundClassroom._id, this.auth.getUserDetails()._id).subscribe((res) => {
      if (res.status === 200) {
        this.classroom = this.foundClassroom;
        this.foundClassroom = null;
      }
    });
  }

  getClassroom() {
    this.classroomService.getAllClassrooms().subscribe((res : Classroom[]) => {
      for(let classroom of res) {
        if(classroom.studentIds.includes(this.auth.getUserDetails()._id)) {
          this.classroom = classroom;
        }
      }
    });
  }

  leaveClassroom() {
    this.classroomService.removeStudentFromClassroom(this.classroom._id, this.auth.getUserDetails()._id).subscribe((_) => {
      this.classroom = null;
    });
  }

  logout() {
    this.engagement.addEventForLoggedInUser(EventType.LOGOUT);
    this.auth.logout();
  }

  /*
   * Delete user account and all data associated with the user
   */
  deleteAccount() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) {
      return;
    }

    if (userDetails.role === "STUDENT") {
      if (this.classroom) {
        this.leaveClassroom();
      }

      this.storyService.getStoriesFor(userDetails.username).subscribe( (res: Story[]) => {
        for(let story of res) {
          this.recordingService.deleteStoryRecordingAudio(story._id).subscribe((_) => {});
          this.recordingService.deleteStoryRecording(story._id).subscribe( (_) => {
          })
        }
      });
      
      this.storyService.deleteAllStories(userDetails._id).subscribe( (_) => {});

    }
    
    if(userDetails.role === "TEACHER") {
      this.classroomService.deleteClassroomsForTeachers(userDetails._id).subscribe( (_) => {});
    }
    
    this.messageService.deleteAllMessages(userDetails._id).subscribe( (_) => {});  
    this.profileService.deleteProfile(userDetails._id).subscribe( (_) => {});
    this.userService.deleteUser(userDetails._id).subscribe( (_) => {});
    this.auth.logout();
  }
  
  /*
  * Update account username and all data associated with it
  */
  async updateUsername() {
    console.log(this.updatedUsername)
    if (!this.updatedUsername){
      this.errorMessage = this.ts.l.please_input_a_new_username;
      return
    }
    
    if (!this.updatedUsername.match('^[A-Za-z0-9]+$')) {
      this.errorMessage = this.ts.l.username_no_special_chars;
      return;
    }
    
    const studentsWithThisUsername = await this.userService.getUserByUsername(this.updatedUsername).toPromise();
    
    if (studentsWithThisUsername.length > 0) {
      this.errorMessage = this.ts.l.username_in_use;
      this.updatedUsername = "";
      return
    }

    await this.userService.updateUsername(this.auth.getUserDetails()._id, this.updatedUsername).toPromise()
    this.auth.logout();
  }

  updatePassword() {
    if (this.newPassword && this.newPasswordConfirm) {
      if (this.newPassword === this.newPasswordConfirm) {
        if (this.newPassword.length < 5) {
          this.errorMessage = this.ts.l.passwords_5_char_long;
        } else {
          this.errorMessage = '';
          this.userService.updatePassword(this.auth.getUserDetails()._id, this.newPassword).subscribe((_) => {
          });
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
        type: 'updatUsername',
        confirmText: this.ts.l.save,
        cancelText: this.ts.l.cancel
      },
      width: '50vh',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        this.errorMessage = "";
        if(res) {
          this.updatedUsername = res[0];
          this.updateUsername();
        }
    });
  }
  
  openDeleteDialog() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.are_you_sure,
        message: this.auth.getUserDetails().role === 'STUDENT' ? this.ts.l.this_includes_story_data : this.ts.l.this_includes_personal_data,
        type: '',
        confirmText: this.ts.l.yes,
        cancelText: this.ts.l.no
      },
      width: '50vh',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        if(res) {
          this.deleteAccount();
        }
    });
  }
  
  openUpdatePasswordDialog() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.change_password,
        message: this.ts.l.you_will_have_to_login_password,
        type: 'updatePassword',
        confirmText: this.ts.l.save,
        cancelText: this.ts.l.cancel
      },
      width: '50vh',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        this.errorMessage = "";
        if(res) {
          this.newPassword = res[0];
          this.newPasswordConfirm = res[1];
          this.updatePassword();
        }
    });
  }
}
