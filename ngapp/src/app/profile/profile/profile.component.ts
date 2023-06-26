import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { EngagementService } from 'app/core/services/engagement.service';
import { EventType } from 'app/core/models/event';
import { TranslationService } from 'app/core/services/translation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  displayComponent: string;
  lastClickedMenuId: string = "";

  constructor(public auth: AuthenticationService,
              private engagement: EngagementService,
              public ts: TranslationService) { }

  /**
   * Set the first button on the side menu as currently selected
   */         
  ngOnInit() {
    document.getElementById('1').classList.add("clickedMenu");
    this.lastClickedMenuId = '1';
  }

  /**
   * Define the component to display in the html body
   * Highlight the selected menu option on the side nav bar
   * @param componentToDisplay name of component to display
   * @param id id of side menu div to highlight
   */
  setCurrentDisplay(componentToDisplay, id) {
    this.displayComponent = componentToDisplay;
    // set css for selecting an option in the side nav
    let menuElement = document.getElementById(id);

    if (menuElement) {
      // remove css highlighting for currently highlighted story
      if (this.lastClickedMenuId) {
        document.getElementById(this.lastClickedMenuId).classList.remove("clickedMenu");
      }
      this.lastClickedMenuId = id;
      // add css highlighting to the newly clicked story
      menuElement.classList.add("clickedMenu");
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
