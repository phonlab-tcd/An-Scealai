import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { RegisterFormComponent } from './form.component';
import { WaitingForEmailVerificationComponent } from './waiting-for-email-verification';


@NgModule({
  declarations: [
    RegisterComponent,
    RegisterFormComponent,
    WaitingForEmailVerificationComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    RegisterComponent,
  ],
})
export class RegisterModule { }
