import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { Subject } from 'rxjs';
import   config from "../../abairconfig";
import { consentTypes, proseOf, ConsentGroup } from "../privacy-preferences/consent-types";
import { SingletonService } from "../privacy-preferences/singleton.service";

const consentGroups = Object.keys(consentTypes) as ConsentGroup[];
@Injectable({
  providedIn: 'root'
})
export class ConsentService {
  private emitter: {[k: string]: Subject<boolean>} = {};
  public userAccepts$(type: ConsentGroup){
    return this.emitter[type];
  }

  rejectAll(){
    consentGroups.forEach(t=>this.emitter[t].next(false));
  }

  constructor(private auth: AuthenticationService, private http: HttpClient, private singleton: SingletonService) {
    consentGroups.forEach(t=>this.emitter[t] = new Subject<boolean>());

    // synchronise preferences
    this.auth.loggedInAs$subscribe({next: async()=>{
      const privacyPreferences = await this.http.get(config.baseurl + 'privacy-preferences').toPromise();
      if(!privacyPreferences) return this.rejectAll();
      consentGroups.forEach(t => {
        const pp = privacyPreferences[t];
        if(pp.option === "accept" && pp.prose === proseOf(t)) {
          this.emitter[t].next(true);
        } else {
          this.emitter[t].next(false);
        }
      });
    }});

    this.singleton.age.subscribe(a=>{
      if(a !== "under16") return;
      consentGroups.forEach(t => {
        const allowUnder16 = consentTypes[t].allowUnder16;
        if(!allowUnder16) {
          console.log("rejecting",t)
          this.emitter[t].next(false);
          this.http.post(config.baseurl + 'privacy-preferences',{forGroup: t, option: "reject", prose: proseOf(t)}).subscribe();
        }
      })
    });

  }
}

