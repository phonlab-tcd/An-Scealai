import { OnInit, Component, Output, EventEmitter } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { AuthenticationService, RegistrationTokenPayload } from "app/core/services/authentication.service";
import { UntypedFormControl } from "@angular/forms";
import config from "abairconfig";
import { ActivatedRoute } from "@angular/router";

type UsernameMessageKey = "username_no_spaces" | "username_no_special_chars";

@Component({
  selector: "register-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./register.component.scss"],
  host: {
    class: "registerContainer",
  },
})
export class RegisterFormComponent implements OnInit {
  // credentials sent back to register component after success
  @Output() registerSuccess: EventEmitter<RegistrationTokenPayload> = new EventEmitter();

  errorTextKeys: string[];
  passwordConfirm: string;

  usernameInput: UntypedFormControl;
  usernameClass: string;
  usernameErrorTextKeys: UsernameMessageKey[];

  termsVisible: boolean = false;

  credentials: RegistrationTokenPayload = {
    baseurl: config.baseurl,
    username: "",
    email: "",
    password: "",
    role: "",
    language: "ga",
  };

  constructor(
    public ts: TranslationService,
    private auth: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  /**
   * Get user role from URL params
   * Check if username meets all criterea, update messages accordingly
   */
  ngOnInit() {
    // check url to see if registering student or teacher
    let role = this.route.snapshot.params["role"];
    if (role && (role === "TEACHER" || role === "STUDENT")) {
      this.credentials.role = role;
    } else {
      return;
    }

    this.usernameClass = "";
    this.usernameErrorTextKeys = [];
    this.usernameInput = new UntypedFormControl();
    // check if the username matches all criterea as the user is typing it in
    this.usernameInput.valueChanges.subscribe((text) => {
      this.credentials.username = text;
      this.usernameErrorTextKeys = [];
      if (text.match(" ")) {
        this.usernameClass = "usernameInputRed";
        this.usernameErrorTextKeys.push("username_no_spaces"); // username shouldn't contain spaces
      } else if (!text.match(/^[A-Za-z0-9]+$/)) {
        this.usernameClass = "usernameInputRed";
        this.usernameErrorTextKeys.push("username_no_special_chars"); // no special characters (fadas, etc.);
      } else {
        this.usernameClass = "";
        this.usernameErrorTextKeys = [];
      }
    });
  }

  /**
   * Register a user and emit user details back to parent component
   */
  register() {
    console.log("REGISTER");
    if (!this.checkDetails()) return;
    this.credentials.language = this.ts.inIrish() ? "ga" : "en";
    this.auth.register(this.credentials).subscribe(
      (_ok) => {
        console.log("SUCCESFUL REGISTRATION", this.credentials);
        this.registerSuccess.emit(this.credentials);
      },
      (err) => {
        if (err.error && err.error.messageKeys)
          this.errorTextKeys = err.error.messageKeys;
      }
    );
  }

  /**
   * Checks if the entered username, password, and email have no errors
   * @returns true if no errors, otherwise false
   */
  checkDetails(): boolean {
    this.errorTextKeys = [];
    this.checkPassword();
    this.checkEmail();
    this.checkUsername();
    return this.errorTextKeys.length === 0;
  }

  /**
   * Check email input is in 'email' format
   */
  checkEmail(): void {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(this.credentials.email))
      this.errorTextKeys.push("email_format_error");
  }

  /**
   * Check if password input is at least 5 char long and matches confirm password
   */
  checkPassword(): void {
    if (this.credentials.password.length < 5)
      this.errorTextKeys.push("passwords_5_char_long");
    if (this.credentials.password !== this.passwordConfirm)
      this.errorTextKeys.push("passwords_must_match");
  }

  /**
   * Check is username input contains any special characters
   */
  checkUsername(): void {
    if (!this.credentials.username.match("^[A-Za-z0-9]+$"))
      this.errorTextKeys.push("username_no_special_chars");
  }

  /**
   * Show/hide the terms and conditions
   */
  toggleTerms() {
    this.termsVisible = !this.termsVisible;
  }
}
