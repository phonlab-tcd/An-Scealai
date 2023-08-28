import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslationService } from "app/core/services/translation.service";
import { AuthenticationService } from "app/core/services/authentication.service";
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
    //see if student is enrolled in a class (if not the case, hide message feature in html)
    this.classroomService.getClassroomOfStudent(this.auth.getUserDetails()._id).subscribe({
      next: (res) => {
        res === null ? (this.isEnrolled = false) : (this.isEnrolled = true);
      },
    });
  }

  goToStats() {
    this._router.navigateByUrl(
      "/stats-dashboard/" + this.auth.getUserDetails()._id
    );
  }

  goToMessages() {
    this._router.navigateByUrl("/messages/" + this.auth.getUserDetails()._id);
  }
}
