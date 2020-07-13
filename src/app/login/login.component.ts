import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { EventType } from '../event';
import { EngagementService } from '../engagement.service';
import { TranslationService } from '../translation.service';
import { NotificationService } from '../notification-service.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { StoryService } from '../story.service';
import { AppComponent } from '../app.component';

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
  newComponent;

  constructor(private auth: AuthenticationService, private router: Router,
              private engagement: EngagementService, public ts : TranslationService, 
              public ns: NotificationService, 
            
            
              public _loadingBar: SlimLoadingBarService,
                          private storyService : StoryService, 
                        ) { this.newComponent = new AppComponent(_loadingBar, router, auth, storyService, ns, engagement, ts); }

  ngOnInit() {
    this.loginError = false;
    //this.newComponent.ngOnInit();
    //this.newComponent = new AppComponent(this._loadingBar, this._router, this.auth, storyService, notificationSerivce, engagement, ts);
  }

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.engagement.addEventForLoggedInUser(EventType.LOGIN);
      //this.newComponent.ngOnInit();
      this.router.navigateByUrl('/landing');
    }, (err) => {
      if(err.status === 400) {
        this.errorText = err.error.message;
        this.loginError = true;
      }
    });
    
  }

}
