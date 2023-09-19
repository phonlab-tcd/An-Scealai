import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService, Notification, } from "app/core/services/notification-service.service";
import { TranslationService } from "app/core/services/translation.service";
import { AuthenticationService } from "app/core/services/authentication.service";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"],
})
export class NavBarComponent implements OnInit {
  smallMenuOpen: boolean = false;
  insideNotificationDiv: boolean = false;
  notificationsShown: boolean = false;
  notifications: Notification[] = [];
  totalNumOfMessages: number = 0;
  currentLanguageButtonId: string = '';

  constructor(
    private _router: Router,
    public auth: AuthenticationService,
    private notificationSerivce: NotificationService,
    public ts: TranslationService
  ) {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.events.subscribe((_) => {});
  }

  /**
   * Set the page language and get any notifications
   */
  async ngOnInit() {
    await this.ts.initLanguage();

    // set the language button styling
    if (this.ts.inIrish()) this.setLanguageButton("ga");
    else this.setLanguageButton("en");

    // subscribe to message emitter
    this.notificationSerivce.notificationEmitter.subscribe(
      (res: Notification[]) => {
        this.notifications = res;
        // reset message counter to 0
        this.totalNumOfMessages = 0;
        // calculate total number of notifictions
        this.notifications.forEach((entry: Notification) => {
          entry.body.forEach((notification) => {
            // for teachers, add number of messages per classroom, otherwise simply increase message counter
            if ('numClassroomMessages' in notification) {
              (this.totalNumOfMessages += notification.numClassroomMessages)
            }
            else {
              this.totalNumOfMessages++;
            }
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
   * Hide notifications and route to story dashboard component for given story -> TODO implement
   * @param id story id that has feedback
   */
  goToStory(id: string) {
    this.notificationsShown = false;
  }

  /**
   * Hide notifications and route to messages component
   * @param id user id if student, classroom id if teacher
   */
  goToMessages(id: string) {
    this.notificationsShown = false;
    this._router.navigateByUrl("/messages/" + id);
  }

  /**
   * Hide notifications and route to stats dashboard
   */
  goToStats() {
    this.notificationsShown = false;
    const user = this.auth.getUserDetails();
    if (user) this._router.navigateByUrl( "/stats-dashboard/" + user._id );
    else console.log("Can't navigate to stats, user is null");
  }

  /**
   * Route the user to the appropriate home page if logged in
   * Otherwise route to the landing apge
   */
  goToHomePage() {
    if (this.auth.isLoggedIn()) {
      const user = this.auth.getUserDetails();
      if (user) {
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
      else {
        console.log("Not able to get user details, user object is null");
      }
    }
    else {
      this._router.navigateByUrl("/landing");
    }
  }

  /**
   * Set the current language and apply CSS to language code in nav bar
   * @param languageCode code for selected language
   */
  setLanguageButton(languageCode: "en" | "ga") {
    this.ts.setLanguage(languageCode);

    // remove css highlighting for currently selected langauge
    if (this.currentLanguageButtonId) {
      const element = document.getElementById(this.currentLanguageButtonId);
      if (element) element.classList.remove("languageSelected");
    }
    this.currentLanguageButtonId = languageCode;
    // add css highlighting to the newly clicked language
    const element = document.getElementById(languageCode);
    if (element) element.classList.add("languageSelected");
  }

  // Keep track of where the user clicks
  @HostListener("click")
  clickInside() {
    this.insideNotificationDiv = true;
  }

  // Hide the notification container if user clicks on the page
  @HostListener("document:click")
  clickout() {
    if (!this.insideNotificationDiv) {
      this.notificationsShown = false;
    }
    this.insideNotificationDiv = false;
  }
}
