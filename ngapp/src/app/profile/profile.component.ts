import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { ClassroomService } from '../classroom.service';
import { FormControl } from '@angular/forms';
import { Classroom } from '../classroom';
import { EngagementService } from '../engagement.service';
import { EventType } from '../event';
import { TranslationService } from '../translation.service';
import { NotificationService } from '../notification-service.service';
import { StatsService } from '../stats.service';
import { StudentStats } from '../studentStats';
import { StoryService } from '../story.service';
import { Story } from '../story';
import { ProfileService } from '../profile.service';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';
import { RecordingService } from '../recording.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  editMode: boolean;
  classroomCodeOutput: string;
  codeInput : FormControl;
  foundClassroom: Classroom;
  classroom: Classroom;
  statObj: StudentStats = new StudentStats();
  modalClass: 'hidden' | 'hiddenFade' | 'visibleFade' = 'hidden';
  updateUsernameMode = false;
  updateEmailMode = false;
  updatePasswordMode = false;
  deleteAccountMode = false;
  updatedUsername: string;
  errorMessage = '';
  newPassword: string;
  newPasswordConfirm: string;

  constructor(public auth: AuthenticationService,
              private classroomService: ClassroomService,
              private engagement: EngagementService,
              public ts: TranslationService,
              public ns: NotificationService,
              public storyService: StoryService,
              public profileService: ProfileService,
              public messageService: MessageService,
              public userService: UserService,
              public statsService: StatsService,
              public recordingService: RecordingService) { }

  ngOnInit() {
    this.editMode = false;
    this.codeInput = new FormControl();
    this.getClassroom();
    this.codeInput.valueChanges.subscribe(
      (code) => {
        if (code.length > 0) {
          this.classroomService.getClassroomFromCode(code).subscribe(
            (res) => {
              console.log(res);
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
* Create a new stats object in the database
*/
  joinClassroom() {
    this.classroomService.addStudentToClassroom(this.foundClassroom._id, this.auth.getUserDetails()._id).subscribe((res) => {
      if (res.status === 200) {
        this.classroom = this.foundClassroom;
        this.foundClassroom = null;
        this.statObj.studentId = this.auth.getUserDetails()._id;
        this.statObj.studentUsername = this.auth.getUserDetails().username;
        this.statObj.classroomId = this.classroom._id;
        this.statsService.addNewStatEntry(this.statObj).subscribe();
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
    this.classroomService.removeStudentFromClassroom(this.classroom._id, this.auth.getUserDetails()._id).subscribe((res) => {
      this.classroom = null;
    });
    this.statsService.deleteStats(this.auth.getUserDetails()._id).subscribe(
      (res) => {
        console.log('stat entry deleted');
      });
  }

  toggleEditMode() {
    if (this.editMode) {
      this.editMode = false;
    } else {
      this.editMode = true;
    }
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
          this.recordingService.deleteStoryRecordingAudio(story._id).subscribe((res) => {
            console.log(res);
          });
          this.recordingService.deleteStoryRecording(story._id).subscribe( (res) => {
            console.log(res);
          })
        }
      });
      
      this.storyService.deleteAllStories(userDetails.username).subscribe( (res) => {
        console.log(res);
      });
      
      this.statsService.deleteStats(userDetails._id).subscribe( (res) => {
        console.log(res);
      });
    }
    
    if(userDetails.role === "TEACHER") {
      this.classroomService.getClassroomsForTeacher(userDetails._id).subscribe( (res) => {
        for(let classroom of res) {
          this.statsService.deleteStatsForClassroom(classroom._id).subscribe( (res) => {
            console.log(res);
          });
        }
      });
      
      this.classroomService.deleteClassroomsForTeachers(userDetails._id).subscribe( (res) => {
        console.log(res)
      });
    }
    
    this.messageService.deleteAllMessages(userDetails._id).subscribe( (res) => {
      console.log(res);
    });  
    this.profileService.deleteProfile(userDetails._id).subscribe( (res) => {
      console.log(res);
    });
    this.userService.deleteUser(userDetails.username).subscribe( (res) => {
      console.log(res);
    });
    this.auth.logout();
  }
  
  /*
  * Update account username and all data associated with it
  */
  async updateUsername() {
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

    if(this.auth.getUserDetails().role === "STUDENT") {
      await this.storyService.updateAuthor(this.auth.getUserDetails().username, this.updatedUsername).toPromise();
      const stats = await this.statsService.getStatsForStudent(this.auth.getUserDetails()._id).toPromise()
        .catch(err => console.log(`${this.auth.getUserDetails().username} doesn't have any associated studentStats!`));
      if (stats) {
        await this.statsService.updateStudentUsername(this.auth.getUserDetails()._id, this.updatedUsername).toPromise();
      }
    }
    
    await this.messageService.updateSenderUsername(this.auth.getUserDetails()._id, this.updatedUsername).toPromise();
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
          this.userService.updatePassword(this.auth.getUserDetails()._id, this.newPassword).subscribe((res) => {
            console.log(res);
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

  showModal() {
    this.modalClass = 'visibleFade';
  }

  hideModal() {
    this.modalClass = 'hiddenFade';
    this.updatePasswordMode = false;
  }
}
