import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslationService } from "app/core/services/translation.service";
import { AuthenticationService, UserDetails } from "app/core/services/authentication.service";
import { ClassroomService } from "app/core/services/classroom.service";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
})
export class HomePageComponent implements OnInit {
  isEnrolled: boolean = false;

  constructor(
    private _router: Router,
    public auth: AuthenticationService,
    public ts: TranslationService,
    private classroomService: ClassroomService
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUserDetails();
    if (!user) {
      console.log("User is null");
      return;
    }
    //see if student is enrolled in a class (if not the case, hide message feature in html)
    this.classroomService.getClassroomOfStudent(user._id).subscribe({
      next: (res) => {
        res === null ? (this.isEnrolled = false) : (this.isEnrolled = true);
      },
    });
  }

  checkUserExists(): UserDetails | null {
    const user = this.auth.getUserDetails();
    if (!user) {
      console.log("User is null");
      return null;
    }
    return user;
  }

  goToStats() {
    const user = this.checkUserExists();
    if (!user) {
      return;
    }
    this._router.navigateByUrl(
      "/stats-dashboard/" + user._id
    );
  }

  goToMessages() {
    const user = this.checkUserExists();
    if (!user) {
      return;
    }
    this._router.navigateByUrl("/messages/" + user._id);
  }
}
