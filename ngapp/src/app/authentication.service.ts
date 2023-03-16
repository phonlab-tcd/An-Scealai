import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import config from "abairconfig";

export interface UserDetails {
  _id: string;
  username: string;
  exp: number;
  iat: number;
  role: string;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  username: string;
  password: string;
  role: string;
}

export interface VerifyEmailRequest {
  username: string;
  email: string;
  password: string;
  // TODO is role necessary for this request?
  role: string;
  baseurl: string;
  language: "ga" | "en";
}

export interface LoginTokenPayload {
  baseurl: string; // 'http://localhost:4000/' | 'https://www.abair.tcd.ie/anscealaibackend';
  username: string;
  password: string;
  role: string;
}

export interface RegistrationTokenPayload {
  baseurl: string; // 'http://localhost:4000/' | 'https://www.abair.tcd.ie/anscealaibackend/';
  username: string;
  email: string;
  password: string;
  role: string;
  language: "en" | "ga";
}

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  baseUrl: string = config.baseurl + "user/";
  private token: string;
  public jwtTokenName = "scealai-token" as const;

  // set in login component -> still needed?
  public pendingUserPayload: LoginTokenPayload = null;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Registers a new user
   * @param user a user created in the form component of /register
   * @returns Observable containing success/error info
   */
  public register( user: TokenPayload | RegistrationTokenPayload ): Observable<any> {
    return this.http.post(this.baseUrl + "register", user).pipe(
      map((data: TokenResponse) => {
        console.log(data);
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
  }

  /**
   * Saves a JWT token to local storage
   * @param token Token response from any DB calls
   */
  private saveToken(token: string): void {
    localStorage.setItem(this.jwtTokenName, token);
    this.token = token;
  }

  /**
   * Gets the JWT token from local storage
   * @returns Token saved in local storage
   */
  public getToken(): string {
    this.token = localStorage.getItem(this.jwtTokenName);
    return this.token;
  }

  /**
   * Parses the local storage token to get
   * the payload information for user details
   * @returns object containing user details
   */
  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload: any;
    if (token) {
      payload = token.split(".")[1];
      if (!payload) return null;

      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  /**
   * Checks to see if the user is logged in by checking
   * the expirey date of their token stored in local storage
   * @returns true if token not expired
   */
  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  /**
   * Makes a call to the backend to verify the email of an old account
   * @param requestObj request object created in login component
   * @returns Observable containing success/error info
   */
  public verifyOldAccount(requestObj: VerifyEmailRequest): Observable<any> {
    return this.http.post(this.baseUrl + "verifyOldAccount", requestObj);
  }

  /**
   * Resets a user's password
   * @param username username of account to reset the password
   * @returns Observable containing success/error info
   */
  public resetPassword(username: string): Observable<any> {
    return this.http.post(this.baseUrl + `resetPassword`, {
      username: username,
      baseurl: config.baseurl,
    });
  }

  /**
   * Logs the user in
   * @param user object defined in login component
   * @returns token saved in local storage
   */
  public login(user: TokenPayload | LoginTokenPayload): Observable<any> {
    return this.http.post(this.baseUrl + "login", user).pipe(
      map((data: TokenResponse) => {
        if (data.token) this.saveToken(data.token);
        return data;
      })
    );
  }

  /**
   * Logs the user out by removing the token in local storage
   */
  public logout(): void {
    this.token = "";
    window.localStorage.removeItem("scealai-token");
    this.router.navigateByUrl("/landing");
  }
}
