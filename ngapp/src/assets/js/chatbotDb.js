//for database....
var currentTopic = "";
var complete = false;
var messageforDb = "";
var switchTopic = false;
var level1Complete = false;
var level2Complete = false;
var level3Complete = false;
var date = new Date();

var request = new XMLHttpRequest();
var date = null;
var topic = "";
var messages = [];
var logToAdd = {date: null, topic: "", complete: false, conversation: []};
var botObj = {
  username: "",
  _id: "",
  role: "",
  logs: []
}
var thisPayload = "";
getUserDetails();


function getUserDetails(){
  const token = localStorage.getItem("scealai-token");
  let payload;
  if(token) {
    payload = token.split('.')[1];
    payload = window.atob(payload);
    thisPayload = JSON.parse(payload);
    return;
  } else {
    return null;
  }
}

//build conversation with array of message objects, then add to logs in db when a new topic is started
function makeMessageObj(isUser, text){
  if(currentTopic) logToAdd.topic = currentTopic;
  date = new Date().toISOString();
  var newMessage = {date: date, isUser: isUser, text: text};
  messages.push(newMessage);
}

function sendLog(){
  console.log(messages);
  if(level1Complete == true && level2Complete == true && level3Complete == true) complete = true;
  logToAdd.date = new Date().toISOString();
  logToAdd.complete = complete;
  logToAdd.conversation = messages;
  if(logToAdd.topic != ""){
    postLogToDb(logToAdd);
    messages = [];
    switchTopic = false;
    complete = false;
  }
}

//adding user to db
function addUserToDb(chatbotObj){
  request.open('POST', backendUrl + '/Chatbot/addUser', true);
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(chatbotObj));
  request.onload = function() {
    console.log(this.response);
  }
}

//add log to db
function postLogToDb(logObj){
  if(logObj){
    logObj.username = thisPayload.username;
    logObj.role = thisPayload.role;
    logObj._id = thisPayload._id;
    console.log(logObj);
    request.open('POST', backendUrl + '/Chatbot/addLog/', true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(JSON.stringify(logObj));
    request.onload = function(){
      console.log(this.response);
    }
  }
}

//clear logs of user
function clearLogs(name){
  request.open('GET', backendUrl + '/Chatbot/clearLogs/' + name, true);
  request.send();
  request.onload = function(){
    console.log(this.response);
  }
}
