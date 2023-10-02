import { Component, OnInit, ViewChild } from "@angular/core";
import { BreakpointObserver, Breakpoints, BreakpointState, } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthenticationService } from "app/core/services/authentication.service";
import { EngagementService } from "app/core/services/engagement.service";
import { EventType } from "app/core/models/event";
import { TranslationService } from "app/core/services/translation.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  componentToDisplay: string = "";
  lastClickedMenuId: string = "";
  @ViewChild("drawer") drawer: any;

  constructor(
    public auth: AuthenticationService,
    private engagement: EngagementService,
    public ts: TranslationService,
    private breakpointObserver: BreakpointObserver
  ) {}

  // check if the device is mobile or desktop
  public isMobile$: Observable<boolean> = this.breakpointObserver
  .observe(Breakpoints.Handset)
  .pipe(map((result: BreakpointState) => result.matches));

  /**
   * Set the first button on the side menu as currently selected
   */
  ngOnInit() {
    document.getElementById("accountSettings")?.classList.add("clickedMenu");
    this.lastClickedMenuId = "accountSettings";
  }

  /**
   * Define which component to display based on selected menu option
   * Highlight the selected menu option on the side nav bar
   * @param componentToDisplay name of component to display (used in HTML switch)
   * @param id id of side menu div to highlight
   */
  setCurrentDisplay(componentToDisplay: string, id: string) {
    this.componentToDisplay = componentToDisplay;
    // set css for selecting an option in the side nav
    let menuElement = document.getElementById(id);

    if (menuElement) {
      // remove css highlighting for currently highlighted story
      if (this.lastClickedMenuId) {
        document
          .getElementById(this.lastClickedMenuId)
          ?.classList.remove("clickedMenu");
      }
      this.lastClickedMenuId = id;
      // add css highlighting to the newly clicked story
      menuElement.classList.add("clickedMenu");
    }

    // close sidenav if the device is mobile
    if (this.drawer._mode == "over") {
      this.drawer.close();
    }
  }

  /**
   * Logout the user
   */
  logout() {
    this.engagement.addEventForLoggedInUser(EventType.LOGOUT);
    this.auth.logout();
  }
}
