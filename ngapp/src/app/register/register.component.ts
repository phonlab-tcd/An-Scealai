import { Component, OnInit } from '@angular/core';
import { AuthenticationService, RegistrationTokenPayload } from '../authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EngagementService } from '../engagement.service';
import { EventType } from '../event';
import { TranslationService } from '../translation.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import config from '../../abairconfig.json';


type UsernameMessageKey = 'username_no_spaces' | 'username_no_special_chars';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private router: Router,
    private engagement: EngagementService,
    public ts: TranslationService) { }

  credentials: RegistrationTokenPayload = {
    baseurl: config.baseurl,
    username: '',
    email: '',
    password: '',
    role: 'STUDENT',
    language: 'ga',
  };

  frozenCredentials: RegistrationTokenPayload = null;

  registrationError: boolean;
  errorTextKeys: string[] = [];
  passwordConfirm: string;
  termsVisible: boolean;
  usernameInput: FormControl;
  usernameClass: string;
  usernameErrorTextKeys: UsernameMessageKey[];
  checkeUsername: string;

  loginErrorTextKey: string = null;

  waitingForEmailVerification = false;


  ngOnInit() {
    this.route.params.subscribe(
      params => {
        console.log(params);
        if (params.role && (params.role === 'TEACHER' || params.role === 'STUDENT')) {
          this.credentials.role = params.role;
        }
      },
      error => {
        console.error(error);
      });

    this.registrationError = false;
    this.usernameClass = '';
    this.usernameErrorTextKeys = [];
    this.usernameInput = new FormControl();
    this.usernameInput.valueChanges.subscribe((text) => {
      this.credentials.username = text;
      if (text.match(' ')) {
        this.usernameClass = 'usernameInputRed';
        this.usernameErrorTextKeys.push('username_no_spaces') // 'Your username shouldn\'t contain spaces';
      } else if (!text.match('^[A-Za-z0-9]*$')) {
        this.usernameClass = 'usernameInputRed';
        this.usernameErrorTextKeys.push('username_no_special_chars')// 'Your username shouldn\'t contain special characters (this includes fadas unfortunately!)';
      } else {
        this.usernameClass = '';
        this.usernameErrorTextKeys = [];
      }
    });
  }

  login() {
    this.auth.login(this.frozenCredentials).subscribe(
      (data) => {
        console.log('got data for login request:', data);
        this.engagement.addEventForLoggedInUser(EventType.REGISTER);
        this.ts.setLanguage(this.ts.l.iso_code);
        this.router.navigateByUrl('register-profile');
      },
      err => {
        console.error(err);
        if ( this.ts.l[ err.error.message ] ) {
          this.loginErrorTextKey = err.error.message;
        } else {
          this.loginErrorTextKey = err.error.message;
        }
      },
      () => {
        console.log('Completed login request for', this.frozenCredentials.username);
      }
    );
  }

  register() {
    if (this.checkDetails()) {
      this.credentials.language = this.ts.inIrish() ? 'ga' : 'en';
      console.log('cred_language', this.credentials.language);
      this.auth.register(this.credentials).subscribe(
        (ok) => {
        // Copy credentials to frozenCredentials
        this.frozenCredentials = JSON.parse(JSON.stringify(this.credentials));
        this.waitingForEmailVerification = true;
        this.errorTextKeys = ok.messageKeys;
      }, (err: any) => {
        if (err.status === 400) {
          this.errorTextKeys = err.error.messageKeys;
          this.registrationError = true;
        }
      });
    }
  }

  checkDetails(): boolean {
    this.errorTextKeys = [];
    if (this.credentials.password !== this.passwordConfirm) {
      this.errorTextKeys.push('passwords_must_match');
      this.registrationError = true;
    }
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log('Testing email address for validity:', this.credentials.email);
    if (! emailRegex.test(this.credentials.email)) {
      this.errorTextKeys.push('email_format_error');
      this.registrationError = true;
    }
    if (this.credentials.password.length < 5) {
      this.errorTextKeys.push('passwords_5_char_long');
      this.registrationError = true;
    }
    if (!this.credentials.username.match('^[A-Za-z0-9]+$')) {
      this.errorTextKeys.push('username_no_special_chars');
      this.registrationError = true;
    }
    return (this.errorTextKeys.length === 0);
  }

  toggleTerms() {
    this.termsVisible = !this.termsVisible;
  }
}
