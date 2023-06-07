import { Component, OnInit } from '@angular/core';
import { HostListener } from "@angular/core";
import { NavigationEnd } from "@angular/router";
import { Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { NotificationService, Notification } from "app/core/services/notification-service.service";
import { TranslationService } from "app/core/services/translation.service";
import { AuthenticationService } from "app/core/services/authentication.service";

//declare var gtag;

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  title: string = "An Scéalaí";
  smallMenuOpen: boolean = false;
  notificationsShown: boolean = false;
  wasInside: boolean = false;
  currentUser: string = "";
  currentLanguage: string = "";
  notifications: Notification[] = [];
  totalNumOfMessages: number = 0;

  constructor(
    private _router: Router,
    public auth: AuthenticationService,
    private notificationSerivce: NotificationService,
    public ts: TranslationService
  ) {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.events.subscribe((_) => {});

    // const navEndEvents = this._router.events.pipe(
    //   filter((event) => event instanceof NavigationEnd)
    // );
    // navEndEvents.subscribe((event: NavigationEnd) => {
    //   gtag("config", "UA-178889778-1", {
    //     page_path: event.urlAfterRedirects,
    //   });
    // });
  }

  /**
   * Set the page language and get any notifications
   */
  ngOnInit() {
    this.ts.initLanguage();
    this.currentLanguage = this.ts.getCurrentLanguage();
    // subscribe to message emitter
    this.notificationSerivce.notificationEmitter.subscribe(
      (res: Notification[]) => {
        this.notifications = res;
        // reset message counter to 0
        this.totalNumOfMessages = 0;
        // calculate total number of notifictions
        this.notifications.forEach((entry) => {
          entry.body.forEach((notification) => {
            // for teachers, add number of messages per classroom, otherwise simply increase message counter
            notification.numClassroomMessages
              ? (this.totalNumOfMessages += notification.numClassroomMessages)
              : this.totalNumOfMessages++;
          });
        });
      }
    );
  }

  /**
   * Open/close the hamburger (3-bar) small menu that is visible on
   * phones and devices with smaller screens
   */
  toggleSmallMenu() {
    if (this.smallMenuOpen) {
      this.smallMenuOpen = false;
      this.notificationsShown = false;
    }
    else {
      this.smallMenuOpen = true;
    }
  }

  /* Show/hide notifications */
  showNotifications() {
    this.notificationsShown = !this.notificationsShown;
  }

  /**
   * Hide notifications and route to story dashboard component for given story
   * @param id story id that has feedback
   */
  goToStory(id: string) {
    this.notificationsShown = false;
    this._router.navigateByUrl("/student/dashboard/" + id);
  }

  /**
   * Hide notifications and route to messages component
   */
  goToMessages() {
    this.notificationsShown = false;
    this._router.navigateByUrl("/messages/" + this.auth.getUserDetails()._id);
  }

  /**
   * Hide notifications and route to stats dashboard
   */
  goToStats() {
    this.notificationsShown = false;
    this._router.navigateByUrl("/stats-dashboard/" + this.auth.getUserDetails()._id);
  }

  /**
   * Route the user to the appropriate home page
   */
  goToHomePage() {
    let user = this.auth.getUserDetails();
    if (user.role === "STUDENT") {
      this._router.navigateByUrl("/student");
    }
    else if (user.role === "TEACHER") {
      this._router.navigateByUrl("/teacher");
    }
    else {
      this._router.navigateByUrl("/admin");
    }
  }

  toggleLanguage() {
    if (this.currentLanguage === "English") {
      this.changeToIrish();
    } else {
      this.changeToEnglish();
    }
  }

  changeToEnglish() {
    this.ts.setLanguage("en");
    this.currentLanguage = "English";
  }

  changeToIrish() {
    this.ts.setLanguage("ga");
    this.currentLanguage = "Gaeilge";
  }

  // Keep track of where the user clicks
  @HostListener("click")
  clickInside() {
    this.wasInside = true;
  }

  // Hide the notification container if user clicks on the page
  @HostListener("document:click")
  clickout() {
    if (!this.wasInside) {
      this.notificationsShown = false;
    }
    this.wasInside = false;
  }
}
