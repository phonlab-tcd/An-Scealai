import { Component, OnInit } from "@angular/core";
import { AuthenticationService, TokenPayload, VerifyEmailRequest } from "../authentication.service";
import { Router } from "@angular/router";
import { EventType } from "../event";
import { EngagementService } from "../engagement.service";
import { TranslationService } from "../translation.service";
import config from "abairconfig";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  // variable for storing user data as they input it in the HTML
  credentials: TokenPayload = {
    username: "",
    password: "",
    role: "",
  };

  // copy of credentials after the user has input the data in the HTML
  frozenCredentials: VerifyEmailRequest = {
    username: null,
    password: null,
    role: null,
    baseurl: config.baseurl,
    email: null,
    language: "ga", // gaeilge by default
  };

  // generic login errors
  loginError: boolean;
  errorMsgKeys: string[] = [];

  // variables for forgot password
  forgotPassword = false; // updated in HTML
  modalClass: "hiddenFade" | "visibleFade";
  usernameForgotPassword: string;
  emailForgotPassword: string;
  errorMessageKey = "";
  resetPasswordOkKeys = null;
  resetPasswordErrKeys = null;

  // variables for user email verification
  emailToVerify = null;
  userHasNotBeenVerified = false;
  userToVerify: string = null;
  verificationEmailHasBeenSent = false;
  waitingForEmailVerification = false;
  waitingErrorTextKeys = [];

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private engagement: EngagementService,
    public ts: TranslationService
  ) {}

  ngOnInit() {
    this.loginError = false;
  }

  /**
   * Verify an account that has an email on file but is not yet active
   */
  async verifyOldAccount() {
    // set frozen ('snapshot') credentials to those input by the user
    this.frozenCredentials.username = this.credentials.username;
    this.frozenCredentials.role = this.credentials.role;
    this.frozenCredentials.password = this.credentials.password;
    this.frozenCredentials.email = this.emailToVerify;
    this.frozenCredentials.language = this.ts.inIrish() ? "ga" : "en";

    // checks if user who tried to login changes the username in the input box
    // (i.e. they click the 'verify email button' but change the username input first)
    if (this.userToVerify !== this.credentials.username) {
      this.errorMsgKeys = ["username_changed_starting_from_scratch"];
      this.userHasNotBeenVerified = false;
      this.userToVerify = null;
      return;
    }

    this.errorMsgKeys = [];

    // verify old account and set current HTML view to waiting for verification
    this.auth.verifyOldAccount(this.frozenCredentials).subscribe(
      (data) => {
        this.waitingForEmailVerification = true; // does this need to be set here?
      },
      (error) => {
        this.verificationEmailHasBeenSent = false;
        this.errorMsgKeys = error.error.messageKeys;
      },
      () => {
        this.verificationEmailHasBeenSent = true;
        // Shallow copy frozen credentials to auth service.
        this.auth.pendingUserPayload = {
          baseurl: config.baseurl,
          ...this.frozenCredentials,
        };
        this.waitingForEmailVerification = true;
      }
    );
  }

  /**
   * Attempt to login a user (verified or not)
   */
  login() {
    this.errorMsgKeys = [];
    // check if user waiting to be verified has been verified
    if (this.waitingForEmailVerification) {
      this.waitingErrorTextKeys = [];
      // if login successful, redirect to register profile page
      this.auth.login(this.frozenCredentials).subscribe(
        () => {
          this.router.navigateByUrl("register-profile");
        },
        (err) => {
          this.waitingErrorTextKeys = err.error.messageKeys;
        },
        () => {}
      );
      return;
    }
    // If the user hits the sign in button we are starting again from scratch
    this.verificationEmailHasBeenSent = false;
    // verify account if user is not verified
    if (this.userHasNotBeenVerified) {
      this.verifyOldAccount();
      return;
    }
    // log in a user if they have been verified already (i.e. returning users)
    this.auth.login(this.credentials).subscribe(
      (res) => {
        this.engagement.addEventForLoggedInUser(EventType.LOGIN);
        this.router.navigateByUrl("/landing");
      },
      (err) => {
        console.log(err);
        this.errorMsgKeys = err.error.messageKeys;
        if (err.error.messageKeys.includes("email_not_verified")) {
          // THIS MAKES THE EMAIL BOX APPEAR
          this.emailToVerify = err.error.email ?? "";
          this.userHasNotBeenVerified = true;
          this.userToVerify = this.credentials.username;
        } else if (err.status === 400) {
          this.loginError = true;
        }
      },
      () => {}
    );
  }

  /**
   * Show forgot password modal
   */
  showModal() {
    this.modalClass = "visibleFade";
  }

  /**
   * Hide forgot password modal
   */
  hideModal() {
    this.modalClass = "hiddenFade";
  }

  /**
   * Reset the user's password to random if they have forgotten theirs
   */
  resetPassword() {
    this.resetPasswordOkKeys = [];
    this.resetPasswordErrKeys = [];
    const name = this.usernameForgotPassword;
    if (name) {
      this.auth.resetPassword(name).subscribe(
        (okRes) => {
          this.resetPasswordOkKeys = okRes.messageKeys;
          this.resetPasswordOkKeys.push(`[${okRes.sentTo}]`);
        },
        (errRes) => {
          this.resetPasswordErrKeys = errRes.error.messageKeys;
        },
        () => {}
      );
    }
  }
}
