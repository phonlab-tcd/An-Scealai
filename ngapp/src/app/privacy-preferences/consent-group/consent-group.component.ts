import { Attribute, Component } from '@angular/core';
import { SingletonService } from '../singleton.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import   config from '../../../abairconfig';
import { ConsentService, ConsentData } from '../../services/consent.service';
import { GoogleAnalytics } from "../../services/google-analytics";
import { TranslationService } from "../../translation.service";

const not = x => x === false;

@Component({
  selector: 'consent-group',
  templateUrl: './consent-group.component.html',
  styleUrls: ['../style.scss']
})
export class ConsentGroupComponent {
  disabled: boolean;
  data: ConsentData;

  constructor(
    @Attribute('for') public forGroup: string,
    public singleton: SingletonService,
    private http: HttpClient,
    private consent: ConsentService,
    private ga: GoogleAnalytics,
    public ts: TranslationService,
    ) {
      this.data = this.consent.consentTypes[this.forGroup];
      this.singleton.age.subscribe(a=>
        this.disabled = not(this.consent.consentTypes[this.forGroup].allowUnder16) && a === "under16"
      );

  }

  choose(event) {
    const body =  {forGroup: this.forGroup, option: event.value, prose: JSON.stringify(this.consent.consentTypes[this.forGroup].prose)};
    console.log(body);
    const accept = event.value === "accept";
    this.consent.consentTypes[this.forGroup].emitter.next(accept);
    accept ? this.data.enable() : this.data.disable();
    this.http.post(config.baseurl + 'privacy-preferences', body ).subscribe();
  }

  not = not;
}
