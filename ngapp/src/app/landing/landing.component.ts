import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "app/core/services/authentication.service";
import { Router, RouterModule } from "@angular/router";
import { TranslationService } from "app/core/services/translation.service";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  selector: "app-landing",
  imports: [CommonModule, RouterModule],
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit {
  constructor(
    public auth: AuthenticationService,
    private router: Router,
    public ts: TranslationService
  ) {}

  /**
   * We want to redirect the user to their home page based on their role if they are logged in
   * Othwersie do nothing but display the landing
   */
  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      const user = this.auth.getUserDetails();
      if (user) {
        if (user.role === "STUDENT") {
          this.router.navigateByUrl("/student");
        }
        else if (user.role === "TEACHER") {
          this.router.navigateByUrl("/teacher");
        }
        else if (user.role === "ADMIN") {
          this.router.navigateByUrl("/admin");
        }
        else {
          console.log("User ROLE is not defined in the landing, cannot redirect")
        }
      } else {
        console.log( "Not able to get user details in the landing, user object is null" );
      }
    }
  }
}
