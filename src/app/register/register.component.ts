import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { EngagementService } from '../engagement.service';
import { EventType } from '../event';
import { TranslationService } from '../translation.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  credentials: TokenPayload = {
    username: '',
    password: '',
    role: 'STUDENT',
  };

  registrationError: boolean;
  errorText: String;
  passwordConfirm : string;
  termsVisible : boolean;
  usernameInput : FormControl;
  usernameClass : string;
  usernameErrorText : string;

  constructor(private auth: AuthenticationService, private router: Router,
              private engagement: EngagementService, public ts : TranslationService) { }

  ngOnInit() {
    this.registrationError = false;
    this.usernameClass = "";
    this.usernameErrorText = "";
    this.usernameInput = new FormControl();
    this.usernameInput.valueChanges.subscribe((text) => {
      if(text.match(" ")) {
        this.usernameClass = "usernameInputRed";
        this.usernameErrorText = "Your username shouldn't contain spaces";
      } else if(!text.match("^[A-Za-z0-9]*$")) {
        this.usernameClass = "usernameInputRed";
        this.usernameErrorText = "Your username shouldn't contain special characters (this includes fadas unfortunately!)";
      } else {
        this.usernameClass = "";
        this.usernameErrorText = "";
      }

    })
  }

  register() {
    if(this.checkDetails()) {
      this.auth.register(this.credentials).subscribe(() => {
        this.engagement.addEventForLoggedInUser(EventType.REGISTER);
        this.ts.setLanguage(this.ts.l.iso_code);
        this.router.navigateByUrl('/register-profile');
      }, (err) => {
        if(err.status === 400) {
          this.errorText = err.error.message;
          this.registrationError = true;
        }
      });
    }
    
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
