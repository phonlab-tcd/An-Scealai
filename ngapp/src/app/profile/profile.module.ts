import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileComponent } from './profile/profile.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ProfileComponent,
  ],
  exports: [ProfileComponent],
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbModule,
  ]
})
export class ProfileModule { }
