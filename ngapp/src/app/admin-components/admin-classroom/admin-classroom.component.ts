import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassroomService } from 'src/app/classroom.service';
import { Classroom } from '../../classroom';
import { User } from '../../user';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-admin-classroom',
  templateUrl: './admin-classroom.component.html',
  styleUrls: ['./admin-classroom.component.css']
})
export class AdminClassroomComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private classroomService: ClassroomService,
    private router: Router,
    private userService: UserService) { }

  classroom : Classroom;
  students : User[] = [];

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

  goToStudent(id: string) {
    this.router.navigateByUrl('/admin/user/' + id);
  }

}
