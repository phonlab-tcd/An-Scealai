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
    if (dashboard.synthesisPlayback.audio && Object.keys(dashboard.synthesisPlayback.turnHighlightOnTimeout).length) {
      dashboard.synthesisPlayback.clear();
    }
    return true;
  }
}
