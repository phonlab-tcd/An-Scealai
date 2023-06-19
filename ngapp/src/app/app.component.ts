import { Component } from "@angular/core";
import { NavigationEnd } from "@angular/router";
import { Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { LogService } from 'app/core/services/log.service';

declare var gtag;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {

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
      gtag("config", "UA-178889778-1", {
        page_path: event.urlAfterRedirects,
      });
    });

    console.error = (consoleError => function () {
      const route = window.location.hash
      const error = arguments[1];
      log.clientsideError(route, error.message).subscribe();
    
      consoleError.apply(this, ...arguments);
    })(console.error);
  }
}
