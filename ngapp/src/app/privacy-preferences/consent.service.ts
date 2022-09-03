import { Injectable, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import type { Observable } from 'rxjs';
import { of, BehaviorSubject } from 'rxjs';
import config from "../../abairconfig";
import { GoogleAnalytics } from 'app/services/google-analytics';
import { EngagementService } from '../engagement.service';
import { MatDialog } from "@angular/material/dialog";
import { TryingToUseFeaturesThatRequireConsentComponent } from "./trying-to-use-features-that-require-consent.dialog.component"
import { PleaseSpecifyPrivacyPreferences } from "./please-specify-privacy-preferences.dialog.component";

export interface ConsentData {
  prose: {
    en: {short: string;full: string};
    ga: {short: string;full: string};
  };
  disable: Function;
  enable: Function;
  allowUnder16: boolean;
  isEnabled: ()=>boolean;
}

export const consentKey = ["Google Analytics", "Engagement", "Cloud Storage"] as const;

const httpMethods = ['request','post','get','patch','options','jsonp','delete','head','put'] as const;

function fakeHttpFunc<T>() {
  return of(undefined) as Observable<any>;
}
@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  private fakeHttpFunc() {
    this.dialog.open(TryingToUseFeaturesThatRequireConsentComponent);
    return of(undefined) as Observable<any>;
  }
  private fakeHttp = {
    post: fakeHttpFunc,
    get: fakeHttpFunc,
  }
  public http: HttpClient | typeof this.fakeHttp;

  age = (()=>{
    const subject = new BehaviorSubject<"under16"|"over16">(undefined);
    this.realHttp.get<"under16"|"over16">(config.baseurl + 'privacy-preferences/age')
      .subscribe((body)=>subject.next(body));
    return subject;
  })();

  constructor(
    private engagement: EngagementService,
    private auth: AuthenticationService,
    public realHttp: HttpClient,
    private dialog: MatDialog,
  ) {
    this.http = this.realHttp;

    // synchronise preferences
    this.auth.loggedInAs$subscribe( async () => {
        const privacyPreferences = await this.http.get(config.baseurl + 'privacy-preferences').toPromise();
        if(!privacyPreferences) return this.dialog.open(PleaseSpecifyPrivacyPreferences, {disableClose: true});
        Object.entries(this.consentTypes).forEach(([t,o])=>{
          const pp = privacyPreferences[t];
          const enabled = pp.option === "accept" && pp.prose === JSON.stringify(o.prose);
          if(enabled)  o.enable();
          else o.disable();
        });
      });

    this.age.subscribe(a => {
      if (a !== "under16") return;
      Object.entries(this.consentTypes).forEach(([t,o]) => {
        if (!o.allowUnder16) {
          this.http.post(config.baseurl + 'privacy-preferences', { forGroup: t, option: "reject", prose: JSON.stringify(o.prose) }).subscribe();
        }
      })
    });

  }

  consentTypes: {[key: string]: ConsentData} = {
    'Google Analytics': {
      prose: {
        en: {
          short: "Send anonymous usage data to An Scéalaí's Google Analytics account.",
          full: `
            By enabling this feature you agree to have anonymous data about how you interact with the An Scéalaí platform processed by Google Analytics.
            Google Analytics will be allowed to process information about which pages of the website you visit,
            how long you spend on each page, your approximate geographic location, and the devices you use to access the site.
            This data will be anonymised and it will not be possible for Google Analytics or An Scéalaí link this data to your account.
            Please consider enabling this feature to help the An Scéalaí development team can continue to improve you experience with the site.
            `,
        },
        ga: {
          short: `todo`,
          full: `todo`,
        },
      },
      allowUnder16: false,
      enable: () => GoogleAnalytics.disable(false),
      disable: () => GoogleAnalytics.disable(true),
      isEnabled: () => GoogleAnalytics.isEnabled(),
    },
    'Engagement': {
      prose: {
        en: {
          short: "Allow An Scéalaí to store additional data about how you use the website.",
          full: `
            An Scéalaí can record fine-grained information about the features of the website you use.
            This data is not anonymised, and An Scéalaí <b>can</b> link the recorded data to your account.
            This data will not be processed by any third parties, unless you release the data explicitly in the future.
            If you do nothing, the data will never be shared with a third party.
            Please consider enabling this feature to help the An Scéalaí development team improve the tools offered on the website.
            `,
        },
        ga: {
          short: `todo`,
          full: `todo`,
        }
      },
      allowUnder16: false,
      enable:  () => { this.engagement.enable()  },
      disable: () => { this.engagement.disable() },
      isEnabled: () => this.engagement.http === this.engagement.realHttp,
    },
    'Cloud Storage': {
      prose: {
        en: {
          short: "Store your documents and messages securely on An Scéalaís database in the cloud.",
          full: `
            The An Scéalaí website uses a backend server to enable most of its functionality.
            In order for An Scéalaí to function normally
            it is required that you consent to having your data
            processed on our private cloud infrastructure.
            Unfortunately, at this time, most of the pages on the An Scéalaí site will be inaccessible
            if you decide not to allow An Scéalaí to process your data in this way.
          `,
        },
        ga: {
          short: ``,
          full: ``,
        }
      },
      allowUnder16: true,
      enable:  () => this.http = this.realHttp,
      disable:  () => this.http = this.fakeHttp,
      isEnabled: () => this.http === this.realHttp,
    },
  } as const;
}