import { Component              } from '@angular/core';
import { HostListener           } from '@angular/core';
import { NavigationEnd          } from '@angular/router';
import { Router                 } from '@angular/router';
import { filter                 } from 'rxjs/operators';
import { Story                  } from 'app/story';
import { Message                } from 'app/message';
import { Classroom              } from 'app/classroom';
import { NotificationService    } from 'app/notification-service.service';
import { TranslationService     } from 'app/translation.service';
import { AuthenticationService  } from 'app/authentication.service';

declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'An Scéalaí';
  checkVal: boolean = false;
  notificationsShown: boolean = false;
  storiesForNotifications: Story[] = [];
  messagesForNotifications: Message[] = [];  
  teacherMessagesForNotifications: Map<Classroom, number> = new Map();
  wasInside: boolean = false;
  currentUser: string = '';
  teacherMessagesSum: number = 0;
  currentLanguage: string = '';

  constructor(
    private _router: Router,
    public auth: AuthenticationService,
    private notificationSerivce : NotificationService,
    public ts: TranslationService,
  ) {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.events.subscribe((_) => {});

    const navEndEvents = this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );
    navEndEvents.subscribe((event: NavigationEnd) => {
      gtag('config', 'UA-178889778-1', {
        'page_path' : event.urlAfterRedirects
      });
    });
  }

  // Set the page langauge
  // Get list of stories that have notifications
  ngOnInit() {
    this.ts.initLanguage();
    this.currentLanguage = this.ts.getCurrentLanguage();
    this.notificationSerivce.storyEmitter.subscribe( (res) => {
      this.storiesForNotifications = res;
    });

    this.notificationSerivce.messageEmitter.subscribe( (res) => {
      this.messagesForNotifications = res;
    });

    this.notificationSerivce.teacherMessageEmitter.subscribe( (res) => {
      this.teacherMessagesForNotifications = res;
      this.teacherMessagesSum = 0;
      for (let entry of Array.from(this.teacherMessagesForNotifications.entries())) {
        this.teacherMessagesSum += entry[1];
      }
    });
  }

  // Swap value of checkVal
  // if changed to false set notificationShown to false
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

  changeToEnglish() {
    this.ts.setLanguage("en");
    this.currentLanguage = "English";
  }

  changeToIrish() {
    this.ts.setLanguage("ga");
    this.currentLanguage = "Gaeilge";
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
