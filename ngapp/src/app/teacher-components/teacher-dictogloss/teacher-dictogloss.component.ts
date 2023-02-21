import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/translation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassroomService } from 'app/classroom.service';
import { Classroom } from '../../classroom';
import { MessageService } from 'app/message.service';
import { UserService } from 'app/user.service';
import { User } from 'app/user';
import { AuthenticationService } from 'app/authentication.service';
import { Message } from 'app/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-teacher-dictogloss',
  templateUrl: './teacher-dictogloss.component.html',
  styleUrls: ['./teacher-dictogloss.component.scss']
})
export class TeacherDictoglossComponent implements OnInit {

  constructor(
    public ts: TranslationService,
    private auth: AuthenticationService,
    private classroomService: ClassroomService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
  ) { this.tdCreateForm(); }

  students: User[] = [];
  studentIds: string[] = [];
  sendTo: string[] = [];
  newStoryForm: FormGroup;
  classroom: Classroom;
  allSelected: boolean = false;

  ngOnInit(): void {
    this.getClassroom();
    console.log(this.students);
    console.log(this.studentIds);
    
  }

  tdCreateForm() {
    this.newStoryForm = this.fb.group({
      passage: ['', Validators.required],
    });
  }

  sendDictogloss(){
    let formFilled = this.newStoryForm.controls['passage'].value !== '';

    console.log(this.sendTo.length, formFilled);
    
    if(this.sendTo.length > 0 && formFilled){
      this.noStudents = false;
      let passage = this.newStoryForm.get('passage').value;

      console.log(passage);
      console.log(this.sendTo);

      let message: Message = {
        _id: "", //Check these
        id: "",
        subject: "New Dictogloss",
        date: new Date,
        senderId: this.auth.getUserDetails()._id, //Teacher ID
        senderUsername: this.auth.getUserDetails().username, //Teacher Username
        recipientId: "",
        text: passage,
        seenByRecipient: false,
        audioId: "",
      }

      for(let student of this.sendTo){
        message.recipientId = student;
        this.messageService.saveMessage(message);
      }
      this.goToDashboard();
    } else if (this.sendTo.length === 0){
      this.noStudents = true;
    }
  }

  noStudents: boolean = false;

  selectAllStudents(){
    this.allSelected = this.allSelected? false:true;
    for(let student of this.studentIds){
      let isNotIn: boolean = this.sendTo.indexOf(student) == -1;
      if(this.allSelected && isNotIn){
        this.sendTo.push(student)
      } else {
        this.sendTo.splice(this.sendTo.indexOf(student), 1);
      }
    }
    console.log("All students selected/deselected: ", this.sendTo);
    
  }

  sendList(id: string){
    if(!this.sendTo.includes(id)){
      this.noStudents = false;
      this.sendTo.push(id);
    } else {
      this.sendTo.splice(this.sendTo.indexOf(id), 1);
    } 
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