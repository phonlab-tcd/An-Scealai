import { Component } from "@angular/core";
import { NavigationEnd } from "@angular/router";
import { Router } from "@angular/router";
import { filter } from "rxjs/operators";

declare var gtag;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {

  constructor(
    private _router: Router,
  ) {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.events.subscribe((_) => {});

    // add google analytics tag
    const navEndEvents = this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    );
    navEndEvents.subscribe((event: NavigationEnd) => {
      gtag("config", "UA-178889778-1", {
        page_path: event.urlAfterRedirects,
      });
    });
  }
}
