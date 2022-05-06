import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterComponent } from './register.component';
import { RegisterFormComponent } from './form.component';
import { WaitingForEmailVerificationComponent } from './waiting-for-email-verification';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { CredentialsService } from './credentials.service';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RegisterFormComponent,
    WaitingForEmailVerificationComponent,
    ForgotPasswordComponent,
    LoginFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    RegisterComponent,
    LoginComponent,
  ],
  providers: [
    CredentialsService,
  ],
})
export class RegisterModule { }
