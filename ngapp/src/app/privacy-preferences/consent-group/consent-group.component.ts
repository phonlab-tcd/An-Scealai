import { Attribute, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConsentService, ConsentData, ConsentGroup } from '../consent.service';
import { TranslationService } from "../../translation.service";
import   config from '../../../abairconfig';

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
    @Attribute('for') public forGroup: ConsentGroup,
    private http: HttpClient,
    public consent: ConsentService,
    public ts: TranslationService,
    ) {
      this.data = this.consent.consentTypes.get(this.forGroup);
      this.consent.age.subscribe(a=>
        this.disabled = not(this.data.allowUnder16) && a === "under16"
      );

  }

  choose(event) {
    const accept = event.value === "accept";
    accept ? this.data.enable() : this.data.disable();
  }

  not = not;
}
