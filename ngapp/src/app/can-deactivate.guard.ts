import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { SaveGuarded } from './abstract-save-guarded-component';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateSaveGuard implements CanDeactivate<SaveGuarded> {
  canDeactivate(guarded: SaveGuarded): Observable<boolean> {
    if(guarded.saved()) { return of(true) };
    guarded.showDialog();
    return guarded.dialogChoice();
  }
}
