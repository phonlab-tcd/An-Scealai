import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassroomService } from 'src/app/classroom.service';
import { HttpClient } from '@angular/common/http';
import { Classroom } from '../../classroom';
import { Observable } from 'rxjs';
import { User } from '../../user';
import { UserService } from '../../user.service';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'app-teacher-classroom',
  templateUrl: './teacher-classroom.component.html',
  styleUrls: ['./teacher-classroom.component.css']
})
export class TeacherClassroomComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private classroomService: ClassroomService,
              private router: Router,
              private userService: UserService,
              public ts : TranslationService) { }
  
  classroom : Classroom;
  modalClass : string = "hidden";
  shareModalClass : string = "hidden";
  deleteModalClass : string = "hidden";
  students : User[] = [];
  errorText : string;
  registrationError : boolean = false;
  newTitle: string;

  ngOnInit() {
    this.getClassroom();
  }

  getClassroomId(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => {
          resolve(params);
      });
    });
  }

  getClassroom() {
    this.getClassroomId().then((params) => {
      let id: string = params.id.toString();
      this.classroomService.getClassroom(id).subscribe((res : Classroom) => {
        this.classroom = res;
        this.getStudents();
      });
    });
  }

  getStudents() {
    for(let id of this.classroom.studentIds) {
      this.userService.getUserById(id).subscribe((res : User) => {
        this.students.push(res);
      });
    }
  }

  editTitle() {
    this.classroomService.editTitle(this.classroom._id, this.newTitle).subscribe((res) => {
      this.getClassroom();
      this.hideModal();
    }, (err) => {
      this.showError(err);
    });
  }

  deleteClassroom() {
    this.classroomService.delete(this.classroom._id).subscribe((res) => {
      this.router.navigateByUrl('/landing');
    });
  }

  goToStudent(id: string) {
    this.router.navigateByUrl('/teacher/student/' + id);
  }

  showModal() {
    this.newTitle = this.classroom.title;
    this.modalClass = "visibleFade";
  }

  hideModal() {
    this.modalClass = "hiddenFade";
  }

  showShareModal() {
    this.shareModalClass = "visibleFade";
  }

  hideShareModal() {
    this.shareModalClass = "hiddenFade";
  }

  showDeleteModal() {
    this.deleteModalClass = "visibleFade";
  }

  hideDeleteModal() {
    this.deleteModalClass = "hiddenFade";
  }

  showError(err) {
    this.errorText = err.message;
    this.registrationError = true;
  }

  
}
