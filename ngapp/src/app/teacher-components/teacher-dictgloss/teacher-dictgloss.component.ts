import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/translation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ClassroomService } from 'app/classroom.service';
import { Classroom } from '../../classroom';
import { MessageService } from 'app/message.service';
import { UserService } from 'app/user.service';
import { User } from 'app/user';

@Component({
  selector: 'app-teacher-dictgloss',
  templateUrl: './teacher-dictgloss.component.html',
  styleUrls: ['./teacher-dictgloss.component.scss']
})
export class TeacherDictglossComponent implements OnInit {

  constructor(
    public ts: TranslationService,
    private classroomService: ClassroomService,
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {}

  students: User[] = [];
  studentIds: String[] = [];
  classroom : Classroom;

  ngOnInit(): void {
    this.getClassroom();
    console.log(this.students);
    console.log(this.classroom);
    
  }

  sendDictgloss(){
    
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

  getClassroomId(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => {
          resolve(params);
      });
    });
  }

  getStudents() {
    for(let id of this.classroom.studentIds) {
      this.userService.getUserById(id).subscribe((res : User) => {
        this.students.push(res);
        //this.students.sort((a, b) => (a.username < b.username) ? -1 : 1);
        this.students.sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
        this.studentIds.push(res._id);
      });
    }
  }

  goToDashboard(){
    this.router.navigateByUrl('teacher/dashboard');
  }
}
