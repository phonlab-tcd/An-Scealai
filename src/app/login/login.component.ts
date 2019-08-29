import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { EventType } from '../event';
import { EngagementService } from '../engagement.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  credentials: TokenPayload = {
    username: '',
    password: '',
    role: 'STUDENT',
  };

  loginError: boolean;
  errorText: String;

  constructor(private auth: AuthenticationService, private router: Router,
              private engagement: EngagementService) { }

  ngOnInit() {
    this.loginError = false;
  }

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.engagement.addEventForLoggedInUser(EventType.LOGIN);
      this.router.navigateByUrl('/landing');
    }, (err) => {
      if(err.status === 400) {
        this.errorText = err.error.message;
        this.loginError = true;
      }
    });
  }

}
