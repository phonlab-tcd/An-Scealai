//Framwork for adding content
var request = new XMLHttpRequest();
let numberofquestions = 5;
let numberofanswers = {"answer-1":1, "answer-2":1, "answer-3":1, "answer-4":1, "answer-5":1};
var currentFilename = '';
var selectedFile = '';

//During Quiz
var quiz_score = 0;
var this_reply = '';
var to_review = [];
var currentNumberofQuestions = 0;
var current_qandanswers = '';

// ADD SOMETHING THAT ALLOWS ADDED QUESTIONS TO BE DELETED 

function addQuestion(){
  let questionDiv = document.getElementById('questions');
  let answerDiv = document.getElementById('answers');
  numberofquestions++;
  let newQ = document.createElement('div');
  let newA = document.createElement('div');
  newQ.setAttribute('class', 'new-Q');
  newQ.setAttribute('id', 'qdiv' + numberofquestions);
  newA.setAttribute('class', 'new-Q');
  newA.setAttribute('id', 'answer-' + numberofquestions);
  newQ.innerHTML = numberofquestions + '. ';
  newA.innerHTML = numberofquestions + '. ';
  let input1 = document.createElement('input');
  let input2 = document.createElement('input');
  input1.setAttribute('type', 'text');
  input2.setAttribute('type', 'text');
  input1.setAttribute('id', 'q' + numberofquestions);
  input2.setAttribute('id', 'a' + numberofquestions);
  input2.setAttribute('class', 'A');
  input1.setAttribute('placeholder', 'Insert Question');
  input2.setAttribute('placeholder', 'Insert Answer');

  let deletePrompt = document.createElement('button');
  deletePrompt.setAttribute('class', 'deleteQPrompt');
  deletePrompt.setAttribute('id', 'dq' + numberofquestions);
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
  addButton.innerText = 'Add Answer';
  addButton.setAttribute('class', 'add-A');
  addButton.setAttribute('type', 'submit');
  addButton.setAttribute('id', 'add' + numberofquestions);
  addButton.onclick = function(){ addAnswer(newA.id, addButton.id);}
  newA.appendChild(addButton);

  questionDiv.appendChild(newQ);
  answerDiv.appendChild(newA);
  $("#questions").animate({ scrollTop: $("#questions")[0].scrollHeight }, 200);
  $("#answers").animate({ scrollTop: $("#answers")[0].scrollHeight }, 200);

  numberofanswers['answer-' + numberofquestions] = 1;
}

function addAnswer(answer_id, button_id){
  numberofanswers[answer_id]++;
  $('#' + button_id).remove();
  let answer_number = answer_id.charAt(7);
  let answer = document.getElementById(answer_id);
  let newAnswer = document.createElement('input');
  newAnswer.setAttribute('type', 'text');
  newAnswer.setAttribute('class', 'A');
  newAnswer.setAttribute('id', 'a' + answer_number + numberofanswers[answer_id]);
  newAnswer.setAttribute('placeholder', 'add answer');
  answer.append(newAnswer);

  let button = document.createElement('button');
  button.innerText = 'Add Answer';
  button.setAttribute('class', 'add-A');
  button.setAttribute('type', 'submit');
  button.setAttribute('id', button_id);
  button.onclick = function(){ addAnswer(answer_id, button.id);}
  answer.append(button);
  
  $("#answers").animate({ scrollLeft: $("#answers")[0].scrollHeight }, 200);
}

function showSubmitSection(backendUrlFromAngularComponent){
  backendUrl = backendUrlFromAngularComponent;
  $('#submit-container').css('top', '14%');
}

function done(){
  //current questions available
  let q1 = document.getElementById('q1');
  let q2 = document.getElementById('q2');
  let q3 = document.getElementById('q3');
  let q4 = document.getElementById('q4');
  let q5 = document.getElementById('q5');

  let a1 = document.getElementById('a1');
  let a2 = document.getElementById('a2');
  let a3 = document.getElementById('a3');
  let a4 = document.getElementById('a4');
  let a5 = document.getElementById('a5');

  //collect questions and answers including ones added with 'add Question'
  let questions = [q1.value, q2.value, q3.value, q4.value, q5.value];
  let answers = [[a1.value], [a2.value], [a3.value], [a4.value], [a5.value]];
  if(numberofquestions > 5){
    for(let i = 6; i <= numberofquestions; i++){
      let nextQuestion = document.getElementById('q' + i);
      let nextAnswer = document.getElementById('a' + i);
      questions.push(nextQuestion.value);
      answers.push([nextAnswer.value]);
    }
  }
  //add additional answers if needed
  for(let key in numberofanswers){
    if(numberofanswers[key] > 1){
      let questionNumber = key.charAt(7);
      for(let i = 2; i <= numberofanswers[key]; i++){
        if(document.getElementById('a' + questionNumber + i).value != ''){
          answers[questionNumber-1].push(document.getElementById('a' + questionNumber + i).value);
        }
      }
    }
  }

  //make sure all entries have been filled in
  if(!questions.includes('') && !answers.some(row => row.includes(''))){
    let name = document.getElementById('topic-name').value;
    let classId = document.getElementById('class-code-input').value;
    var result = {};
    questions.forEach((key, i) => result[key] = answers[i]);
    result["topic-name"] = name;
    result['userId'] = user._id;
    result['role'] = user.role;
    if(user.role == 'TEACHER' && classId != ""){
      result['classId'] = classId;
    }
    console.log(result);  
    if(name != ''){
      //store questions & answers on the backend to be pulled again from the bot
      request.open('POST', backendUrl + 'Chatbot/SaveScript', true);
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify(result));
      request.onload = function(){
        console.log(this.response);
        if(this.response == 'script already exists'){
          $('#remind-message').text('Script with this name already exists!');
          $('#remind-message').css('display', 'block');
        }
        else{
          // if file creation was successful
          $('#saved-message').css('display', 'block');
          $('#ask-publish').css('display', 'block');
          $('#ask-download').css('display', 'block');
          currentFilename = name;
        }
      }
    }
    else{
      //remind to fill in quiz name
      showReminder("Don't forget to name your quiz.");
    }
  }
  else{
    //remind to fill in all entries
    showReminder('Fill in all entries.');
  }
  
}

function sendVerification(){
  //send new script to an scealai email
  $('#saved-message').text('Your script will be verified.');
  $('#saved-message').css('display', 'block');
  var request = new XMLHttpRequest();
  request.open('POST', backendUrl + 'Chatbot/sendScriptVerification', true);
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify({user: user._id, name: currentFilename}));
  request.onload = function(){
    console.log(this.response);
  }
}

function showReminder(text){
  let reminder = document.getElementById('remind-message');
  reminder.innerText = text;
  reminder.style.display = 'block';
}

function downloadNewScript(){
  var request = new XMLHttpRequest();
  request.open('POST', backendUrl + 'Chatbot/getScriptForDownload', true);
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify({user: user._id, name: currentFilename, role: user.role}));
  request.onload = function(){
    console.log(JSON.parse(this.response));
    if(JSON.parse(this.response).status == 200){
      var text = JSON.parse(this.response).text
      setTimeout(function(){
        var link = document.createElement('a');
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        link.setAttribute('download', currentFilename + '.txt');
        link.style.display = 'none';
        link.click();
        link.remove();
      }, 500);
    }
  }
}

function deleteScript(){
  var toDelete = '';
  if(selectedFile.includes('student')) toDelete = selectedFile.replace('student_script_', '');
  else toDelete = selectedFile.replace('teacher_script_', '');
  console.log('to delete: ' + toDelete);

  var request = new XMLHttpRequest();
  request.open('POST', backendUrl + 'Chatbot/deleteScript', true);
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify({name: toDelete, user: user._id}));
  request.onload = function(){
    console.log(this.response);
    if(this.response == 'script deleted'){
      $('#' + selectedFile).remove();
      var index = personal_buttons.indexOf(selectedFile);
      if(index != -1) personal_buttons.splice(index, 1);
    }
  }
}

function closeSubmit(){
  $('#submit-container').css('top', '-100%'); 
  setTimeout(function(){
    $('#remind-message').css('display', 'none');
    $('#saved-message').css('display', 'none');
    $('#ask-publish').css('display', 'none');
    $('#ask-download').css('display', 'none');
  }, 500);
}

function closeAbout(){
  $('#about-container').css('top', '-100%'); 
}

function showAbout(){
  $('#about-container').css('top', '14%'); 
}

var personal_buttons = [];
var currentScripts = [];
function getPersonalScripts(){
  var request = new XMLHttpRequest();
  request.open('POST', backendUrl + 'Chatbot/getScripts', true);
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify({name: user.username, id: user._id}));
  request.onload = function(){
    let response = JSON.parse(this.response).userFiles;
    if(typeof response == 'object'){
      currentScripts = JSON.parse(this.response).userFiles;
      console.log(currentScripts);
      if(currentScripts.length > 0) appendToPersonalTopics(currentScripts, user.role.toLowerCase());
    }
    else{
     console.log(response);
    }
  }
}

function openScript(){
  quiz_score = 0;
  var toLoad = '';
  showContents('p', 'popup-background', false);
  $('#' + selectedFile).css('border', 'none');
  $('#open-script').css('display', 'none');
  $('#delete-script').css('display', 'none'); 
  //console.log(selectedFile);
  if(selectedFile.includes('student')) toLoad = selectedFile.replace('student_script_', '');
  else toLoad = selectedFile.replace('teacher_script_', '');
  var file = currentScripts.find(obj => obj.name.includes(toLoad));
  if(file){
    if(file.numberofquestions) currentNumberofQuestions = file.numberofquestions;
    if(file.questionsandanswers) current_qandanswers = file.questionsandanswers;
  }
  console.log(file);
  loadQuiz(toLoad);
}

function getTeacherScripts(){
  var request = new XMLHttpRequest();
  request.open('GET', backendUrl + 'Classroom/getClassroomForStudent/' + user._id, true);
  request.send();
  request.onload = function(){
    console.log(JSON.parse(this.response));
    if(JSON.parse(this.response) != null){
      var classData = JSON.parse(this.response);
      request.open('GET', backendUrl + 'Chatbot/getTeacherScripts/' + classData.teacherId + '/' + classData.code, true);
      request.send();
      request.onload = function(){
        console.log(JSON.parse(this.response));
        let response = JSON.parse(this.response);
        if(typeof response == 'object'){
          for(let s of response) currentScripts.push(s);
          if(response.length > 0) appendToPersonalTopics(response, user.role.toLowerCase());
        }
        else{
          console.log(response);
        }
      }
    }
  }
}

function appendToPersonalTopics(scripts, role){
  let button_id = role + '_script_';
  //console.log(scripts);
  if(typeof scripts == 'object'){
    
    //append buttons to personal-topics
    for(let script of scripts){
      //label for button
      let topicname = script.name;
      //check not already in DOM
      if(!personal_buttons.includes(button_id + topicname)){
        //create button
        let topic = document.createElement('button');
        topic.setAttribute('class', 'add-personal-topics');
        topic.innerText = topicname;
        topic.setAttribute('id', button_id + topicname);
        //set teacher quizzes display to none if student
        if(topic.id.includes('teacher') && user.role == 'STUDENT'){
          topic.style.display = 'none';
          topic.style.backgroundColor = '#138D75';
          topic.innerText = topicname.replace('teacher_', '');
        } 
        else if(topic.id.includes('teacher') && user.role == 'TEACHER'){
          topic.innerText = topicname.replace('teacher_', '');
        }
        else topic.style.display = 'inline';
        //keep track of buttons
        personal_buttons.push(topic.id);
        topic.onclick = function(){
          //console.log(selectedFile);
          if(selectedFile != ''){
            $('#' + selectedFile).css('border', 'none');
          }
          topic.style.border = 'thick solid #F4D03F';
          $('#delete-script').css('display', 'block');
          $('#open-script').css('display', 'block');
          selectedFile = topic.id;
          //showContents('p', 'popup-background', false);
          //load(topic.innerText);
        }
        setTimeout(function(){
          //append new button
          $('#personal-container').append(topic);
        }, 500)
      }
    }
  }
}

function showPersonal(role){
  if(selectedFile != '') $('#' + selectedFile).css('border', 'none');
  if(role == 'student'){
    $('.personal-topics #teacher').css('background-color', '#FBFCFC');
    $('.personal-topics #student').css('background-color', '#F4D03F');
    $('#delete-script').prop('disabled', false);
  }
  else{
    $('.personal-topics #student').css('background-color', '#FBFCFC');
    $('.personal-topics #teacher').css('background-color', '#F4D03F');
    $('#delete-script').prop('disabled', true);
  }
  for(let id of personal_buttons){
    let button = document.getElementById(id);
    if(id.includes(role)){
      button.style.display = 'inline';
    } 
    else button.style.display = 'none';

    if(role == 'student' && id.includes('teacher')) button.style.display = 'none';
    $('#delete-script').css('display', 'none');
    $('#open-script').css('display', 'none');
  }
}

//Scoring
function addScore(){
  quiz_score++;
}

function trackWrongAnswer(){
  to_review.push(this_reply);
}

function endOfQuiz(){
  console.log('quiz ended');
  appendTypingIndicator();
  setTimeout(function(){
    let message = 'Well done! Your score is ' + quiz_score + ' out of ' + currentNumberofQuestions;
    appendMessage(true, false, message);
  }, 2200);
  setTimeout(function(){
    chatSetup('tryagain', false);
  }, 3000);
}

function tryAgain(quizName){
  if(user.role == 'STUDENT' && selectedFile.includes('teacherquiz-')){
    quizName = "teacherquiz-" + quizName;
  }
  console.log(quizName);
  quiz_score = 0;
  to_review = []
  loadQuiz(quizName);
}

function showAnswers(){
  appendTypingIndicator();
  setTimeout(function(){
    appendMessage(true, false, current_qandanswers);
    $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);
  }, 2200)
}

function loadQuiz(script){
  $("#bot-messages").empty();
  let send = document.getElementById('bot-message-button');
  send.onclick = function(){
    sendInput();
  }
  var quiz = currentScripts.find(obj => obj.name.includes(script));

  bot = new RiveScript({utf8: true});    
  bot.stream(quiz.content);
  bot.sortReplies();
  chatSetup('start');
}

/*
- When user inputs their content, create HTML button that would load the file to the bot when clicked.
- Send button as string along with content to the backend.
- In the backend the content would be saved in a new rivescript file.
- File and button would then need to be saved to the database in that user's data
- File would be saved as blob/chunks not too sure.
- From then whenever the user opens Taidhgín, the backend would be prompted to get all content user
has added before and display on the DOM. 
- User can also be prompted to download the file, but still would be saved to DB
*/
