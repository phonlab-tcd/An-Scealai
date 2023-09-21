import { Component } from "@angular/core";
import { NavigationEnd } from "@angular/router";
import { Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { LogService } from 'app/core/services/log.service';
import { BehaviorSubject, lastValueFrom } from "rxjs";
import { type } from "os";

declare var gtag;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  currentRoute="";

  constructor(
    private _router: Router,
    private log: LogService
  ) {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    // add google analytics tag
    const navEndEvents = this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    );
    navEndEvents.subscribe((event: NavigationEnd) => {
      gtag("config", "G-CYK4VM4ZZM", {
        page_path: event.urlAfterRedirects,
      });
    });
    this._router.events.pipe(filter(function(event){ return "url" in event}))
      .subscribe(
        (function(event){this.currentRoute=event.url;})
        .bind(this)
      );

    console["originalError"] = console.error;

    const logBackend = (async function() {
      function validateError(e) {
        if(!e) return "undefined";
        if(e instanceof String || typeof e === "string") return e;
        if("message" in e) return e.message;
        try { return JSON.stringify(e); }
        catch(e) { return "ERROR NOT SERIALIZABLE"}
      }
      try {
        const errorSerial = validateError(arguments);
        this.log.clientsideError(this.currentRoute, errorSerial)
          .subscribe({error: console["originalError"]});
      } catch(e) {
        console["originalError"](e);
      }

    }).bind(this);

    // console.error = (async function () {
    //   try {
    //   logBackend(...arguments);
    //   } catch(e) {
    //     console["originalError"]();
    //   }
    //   console["originalError"](...arguments);
    // }).bind(this);

    //window.onerror = logBackend;
  }
}
