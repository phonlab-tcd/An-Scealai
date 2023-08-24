import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { TranslationService } from "app/core/services/translation.service";
import { AuthenticationService } from "app/core/services/authentication.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(
    private _router: Router,
    public auth: AuthenticationService,
    public ts: TranslationService
  ) {}

  ngOnInit(): void {
  }

  goToStats() {
    this._router.navigateByUrl( "/stats-dashboard/" + this.auth.getUserDetails()._id );
  }

    goToMessages() {
      this._router.navigateByUrl("/messages/" +  this.auth.getUserDetails()._id);
    }

}
