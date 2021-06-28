import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { EventType } from '../event';
import { EngagementService } from '../engagement.service';
import { TranslationService } from '../translation.service';
//import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { StoryService } from '../story.service';
import { UserService } from '../user.service';


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
  errorText: String;
  forgotPassword: boolean = false;
  modalClass : string = "hidden";
  usernameForgotPassword: string;
  emailForgotPassword: string;
  errorMessage: string = "";
  

  constructor(private auth: AuthenticationService, private router: Router,
              private engagement: EngagementService, public ts : TranslationService, 
              //public _loadingBar: SlimLoadingBarService,
              private storyService : StoryService, private userService: UserService) {}

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
