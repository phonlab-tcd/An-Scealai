import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload, VerifyEmailRequest } from '../authentication.service';
import { Router } from '@angular/router';
import { EventType } from '../event';
import { EngagementService } from '../engagement.service';
import { TranslationService } from '../translation.service';
//import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { StoryService } from '../story.service';
import { UserService } from '../user.service';
import config from '../../abairconfig.json';


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

  loginError: boolean;
  errorText: string;
  forgotPassword = false;
  modalClass: 'hiddenFade' | 'visibleFade';
  usernameForgotPassword: string;
  emailForgotPassword: string;
  errorMessage = '';
  emailToVerify = null;

  userHasNotBeenVerified = false;
  userToVerify: string = null;

  verificationEmailHasBeenSent = false;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private engagement: EngagementService,
    public ts: TranslationService, 
    // public _loadingBar: SlimLoadingBarService,
    private storyService: StoryService,
    private userService: UserService) {}

  ngOnInit() {
    this.loginError = false;
  }

  async verifyOldAccount() {
    if(this.userToVerify !== this.credentials.username){
      console.log("this.userToVerify !=== this.credentials.username");
      this.errorText = 'Username changed. Starting from scratch.';
      this.userHasNotBeenVerified = false;
      this.userToVerify = null;
      return;
    }

    const reqObj: VerifyEmailRequest = {
      username: this.credentials.username,
      email: this.emailToVerify,
      password: this.credentials.password,
      // TODO is role necessary for this request?
      role: this.credentials.role,
      baseurl: config.baseurl,
    };

    console.log('Requesting email verification.');
    this.auth.verifyOldAccount(reqObj).subscribe(
      (data) => {
        console.log('Got response for verifyOldAccount endpoint');
        console.dir(data);
      },
      (error) => {
        console.dir(error);
        this.verificationEmailHasBeenSent = false;
      },
      () => {
        console.log('Completed verifyOldAccount request')
        this.verificationEmailHasBeenSent = true;
      });
  }

  login() {
    // If the user hits the sign in button we are starting again from scratch
    this.verificationEmailHasBeenSent = false;

    if(this.userHasNotBeenVerified){
      this.verifyOldAccount();
      return;
    }
    this.auth.login(this.credentials).subscribe(
    (res) => {
      console.dir('res:',res);
      this.engagement.addEventForLoggedInUser(EventType.LOGIN);
      this.router.navigateByUrl('/landing');
    }, 
    (err) => {
      console.dir('err.error:',err.error);
      if (err.error.userStatus === 'Pending') {
        console.log('User status is Pending');
        this.errorText = 'Please provide and verify an email address to continue.';
        this.userHasNotBeenVerified = true;
        this.userToVerify = err.error.username;
      }
      if(err.status === 400) {
        this.loginError = true;
      }
      this.errorText = err.error.message;
    },
    () => {
      console.log('completed login for:', this.credentials.username);
    });
    
  }
  
  showModal() {
    this.modalClass = "visibleFade";
  }

  hideModal() {
    this.modalClass = "hiddenFade";
  }
  
  sendNewPassword() {
    if(this.usernameForgotPassword) {
      console.log(this.usernameForgotPassword);
      this.userService.sendNewPassword(this.usernameForgotPassword, this.emailForgotPassword).subscribe((res) => {
        console.log("this is read");
        console.log(res);
      });
      this.errorMessage = "";
      this.usernameForgotPassword = "";
      this.forgotPassword = false;
    }
    else {
      this.errorMessage = "Please input your username"
    }
  }

}
