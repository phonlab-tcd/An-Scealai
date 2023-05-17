import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { TranslationService } from 'app/core/services/translation.service';
import { NotificationService } from 'app/core/services/notification-service.service';
import { ProfileService } from "app/core/services/profile.service";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(public auth: AuthenticationService, private router: Router,
    public ts : TranslationService, private notificationService: NotificationService, private profileService: ProfileService,) { }

  ngOnInit() {
    if(this.auth.isLoggedIn()) {  
      this.checkIfProfileFilledOut(this.auth.getUserDetails()._id);
      
      // if(this.auth.getUserDetails().role === 'STUDENT') {
      //   this.checkIfProfileFilledOut(this.auth.getUserDetails()._id);
      //   this.notificationService.getStudentNotifications();
      //   this.router.navigateByUrl('/student');
      // }
      // if(this.auth.getUserDetails().role === 'TEACHER') {
      //   this.checkIfProfileFilledOut(this.auth.getUserDetails()._id);
      //   this.router.navigateByUrl('/teacher');
      // }
      // if(this.auth.getUserDetails().role === 'ADMIN') {
      //   this.router.navigateByUrl('/admin');
      // }
    }
  }

  /**
   * Check if the user has filled out their profile
   * @param id user id
   */
    checkIfProfileFilledOut(id) {
      this.profileService.getForUser(id).subscribe({
        next: () => {
          if(this.auth.getUserDetails().role === 'STUDENT') {
            this.notificationService.getStudentNotifications();
            this.router.navigateByUrl('/student');
          }
          if(this.auth.getUserDetails().role === 'TEACHER') {
            this.router.navigateByUrl('/teacher');
          }
          if(this.auth.getUserDetails().role === 'ADMIN') {
            this.router.navigateByUrl('/admin');
          }
        },
        error: () => this.router.navigateByUrl("/register-profile"),
      });
    }

}
