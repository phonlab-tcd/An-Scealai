import { Component, OnInit, HostListener } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { NavigationCancel, Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { StoryService } from './story.service';
import { Story } from './story';
import { Message } from './message';
import { Classroom } from './classroom';
import { NotificationService } from './notification-service.service';
import { EngagementService } from './engagement.service';
import { TranslationService } from './translation.service';
import { MessageService } from './message.service';
import { filter } from 'rxjs/operators';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
  title: string = 'An Scéalaí';
  checkVal: boolean = false;
  notificationsShown : boolean = false;
  storiesForNotifications : Story[] = [];
  messagesForNotifications: Message[] = [];  
  teacherMessagesForNotifications: Map<Classroom, number> = new Map();
  wasInside : boolean = false;
  currentUser: string = '';
  teacherMessagesSum: number = 0;
  currentLanguage: string = '';

  constructor(private _loadingBar: SlimLoadingBarService, private _router: Router, public auth: AuthenticationService,
              private storyService : StoryService, private notificationSerivce : NotificationService,
              private engagement: EngagementService, public ts : TranslationService) {
    this._router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });
    
    const navEndEvents = this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );
    navEndEvents.subscribe((event: NavigationEnd) => {
      gtag('config', 'UA-178889778-1', {
        'page_path' : event.urlAfterRedirects
      });
    });
  }

/*
* Set the page langauge
* Get list of stories that have notifications
*/
  ngOnInit() {
    this.ts.initLanguage();
    this.currentLanguage = this.ts.getCurrentLanguage();
    console.log(this.currentLanguage);
    this.notificationSerivce.storyEmitter.subscribe( (res) => {
      this.storiesForNotifications = res;
      console.log(this.storiesForNotifications);
    });

    this.notificationSerivce.messageEmitter.subscribe( (res) => {
      this.messagesForNotifications = res;
      console.log(this.messagesForNotifications);
    });
  
    this.notificationSerivce.teacherMessageEmitter.subscribe( (res) => {
      this.teacherMessagesForNotifications = res;
      console.log(this.teacherMessagesForNotifications);
      this.teacherMessagesSum = 0;
      for (let entry of Array.from(this.teacherMessagesForNotifications.entries())) {
        this.teacherMessagesSum += entry[1];
      }
      console.log(this.teacherMessagesSum);
    });
    
    if(this.auth.isLoggedIn()){
      console.log(this.auth.getUserDetails().username);
    }
  }

/*
* Swap value of checkVal, if changed to false set notificationShown to false
*/
  changeCheck() {
    if(this.checkVal === false) {
      this.checkVal = true;
    } else {
      this.checkVal = false;
      this.notificationsShown = false;
    }
  }
  
// Set value to show notifications to true
  showNotifications() {
    this.notificationsShown = !this.notificationsShown;
  }

// Hide notifications and route to story dashboard component
  goToStory(id : string) {
    this.notificationsShown = false;
    this._router.navigateByUrl('/dashboard/' + id);
  }
  
  goToMessages(id: string) {
    this.notificationsShown = false;
    this._router.navigateByUrl('/messages/' + id);
  }

  toggleLanguage(){
    if(this.currentLanguage === "English"){
      this.changeToIrish();
    }
    else {
      this.changeToEnglish();
    }
  }
  
  otherLanguage() : string{
    if(this.currentLanguage === "English"){
      return "Irish";
    }
    return "Béarla";
  }

  changeToEnglish() {
    this.ts.setLanguage("en");
    this.currentLanguage = "English";
  }
  
  changeToIrish() {
    this.ts.setLanguage("ga");
    this.currentLanguage = "Gaeilge";
  }

/*
* Change loading bar status based on current event
*/
  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this._loadingBar.start();
    }
    if (event instanceof NavigationEnd) {
      this._loadingBar.complete();
    }
    if (event instanceof NavigationCancel) {
      this._loadingBar.stop();
    }
    if (event instanceof NavigationError) {
      this._loadingBar.stop();
    }
  }

// Keep track of where the user clicks
  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

// Hide the notification container if user clicks on the page
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.notificationsShown = false;
    }
    this.wasInside = false;
  }
  
}
