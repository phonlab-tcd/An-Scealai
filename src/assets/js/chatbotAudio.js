var request = new XMLHttpRequest();
var audio_reply = "";
var audioPlayer;
var audioCheckbox;
var male;
var female;
var connemara;
var kerry;
var donegal;
var bubbleObjArr = [];
var thisId = 0;
var duration;
var isPlaying = false;
var thisDialect = "";
var thisGender = "";
var isPlaying = false;

//sets up for messages to be edited and urls to be called
function audio(newReply, id, isUser){
  audio_reply = newReply;
  thisId = id;
  if(isUser == false){
    editMessageForAudio();
    var bubbleText = "";
    //Create Bubble Objects
    if(inp[2] == "//www"){
      bubbleText = "Úsáid tearma.ie chun cabhrú leat munar thuig tú téarma ar leith.";
      var newBubble = { text: bubbleText, id: thisId, url: null, isUser: isUser };
      bubbleObjArr.push(newBubble);
      testCallAudio(bubbleText, thisId);
    }
    else if(inp[3] == "//www"){
      bubbleText = "An bhfuil aon fhocail nár thuig tú? Féach sa bhfoclóir ag teanglann.ie.";
      var newBubble = { text: bubbleText, id: thisId, url: null, isUser: isUser };
      bubbleObjArr.push(newBubble);
      testCallAudio(bubbleText, thisId);
    }
    else if(inp != ""){
      var notAHint = true;
      for(i = 0; i < inp.length; i++){
        if(inp[i].indexOf("teanglann") != -1){
          notAHint = false;
          bubbleText = "Mícheart, beagnach ceart ach féach arís air, a " + getName() + ". Hint: teanglann.ie"
          var newBubble = { text: bubbleText, id: thisId, url: null, isUser: isUser };
          bubbleObjArr.push(newBubble);
          testCallAudio(bubbleText, thisId);
        }
      }
      if(notAHint){
        for(i = 0; i < inp.length; i++){
          bubbleText = bubbleText.concat(inp[i], ".");
        }
        var newBubble = { text: bubbleText , id: thisId, url: null, isUser: isUser };
        bubbleObjArr.push(newBubble);
        testCallAudio(bubbleText, thisId);
      }
    }
  }
  else{
    var newBubble = { text: audio_reply , id: thisId, url: null, isUser: isUser };
    bubbleObjArr.push(newBubble);
    testCallAudio(audio_reply, thisId);
  }
}

//edits messages to be played & adds them to array
function editMessageForAudio(){
  inp = [];
  var inputString = audio_reply;
  var index = inputString.indexOf("Ceist:");
  var j = 0;
  var length;
  for(i = 0; i < inputString.length; i++){
    if(inputString[i] == "." || inputString[i] == ":" || inputString[i] == "?" || inputString[i] == "!"){
      length = i - j;
      var newString = inputString.substr(j, length);
      //console.log(newString);
      j = i + 1;
      if(newString != "ERR" || newString != " ")
        inp.push(newString);
    }
    if(inputString[i] == "'"){
      inputString[i] == inputString[i].replace("'", "");
    }
  }
  var currentSentence;
  for(i = 0; i < inp.length; i++){
    currentSentence = inp[i];
    //console.log(currentSentence);
    for(j = 0; j < currentSentence.length; j++){
      indexOf1 = currentSentence.indexOf("<b>");
      indexOf2 = currentSentence.indexOf("<i>");
      indexOf3 = currentSentence.indexOf("</b>");
      indexOf4 = currentSentence.indexOf("</i>");
      indexOf5 = currentSentence.indexOf("<br>");
      indexOf6 = currentSentence.indexOf("-");
      if(indexOf1 != -1){
        inp[i] = inp[i].replace("<b>", "");
      }
      if(indexOf2 != -1){
        inp[i] = inp[i].replace("<i>", "");
      }
      if(indexOf3 != -1){
        inp[i] = inp[i].replace("</b>", "");
      }
      if(indexOf4 != -1){
        inp[i] = inp[i].replace("</i>", "");
      }
      if(indexOf5 != -1){
        inp[i] = inp[i].replace("<br>", "");
      }
      if(indexOf6 != -1){
        inp[i] = inp[i].replace("-", "");
      }
    }
  }
}

function testCallAudio(testString, id){
  console.log(testString);
  var messageBubble = {text: testString, dialect: ""};
  if(thisDialect == "connemara") messageBubble.dialect = "CM";
  else if(thisDialect == "donegal") messageBubble.dialect = "GD";
  else if(thisDialect == "kerry") messageBubble.dialect = "MU";

  request.open('POST', 'http://localhost:4000/Chatbot/getAudio', true);
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(messageBubble));
  request.onload = function(){
    //console.log(JSON.parse(this.response).html[0][0]);
    var bubbleUrl =JSON.parse(this.response).audio[0];
    for(i = 0; i < bubbleObjArr.length; i++){
      if(id == bubbleObjArr[i].id){
        bubbleObjArr[i].url = bubbleUrl;
        if(audioCheckbox.checked == true && bubbleObjArr[i].isUser == false)
          playAudio(bubbleObjArr[i]);
      }
    }
  }
}

//plays audio
function playAudio(bubble){
  if(bubble.url){
    audioPlayer = new Audio(bubble.url);
    var playPromise = audioPlayer.play();
    if(playPromise !== undefined){
      playPromise.then(_ => {

      }).catch(error => {
        console.log(error);
      });
    }
    isPlaying = true;
    audioPlayer.addEventListener("ended", function(){
      isPlaying = false;
    });
  }
}

function manualPlay(id){
  console.log(id);
  for(i = 0; i < bubbleObjArr.length; i++){
    if(bubbleObjArr[i].id == id){
      playAudio(bubbleObjArr[i]);
    }
  }
}

function checkboxSelect(checkbox, isGender, isDialect){
  male = document.querySelector(".maleCheckbox");
  female = document.querySelector(".femaleCheckbox");
  connemara = document.querySelector(".connemaraCheckbox");
  kerry = document.querySelector(".kerryCheckbox");
  donegal = document.querySelector(".donegalCheckbox");

  if(isDialect){
    thisDialect = checkbox;
    if(checkbox == "connemara"){
      kerry.checked = false;
      donegal.checked = false;
    }
    else if(checkbox == "kerry"){
      connemara.checked = false;
      donegal.checked = false;
    }
    else if(checkbox == "donegal"){
      connemara.checked = false;
      kerry.checked = false;
    }
  }
  else if(isGender){
    thisGender = checkbox;
    if(checkbox == "male"){
      female.checked = false;
    }
    else if(checkbox == "female"){
      male.checked = false;
    }
  }
  if(thisGender == "male"){
    if(thisDialect == "donegal" || thisDialect == "kerry"){
      male.checked = false;
      female.checked = true;
    }
  }
}
