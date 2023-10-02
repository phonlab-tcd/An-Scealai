import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';

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
    ReactiveFormsModule,
    MatSidenavModule,
    MatFormFieldModule, // not used currently
    MatInputModule // not used currently
  ]
})
export class ProfileModule { }
