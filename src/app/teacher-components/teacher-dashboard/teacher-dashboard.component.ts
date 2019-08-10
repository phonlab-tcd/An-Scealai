import { Component, OnInit } from '@angular/core';
import { ClassroomService } from '../../classroom.service';
import { AuthenticationService } from '../../authentication.service';
import { Observable } from 'rxjs';
import { Classroom } from '../../classroom';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent implements OnInit {

  constructor(private classroom: ClassroomService,
              private auth: AuthenticationService,
              private router: Router) { }
  
  classrooms : Observable<Classroom[]>;
  modalClass : string = "hidden";
  newClassroom : Classroom = new Classroom();
  errorText : string;
  registrationError : boolean = false;

  ngOnInit() {
    this.classrooms = this.getClassrooms();
  }

  getClassrooms() : Observable<Classroom[]> {
    return this.classroom.getClassroomsForTeacher(this.auth.getUserDetails()._id);
  }

  goToClassroom(id : string) {
    this.router.navigateByUrl('teacher/classroom/' + id);
  }

  addNewClassroom() {
    this.newClassroom.title = null;
    this.showModal();
  }

  createNewClassroom() {
    this.newClassroom.teacherId = this.auth.getUserDetails()._id;
    this.classroom.getAllCodes().subscribe((res: string[]) => {
      let newCode: string = this.getUniqueCode(res);
      this.newClassroom.code = newCode;
      this.classroom.createClassroom(this.newClassroom).subscribe((res) => {
        this.classrooms = this.getClassrooms();
        this.hideModal();
      }, (err) => {
        this.showError(err);
      });
    }, (err) => {
      this.showError(err);
    });
    
  }

  showError(err) {
    this.errorText = err.message;
    this.registrationError = true;
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

  showModal() {
    this.modalClass = "visibleFade";
  }

  hideModal() {
    this.modalClass = "hiddenFade";
  }

}
