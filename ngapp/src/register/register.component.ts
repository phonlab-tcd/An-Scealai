import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RegistrationTokenPayload } from 'app/authentication.service';
import { TranslationService } from 'app/translation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    public ts: TranslationService,
    private cd: ChangeDetectorRef,
  ) { }

  successfulCredentials: RegistrationTokenPayload = null;

  registerSuccess(creds: RegistrationTokenPayload) {
    this.successfulCredentials = creds;
    this.cd.detectChanges();
  }

  ngOnInit() { }
}
