import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

const analyticsId="UA-178889778-1";
const disableStr = `ga-disable-${analyticsId}`;

function disable(disable = true) {
  window[disableStr] = disable;
}

function isDisabled() {
  return window[disableStr];
}

const disabled$ = new Subject<boolean>();


@Injectable({providedIn: 'root'})
export class GoogleAnalytics {
  disable(d=true) { disable(d) }
}