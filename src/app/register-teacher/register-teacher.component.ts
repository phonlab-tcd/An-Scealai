import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EngagementService } from '../engagement.service';
import { EventType } from '../event';
import { TranslationService } from '../translation.service';
import config from '../../abairconfig.json';

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
  passwordConfirm : string;
  termsVisible : boolean;

  baseurl : String = config.baseurl;

  constructor(private auth: AuthenticationService, private http: HttpClient, 
    private router: Router, private engagement: EngagementService,
    public ts: TranslationService) { }

  ngOnInit() {
    this.registrationError = false;
  }

  register() {
    if(this.checkDetails()) {
      this.http.get(this.baseurl + 'teacherCode/isActiveCode/' + this.teacherCode).subscribe(() => {
        this.auth.register(this.credentials).subscribe(() => {
          this.http.get(this.baseurl + 'teacherCode/delete/' + this.teacherCode).subscribe(() => {
            this.engagement.addEventForLoggedInUser(EventType.REGISTER);
            this.router.navigateByUrl('/register-profile');
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
  }

  showErrorMessage(message : String) {
    this.errorText = message;
    this.registrationError = true;
  }

  checkDetails() : boolean {
    if(this.credentials.password !== this.passwordConfirm) {
      this.errorText = this.ts.l.passwords_must_match;
      this.registrationError = true;
      return false;
    }
    if(this.credentials.password.length < 5) {
      this.errorText = this.ts.l.passwords_5_char_long;
      this.registrationError = true;
      return false;
    }
    if(!this.credentials.username.match('^[A-Za-z0-9]+$')) {
      this.errorText = this.ts.l.username_no_special_chars;
      this.registrationError = true;
      return false;
    }
    return true;
  }

  toggleTerms() {
    this.termsVisible = !this.termsVisible;
  }
}
