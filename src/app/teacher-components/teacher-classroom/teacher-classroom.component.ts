import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassroomService } from 'src/app/classroom.service';
import { HttpClient } from '@angular/common/http';
import { Classroom } from '../../classroom';
import { Observable } from 'rxjs';
import { User } from '../../user';
import { UserService } from '../../user.service';
import { TranslationService } from '../../translation.service';
import { MessageService } from '../../message.service';
import { Message } from '../../message';

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
              public ts : TranslationService,
              private messageService: MessageService) { }
  
  classroom : Classroom;
  modalClass : string = "hidden";
  shareModalClass : string = "hidden";
  deleteModalClass : string = "hidden";
  students : User[] = [];
  errorText : string;
  registrationError : boolean = false;
  newTitle: string;
  unreadMessages: number = 0;
  messagesForNotifications: Message[] = [];

  ngOnInit() {
    this.getClassroom();
    this.messageService.getMessagesForLoggedInUser().subscribe((res: Message[]) => {
      this.messagesForNotifications = res;
      this.unreadMessages = this.messageService.getNumberOfUnreadMessages(this.messagesForNotifications);
    });
  }

/*
* Get classroom id from route parameters
*/
  getClassroomId(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        params => {
          resolve(params);
      });
    });
  }

/*
* Get classroom id with function and call getClassroom with classroom service
* call function to get list of students
*/
  getClassroom() {
    this.getClassroomId().then((params) => {
      let id: string = params.id.toString();
      this.classroomService.getClassroom(id).subscribe((res : Classroom) => {
        this.classroom = res;
        console.log(this.classroom);
        this.getStudents();
      });
    });
  }

/*
* Loop through student ids in classroom object to get student objects
*/
  getStudents() {
    for(let id of this.classroom.studentIds) {
      this.userService.getUserById(id).subscribe((res : User) => {
        this.students.push(res);
      });
    }
  }

/*
* Edit the title of the classroom with classroom service 
*/
  editTitle() {
    this.classroomService.editTitle(this.classroom._id, this.newTitle).subscribe((res) => {
      this.getClassroom();
      this.hideModal();
    }, (err) => {
      this.showError(err);
    });
  }

/*
* Delete classroom with classroom service, redirect to landing
*/
  deleteClassroom() {
    this.classroomService.delete(this.classroom._id).subscribe((res) => {
      this.router.navigateByUrl('/landing');
    });
  }

/*
* Route to student component on teacher page
*/
  goToStudent(id: string) {
    this.router.navigateByUrl('/teacher/student/' + id);
  }
  
  goToMessages() {
    this.router.navigateByUrl('/messages/' + this.classroom._id);
  }

/*
* Set modal to visible
*/
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
