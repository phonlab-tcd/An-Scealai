import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { TranslationService } from 'app/core/services/translation.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(public auth: AuthenticationService, private router: Router,
    public ts : TranslationService) { }

  ngOnInit() {
  }
}
