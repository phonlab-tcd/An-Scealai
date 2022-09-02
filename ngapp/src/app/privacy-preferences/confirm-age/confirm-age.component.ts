import { Component } from '@angular/core';
import { SingletonService } from '../singleton.service';
import { HttpClient } from '@angular/common/http';
import config from '../../../abairconfig';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'confirm-age',
  templateUrl: './confirm-age.component.html',
  styleUrls: ['./../style.scss']
})
export class ConfirmAgeComponent {
  constructor(public singleton: SingletonService,private http: HttpClient,public ts: TranslationService){}
  ageProse = Object.freeze({
    en:{
      short: "If you are under the age of digital consent, you can  still use An Séalaí, but we will only process data necessary for the normal functioning of the website features.",
      full: `
        Data protection law is different for people below the age of digital consent. We assume the age of digital consent
        In order to ensure that we are complying with the law on data protection we need to know if you are below the age of digital consent.
        All of the features of An Scéalaí will continue to work either way,
        but users above the age of digital consent have the option to enable additional data processing.
      `,
    },
    ga: {
      short: "todo",
      full: "todo",
    },
  } as const);

  choose(event){
    console.log(event);
    this.singleton.age.next(event.value);
    this.http.post(config.baseurl + 'privacy-preferences/age',{range:event.value}).subscribe();
  }
}