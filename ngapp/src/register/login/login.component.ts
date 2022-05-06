import { Component } from '@angular/core';
import { AuthenticationService, VerifyEmailRequest } from 'app/authentication.service';
import { Router } from '@angular/router';
import { EngagementService } from 'app/engagement.service';
import { TranslationService } from 'app/translation.service';
import { UserService } from 'app/user.service';
import { CredentialsService } from 'register/credentials.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private engagement: EngagementService,
    public ts: TranslationService,
    // public _loadingBar: SlimLoadingBarService,
    // private storyService: StoryService,
    private userService: UserService,
    private credentials: CredentialsService) {}

  verifyOldAccountSuccess(v: VerifyEmailRequest) {
    this.credentials.username = v.username;
    this.credentials.email = v.email;
    this.credentials.password = v.password;
    this.credentials.language = v.language;
    this.router.navigateByUrl('/waiting-for-email-verification');
  }
}
