import { Component, ChangeDetectorRef } from '@angular/core';
import { RegistrationTokenPayload } from 'app/authentication.service';
import { TranslationService } from 'app/translation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(
    public ts: TranslationService,
    private cd: ChangeDetectorRef,
  ) { }

  successfulCredentials: RegistrationTokenPayload = null;

  /**
   * Get the registration credentials after successful registration
   * @param creds registration credentials created in form.component
   */
  registerSuccess(creds: RegistrationTokenPayload) {
    this.successfulCredentials = creds;
    this.cd.detectChanges();
  }
}
