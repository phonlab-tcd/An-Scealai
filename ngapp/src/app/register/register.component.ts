import { Component, ChangeDetectorRef } from '@angular/core';
import { RegistrationTokenPayload } from 'app/core/services/authentication.service';
import { TranslationService } from 'app/core/services/translation.service';
import { WaitingForEmailVerificationComponent } from './waiting-for-email-verification';
import { RegisterFormComponent } from './form.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, WaitingForEmailVerificationComponent, RegisterFormComponent],
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
