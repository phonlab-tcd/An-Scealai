import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './profile/profile.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { RegisterProfileComponent } from './register-profile/register-profile.component'


@NgModule({
  declarations: [
    ProfileComponent,
    AccountSettingsComponent,
    RegisterProfileComponent
  ],
  exports: [ProfileComponent, RegisterProfileComponent],
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule { }
