import { Component } from '@angular/core';
import { SingletonService } from '../singleton.service';
import { HttpClient } from '@angular/common/http';
import config from '../../../abairconfig';

@Component({
  selector: 'confirm-age',
  templateUrl: './confirm-age.component.html',
  styleUrls: ['./../style.scss']
})
export class ConfirmAgeComponent {
  constructor(public singleton: SingletonService,private http: HttpClient){}
  ageProse = Object.freeze({
    short: "If you are under the age of digital consent, you can  still use An Séalaí, but we will only process data necessary for the normal functioning of the website features.",
    full: `
        Data protection law is different for people below the age of digital consent. We assume the age of digital consent
        In order to ensure that we are complying with the law on data protection we need to know if you are below the age of digital consent.
        All of the features of An Scéalaí will continue to work either way,
        but users above the age of digital consent have the option to enable additional data processing.
    `,
    settings: [
        {value: "under16", display: "I am under 16."},
        {value: "over16", display: "I am over 16."}
    ],
  } as const);

  choose(event){
    console.log(event);
    this.singleton.age.next(event.value);
    this.http.post(config.baseurl + 'privacy-preferences/age',{range:event.value}).subscribe();
  }
}