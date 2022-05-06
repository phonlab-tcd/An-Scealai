import { OnInit, Component, Output, EventEmitter } from '@angular/core';
import { TranslationService } from 'app/translation.service';
import { AuthenticationService, RegistrationTokenPayload } from 'app/authentication.service';
import { FormControl } from '@angular/forms';
import config from 'abairconfig';
import {ActivatedRoute} from "@angular/router";

type UsernameMessageKey = 'username_no_spaces' | 'username_no_special_chars';

@Component({
  selector: 'register-form',
  templateUrl: './form.component.html',
  styleUrls: ['./register.component.css'],
  host: {
    class: 'registerContainer',
  },
})
export class RegisterFormComponent implements OnInit {
  @Output() registerSuccess:
    EventEmitter<RegistrationTokenPayload> = new EventEmitter();

  errorTextKeys: string[];
  passwordConfirm: string;

  usernameInput: FormControl;
  usernameClass: string;
  usernameErrorTextKeys: UsernameMessageKey[];

  termsVisible: boolean = false;

  credentials: RegistrationTokenPayload = {
    baseurl: config.baseurl,
    username: '', 
    email: '',
    password: '',
    role: '',
    language: 'ga',
  };

  constructor(
    public ts: TranslationService,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
  ){ }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        if (params.role && (params.role === 'TEACHER' || params.role === 'STUDENT')) {
          this.credentials.role = params.role;
        }
      },
      error => {
        console.error(error);
      });

    this.usernameClass = '';
    this.usernameErrorTextKeys = [];
    this.usernameInput = new FormControl();
    this.usernameInput.valueChanges.subscribe((text) => {
      this.credentials.username = text;
      this.usernameErrorTextKeys = [];
      if (text.match(' ')) {
        this.usernameClass = 'usernameInputRed';
        // username shouldn't contain spaces
        this.usernameErrorTextKeys.push('username_no_spaces') 
      } else if (!text.match(/^[A-Za-z0-9]+$/)) {
        this.usernameClass = 'usernameInputRed';
        this.usernameErrorTextKeys.push('username_no_special_chars')// 'Your username shouldn\'t contain special characters (this includes fadas unfortunately!)';
      } else {
        this.usernameClass = '';
        this.usernameErrorTextKeys = [];
      }
    });
  }

  register() {
    console.log("REGISTER");
    if (!this.checkDetails()) return;
    this.credentials.language = this.ts.inIrish() ? 'ga' : 'en';
    this.auth.register(this.credentials).subscribe(
      _ok => {
        console.log('SUCCESFUL REGISTRATION', this.credentials);
        this.registerSuccess.emit(this.credentials);
      },
      err => {
        console.error('REGISTRATION ERROR');
        console.error
        if(err.error && err.error.messageKeys)
          this.errorTextKeys = err.error.messageKeys;
    });
  }

  checkDetails(): boolean {
    this.errorTextKeys = [];
    this.checkPassword();
    this.checkEmail();
    this.checkUsername();
    return (this.errorTextKeys.length === 0);
  }

  checkEmail(): void {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (! emailRegex.test(this.credentials.email))
      this.errorTextKeys.push('email_format_error');
  }

  checkPassword(): void {
    if (this.credentials.password.length < 5)
      this.errorTextKeys.push('passwords_5_char_long');
    if (this.credentials.password !== this.passwordConfirm)
      this.errorTextKeys.push('passwords_must_match');
  }

  checkUsername(): void {
    if (!this.credentials.username.match('^[A-Za-z0-9]+$'))
      this.errorTextKeys.push('username_no_special_chars');
  }

  toggleTerms() {
    this.termsVisible = !this.termsVisible;
  }
}
