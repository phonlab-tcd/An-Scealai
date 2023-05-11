import { Component, OnInit } from '@angular/core';
import { userInfo } from 'os';
import { AuthenticationService } from 'app/core/services/authentication.service';
import config from 'abairconfig';
import { TranslationService } from 'app/core/services/translation.service';

const backendUrl = config.baseurl;

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  constructor(public auth: AuthenticationService, public ts: TranslationService) {
   }

  ngOnInit(): void {
    if(this.auth.isLoggedIn()){
      // @ts-ignore
      setup('startLoggedIn', backendUrl, this.ts.getCurrentLanguage());
      //@ts-ignore
      personal_buttons = [];
      //@ts-ignore
      currentScripts = [];
      $('#login-rec').css('display', 'none');
      // @ts-ignore
      user = this.auth.getUserDetails();
      // @ts-ignore
      pandoraID = 'da387bedce347878';
      // @ts-ignore
      getPersonalScripts();
      if(this.auth.getUserDetails().role == 'STUDENT'){
        // @ts-ignore
        getTeacherScripts();
      }
      else{
        $('.personal-topics #student').css('display', 'none');
        $('.personal-topics #teacher').css('display', 'none');
        $('#personal-container').css('margin-top', '5%');
      }
    }
    else{
      // @ts-ignore
      setup('startNotLoggedIn', backendUrl, this.ts.getCurrentLanguage());
      // @ts-ignore
      hideTopics();
      // @ts-ignore
      pandoraID = 'c08188e27e34571c';
    }
  }

}
