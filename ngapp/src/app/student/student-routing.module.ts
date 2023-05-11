import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'app/core/services/auth-guard.service';
import { CanDeactivateDashboardGuard } from 'app/core/guards/can-deactivate.guard';
import { StopSoundGuard } from 'app/core/guards/stop-sound.guard';
import { BookContentsComponent } from './book-contents/book-contents.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SynthesisComponent } from './synthesis/synthesis.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'contents' },
  { path: 'contents', component: BookContentsComponent, canActivate: [AuthGuardService] },
  { path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateDashboardGuard] },
  { path: 'synthesis/:id', component: SynthesisComponent, canActivate: [AuthGuardService], canDeactivate: [StopSoundGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
