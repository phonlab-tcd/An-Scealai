var request = new XMLHttpRequest();
var date = null;
var topic = "";
var messages = [];
var logToAdd = {date: null, topic: "", complete: false, conversation: []};
var botObj = {
  username: "",
  user_id: "001",
  logs: []
}
//clearLogs("Ciara");
//addUserToDb(botObj);
//postLogToDb(logToAdd);

//build conversation with array of message objects, then add to logs in db when a new topic is started
function makeMessageObj(sentByBot, text){
  if(switchTopic){
    if(level1Complete == true && level2Complete == true && level3Complete == true) complete = true;
    logToAdd.date = new Date();
    logToAdd.complete = complete;
    logToAdd.conversation = messages;
    if(logToAdd.topic != ""){
      //console.log(logToAdd);
      //postLogToDb(logToAdd, "Ciara");
      messages = [];
      switchTopic = false;
      complete = false;
    }
  }
  else{
    logToAdd.topic = currentTopic;
    date = new Date();
    var newMessage = {date: date, sentByBot: sentByBot, text: text};
    messages.push(newMessage);
  }
}

//adding user to db
function addUserToDb(chatbotObj){
  request.open('POST', 'http://localhost:4000/Chatbot/addUser', true);
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(chatbotObj));
  request.onload = function() {
    console.log(this.response);
  }
}

//add log to db
function postLogToDb(logObj, name){
  request.open('POST', 'http://localhost:4000/Chatbot/addLog/'+ name, true);
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(logObj));
  request.onload = function(){
    console.log(this.response);
  }
}

//clear logs of user
function clearLogs(name){
  request.open('GET', 'http://localhost:4000/Chatbot/clearLogs/' + name, true);
  request.send();
  request.onload = function(){
    console.log(this.response);
  }
}
