import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { TranslationService } from 'app/translation.service';
import { EngagementService } from 'app/engagement.service';
import { EventType } from 'app/event';
import { AuthenticationService, RegistrationTokenPayload } from "app/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'waiting-for-email-verification',
  templateUrl: './waiting-for-email-verification.html',
  styleUrls: [
    './register.component.scss'
  ],
  host: {
    class: 'registerContainer',
  },
})
export class WaitingForEmailVerificationComponent {
  errorKeys: string[];
  @Input() credentials: RegistrationTokenPayload;

  constructor(
    public ts: TranslationService,
    private engagement: EngagementService,
    private auth: AuthenticationService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) { }

  login(credentials: RegistrationTokenPayload) {
    this.auth.login(credentials).subscribe(
      _ok => {
        console.log('LOGIN OK');
        this.engagement.addEventForLoggedInUser(EventType.REGISTER);
        this.ts.setLanguage(this.ts.l.iso_code);
        this.router.navigateByUrl('register-profile');
      },
      err => {
        console.error(err);
        console.log('LOGIN ERROR');
        console.log(err.error);
        this.errorKeys = err.error.messageKeys;
        this.cd.detectChanges();
      }
    );
  }
}
