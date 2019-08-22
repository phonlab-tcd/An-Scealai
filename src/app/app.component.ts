import { Component, OnInit, HostListener } from '@angular/core';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { NavigationCancel,
        Event,
        NavigationEnd,
        NavigationError,
        NavigationStart,
        Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { StoryService } from './story.service';
import { Story } from './story';
import { NotificationService } from './notification-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'An Scéalaí';

  checkVal = false;
  notificationsShown : boolean = false;
  storiesForNotifications : any;

  changeCheck() {
    if(this.checkVal === false) {
      this.checkVal = true;
    } else {
      this.checkVal = false;
    }
  }

  constructor(private _loadingBar: SlimLoadingBarService, private _router: Router, public auth: AuthenticationService,
              private storyService : StoryService, private notificationSerivce : NotificationService) {
    this._router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit() {
    this.notificationSerivce.getStories().subscribe((res: Story[]) => {
      this.storiesForNotifications = res;
    });
  }

  showNotifications() {
    this.notificationsShown = !this.notificationsShown;
  }

  goToStory(id : string) {
    this.notificationsShown = false;
    this._router.navigateByUrl('/dashboard/' + id);
  }

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

  wasInside : boolean = false;
  
  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }
  
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.notificationsShown = false;
    }
    this.wasInside = false;
  }
}
