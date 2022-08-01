import { identifierName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassroomService } from 'app/classroom.service';
import { firstValueFrom } from 'rxjs';
import { Classroom } from '../../classroom';
import { User } from '../../user';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-admin-classroom',
  templateUrl: './admin-classroom.component.html',
  styleUrls: ['./admin-classroom.component.scss']
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

  private async getClassroomId(): Promise<string> {
    const params = await firstValueFrom(this.route.params);
    if(params.id) return params.id;
    throw new Error('classroom id not in route params');
  }

  private async getClassroom() {
    const id = await this.getClassroomId();
    this.classroom = await firstValueFrom(this.classroomService.getClassroom(id));
    this.getStudents();
  }

  private getStudents() {
    for(let id of this.classroom.studentIds) {
      this.userService.getUserById(id)
        .subscribe(student => this.students.push(student));
    }
  }

  goToStudent(id: string) {
    this.router.navigateByUrl('/admin/user/' + id);
  }

}
