// import identifierModuleUrl from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { doesNotReject } from 'assert';
import { AuthenticationService } from 'app/authentication.service';
import { User } from '../user';
import { TranslationService } from '../translation.service';
import config from 'abairconfig';

const backendUrl = config.baseurl;

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {

  constructor(
    public auth: AuthenticationService,
    public ts: TranslationService) { }

  ngOnInit(): void {
    console.log("create-init");
    if(this.auth.isLoggedIn()){
      // @ts-ignore
      user = this.auth.getUserDetails();
      if(this.auth.getUserDetails().role == 'TEACHER'){
        $('#class-code-input').css('display', 'block');
      } 
    }
  }

  submit(){
    // @ts-ignore
    showSubmitSection(backendUrl);
  }
  test(){
    console.log('here');
  }
  sendScript(){
    if(this.auth.isLoggedIn()){
      // @ts-ignore
      done();
    }
  }

}
