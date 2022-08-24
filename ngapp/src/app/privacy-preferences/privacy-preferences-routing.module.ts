import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyPreferencesComponent } from './privacy-preferences.component';

const routes: Routes = [{ path: '', component: PrivacyPreferencesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivacyPreferencesRoutingModule { }
