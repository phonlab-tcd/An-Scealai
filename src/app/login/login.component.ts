import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  credentials: TokenPayload = {
    username: '',
    password: ''
  };

  loginError: boolean;
  errorText: String;

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.loginError = false;
  }

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/contents');
    }, (err) => {
      if(err.status === 400) {
        this.errorText = err.error.message;
        this.loginError = true;
      }
    });
  }

}
