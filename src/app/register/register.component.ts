import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { EngagementService } from '../engagement.service';
import { EventType } from '../event';
import { TranslationService } from '../translation.service';

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

  constructor(private auth: AuthenticationService, private router: Router,
              private engagement: EngagementService, public ts : TranslationService) { }

  ngOnInit() {
    this.registrationError = false;
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
      this.errorText = "Passwords must match!";
      this.registrationError = true;
      return false;
    }
    if(this.credentials.password.length < 5) {
      this.errorText = "Passwords must be at least 5 characters long!";
      this.registrationError = true;
      return false;
    }
    return true;
  }

  toggleTerms() {
    this.termsVisible = !this.termsVisible;
  }

}
