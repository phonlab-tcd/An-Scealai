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
    const originalConsoleError = console.error;
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.events.subscribe((routeEvent) => {
      if (routeEvent instanceof NavigationEnd) {
        console.error = (consoleError => function () {
          const route = routeEvent.urlAfterRedirects
          const error = arguments[1];
          log.clientsideError(route, error.message).subscribe();
        
          consoleError.apply(this, arguments);
        })(originalConsoleError);
      }
    });
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
