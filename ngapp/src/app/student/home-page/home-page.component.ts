import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslationService } from "app/core/services/translation.service";
import { AuthenticationService, UserDetails } from "app/core/services/authentication.service";
import { ClassroomService } from "app/core/services/classroom.service";
import { ReplaySubject, takeUntil } from "rxjs";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
})
export class HomePageComponent implements OnInit, OnDestroy {
  isEnrolled: boolean = false;
  user: UserDetails | null = null;
  private readonly destroyed = new ReplaySubject<void>();

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
    this.user = user;
    const classroom = localStorage.getItem("classroom");
    if (!classroom) {
      //see if student is enrolled in a class (if not the case, hide message feature in html)
      this.classroomService.getClassroomOfStudent(user._id).pipe(takeUntil(this.destroyed)).subscribe({
        next: (res) => {
          res === null ? (this.isEnrolled = false) : (this.isEnrolled = true);
          localStorage.setItem("classroom", JSON.stringify(res));
        },
      });
    }
    else {
      this.isEnrolled = true;
    }

  }

  goToStats() {
    if (!this.user) {
      return;
    }
    this._router.navigateByUrl(
      "/stats-dashboard/" + this.user._id
    );
  }

  goToMessages() {
    if (!this.user) {
      return;
    }
    this._router.navigateByUrl("/messages/" + this.user._id);
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
