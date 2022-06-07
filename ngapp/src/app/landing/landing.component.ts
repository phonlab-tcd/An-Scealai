import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from 'app/services/authentication';
import { Router } from '@angular/router';
import { TranslationService } from 'app/services/translation';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(public auth: AuthenticationService, private router: Router,
    public ts : TranslationService) { }

  ngOnInit() {
    if(this.auth.isLoggedIn()) {  
      if(this.auth.getUserDetails().role === 'STUDENT') {
        this.router.navigateByUrl('/contents');
      }
      if(this.auth.getUserDetails().role === 'TEACHER') {
        this.router.navigateByUrl('/teacher');
      }
      if(this.auth.getUserDetails().role === 'ADMIN') {
        this.router.navigateByUrl('/admin');
      }
    }
  }

}
