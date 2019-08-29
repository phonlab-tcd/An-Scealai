import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { EngagementService } from '../engagement.service';
import { EventType } from '../event';

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

  constructor(private auth: AuthenticationService, private router: Router,
              private engagement: EngagementService,) { }

  ngOnInit() {
    this.registrationError = false;
  }

  register() {
    this.auth.register(this.credentials).subscribe(() => {
      this.engagement.addEventForLoggedInUser(EventType.REGISTER);
      this.router.navigateByUrl('/landing');
    }, (err) => {
      if(err.status === 400) {
        this.errorText = err.error.message;
        this.registrationError = true;
      }
    });
  }

}
