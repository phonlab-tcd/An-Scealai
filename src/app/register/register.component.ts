import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { createDecipher } from 'crypto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  credentials: TokenPayload = {
    username: '',
    password: ''
  };

  usernameExists: boolean;
  emptyFields: boolean;

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.usernameExists = false;
    this.emptyFields = false;
  }

  register() {
    this.auth.register(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/landing');
    }, (err) => {
      if(err.status === 409) {
        this.usernameExists = true;
      }
      if(err.status === 400) {
        this.emptyFields = true;
      }
    });
  }

}
