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

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  register() {
    this.auth.register(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/landing');
    }, (err) => {
      console.error("This: ", err);
    });
  }

}
