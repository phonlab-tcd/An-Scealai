import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardComponent } from 'app/student/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class StopSoundGuard implements CanDeactivate<DashboardComponent> {
  
  canDeactivate(
    dashboard: DashboardComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    console.log('dashboard stop guard trigger');
    if (dashboard.synthButtons.playback.audio && Object.keys(dashboard.synthButtons.playback.turnHighlightOnTimeout).length) {
      dashboard.synthButtons.playback.clear();
    }
    return true;
  }
}
