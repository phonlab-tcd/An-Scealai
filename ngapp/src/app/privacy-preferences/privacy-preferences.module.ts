import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyPreferencesRoutingModule } from './privacy-preferences-routing.module';
import { PrivacyPreferencesComponent } from './privacy-preferences.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    PrivacyPreferencesComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatSlideToggleModule,
    PrivacyPreferencesRoutingModule,
  ]
})
export class PrivacyPreferencesModule { }
