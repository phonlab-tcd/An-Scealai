import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ChatbotService } from 'app/core/services/chatbot.service';
import { TranslationService } from 'app/core/services/translation.service';
import { ClassroomService } from "app/core/services/classroom.service";
import { Classroom } from "app/core/models/classroom";
import { firstValueFrom } from 'rxjs';
import { Quiz } from '../chatbot.component';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {

  numberofquestions: number = 5;
  user: any;
  currentFilename: string = '';
  numberofanswers = {"answer-1":1, "answer-2":1, "answer-3":1, "answer-4":1, "answer-5":1};
  classrooms: Classroom[] = [];
  selectedClassroomId: string = '';
  createdQuiz: Quiz;

  constructor(
    public auth: AuthenticationService,
    public ts: TranslationService,
    private chatbotService: ChatbotService,
    private classroomService: ClassroomService,) { }

  async ngOnInit(){
    console.log("create-init");

    if(this.auth.isLoggedIn()){
      const userDetails = this.auth.getUserDetails();
      this.user = userDetails;
      if(this.user.role == 'TEACHER'){
        $('#class-code-input').css('display', 'block');
        this.classrooms = await firstValueFrom( this.classroomService.getClassroomsForTeacher(this.user._id) );
        console.log(this.classrooms);
      } 
    }
    else {
      return;
    }
  }

  showSubmitSection(){
    $('#submit-container').css('top', '14%');
  }

  async done(){
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
      var result = {};
      let questionsAndAnswers = {};
      questions.forEach((key, i) => questionsAndAnswers[key] = answers[i]);

      let newQuizData = {
        questionsAndAnswers: questionsAndAnswers,
        title: name,
        userId: this.user._id,
        shuffle: $('#shuffle-box input').prop('checked'),
        classroomId: null
      }
      // result['questionsAndAnswers']
      // result["topic-name"] = name;
      // result['userId'] = this.user._id;
      // result['role'] = this.user.role;
      // result['shuffle'] = $('#shuffle-box input').prop('checked');

      if(this.user.role == 'TEACHER' && this.selectedClassroomId != ""){
        newQuizData.classroomId = this.selectedClassroomId;
      }
      console.log(newQuizData);  

      if (name != ''){
        //store questions & answers on the backend to be pulled again from the bot
        this.chatbotService.createQuiz(newQuizData).subscribe({
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
              this.createdQuiz = response;
              console.log(this.createdQuiz)
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

  sendVerification(){
    //send new script to an scealai email
    $('#verified-message').css('display', 'block');
    // TODO: make this validation work
    // this.chatbotService.sendVerification(this.currentFilename, this.user._id).subscribe({
    //   next: (res) => {console.log(res)},
    //   error: (err) => {console.log(err)}
    // })
    console.log(this.createdQuiz);
    if (this.createdQuiz) {
      this.chatbotService.setAsCommunityQuiz(this.createdQuiz._id).subscribe({next: ()=> {}, error: (e) => console.log(e)});
    }
    
  }

  showAbout(){
    $('#about-container').css('top', '14%'); 
  }

  addQuestion(){
    console.log(this.numberofquestions)
    let questionDiv = document.getElementById('questions');
    let answerDiv = document.getElementById('answers');
    this.numberofquestions++;
    let newQ = document.createElement('div');
    let newA = document.createElement('div');
    newQ.setAttribute('class', 'new-Q');
    newQ.setAttribute('id', 'qdiv' + this.numberofquestions);
    newA.setAttribute('class', 'new-Q');
    newA.setAttribute('id', 'answer-' + this.numberofquestions);
    newQ.innerHTML = this.numberofquestions + '. ';
    newA.innerHTML = this.numberofquestions + '. ';
    let input1 = document.createElement('input');
    let input2 = document.createElement('input');
    input1.setAttribute('type', 'text');
    input2.setAttribute('type', 'text');
    input1.setAttribute('id', 'q' + this.numberofquestions);
    input2.setAttribute('id', 'a' + this.numberofquestions);
    input2.setAttribute('class', 'A');
    input1.setAttribute('placeholder', this.ts.l.t_insert_q);
    input2.setAttribute('placeholder', this.ts.l.t_insert_a);
  
    let deletePrompt = document.createElement('button');
    deletePrompt.setAttribute('class', 'deleteQPrompt');
    deletePrompt.setAttribute('id', 'dq' + this.numberofquestions);
    deletePrompt.innerText = 'X';
    deletePrompt.style.display = 'none';
  
    deletePrompt.onclick = function(){
      console.log(deletePrompt.id);
      console.log(deletePrompt.id.charAt(2));
      $('#qdiv' + deletePrompt.id.charAt(2)).remove();
      $('#answer-' + deletePrompt.id.charAt(2)).remove();
    }
  
    input1.onmouseover = function(){
      deletePrompt.style.display = 'block';
    };
  
    input1.oninput = function(){deletePrompt.style.display = 'none';};
  
    newQ.appendChild(input1);
    newQ.appendChild(deletePrompt);
    newA.appendChild(input2);
  
    let addButton = document.createElement('button');
    addButton.innerText = this.ts.l.quiz_add_a;
    addButton.setAttribute('class', 'add-A');
    addButton.setAttribute('type', 'submit');
    addButton.setAttribute('id', 'add' + this.numberofquestions);
    addButton.onclick = () => { this.addAnswer(newA.id, addButton.id);}
    newA.appendChild(addButton);
  
    questionDiv.appendChild(newQ);
    answerDiv.appendChild(newA);
    $("#questions").animate({ scrollTop: $("#questions")[0].scrollHeight }, 200);
    $("#answers").animate({ scrollTop: $("#answers")[0].scrollHeight }, 200);
  
    this.numberofanswers['answer-' + this.numberofquestions] = 1;
  }

  addAnswer(answer_id, button_id){
      this.numberofanswers[answer_id]++;
      $('#' + button_id).remove();
      let answer_number = answer_id.charAt(7);
      let answer = document.getElementById(answer_id);
      let newAnswer = document.createElement('input');
      newAnswer.setAttribute('type', 'text');
      newAnswer.setAttribute('class', 'A');
      newAnswer.setAttribute('id', 'a' + answer_number + this.numberofanswers[answer_id]);
      newAnswer.setAttribute('placeholder', 'add answer');
      answer.append(newAnswer);
    
      let button = document.createElement('button');
      button.innerText = 'Add Answer';
      button.setAttribute('class', 'add-A');
      button.setAttribute('type', 'submit');
      button.setAttribute('id', button_id);
      button.onclick = () => { this.addAnswer(answer_id, button.id);}
      answer.append(button);
      
      $("#answers").animate({ scrollLeft: $("#answers")[0].scrollHeight }, 200);
    }

    downloadNewScript(){
      this.chatbotService.downloadNewScript(this.user._id, this.currentFilename, this.user.role).subscribe({
        next: (response) => {
          console.log(response);
          if(response.status == 200){
            var text = response.text
            setTimeout(function(){
              var link = document.createElement('a');
              link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
              link.setAttribute('download', this.currentFilename + '.txt');
              link.style.display = 'none';
              link.click();
              link.remove();
            }, 500);
          }
        },
        error: (error) => {console.log(error)}
      })
    }

    closeSubmit(){
      $('#submit-container').css('top', '-100%'); 
      setTimeout(function(){
        $('#remind-message').css('display', 'none');
        $('#saved-message').css('display', 'none');
        $('#forgetName-message').css('display', 'none');
        $('#exists-message').css('display', 'none');
        $('#ask-publish').css('display', 'none');
        $('#ask-download').css('display', 'none');
      }, 500);
    }

    closeAbout(){
        $('#about-container').css('top', '-100%'); 
      }

}
