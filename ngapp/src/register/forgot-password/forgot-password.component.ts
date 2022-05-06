import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/translation.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../register.component.css'],
  host: {
    class: 'registerContainer',
  }
})
export class ForgotPasswordComponent implements OnInit {
  username: string;
  errKeys: string[];
  okKeys: string[];

  constructor(
    public ts: TranslationService,
    public router: Router,
    private auth: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.router.navigateByUrl('/login');
  }

  resetPassword() {
    this.errKeys = [];
    this.okKeys = [];
    if (this.username) {
      this.auth.resetPassword(this.username).subscribe(
        res => {
          this.okKeys = res.messageKeys;
          this.okKeys.push(`[${res.sentTo}]`);
        },
        err => {
          this.errKeys = err.error.messageKeys;
        });
    }
  }
}
