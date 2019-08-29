import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EngagementService } from '../engagement.service';
import { EventType } from '../event';

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

  constructor(private auth: AuthenticationService, private http: HttpClient, 
    private router: Router, private engagement: EngagementService,) { }

  ngOnInit() {
    this.registrationError = false;
  }

  register() {
    this.http.get('http://localhost:4000/teacherCode/isActiveCode/' + this.teacherCode).subscribe(() => {
      this.auth.register(this.credentials).subscribe(() => {
        this.http.get('http://localhost:4000/teacherCode/delete/' + this.teacherCode).subscribe(() => {
          this.engagement.addEventForLoggedInUser(EventType.REGISTER);
          this.router.navigateByUrl('/landing');
        }, (err) => {
          this.showErrorMessage(err.error.message);
        });
      }, (err) => {
        this.showErrorMessage(err.error.message);
      });
    }, (err) => {
      this.showErrorMessage(err.error.message);
    });
  }

  showErrorMessage(message : String) {
    this.errorText = message;
    this.registrationError = true;
  }
}
