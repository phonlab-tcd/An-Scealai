//window.onload = setup;
var bubbleId = 0;
var holdMessages = false;
var thisVerb;
var dictOn = false;

// TODO request is very common variable name and shouldn't be used
// in global scope
var request = new XMLHttpRequest();
let parser = new DOMParser();
var currentSpellings;
var videoPlayer;
let currentFile = '';
var user = null;
var pandoraID = '';
var slender_names = [];

var test_file = "+ start\n - Hi this is taidhgin!:)";

var backendUrl = 'backend url not yet created';
var currentLanguage = 'Gaeilge';

let currentDialectButton = null;

async function testLoadQuiz(quizContent) {
  console.log("loading quiz bot testLoadQuiz()");
  bot = new RiveScript({utf8: true});    
  await bot.stream(quizContent);
  await bot.sortReplies();
  console.log("done loading quiz bot");
}

async function getBotReply(text) {
  console.log("getting bot reply testBotReply() with text: ", text);
  let reply = await bot.reply("local-user", text);
  return reply;
}

/**
 * Load in the community quizzes
 * @param {*} fileId 
 */
async function setupCommunityBot(fileId) {
  console.log("test loading new bot testBotLoad()")
  // sets thisVerb if the quiz is not of type 'quiz' (i.e. community, eire)
  if(fileId.indexOf("quiz") == -1){
    var length = fileId.length - 2;
    thisVerb = fileId.substr(0, length);
    console.log("this verb: ", thisVerb);
    if(thisVerb == "bi") thisVerb = "bí";
    else if(thisVerb == "teigh") thisVerb = "téigh";
    else if(thisVerb == "dean") thisVerb = "déan";
  }

  console.log("To Load: " + fileId);
  bot = new RiveScript({utf8: true});
  await bot.loadFile("./assets/rive/" + fileId + '.rive');
  await bot.sortReplies();
  console.log(fileId + ' loaded');
  //if(start == null) start = 'start';
}

/**
 * Set up the chatbot with the given filename
 * @param {*} file name of rive file to load into bot
 */
async function setupBot(file){
  bot = new RiveScript({utf8: true});    
  await bot.loadFile("./assets/rive/" + file + '.rive');
  console.log("bot set up")
  await bot.sortReplies();
  console.log("bot sorted")
  currentFile = 'start';
  console.log("done setting up bot")
}

// function load(fileId, start, content_id){
//   console.log("FileId: ", fileId);
//   console.log("Start: ", start);
//   console.log("content_id: ", content_id);
//   console.log("currentFile: ", currentFile)
//   audioPlayer.pause();
//   let send = document.getElementById('bot-message-button');
//   send.onclick = function(){
//     sendInput();
//   }
//   //console.log(send);

//   if(content_id) showContents(content_id, 'popup-background', false);
//   if (currentFile == 'start') $("#bot-messages").empty();
//   else currentFile = fileId;
//   console.log(fileId);

//   // sets thisVerb, use regex
//   if(fileId.indexOf("quiz") == -1){
//     var length = fileId.length - 2;
//     thisVerb = fileId.substr(0, length);
//     if(thisVerb == "bi") thisVerb = "bí";
//     else if(thisVerb == "teigh") thisVerb = "téigh";
//     else if(thisVerb == "dean") thisVerb = "déan";
//   }

//   console.log("To Load: " + fileId);
//   bot = new RiveScript({utf8: true});
//   bot.loadFile('assets/rive/' + fileId + '.rive').then( () => {
//     bot.sortReplies();
//     console.log(fileId + ' loaded');
//     if(start == null) start = 'start';

//     chatSetup(start, false, false);
//   });
// }

function loadFromChat(fileId, start){ load(fileId, start); }

// function appendTypingIndicator(){
//   $("#bot-messages").append($("<div class=\"typing-indicator\"><div class=\"bot-message-photo\"><img src=\"assets/img/logo-S.png\" id=\"bot-img\"></div><div class=\"dots\"><p class=\"bot-message-ind\"><span id=\"typ1\"></span><span id=\"typ2\"></span><span id=\"typ3\"></span></p></div></div></div>"));
//   $(".typing-indicator").delay(2000).fadeOut("fast");
//   $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);
// }

// function appendMessage(isBot, isUser, text, showButtons){
//   bubbleId++;
//   var newMessage = document.createElement("div");
//   newMessage.setAttribute("class", "message_parent");
//   newMessage.setAttribute("id", bubbleId);
//   var newP = document.createElement("p");
//   var newSpan = document.createElement("span");
//   var photoDiv = document.createElement("div");
//   var photo = document.createElement("img");
//   if(isBot){
//     newP.setAttribute("class", "bot-message");
//     photoDiv.setAttribute("class", "bot-message-photo");
//     photo.src = "assets/img/logo-S.png";
//     photo.setAttribute("id", "bot-img");
//   }
//   else{
//     newP.setAttribute("class", "user-message");
//     photoDiv.setAttribute("class", "user-message-photo");
//     photo.src = "assets/img/apple-user.svg";
//     photo.setAttribute("id", "user-img");
//   }
  
//   photoDiv.appendChild(photo);
//   newMessage.appendChild(photoDiv);
//   newSpan.setAttribute("class", "this-message");
//   newSpan.innerHTML = text;
//   newP.appendChild(newSpan);

//   newMessage.ondblclick = function(){
//     manualPlay(newMessage.id);
//   }

//   if(isAQuestion){
//     var dictPopup;
//     var dictTri;
//     var dictText;
//     var dictImg;
//     dictImg = document.createElement("img");
//     dictImg.src = "assets/img/dict.png";
//     dictImg.setAttribute("class", "dictButton");
//     dictImg.style.display = "none";
//     dictImg.onclick = function(){
//       if(dictOn == false){
//         dictPopup.style.display = "flex";
//         dictTri.style.display = "flex";
//         dictText.innerHTML = currentQuestion.translation;
//         dictOn = true;
//       }
//       else if(dictOn){
//         dictPopup.style.display = "none";
//         dictTri.style.display = "none";
//         dictOn = false;
//       }
//     }
//     newP.appendChild(dictImg);
//     isAQuestion = false;
//   }

//   let messages = document.getElementById("bot-messages");
//   newMessage.appendChild(newP);  
//   messages.appendChild(newMessage);
// }

//CHAT REPLIES AND INPUTS from scripts
// function chatSetup(text, holdMessages, showButtons){
//   // holdMessages => for autoplay audio
//   // showButtons => for manual audio 

//   console.log("Setting up chat with: ", text);

//   if(holdMessages == "true" && audioCheckbox.checked == true){
//     // autoplay is on & bot is sending multiple consecutive bubbles
//     audioPlayer.onended = function(){
//       if(text != ""){
//         bot.reply("local-user", text).then( (reply) => {
//           text = "";
//           if(reply != "" && !reply.includes('ERR')){
//             //console.log(reply);
//             appendTypingIndicator();
//             setTimeout(function(){
//               appendMessage(true, false, reply, showButtons);
//               audio(reply, bubbleId, false);
//               $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);
//             }, 2200);
//           }
//         });
//       }
//     }
//   }
//   else{
//     // autoplay is off => no need to wait for audio to play for consecutive bubbles
//     bot.reply("local-user", text).then( (reply) => {
//       if(reply != "" && !reply.includes('ERR')){
//         console.log("Reply: " + reply);
//         this_reply = reply;
//         appendTypingIndicator();
//         setTimeout(function(){
//           appendMessage(true, false, reply, showButtons);
//           audio(reply, bubbleId, false);
//           $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);
//         }, 2200);
//       }
//     });
//   }
//   return "";
// }

// receives input from user 
// function sendInput(){
//   var input = document.getElementById("bot-user_input").value;
//   $("form").on("submit", (event) => {
//     event.preventDefault();
//   });
//   if(input != ""){
//     document.getElementById("bot-user_input").value = "";
//     appendMessage(false, true, input);
//     playVid();
//     setTimeout(function(){
//       chatSetup(input, "true", false);
//       audio(input, bubbleId, true)
//     }, 1500);
//     $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);

//   }
// }

// function playVid(){
//   videoPlayer.play();
// }

// Select Synthesis Engine
// function selectEngine(engine){
//   $(engine).css('backgroundColor', '#F5B041');
//   if(engine == "#select-DNN"){
//     currentEngine = 'DNN';
//     $('#select-HTS').css('backgroundColor', '#FBFCFC');
//     $('#dialect-CM').css('display', 'none');
//     $('#dialect-GD').css('display', 'none');
//     $('#dialect-MU').css('display', 'none');

//     $('#dialect-UL').css('display', 'block');
//     $('#dialect-CO').css('display', 'block');
//     $('#dialect-MU-DNN').css('display', 'block');
//   }
//   else{
//     currentEngine = 'HTS';
//     $('#select-DNN').css('backgroundColor', '#FBFCFC');
//     $('#dialect-CM').css('display', 'block');
//     $('#dialect-GD').css('display', 'block');
//     $('#dialect-MU').css('display', 'block');

//     $('#dialect-UL').css('display', 'none');
//     $('#dialect-CO').css('display', 'none');
//     $('#dialect-MU-DNN').css('display', 'none');
//   }
// }

// Selecting Dialect
let currentDialect = '';
// function dialectSelection(dialect){
//   $('.audioCheckbox').prop('checked', true);

//   //set color
//   if(currentDialect != ''){
//     currentDialectButton.style.backgroundColor = '#1ABC9C';
//     currentDialectButton.style.fontWeight = '';
//   }
//   currentDialect = dialect.substr(8, dialect.length);
//   console.log(currentDialect);

//   //set text
//   if(currentDialect == 'MU-DNN') currentDialect = 'MU';
  
//   if(currentEngine == 'HTS'){
//     if(currentDialect == 'CM') $('#this-dialect').text("Dialect: Connemara - HTS");
//     else if(currentDialect == 'GD') $('#this-dialect').text("Dialect: Donegál - HTS");
//     else $('#this-dialect').text("Dialect: Kerry - HTS");
//   }
//   else{
//     if(currentDialect == 'CO') $('#this-dialect').text("Dialect: Connemara - DNN");
//     else if(currentDialect == 'UL') $('#this-dialect').text("Dialect: Gaoth Dobhair - DNN");
//     else $('#this-dialect').text("Dialect: Kerry - DNN");
//   }

//   currentDialectButton = document.getElementById(dialect);
//   currentDialectButton.style.backgroundColor = '#117A65';
//   currentDialectButton.style.fontWeight = 'bold';
// }


//Bunscoil Spelling Test
var vocabInput;
var vocabOuter;

function showWordsInput(){
  vocabInput = document.querySelector(".inputVocab");
  vocabOuter = document.querySelector(".vocabOuter");
  vocabInput.style.display = "flex";
  vocabOuter.style.display = "flex";
  setTimeout(function(){
    vocabInput.style.opacity = "1";
    vocabOuter.style.opacity = "0.5";
  }, 50);
}

function enterWords(){
  if(document.getElementById("word10").value == ""){
    var warning = document.querySelector(".warning");
    warning.style.display = "flex";
  }
  else{
    var newWords = [];
    for(i = 1; i < 11; i++){
      newWords.push(document.getElementById("word" + i).value);
    }
    request.open('POST', backendUrl + '/Chatbot/saveSpellings/', true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(newWords));
    request.onload = function(){
      console.log(this.response);
    }
  }
  closeWords();
  console.log("loading spelling test")
  $('#bot-messages').empty();
  bot = new RiveScript({utf8: true});
  bot.loadFile("assets/rive/spelling.rive").then( () => {
    bot.sortReplies();
    chatSetup("start", false, false);
    getWords();
  });
}

function closeWords(){
  var warning = document.querySelector(".warning");
  warning.style.display = "none";
  vocabInput.style.opacity = "0";
  vocabOuter.style.opacity = "0";
  setTimeout(function(){
    vocabInput.style.display = "none";
    vocabOuter.style.display = "none";
  }, 1000);
}

function getWords(){
  request.open('GET', backendUrl + '/Chatbot/getWords/', true);
  request.send();
  request.onload = function(){
    currentSpellings = JSON.parse(this.response);
    console.log(currentSpellings);
  }
}

function getRandomWord(){
  console.log(currentSpellings);
  var ran = getRandomIntInclusive(0, currentSpellings.length - 1);
  currentWord = currentSpellings[ran];
  console.log("Current Word: " + currentWord);
  var wordToReturn = "<p style=\"display:none\">" + currentWord + "</p>";
  //currentSpellings.splice(ran, 1);
  if(currentSpellings.length == 0){
    isLevelComplete = true;
  }
  return wordToReturn;
}


//Test AIML Chit-Chat
// function chatAIML(){
//   let output = '';
//   var input = document.getElementById("bot-user_input").value;
//   $("form").on("submit", (event) => {
//     event.preventDefault();
//   });
//   if(input != ""){
//     document.getElementById("bot-user_input").value = "";
//     appendMessage(false, true, input);
//     audio(input, bubbleId, true);
//     setTimeout(function(){
//       playVid();
//       $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);
//       request.open('POST', backendUrl + 'Chatbot/aiml-message/', true);
//       request.setRequestHeader("Content-Type", "application/json");
//       request.send(JSON.stringify({message: input, botId: pandoraID}));
//       request.onload = function(){
//         //console.log(this.response);
//         if(this.response != ""){
//           let xmlDoc = parser.parseFromString(JSON.parse(this.response).reply, 'text/xml');
//           output = xmlDoc.getElementsByTagName('that')[0].childNodes[0].nodeValue;
//           appendTypingIndicator();
//           setTimeout(function(){
//             appendMessage(true, false, output);
//             $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);
//             audio(output, bubbleId, false);
//             //videoPlayer.pause();
//           }, 2200);
//           //callAudio(output, 'GD');
//         } 
//       }
//     }, 2200)
//   }
// }

// function showContents(content_id, background_id, show){
//   $("form").on("submit", (event) => {
//     event.preventDefault();
//   });
//   if(content_id == 'recording-prompt'){
//     $('#send-recording').css('display', 'none');
//     $('#recording-player').css('display', 'none');
//   }

//   let contentPopup = document.getElementById(content_id);
//   let backgroundPopup = document.getElementById(background_id);
//   if(show){
//     //show contents
//     contentPopup.style.display = 'inline-block';
//     backgroundPopup.style.display = 'flex';
//     setTimeout(function(){
//       contentPopup.style.opacity = "1";
//       backgroundPopup.style.opacity = "0.6";
//     }, 50);
//     if(content_id == 'p' && user.role == 'TEACHER'){
//       $('#to-create').css('margin-top', '5%');
//       $('#to-create').css('left', '5%');
//     }
//   }
//   else{
//     //hide contents
//     contentPopup.style.opacity = "0";
//     backgroundPopup.style.opacity = "0";
//     setTimeout(function(){
//       contentPopup.style.display = 'none';
//       backgroundPopup.style.display = 'none';
//     }, 500);
//   }
// }

// function closePersonal(){
//   showContents("p", "popup-background", false);
//   if(user.role == 'STUDENT') showPersonal('student');
//   if(selectedFile != ''){
//     $('#' + selectedFile).css('border', 'none');
//     $('#open-script').css('display', 'none');
//     $('#delete-script').css('display', 'none'); 
//   }
// }

// function hideTopics(){
//   $('.choose-scealai').css('display', 'none');
//   $('.choose-personal').css('display', 'none');
//   $('.choose-community').css('display', 'none');
// }

var community_scripts = [
  {name: 'Community_Eire', numberofquestions: 10, answers: '<b>Ceist:</b> Cad é an contae is lú in Éirinn?   <b>Freagra:</b> An Lú, Contae Lú, Co. Lú, Contae Lú<br>' + '<br>' + '<b>Ceist:</b> Cén contae ina bhfuil Conamara?   <b>Freagra:</b> Gaillimh, Contae na Gaillimhe, Co. na Gaillimhe<br>' + '<br>' + '<b>Ceist:</b> Cé mhéad bliain a bhíonn i dtéarma Uachtaránachta in Éirinn?   <b>Freagra:</b> Seacht, 7<br>' + '<br>' + '<b>Ceist:</b> Cad é siombail náisiúnta na hÉireann?   <b>Freagra:</b> cláirseach, cruit<br>' + '<br>' + '<b>Ceist:</b> Cé a bhí mar an gcéad Uachtarán ar Éirinn?   <b>Freagra:</b> Dúbhghlas de hÍde, Douglas Hyde<br>' + '<br>' + '<b>Ceist:</b> Cén contae ag a bhfuil an daonra is lú in Éirinn?   <b>Freagra:</b> Liatroim, Contae Liatroma, Co. Liatroma<br>' + '<br>' + '<b>Ceist:</b> Cén contae ina bhfuil Caisleán Bhun Raite?   <b>Freagra:</b> an Clár, Contae an Chláir, Co. an Chláir, Clár<br>' + '<br>' + '<b>Ceist:</b> Cén sliabh is airde in Éirinn?   <b>Freagra:</b> Corrán Tuathaill, Carrauntoohil<br>' + '<br>' + '<b>Ceist:</b> Cén teanga inar scríobhadh Leabhar Cheanannais   <b>Freagra:</b> Laidin<br>' + '<br>' + '<b>Ceist:</b> Cad í an dara abhainn is faide in Éirinn?   <b>Freagra:</b> Abhainn na Bearú, An Bhearú'},
  {name: 'Community_Seanfhocail', numberofquestions: 10, answers: "<b>Ceist:</b> Críochnaigh an nath seo: 'Níl aon tinteán…'   <b>Freagra:</b> mar do thinteán féin<br>" + '<br>' + "<b>Ceist:</b> Críochnaigh an nath seo: 'An té a bhíonn siúlach…'   <b>Freagra:</b> bíonn sé scéalach<br>" + '<br>' + "<b>Ceist:</b> Críochnaigh an nath seo: 'Ní thagann ciall…'   <b>Freagra:</b> roimh aois<br>" + '<br>' + "<b>Ceist:</b> Críochnaigh an nath seo: 'Aithníonn ciaróg…'   <b>Freagra:</b> ciaróg eile<br>" + '<br>' + "<b>Ceist:</b> Críochnaigh an nath seo: 'An té nach bhfuil láidir, ní foláir dó a bheith…'   <b>Freagra:</b> glic<br>" + '<br>' + "<b>Ceist:</b> Críochnaigh an nath seo: 'Beatha teanga…'   <b>Freagra:</b> í a labhairt<br>" + '<br>' + "<b>Ceist:</b> Críochnaigh an nath seo: 'Bíonn blas ar an…'   <b>Freagra:</b> mbeagán<br>" + '<br>' + "<b>Ceist:</b> Críochnaigh an nath seo: 'Is binn béal…'   <b>Freagra:</b> ina thost<br>" + '<br>' + "<b>Ceist:</b> Críochnaigh an nath seo: 'Marbh le tae agus…'   <b>Freagra:</b> marbh gan é<br>" + '<br>' + "<b>Ceist:</b> Críochnaigh an nath seo: 'Ná déan nós is ná…'   <b>Freagra:</b> bris nós"},
];
