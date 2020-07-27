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
import { ProfileService } from '../profile.service';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';

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
  modalClass : string = "hidden";

  constructor(public auth: AuthenticationService,
              private classroomService: ClassroomService, 
              private engagement: EngagementService,
              public ts : TranslationService,
              public ns: NotificationService,
              public ss: StatsService,
              public storyService: StoryService,
              public profileService : ProfileService,
              public messageService: MessageService,
              public userService: UserService) { }

  ngOnInit() {
    this.editMode = false;
    this.codeInput = new FormControl();
    this.getClassroom();
    this.codeInput.valueChanges.subscribe((code) => {
      if(code.length > 0) {
        this.classroomService.getClassroomFromCode(code).subscribe((res) => {
          console.log(res);
          if(res.found) {
            this.classroomCodeOutput = null;
            this.foundClassroom = res.classroom;
          } else {
            this.foundClassroom = null;
            this.classroomCodeOutput = res.message;
          }
        })
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
      if(res.status === 200) {
        this.classroom = this.foundClassroom;
        this.foundClassroom = null;
        this.statObj.studentId = this.auth.getUserDetails()._id;
        this.statObj.studentUsername = this.auth.getUserDetails().username;
        this.statObj.classroomId = this.classroom._id;
        this.ss.addNewStatEntry(this.statObj).subscribe();
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
    this.ss.deleteStats(this.auth.getUserDetails()._id).subscribe( (res) => {
      console.log("stat entry deleted");
    });
  }

  toggleEditMode() {
    if(this.editMode) {
      this.editMode = false;
    } else {
      this.editMode = true;
    }
  }

  logout() {
    this.engagement.addEventForLoggedInUser(EventType.LOGOUT);
    let value: boolean = false;  
    this.auth.logout();
  }

/*
* Delete user account and all data associated with the user
*/
  deleteAccount() {
    if(this.auth.getUserDetails().role === "STUDENT") {
      this.leaveClassroom();
      this.storyService.deleteAllStories(this.auth.getUserDetails().username).subscribe( (res) => {
        console.log("All stories deleted");
      });
    }
    if(this.auth.getUserDetails().role === "TEACHER") {
      this.classroomService.deleteClassroomsForTeachers(this.auth.getUserDetails()._id).subscribe( (res) => {
        console.log("All classrooms deleted");
      })
    }
    
    this.messageService.deleteAllMessages(this.auth.getUserDetails()._id).subscribe( (res) => {
      console.log("All messages deleted");
    });  
    this.profileService.deleteProfile(this.auth.getUserDetails()._id).subscribe( (res) => {
      console.log("Profile deleted");
    });
    this.userService.deleteUser(this.auth.getUserDetails().username).subscribe( (res) => {
      console.log("User deleted");
    });
    this.auth.logout();
  }
  
  showModal() {
    this.modalClass = "visibleFade";
  }

  hideModal() {
    this.modalClass = "hiddenFade";
  }

}
