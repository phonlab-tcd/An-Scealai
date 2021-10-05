var username = '';
var botName = "Taidhgín";
var progress = 0;
var currentQuestion;
var prevQuestion = -1;
var wrongCount = 0;
var answer2;
var answeringQuestions = false;
var isLevelComplete = false;
var isQuizComplete = false;
var quiz = false;
var quizScore = 0;
var quizProgress = 0;
var isAQuestion = false;


function getName(){
  return username;
}

function clearName(){
  userName = '';
}

function setUsername(name){
  username = name;
  return '';
}

function isNameStored(){
  if(username != '') return true;
  else return false;
}

function getCurrentTopic(){
  return currentTopic;
}

function getBotName(){
  if(botName) return botName;
}


function askName(){
  var greeting = "Dia Dhuit, Is mise " + getBotName() + ". ";
  var askNames = ["Cén t-ainm atá ort?", "Cad is ainm duit?", "Cé thú féin?", "Cad a thabharfaidh mé ort?"];
  var ran = getRandomIntInclusive(0, askNames.length - 1);
  let reply = greeting + askNames[ran];
  return reply;
}

function getProgress(){
  if(isLevelComplete == true && quiz == false) return "";
  else if(isQuizComplete == true) return "";
  else return "Scór: " + progress + "<br>";
}

function resetProgress(){
  progress = 0;
  return "";
}

function triailAris(){
  console.log(wrongCount);
  var rep = [", féach ar an gceann seo arís, a ", ", beagnach ceart ach féach arís air, a "];
  var ran = getRandomIntInclusive(0, rep.length - 1);
  var thisHint;
  if(wrongCount == 2){
    thisHint = "<b>Hint:</b> " + currentQuestion.hint1;
  }
  else if(wrongCount == 4){
    var link =   "https://www.teanglann.ie/ga/gram/" + thisVerb;
    thisHint = "<b>Hint:</b> <a href=\"javascript:void(0)\" onclick=\"openHintWindowPopup()\"><button class='rive-button'>www.teanglann.ie</button></a>"
  }
  else if(wrongCount == 6){
    thisHint = "<i><b>Freagra:</b></i> " + currentQuestion.answer + ". ";
    wrongCount = 0;
    setTimeout(function(){
      chatSetup("continue", "true");
    }, 2500);
    wrongCount = 0;
    return "<br><br>" + thisHint;
  }
  return rep[ran] + getName() + ". <br><br>" + thisHint;
}

function openHintWindowPopup(){
  var url  = "https://www.teanglann.ie/ga/gram/" + thisVerb;
  window.open(url,'popUpWindow','height=500,width=700,left=50,top=50,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
}

function nilToCeim(){
  var nils = ["Tóg briseadh beag mar sin", "Fág é go dtí an chéad lá eile", "Ar aghaidh go briathar eile", "Ar ais go dtí an leathanach baile mar sin",
  "Go breá. Is féidir leat topaic eile a phiocadh nó teacht ar ais uair éigin eile."];
  var ran = getRandomIntInclusive(0, nils.length - 1);
  return nils[ran];
}

function nilToQuiz(){
  var nilToQuiz = ["Tá sé sin go breá. Pioc topaic éigin eile", "Sin a bhfuil mar sin. Slán go fóill agus bain triail as gné eile den ghramadach uair éigin eile. Slán!"];
  var ran = getRandomIntInclusive(0, nilToQuiz.length - 1);
  return nilToQuiz[ran];
}

function nilToCleachtadh(){
  return "";
}

function missingContentMessage(){
  var missingCont = ["Ó, níl na ceisteanna réidh don chuid seo go fóillín. Bogfaimid ar aghaigh go dtí an chéad chuid eile.", "A " + getName() + " níl an chuid seo ullmhaithe i gceart duit go fóill. Bogfaimid " +
  "ar aghaidh.", "A " + getName() + " bogfaimid ar aghaidh is cosúil nach bhfuil an chuid seo réidh.", "A " + getName() + "bogfaimid ar aghaidh níor smaoinigh mé ar cheisteanna duit anseo go fóill."];
  var ran = getRandomIntInclusive(0, missingCont.length - 1);
  return missingCont[ran];
}

function getCrioch(){
  var crioch = ["Maith thú, a " + getName() + ", sin deireadh leis an gcleachtadh anois!", "Fágfaidh mé slán anseo agat! Bhí sé go deas bheith ag caint leat, a " +
  getName(), "Slán go fóill, a " + getName() + ". Beimid ag caint arís tá súil agam.", "Bhí sé go deas bheith ag caint leat. Más maith leat cleachtadh eile a dhéanamh téigh go dtí an leathanach baile."];
  var ran = getRandomIntInclusive(0, crioch.length - 1);
  return crioch[ran];
}

function getRandomQuestion(questions){
    answer2 = "";
    wrongCount = 0;
    if(isLevelComplete == true && quiz == false){
      return "";
    }
    if(isQuizComplete == true) return "";
    if(quiz) quizProgress++;
    var index = getRandomIntInclusive(0, questions.length - 1);
    console.log("index: " +  index);
    if(index == prevQuestion) index = getRandomIntInclusive(0, questions.length - 1);
    prevQuestion = index;
    currentQuestion = questions[index];
    if("answer2" in currentQuestion){
      answer2 = currentQuestion.answer2;
    }
    console.log(currentQuestion.question + ", " + currentQuestion.answer + " " + answer2);
    var ceist = "Ceist: " + currentQuestion.question;
    isAQuestion = true;
    return ceist;
}

function getCurrentAnswer(){
  return currentQuestion.answer;
}

function getTranslation(){
  console.log(currentQuestion);
  if("translation" in currentQuestion){
    dictText.innerHTML = currentQuestion.translastion;
  }
}

function getRandomReply(){
  if(isLevelComplete == true && quiz == false) return "";
  if(isQuizComplete == true) return "";
  var reply = "Maith thú, a " + getName() + ". ";
  var reply2 = "An ceart ar fad agat, a " + getName() + ". ";
  var reply3 = "Sin agat é, a " + getName() + ". ";
  var reply4 = "An mhaith ar fad! "
  var replies = [reply, reply2, reply3, reply4];
  var i = getRandomIntInclusive(0, replies.length-1);
  return replies[i];
}

function getQuizArray(tense){
  var verbs = ["abair", "bi", "beir", "clois", "dean", "faigh", "feic", "ith", "tabhair", "tar", "teigh"];
  var topics = ["Questions", "Ni", "BriatharSaor", "Ceisteach", "Spleach", "Coibhneasta"];
  var ac = "AC";
  for(i = 0; i < verbs.length; i++){
    var thisVerb = verbs[i];
    for(j = 1; j < topics.length + 1; j++){
      var ran = getRandomIntInclusive(0, 9);
      var array = getQuestion(thisVerb, j, ran, tense);
      //BQuizArray.push(array[ran]);
    }
  }
}

function getQuestion(verb, topic, ran, tense){
  if(verb == "abair"){
    if(tense == "AC"){
      if(topic == 1) return abairAimsirChaiteQuestions[ran];
      else if(topic == 2) return abairAimsirChaiteNi[ran];
      else if(topic == 3) return abairACBriatharSaor[ran];
      else if(topic == 4) return abairACCeisteach[ran];
      else if(topic == 5) return abairACSpleach[ran];
    }
    else if(tense == "AL"){
      if(topic == 1) return abairAimsirLaithreachQuestions[ran];
      else if(topic == 2) return abairAimsirLaithreachNi[ran];
      else if(topic == 3) return abairALBriatharSaor[ran];
      else if(topic == 4) return abairALCeisteach[ran];
      else if(topic == 5) return abairALSpleach[ran];
      else if(topic == 6) return abairALCoibhneasta[ran];
    }
    else if(tense == "AF"){
      if(topic == 1) return abairAFQuestions[ran];
      else if(topic == 2) return abairAFNi[ran];
      else if(topic == 3) return abairAFBriatharSaor[ran];
      else if(topic == 4) return abairAFCeisteach[ran];
      else if(topic == 5) return abairAFSpleach[ran];
      else if(topic == 6) return abairAFCoibhneasta[ran];
    }
    else if(tense == "MC"){
      if(topic == 1) return abairMCQuestions[ran];
      else if(topic == 2) return abairMCNi[ran];
      else if(topic == 3) return abairMCBriatharSaor[ran];
      else if(topic == 4) return abairMCCeisteach[ran];
      else if(topic == 5) return abairMCSpleach[ran];
    }
  }

  if(verb == "beir"){
    if(tense == "AC"){
      if(topic == 1) return beirACQuestions[ran];
      else if(topic == 2) return beirACNi[ran];
      else if(topic == 3) return beirACBriatharSaor[ran];
      else if(topic == 4) return beirACCeisteach[ran];
      else if(topic == 5) return beirACSpleach[ran];
      else if(topic == 6) return beirACCoibhneasta[ran];
    }
    else if(tense == "AL"){
      if(topic == 1) return beirALQuestions[ran];
      else if(topic == 2) return beirALNi[ran];
      else if(topic == 3) return beirALBriatharSaor[ran];
      else if(topic == 4) return beirALCeisteach[ran];
      else if(topic == 5) return beirALSpleach[ran];
      else if(topic == 6) return beirALCoibhneasta[ran];
    }
    else if(tense == "AF"){
      if(topic == 1) return beirAFQuestions[ran];
      else if(topic == 2) return beirAFNi[ran];
      else if(topic == 3) return beirAFBriatharSaor[ran];
      else if(topic == 4) return beirAFCeisteach[ran];
      else if(topic == 5) return beirAFSpleach[ran];
      else if(topic == 6) return beirAFCoibhneasta[ran];
    }
    else if(tense == "MC"){
      if(topic == 1) return beirMCQuestions[ran];
      else if(topic == 2) return beirMCNi[ran];
      else if(topic == 3) return beirMCBriatharSaor[ran];
      else if(topic == 4) return beirMCCeisteach[ran];
      else if(topic == 5) return beirMCSpleach[ran];
    }
  }

  if(verb == "bi"){
    if(tense == "AC"){
      if(topic == 1) return biACQuestions[ran];
      else if(topic == 2) return biACNi[ran];
      else if(topic == 3) return biACBriatharSaor[ran];
      else if(topic == 4) return biACCeisteach[ran];
      else if(topic == 5) return biACSpleach[ran];
      else if(topic == 6) return biACCoibhneasta[ran];
    }
    else if(tense == "AL"){
      if(topic == 1) return biALQuestions[ran];
      else if(topic == 2) return biALNi[ran];
      else if(topic == 3) return biALBriatharSaor[ran];
      else if(topic == 4) return biALCeisteach[ran];
      else if(topic == 5) return biALSpleach[ran];
      else if(topic == 6) return biALCoibhneasta[ran];
    }
    else if(tense == "AF"){
      if(topic == 1) return biAFQuestions[ran];
      else if(topic == 2) return biAFNi[ran];
      else if(topic == 3) return biAFBriatharSaor[ran];
      else if(topic == 4) return biAFCeisteach[ran];
      else if(topic == 5) return biAFSpleach[ran];
      else if(topic == 6) return biAFCoibhneasta[ran];
    }
    else if(tense == "MC"){
      if(topic == 1) return biMCQuestions[ran];
      else if(topic == 2) return biMCNi[ran];
      else if(topic == 3) return biMCBriatharSaor[ran];
      else if(topic == 4) return biMCCeisteach[ran];
      else if(topic == 5) return biMCSpleach[ran];
    }
  }

  if(verb == "clois"){
    if(tense == "AC"){
      if(topic == 1) return cloisACQuestions[ran];
      else if(topic == 2) return cloisACNi[ran];
      else if(topic == 3) return cloisACBritharsaor[ran];
      else if(topic == 4) return cloisACCeisteach[ran];
      else if(topic == 5) return cloisACSpleach[ran];
    }
    else if(tense == "AL"){
      if(topic == 1) return cloisALQuestions[ran];
      else if(topic == 2) return cloisALNi[ran];
      else if(topic == 3) return cloisALBriatharSaor[ran];
      else if(topic == 4) return cloisALCeisteach[ran];
      else if(topic == 5) return cloisALSpleach[ran];
      else if(topic == 6) return cloisALCoibhneasta[ran];
    }
    else if(tense == "AF"){
      if(topic == 1) return cloisAFQuestions[ran];
      else if(topic == 2) return cloisAFNi[ran];
      else if(topic == 3) return cloisAFBriatharSaor[ran];
      else if(topic == 4) return cloisAFCeisteach[ran];
      else if(topic == 5) return cloisAFSpleach[ran];
      else if(topic == 6) return cloisAFCoibhneasta[ran];
    }
    else if(tense == "MC"){
      if(topic == 1) return cloisMCQuestions[ran];
      else if(topic == 2) return cloisMCNi[ran];
      else if(topic == 3) return cloisMCBriatharSaor[ran];
      else if(topic == 4) return cloisMCCeisteach[ran];
      else if(topic == 5) return cloisMCSpleach[ran];
    }
  }

  if(verb == "dean"){
    if(tense == "AC"){
      if(topic == 1) return abairAimsirChaiteQuestions[ran];
      else if(topic == 2) return abairAimsirChaiteNi[ran];
      else if(topic == 3) return abairACBriatharSaor[ran];
      else if(topic == 4) return abairACCeisteach[ran];
      else if(topic == 5) return abairACSpleach[ran];
    }
    else if(tense == "AL"){
      if(topic == 1) return abairAimsirLaithreachQuestions[ran];
      else if(topic == 2) return abairAimsirLaithreachNi[ran];
      else if(topic == 3) return abairALBriatharSaor[ran];
      else if(topic == 4) return abairALCeisteach[ran];
      else if(topic == 5) return abairALSpleach[ran];
      else if(topic == 6) return abairALCoibhneasta[ran];
    }
    else if(tense == "AF"){
      if(topic == 1) return abairAFQuestions[ran];
      else if(topic == 2) return abairAFNi[ran];
      else if(topic == 3) return abairAFBriatharSaor[ran];
      else if(topic == 4) return abairAFCeisteach[ran];
      else if(topic == 5) return abairAFSpleach[ran];
      else if(topic == 6) return abairAFCoibhneasta[ran];
    }
    else if(tense == "MC"){
      if(topic == 1) return abairMCQuestions[ran];
      else if(topic == 2) return abairMCNi[ran];
      else if(topic == 3) return abairMCBriatharSaor[ran];
      else if(topic == 4) return abairMCCeisteach[ran];
      else if(topic == 5) return abairMCSpleach[ran];
    }
  }

  if(verb == "abair"){
    if(tense == "AC"){
      if(topic == 1) return abairAimsirChaiteQuestions[ran];
      else if(topic == 2) return abairAimsirChaiteNi[ran];
      else if(topic == 3) return abairACBriatharSaor[ran];
      else if(topic == 4) return abairACCeisteach[ran];
      else if(topic == 5) return abairACSpleach[ran];
    }
    else if(tense == "AL"){
      if(topic == 1) return abairAimsirLaithreachQuestions[ran];
      else if(topic == 2) return abairAimsirLaithreachNi[ran];
      else if(topic == 3) return abairALBriatharSaor[ran];
      else if(topic == 4) return abairALCeisteach[ran];
      else if(topic == 5) return abairALSpleach[ran];
      else if(topic == 6) return abairALCoibhneasta[ran];
    }
    else if(tense == "AF"){
      if(topic == 1) return abairAFQuestions[ran];
      else if(topic == 2) return abairAFNi[ran];
      else if(topic == 3) return abairAFBriatharSaor[ran];
      else if(topic == 4) return abairAFCeisteach[ran];
      else if(topic == 5) return abairAFSpleach[ran];
      else if(topic == 6) return abairAFCoibhneasta[ran];
    }
    else if(tense == "MC"){
      if(topic == 1) return abairMCQuestions[ran];
      else if(topic == 2) return abairMCNi[ran];
      else if(topic == 3) return abairMCBriatharSaor[ran];
      else if(topic == 4) return abairMCCeisteach[ran];
      else if(topic == 5) return abairMCSpleach[ran];
    }
  }

  if(verb == "abair"){
    if(tense == "AC"){
      if(topic == 1) return abairAimsirChaiteQuestions[ran];
      else if(topic == 2) return abairAimsirChaiteNi[ran];
      else if(topic == 3) return abairACBriatharSaor[ran];
      else if(topic == 4) return abairACCeisteach[ran];
      else if(topic == 5) return abairACSpleach[ran];
    }
    else if(tense == "AL"){
      if(topic == 1) return abairAimsirLaithreachQuestions[ran];
      else if(topic == 2) return abairAimsirLaithreachNi[ran];
      else if(topic == 3) return abairALBriatharSaor[ran];
      else if(topic == 4) return abairALCeisteach[ran];
      else if(topic == 5) return abairALSpleach[ran];
      else if(topic == 6) return abairALCoibhneasta[ran];
    }
    else if(tense == "AF"){
      if(topic == 1) return abairAFQuestions[ran];
      else if(topic == 2) return abairAFNi[ran];
      else if(topic == 3) return abairAFBriatharSaor[ran];
      else if(topic == 4) return abairAFCeisteach[ran];
      else if(topic == 5) return abairAFSpleach[ran];
      else if(topic == 6) return abairAFCoibhneasta[ran];
    }
    else if(tense == "MC"){
      if(topic == 1) return abairMCQuestions[ran];
      else if(topic == 2) return abairMCNi[ran];
      else if(topic == 3) return abairMCBriatharSaor[ran];
      else if(topic == 4) return abairMCCeisteach[ran];
      else if(topic == 5) return abairMCSpleach[ran];
    }
  }

  if(verb == "abair"){
    if(tense == "AC"){
      if(topic == 1) return abairAimsirChaiteQuestions[ran];
      else if(topic == 2) return abairAimsirChaiteNi[ran];
      else if(topic == 3) return abairACBriatharSaor[ran];
      else if(topic == 4) return abairACCeisteach[ran];
      else if(topic == 5) return abairACSpleach[ran];
    }
    else if(tense == "AL"){
      if(topic == 1) return abairAimsirLaithreachQuestions[ran];
      else if(topic == 2) return abairAimsirLaithreachNi[ran];
      else if(topic == 3) return abairALBriatharSaor[ran];
      else if(topic == 4) return abairALCeisteach[ran];
      else if(topic == 5) return abairALSpleach[ran];
      else if(topic == 6) return abairALCoibhneasta[ran];
    }
    else if(tense == "AF"){
      if(topic == 1) return abairAFQuestions[ran];
      else if(topic == 2) return abairAFNi[ran];
      else if(topic == 3) return abairAFBriatharSaor[ran];
      else if(topic == 4) return abairAFCeisteach[ran];
      else if(topic == 5) return abairAFSpleach[ran];
      else if(topic == 6) return abairAFCoibhneasta[ran];
    }
    else if(tense == "MC"){
      if(topic == 1) return abairMCQuestions[ran];
      else if(topic == 2) return abairMCNi[ran];
      else if(topic == 3) return abairMCBriatharSaor[ran];
      else if(topic == 4) return abairMCCeisteach[ran];
      else if(topic == 5) return abairMCSpleach[ran];
    }
  }

  if(verb == "abair"){
    if(tense == "AC"){
      if(topic == 1) return abairAimsirChaiteQuestions[ran];
      else if(topic == 2) return abairAimsirChaiteNi[ran];
      else if(topic == 3) return abairACBriatharSaor[ran];
      else if(topic == 4) return abairACCeisteach[ran];
      else if(topic == 5) return abairACSpleach[ran];
    }
    else if(tense == "AL"){
      if(topic == 1) return abairAimsirLaithreachQuestions[ran];
      else if(topic == 2) return abairAimsirLaithreachNi[ran];
      else if(topic == 3) return abairALBriatharSaor[ran];
      else if(topic == 4) return abairALCeisteach[ran];
      else if(topic == 5) return abairALSpleach[ran];
      else if(topic == 6) return abairALCoibhneasta[ran];
    }
    else if(tense == "AF"){
      if(topic == 1) return abairAFQuestions[ran];
      else if(topic == 2) return abairAFNi[ran];
      else if(topic == 3) return abairAFBriatharSaor[ran];
      else if(topic == 4) return abairAFCeisteach[ran];
      else if(topic == 5) return abairAFSpleach[ran];
      else if(topic == 6) return abairAFCoibhneasta[ran];
    }
    else if(tense == "MC"){
      if(topic == 1) return abairMCQuestions[ran];
      else if(topic == 2) return abairMCNi[ran];
      else if(topic == 3) return abairMCBriatharSaor[ran];
      else if(topic == 4) return abairMCCeisteach[ran];
      else if(topic == 5) return abairMCSpleach[ran];
    }
  }

  if(verb == "abair"){
    if(tense == "AC"){
      if(topic == 1) return abairAimsirChaiteQuestions[ran];
      else if(topic == 2) return abairAimsirChaiteNi[ran];
      else if(topic == 3) return abairACBriatharSaor[ran];
      else if(topic == 4) return abairACCeisteach[ran];
      else if(topic == 5) return abairACSpleach[ran];
    }
    else if(tense == "AL"){
      if(topic == 1) return abairAimsirLaithreachQuestions[ran];
      else if(topic == 2) return abairAimsirLaithreachNi[ran];
      else if(topic == 3) return abairALBriatharSaor[ran];
      else if(topic == 4) return abairALCeisteach[ran];
      else if(topic == 5) return abairALSpleach[ran];
      else if(topic == 6) return abairALCoibhneasta[ran];
    }
    else if(tense == "AF"){
      if(topic == 1) return abairAFQuestions[ran];
      else if(topic == 2) return abairAFNi[ran];
      else if(topic == 3) return abairAFBriatharSaor[ran];
      else if(topic == 4) return abairAFCeisteach[ran];
      else if(topic == 5) return abairAFSpleach[ran];
      else if(topic == 6) return abairAFCoibhneasta[ran];
    }
    else if(tense == "MC"){
      if(topic == 1) return abairMCQuestions[ran];
      else if(topic == 2) return abairMCNi[ran];
      else if(topic == 3) return abairMCBriatharSaor[ran];
      else if(topic == 4) return abairMCCeisteach[ran];
      else if(topic == 5) return abairMCSpleach[ran];
    }
  }

  if(verb == "abair"){
    if(tense == "AC"){
      if(topic == 1) return abairAimsirChaiteQuestions[ran];
      else if(topic == 2) return abairAimsirChaiteNi[ran];
      else if(topic == 3) return abairACBriatharSaor[ran];
      else if(topic == 4) return abairACCeisteach[ran];
      else if(topic == 5) return abairACSpleach[ran];
    }
    else if(tense == "AL"){
      if(topic == 1) return abairAimsirLaithreachQuestions[ran];
      else if(topic == 2) return abairAimsirLaithreachNi[ran];
      else if(topic == 3) return abairALBriatharSaor[ran];
      else if(topic == 4) return abairALCeisteach[ran];
      else if(topic == 5) return abairALSpleach[ran];
      else if(topic == 6) return abairALCoibhneasta[ran];
    }
    else if(tense == "AF"){
      if(topic == 1) return abairAFQuestions[ran];
      else if(topic == 2) return abairAFNi[ran];
      else if(topic == 3) return abairAFBriatharSaor[ran];
      else if(topic == 4) return abairAFCeisteach[ran];
      else if(topic == 5) return abairAFSpleach[ran];
      else if(topic == 6) return abairAFCoibhneasta[ran];
    }
    else if(tense == "MC"){
      if(topic == 1) return abairMCQuestions[ran];
      else if(topic == 2) return abairMCNi[ran];
      else if(topic == 3) return abairMCBriatharSaor[ran];
      else if(topic == 4) return abairMCCeisteach[ran];
      else if(topic == 5) return abairMCSpleach[ran];
    }
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function changeProgress(sign){
  if(sign == "+"){
    progress++;
    if(progress == 3){
      isLevelComplete = true;
      console.log("level complete")
    }
    if(quiz) quizScore++;
  }
  if(quiz) {
    if(quizProgress == abairQuiz.length - 1){
      isQuizComplete = true;
      chatSetup("quizcomplete");
    }
    console.log("quiz: " + quizScore);
  }
  return "";
}
