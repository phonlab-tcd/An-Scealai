import { Component, OnInit } from '@angular/core';
import { doesNotReject } from 'assert';
import { AuthenticationService } from 'app/authentication.service';
import { ChatbotService } from 'app/services/chatbot.service';
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

  numberofquestions: number;
  numberofanswers: Object = {};
  user: any;
  currentFilename: string = '';

  constructor(
    public auth: AuthenticationService,
    public ts: TranslationService,
    private chatbotService: ChatbotService) { }

  ngOnInit(){
    console.log("create-init");

    if(this.auth.isLoggedIn()){
      const userDetails = this.auth.getUserDetails();
      this.user = userDetails;
      if(this.user.role == 'TEACHER'){
        $('#class-code-input').css('display', 'block');
      } 
    }
    else {
      return;
    }
  }

  showSubmitSection(){
    $('#submit-container').css('top', '14%');
  }

  done(){
    //current questions available
    let q1 = document.getElementById('q1') as HTMLInputElement;
    let q2 = document.getElementById('q2') as HTMLInputElement;
    let q3 = document.getElementById('q3') as HTMLInputElement;
    let q4 = document.getElementById('q4') as HTMLInputElement;
    let q5 = document.getElementById('q5') as HTMLInputElement;
  
    let a1 = document.getElementById('a1') as HTMLInputElement;
    let a2 = document.getElementById('a2') as HTMLInputElement;
    let a3 = document.getElementById('a3') as HTMLInputElement;
    let a4 = document.getElementById('a4') as HTMLInputElement;
    let a5 = document.getElementById('a5') as HTMLInputElement;
  
    //collect questions and answers including ones added with 'add Question'
    let questions = [q1.value, q2.value, q3.value, q4.value, q5.value];
    let answers = [[a1.value], [a2.value], [a3.value], [a4.value], [a5.value]];
    if(this.numberofquestions > 5){
      for(let i = 6; i <= this.numberofquestions; i++){
        let nextQuestion = document.getElementById('q' + i) as HTMLInputElement;
        let nextAnswer = document.getElementById('a' + i) as HTMLInputElement;
        questions.push(nextQuestion.value);
        answers.push([nextAnswer.value]);
      }
    }
    //add additional answers if needed
    for(let key in this.numberofanswers){
      if(this.numberofanswers[key] > 1){
        let questionNumber = +key.charAt(7);
        for(let i = 2; i <= this.numberofanswers[key]; i++){
          if ( (document.getElementById('a' + questionNumber + i) as HTMLInputElement).value != ''){
            answers[questionNumber-1].push( (document.getElementById('a' + questionNumber + i) as HTMLInputElement).value);
          }
        }
      }
    }
  
    //make sure all entries have been filled in
    if(!questions.includes('') && !answers.some(row => row.includes(''))){
      let name = (document.getElementById('topic-name') as HTMLInputElement).value;
      let classId = (document.getElementById('class-code-input') as HTMLInputElement).value;
      var result = {};
      questions.forEach((key, i) => result[key] = answers[i]);
      result["topic-name"] = name;
      result['userId'] = this.user._id;
      result['role'] = this.user.role;
      result['shuffle'] = $('#shuffle-box input').prop('checked');

      if(this.user.role == 'TEACHER' && classId != ""){
        result['classId'] = classId;
      }
      console.log(result);  

      if (name != ''){
        //store questions & answers on the backend to be pulled again from the bot
        this.chatbotService.saveScript(result).subscribe({
          next: (response) => {
            console.log(response);
            if(response == 'script already exists'){
              $('#exists-message').css('display', 'block');
            }
            else{
              // if file creation was successful
              $('#saved-message').css('display', 'block');
              $('#ask-publish').css('display', 'block');
              $('#ask-download').css('display', 'block');
              this.currentFilename = name;
            }
          }, 
          error: (error) => {
            console.log(error);
          }
        })
      }
      else{
        //remind to fill in quiz name
        $('#forgetName-message').css('display', 'block');
      }
    }
    else{
      //remind to fill in all entries
      $('#remind-message').css('display', 'block');
    }
    
  }

}
