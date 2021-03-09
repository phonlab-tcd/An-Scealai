import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardComponent } from './student-components/dashboard/dashboard.component';
import { RecordingComponent } from './student-components/recording/recording.component';
import { AppComponent } from './app.component';

@Injectable({
  providedIn: 'root'
})
class CanDeactivateDashboardGuard implements CanDeactivate<DashboardComponent> {
  canDeactivate(
    dashboard: DashboardComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if(dashboard.storySaved) { return true };
    dashboard.showModal();
    return dashboard.modalChoice;
  }
}

@Injectable({
  providedIn: 'root'
})
class CanDeactivateRecordingGuard implements CanDeactivate<RecordingComponent> {
  canDeactivate(
    recording: RecordingComponent
  ): Observable<boolean> | boolean {
    if(recording.recordingSaved) { return true };
    recording.showModal();
    return recording.modalChoice;
  }
}

export {CanDeactivateDashboardGuard, CanDeactivateRecordingGuard};