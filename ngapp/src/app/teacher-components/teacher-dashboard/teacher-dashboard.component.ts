import { Component, OnInit } from '@angular/core';
import { ClassroomService } from '../../classroom.service';
import { AuthenticationService } from '../../authentication.service';
import { Observable } from 'rxjs';
import { Classroom } from '../../classroom';
import { Router } from '@angular/router';
import { TranslationService } from '../../translation.service';
import { NotificationService } from '../../notification-service.service';
import { ProfileService } from '../../profile.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasicDialogComponent } from '../../dialogs/basic-dialog/basic-dialog.component';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent implements OnInit {

  constructor(private classroom: ClassroomService,
              private auth: AuthenticationService,
              private router: Router,
              public ts : TranslationService,
              public ns: NotificationService,
              private dialog: MatDialog,
              private profileService: ProfileService) { }
              
  
  classrooms : Observable<Classroom[]>;
  newClassroom : Classroom = new Classroom();
  dialogRef: MatDialogRef<unknown>;

  ngOnInit() {
    this.profileService.getForUser(this.auth.getUserDetails()._id).subscribe((res) => {
    }, err => {
      this.router.navigateByUrl('/register-profile');
    });

    this.classrooms = this.getClassrooms();
    // TODO: Fix bug
    // this.classrooms.sort((a, b) => (a.title < b.title) ? -1 : 1);
    this.ns.setNotifications();
  }

  getClassrooms() : Observable<Classroom[]> {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    return this.classroom.getClassroomsForTeacher(userDetails._id);
  }

  goToClassroom(id : string) {
    this.router.navigateByUrl('teacher/classroom/' + id);
  }

  createNewClassroom() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    this.newClassroom.teacherId = userDetails._id;
    this.newClassroom.date = new Date();
    this.classroom.getAllCodes().subscribe((res: string[]) => {
      let newCode: string = this.getUniqueCode(res);
      this.newClassroom.code = newCode;
      this.classroom.createClassroom(this.newClassroom).subscribe((_) => {
        this.classrooms = this.getClassrooms();
      }, (err) => {
        alert(err.message);
      });
    }, (err) => {
      alert(err.message);
    });
    
  }

  getUniqueCode(codes: string[]) : string {
    let potentialCode : string = this.classroom.generateCode();
    while(codes.includes(potentialCode)) {
      potentialCode = this.classroom.generateCode();
    }
    return potentialCode;
  }

  getNumberOfStudents(classroom : Classroom) : number{
    return classroom.studentIds.length;
  }
  
  openCreateClassroomDialog() {
    this.newClassroom.title = null;
    if(this.newClassroom) {
      this.dialogRef = this.dialog.open(BasicDialogComponent, {
        data: {
          title: this.ts.l.add_new_classroom,
          message: this.ts.l.enter_title,
          type: 'updateText',
          confirmText: this.ts.l.create,
          cancelText: this.ts.l.cancel
        },
        width: '50vh',
      });
      
      this.dialogRef.afterClosed().subscribe( (res) => {
          this.dialogRef = undefined;
          if(res) {
            this.newClassroom.title = res[0];
            this.createNewClassroom();
          }
      });
    }
  }

}
