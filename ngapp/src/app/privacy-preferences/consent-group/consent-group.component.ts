import type { ConsentGroup } from '../consent-types';
import { consentTypes } from '../consent-types';
import { Attribute, Component } from '@angular/core';
import { SingletonService } from '../singleton.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import   config from '../../../abairconfig';

const not = x => x === false;

@Component({
  selector: 'consent-group',
  templateUrl: './consent-group.component.html',
  styleUrls: ['../style.scss']
})
export class ConsentGroupComponent {
  rejectAll = new Subject<"reject">();
  data: typeof consentTypes[ConsentGroup];
  disabled: boolean;

  constructor(
    @Attribute('for') public forGroup: ConsentGroup,
    public singleton: SingletonService,
    private http: HttpClient,
    ) {
    this.data = consentTypes[forGroup];
    this.singleton.age.subscribe(a=>
      this.disabled = not(this.data.allowUnder16) && a === "under16"
    );

  }

  choose(event) {
    const body =  {forGroup: this.forGroup, option: event.value, prose: `<p>${this.data.short}</p><p>${this.data.full}</p>`};
    console.log(body);
    this.http.post(config.baseurl + 'privacy-preferences', body ).subscribe();
  }

  not = not;
}
