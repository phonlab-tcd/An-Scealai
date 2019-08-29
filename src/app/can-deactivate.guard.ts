import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardComponent } from './student-components/dashboard/dashboard.component';
import { AppComponent } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<DashboardComponent> {
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