import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { LegacySynthPage } from './synthesis/legacy-synth-page/synthesis.component';
import { SynthService } from './synthesis/synth.service';

@Injectable({
  providedIn: 'root'
})
export class StopSoundGuard implements CanDeactivate<LegacySynthPage> {
  
  canDeactivate(synthesis: LegacySynthPage): Observable<boolean> | boolean {
    for (const section of synthesis.chosenSections) {
      section.stop();
    }
    return true;
  }

}
