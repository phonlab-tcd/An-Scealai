import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload, VerifyEmailRequest } from 'app/authentication.service';
import { Router } from '@angular/router';
import { EventType } from 'app/event';
import { EngagementService } from 'app/engagement.service';
import { TranslationService } from 'app/translation.service';
// import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
// import { StoryService } from '../story.service';
import { UserService } from 'app/user.service';
import config from 'abairconfig';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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

  loginError: boolean;
  errorMsgKeys: string[] = [];

  forgotPassword = false;
  modalClass: 'hiddenFade' | 'visibleFade';

  usernameForgotPassword: string;
  emailForgotPassword: string;

  errorMessageKeys = [];
  errorMessageKey = '';

  emailToVerify = null;
  userHasNotBeenVerified = false;
  userToVerify: string = null;
  verificationEmailHasBeenSent = false;

  waitingForEmailVerification = false;
  waitingErrorTextKeys = [];

  resetPasswordOkKeys = null;
  resetPasswordErrKeys = null;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private engagement: EngagementService,
    public ts: TranslationService,
    // public _loadingBar: SlimLoadingBarService,
    // private storyService: StoryService,
    private userService: UserService) {}

  ngOnInit() {
    this.loginError = false;
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
        this.waitingForEmailVerification = true;
      },
      (error) => {
        this.verificationEmailHasBeenSent = false;
        this.errorMsgKeys = error.error.messageKeys;
      },
      () => {
        this.verificationEmailHasBeenSent = true;
        // Shallow copy frozen credentials to auth service.
        this.auth.pendingUserPayload = {baseurl: config.baseurl, ...this.frozenCredentials};
        this.waitingForEmailVerification = true;
      });
  }

  login() {
    this.errorMsgKeys = [];
    if (this.waitingForEmailVerification) {
      this.waitingErrorTextKeys = [];
      this.auth.login(this.frozenCredentials).subscribe(
        () => {
          this.router.navigateByUrl('register-profile');
        },
        (err) => {
          for (const msg of err.error.messageKeys) {
            this.waitingErrorTextKeys.push(msg);
          }
        },
        () => {
        });
      return;
    }
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
        // this.errorMsgKeys = err.error.messageKeys;
        console.log(err);
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

  showModal() {
    this.modalClass = 'visibleFade';
  }

  hideModal() {
    this.modalClass = 'hiddenFade';
  }

  resetPassword() {
    this.resetPasswordOkKeys = [];
    this.resetPasswordErrKeys = [];
    const name = this.usernameForgotPassword;
    if (name) {
      this.auth.resetPassword(name).subscribe(
        okRes => {
          this.resetPasswordOkKeys = okRes.messageKeys;
          this.resetPasswordOkKeys.push(`[${okRes.sentTo}]`);
        },
        errRes => {
          this.resetPasswordErrKeys = errRes.error.messageKeys;
        },
        () => {
        });
    }
  }
}
