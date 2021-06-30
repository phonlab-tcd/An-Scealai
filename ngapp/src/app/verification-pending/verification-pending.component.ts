import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification-pending',
  templateUrl: './verification-pending.component.html',
  styleUrls: ['./verification-pending.component.css']
})
export class VerificationPendingComponent implements OnInit {

  credentials: TokenPayload = null;

  constructor(
    private router: Router,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.credentials = this.auth.pendingUserPayload;
    this.loginLoop();
  }

  login() {
    this.auth.login(this.credentials).subscribe(
      (res) => {
        if (res.token) {
          this.router.navigateByUrl('landing');
        }
      },
      (err) => {
        console.dir(err);
      },
      () => {
        requestsInProgress = requestsInProgress - 1;
      });
  }

}
