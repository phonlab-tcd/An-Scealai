import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-teacher',
  templateUrl: './register-teacher.component.html',
  styleUrls: ['./register-teacher.component.css']
})
export class RegisterTeacherComponent implements OnInit {
  credentials: TokenPayload = {
    username: '',
    password: '',
    role: 'TEACHER',
  };

  teacherCode : String;

  registrationError: boolean;
  errorText: String;

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.registrationError = false;
  }

  register() {
    this.auth.registerTeacher(this.credentials, this.teacherCode).subscribe(() => {
      this.router.navigateByUrl('/landing');
    }, (err) => {
      if(err.status === 400) {
        this.errorText = err.error.message;
        this.registrationError = true;
      }
    });
  }
}
