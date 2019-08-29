import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { ClassroomService } from '../classroom.service';
import { FormControl } from '@angular/forms';
import { Classroom } from '../classroom';
import { EngagementService } from '../engagement.service';
import { EventType } from '../event';

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

  constructor(public auth: AuthenticationService,
              private classroomService: ClassroomService, private engagement: EngagementService) { }

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

  joinClassroom() {
    this.classroomService.addStudentToClassroom(this.foundClassroom._id, this.auth.getUserDetails()._id).subscribe((res) => {
      if(res.status === 200) {
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

  toggleEditMode() {
    if(this.editMode) {
      this.editMode = false;
    } else {
      this.editMode = true;
    }
  }

  logout() {
    this.engagement.addEventForLoggedInUser(EventType.LOGOUT);
    this.auth.logout();
  }

}
