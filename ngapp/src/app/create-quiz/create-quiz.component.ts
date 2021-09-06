import { identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { doesNotReject } from 'assert';
import { AuthenticationService } from 'src/app/authentication.service';
import { User } from '../user';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.css']
})
export class CreateQuizComponent implements OnInit {

  constructor(public auth: AuthenticationService) { }

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

  sendScript(){
    if(this.auth.isLoggedIn()){
      // @ts-ignore
      done();
    }
  }

}
