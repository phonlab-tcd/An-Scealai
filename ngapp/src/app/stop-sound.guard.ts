import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { SynthesisComponent } from './student/synthesis/synthesis.component';

@Injectable({
  providedIn: 'root'
})
export class StopSoundGuard implements CanDeactivate<SynthesisComponent> {
  
  canDeactivate(
    synthesis: SynthesisComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if(synthesis.chosenSections){
      for (const section of synthesis.chosenSections) {
        section.stop();
      }
    }
    return true;
  }
}
