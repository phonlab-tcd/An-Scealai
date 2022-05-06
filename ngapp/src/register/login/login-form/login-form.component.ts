import { Component, OnInit, EventEmitter } from '@angular/core';
import { TranslationService } from 'app/translation.service';
import { AuthenticationService, TokenPayload, VerifyEmailRequest } from 'app/authentication.service';
import { Router } from '@angular/router';
import { EngagementService } from 'app/engagement.service';
import { EventType } from 'app/event';
import config from 'abairconfig';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['../../register.component.css'],
  host: {
    class: 'registerContainer',
  }
})
export class LoginFormComponent implements OnInit {
  constructor(
    public ts: TranslationService,
    public router: Router,
    private auth: AuthenticationService,
    private engagement: EngagementService,
  ) { }

  verifyOldAccountSuccess: EventEmitter<VerifyEmailRequest> = new EventEmitter();
  userHasNotBeenVerified = false;
  verificationEmailHasBeenSent = false;
  errorMsgKeys: string[] = [];
  userToVerify: string = null;
  emailToVerify: string;

  credentials: TokenPayload = {
    username: '',
    password: '',
    role: '',
  };

  frozenCredentials: VerifyEmailRequest = {
    username: null,
    password: null,
    role: null,
    baseurl: config.baseurl,
    email: null,
    language: 'ga', // gaeilge by default
  };

  ngOnInit(): void {
  }

  login() {
    this.errorMsgKeys = [];
    // If the user hits the sign in button we are starting again from scratch
    this.verificationEmailHasBeenSent = false;

    if (this.userHasNotBeenVerified) {
      this.verifyOldAccount();
      return;
    }
    this.auth.login(this.credentials).subscribe(
      (res) => {
        this.engagement.addEventForLoggedInUser(EventType.LOGIN);
        this.router.navigateByUrl('/landing');
      },
      (err) => {
        if (err.status === 404) {
          this.errorMsgKeys = ['username_not_found'];
        }
        if (err.status === 401) {
          this.errorMsgKeys = ['incorrect_password'];
        }
        if (err.error.userPending) {
          this.errorMsgKeys= ['email_not_verified'];
          // THIS MAKES THE EMAIL BOX APPEAR
          console.log('USER PENDING');
          this.userHasNotBeenVerified = true;
          this.userToVerify = this.credentials.username;
        }
      });
  }

  async verifyOldAccount() {
    this.frozenCredentials.username = this.credentials.username;
    this.frozenCredentials.role = this.credentials.role;
    this.frozenCredentials.password = this.credentials.password;
    this.frozenCredentials.email = this.emailToVerify;
    this.frozenCredentials.language = this.ts.inIrish() ? 'ga' : 'en';

    if (this.userToVerify !== this.credentials.username) {
      this.errorMsgKeys = ['username_changed_starting_from_scratch'];
      this.userHasNotBeenVerified = false;
      this.userToVerify = null;
      return;
    }

    this.errorMsgKeys = [];

    this.auth.verifyOldAccount(this.frozenCredentials).subscribe(
      (data) => {
        this.verifyOldAccountSuccess.emit(data);
        // this.waitingForEmailVerification = true;
        // this.verificationEmailHasBeenSent = true;
        // // Shallow copy frozen credentials to auth service.
        // this.auth.pendingUserPayload = {baseurl: config.baseurl, ...this.frozenCredentials};
      },
      (error) => {
        this.verificationEmailHasBeenSent = false;
        this.errorMsgKeys = error.error.messageKeys;
      },
      () => {
      });
  }
}
