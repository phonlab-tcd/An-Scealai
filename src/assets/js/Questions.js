var quizVerb = "";
var quizStr = "Quiz";
var quizVerbAC = "AC";
var quizVerbAL = "AL";
var quizVerbAF = "AF";
var quizVerbMC = "MC";

function chatSetupQuiz(verb){
  quizVerb = verb;
  if(verb == "bi") verb = "bí";
  else if(verb == "teigh") verb = "téigh";
  keepMessages = true;
  load("IrrQuiz");
}

var irregularVerbsQuiz = [
  {question: "Cad eile ____ ___________ sé? (modh coinníollach)", answer: "a déarfadh"},
  {question: "Ní féidir le hAntoin a bhéal a choimeád dúnta. ___________ sé amach aon rud a thiocfadh isteach ina cheann. (modh coinníollach)", answer: "déarfadh"},
  {question: "____ ___________ aon rud faoin mí-ádh a bhain dó níos mó. (briathar saor, aimsir láithreach, diúltach)", answer: "ní deirtear"},
  {question: "Cad a ___________ siad nuair a chuala siad an méid sin? ", answer: "dúirt"},
  {question: "___________ gur siúinéir iontach í. (aimsir láithreach, briathar saor) ", answer: "deirtear"},
];

var abairQuiz = [
  {question: "____ ___________ mé é sin ná é. (aimsir chaite, diúltach)", answer: "ní dúirt"},
  {question: "____ ___________ éinne é sin. (aimsir chaite, diúltach)", answer: "ní dúirt"},
  {question: "Bhí a fhios agam go maith _____ ___________ Deirdre é sin? (aimsir chaite, diúltach)", answer: "nach ndúirt"},
  {question: "____ ___________ mé é sin leat na blianta ó sin? (aimsir chaite, diúltach)", answer: "nach ndúirt"},
  {question: "Cad eile ____ ___________ sé? (modh coinníollach)", answer: "a déarfadh"},
  {question: "___________ gur siúinéir iontach í. (aimsir láithreach, briathar saor) ", answer: "deirtear"},
  {question: "___________ mé leat é anocht. (aimsir fháistineach)", answer: "déarfaidh"},
  {question: "_____ ___________Máiréad aon rud faoi go dtí go mbeidh sí lán-chinnte. (aimsir fháistineach, diúltach)", answer: "ní déarfaidh"},
  {question: "____ ___________ go bhfuil fios a ghnó aige? (tú, modh coinníollach, dearfach)", answer: "an ndéarfá"},
  {question: "Nach é sin a ___________ leat? (mé, aimsir láithreach)", answer: "deirim"},
  {question: "___________ madraí an bhaile é sin leat. (modh coinníollach)", answer: "déarfadh"},
  {question: "___________ go bhfuil sé glan as a mheabhair má thagann an scéal sin amach faoi. (aimsir fháistineach, briathar saor)", answer: "déarfar"},
  {question: "____ ___________ faic faoi sin go fóill? (sinn, aimsir fháistineach)", answer: "ní déarfaimid"},
  {question: "____ ___________ go bhfuil tuairim faoin spéir acu faoi cad atá i ndán dóibh. (mé, modh coinníollach, diúltach)", answer: "ní déarfainn"},
  {question: "____ ___________ aon rud faoin mí-ádh a bhain dó níos mó. (briathar saor, aimsir láithreach, diúltach)", answer: "ní deirtear"},
  {question: "____ ___________ aon rud go dtí go mbeidh deireadh ráite acu sin. (sinn, aimsir fháistineach, diúltach) ", answer: "ní déarfaimid"},
  {question: "Cad a ___________ siad nuair a chuala siad an méid sin? ", answer: "dúirt"},
  {question: "Ní féidir le hAntoin a bhéal a choimeád dúnta. ___________ sé amach aon rud a thiocfadh isteach ina cheann. (modh coinníollach)", answer: "déarfadh"},
  {question: "Dúirt bean liom ____ ___________ bean léi. (aimsir chaite, an fhoirm spleách)", answer: "go ndúirt"},
  {question: "“Bíonn súil le muir, ach ní bhíonn súil le huaigh”, a ___________. (briathar saor, aimsir láithreach)", answer: "deirtear"},
];

var faighQuiz = [
  {question: "___________ mé an méid a bhí uaim ar deireadh thiar thall.", answer: "fuair", answer2: "gheobhaidh"},
  {question: "___________ an spreagadh ó na moltóirí sa chéad bhabhta den gcomórtas. (sinn, aimsir chaite)", answer: "fuaireamar", answer2: "fuair muid"},
  {question: "___ ___________ siad leath den mhéid a bhí ag dul dóibh? (diúltach, aimsir chaite)", answer: "ní bhfuair"},
  {question: "___  ___________ tú aon deis chun an obair a chríochnú? (ceist, aimsir chaite)", answer: "an bhfuair"},
  {question: "____ ___________ siad gach a raibh ag teastáil uatha. (diúltach, aimsir chaite)", answer: "ní bhfuair"},
  {question: "______ ___________ sibh lón san áit a bhfuil sibh ag obair ann? (aimsir láithreach) ", answer: "an bhfaigheann"},
  {question: "______ ___________ tú do chuid feola ón mbúistéir sin? (aimsir láithreach)", answer: "an bhfaigheann"},
  {question: "____ ___________gach éinne a dhéanann obair dheonach san áit aitheantas foirmeálta ina dtuairisc bhliantúil? (diúltach, aimsir láithreach)", answer: "an bhfaigheann"},
  {question: "____ ___________ siad tuarastal ard ón gcomhlacht a bhfuil siad ag obair dóibh? (dearfach, aimsir láithreach)", answer: "an bhfaigheann"},
  {question: "___________ mé é sin duit an chéad rud maidin amárach.", answer: "gheobhaidh"},
  {question: "___________ sé breith a bhéil féin ag deireadh an lae. (dearfach)", answer: "gheobhaidh"},
  {question: "___________ rud éigin le n-ithe go luath anois. (sinn, aimsir fháistineach)", answer: "gheobhaimid", answer2: "gheobhaidh muid"},
  {question: "___________ réidh leis na cinn sin go luath. (briathar saor, aimsir fháistineach)", answer: "gheofar"},
  {question: "______ ___________ é sin ar ais dom chomh luath agus is féidir leat? (tú, aimsir fháistineach) ", answer: "an bhfaighfeá"},
  {question: "___________ ceann nua murach go bhfuil mé an-tógtha leis an sean-cheann seo. (mé, modh coinníollach)", answer: "gheobhainn"},
  {question: "____ ___________an duais fiú muna mbeadh istigh ar an gcomórtas ach iad féin. (diúltach, modh coinníollach)", answer: "ní bhfaighidís", answer2: "ní bhfaigheadh siad"},
  {question: "____ ___________ éinne beo an ceann is fearr ar Mhaebh an lá sin? (diúltach, modh coinníollach)", answer: "ní bhfaigheadh"},
  {question: "___________ ceann nua duit dá mbeadh an ceann sin briste. (mé)", answer: "gheobhainn"},
  {question: "Níl a fhios agam ach ___________ mé amach duit é.", answer: "gheobhaidh"},
  {question: "___________ siad bróga nua sa siopa.", answer: "fuair"},
];

var tarQuiz = [
  {question: "___________ sí isteach ach choimeád sí a béal dúnta.", answer: "tháinig", hint1: ""},
  {question: "_____ __________ ar aon réiteach ar an bhfadhb go fóill. (sinn, diúltach)", answer: "níor thángamar", answer2: "níor tháinig muid", hint1: ""},
  {question: "Ta a fhios agam___ ___________ siad ar ais ag gearán an lá dar gcionn. (dearfach, aimsir chaite)", answer: "gur tháinig", hint1: ""},
  {question: "___  ___________ siad ar chorp an fhir a báiteadh riamh. (diúltach) ", answer: "níor tháinig", hint1: ""},
  {question: "____ ___________ ciall roimh aois. (diúltach, aimsir láithreach)", answer: "ní thagann", hint1: ""},
  {question: "______ ___________ an sneachta rómhinic in Éirinn. (diúltach, aimsir láithreach) ", answer: "ní thagann", hint1: ""},
  {question: "Tá a fhios agam ______ ___________ sé timpeall ach anois is arís. (diúltach, aimsir láithreach)", answer: "nach dtagann", hint1: ""},
  {question: "____ ___________tú abhaile go minic? (dearfach, aimsir láithreach)", answer: "nach dtagann", hint1: ""},
  {question: "____ ___________ go dtí an phictiúrlann liom? (tú, dearfach)", answer: "an dtiocfá", answer2: "an dtiocfadh tú", hint1: ""},
  {question: "Ní dóigh liom ____ ___________ sí ar ais anocht.", answer: "go dtiocfaidh", hint1: ""},
  {question: "Cén t-am ____ ___________ an bus ar maidin? ", answer: "a thagann", hint1: ""},
  {question: "Seo é an tobar beannaithe ___ ___________ na céadta daoine chuige gach bliain. (dearfadh) ", answer: "a dtagann**", hint1: ""},
  {question: "___________ _________ ar ais go háit mar seo. Tá sí ró-iarghúlta. (mé, modh coinníollach)", answer: "ní thiocfainn", answer2: "ní thiocfadh mé", hint1: ""},
  {question: "Bhí a fhios agam ______ ___________ sí linn dá bhfaigheadh sí an seans. (dearfach) ", answer: "go dtiocfadh", hint1: ""},
  {question: "______ ___________ tú ar ais go dtí mo theachsa níos déanaí? ", answer: "an dtiocfaidh", hint1: ""},
  {question: "Bhí tuairim mhaith agam ____ ___________aon athrú ar a intinn siúd. (diúltach, modh coinníollach)", answer: "nach dtiocfadh", hint1: ""},
  {question: "____ ___________ feabhas ar an aimsir anois bheadh linn. ", answer: "dá dtiocfadh", hint1: ""},
  {question: "___________ sí abhaile gach seachtain is cuma cad é a bhíonn ar siúl aici. ", answer: "tagann", hint1: ""},
  {question: "_____ ___________ ar ais anois d’fhéadfaimis é seo a chríochnú go luath. (tú, modh coinníollach)", answer: "dá dtiocfá", hint1: ""},
  {question: "Bhí a fhios agam go maith _____ ___________ i ngiorracht scread asail den áit. (siad)", answer: "nach dtiocfaidís", answer2: "nach dtiocfadh siad", hint1: ""},
];

var biQuiz = [
  {question: "___________ go maith is ní raibh go holc.", answer: "bhí", hint1: ""},
  {question: "_____ __________ an phraiseach ar fud na mias san oifig faoi dheireadh an lae. (dearfach)", answer: "bhí", hint1: ""},
  {question: "___ ___________ ann ach sceach i mbéal bearna ach d’oibrigh sé. (diúltach)", answer: "ní raibh", hint1: ""},
  {question: "Cé ___  ___________ oiread na fríde ann, ba imreoir an-mhaith é. (diúltach) ", answer: "nach raibh", hint1: ""},
  {question: "____ ___________ tú ag caint le héinne eile ó shin? (diúltach)", answer: "nach raibh", hint1: ""},
  {question: "______ ___________ cósta na Breataine Bige le feiceáil ón áit seo uaireanta? (dearfach) ", answer: "an mbíonn", hint1: ""},
  {question: "___________ ag tnúth go mór le bualadh leat. (sinn, dearfach, aimsir fháistineach)", answer: "beimid", answer2: "beidh muid", hint1: ""},
  {question: "____ ___________siad á rá sin ach ná creid focal a thagann amach as a mbéil. (aimsir láithreach)", answer: "bíonn", hint1: ""},
  {question: "Deir sí ____ ___________ éinne ann de ghnáth. (diúltach)", answer: "nach mbíonn", hint1: ""},
  {question: "____ ___________ siad riamh gan ghearán. (diúltach, aimsir láithreach)", answer: "ní bhíonn", hint1: ""},
  {question: "____ ___________ tú ag dul go dtí an cluiche anocht? (dearfach) ", answer: "an mbeidh", hint1: ""},
  {question: "___ ___________ tú leat féin san oifig maidin amárach? (dearfadh) ", answer: "an mbeidh", hint1: ""},
  {question: "Tá a fhios agam go maith ___________ _________ duine ná deoraí ann go dtí a deich a chlog. (diúltach, aimsir fháistineach)", answer: "nach mbeidh", hint1: ""},
  {question: "___________ an saol is a mháthair istigh i lár na cathrach anocht. (dearfach) ", answer: "beidh", hint1: ""},
  {question: "___________gach rud ceart go leor dá bhfanfaidís socair. (dearfach)", answer: "bheadh", hint1: ""},
  {question: "Dá mbeadh sí anseo ____ ___________ sí sásta cur suas le seafóid mar sin. (diúltach)", answer: "ní bheadh", hint1: ""},
  {question: "Bhí a fhios agam go maith ___________ ann in am. (siad, diúltach) ", answer: "nach mbeidís", answer2: "nach mbeadh siad", hint1: ""},
  {question: "An gceapann tú _____ ___________ sí ábalta an rás a bhuachan anocht? (dearfach)", answer: "go mbeidh", hint1: ""},
  {question: "Dúirt sí _____ ___________ sí sásta é a dhéanamh. (siad)", answer: "go mbeadh", answer2: "go mbeidh", hint1: ""},
];

var tabhairQuiz = [
  {question: "___________ gach cabhair agus cúnamh dó ach bhí sé fuar agam. (mé, aimsir chaite, dearfach)", answer: "thugas", answer2: "thug mé", hint1: ""},
  {question: "_____ __________ bia agus deoch dóibh sula ndeachaigh siad abhaile. (sinn, aimsir chaite, dearfach)", answer: "thugamar", answer2: "thug muid", hint1: ""},
  {question: "___________ gach rud dóibh ach níor spéis leo an scolaíocht. (briathar saor, aimsir chaite, dearfach)", answer: "tugadh", hint1: ""},
  {question: "___  ___________ aon rud le n-ithe dúinn ó mhaidin. (briathar saor, aimsir chaite, diúltach) ", answer: "níor thugadh", hint1: ""},
  {question: "____ ___________ sí an leabhar ar ais dom go fóill. (aimsir chaite, diúltach)", answer: "níor thug", hint1: ""},
  {question: "______ ___________ an-aird ar na rudaí beaga sin. (mé, aimsir láithreach, dearfach) ", answer: "ní thugaim", answer2: "ní thugann mé", hint1: ""},
  {question: "___________ sí bronntanas deas dom gach Nollaig. (dearfach)", answer: "tugann", hint1: ""},
  {question: "____ ___________íde na much do na daoine a bhíonn ag obair san áit sin. (briathar saor, aimsir láithreach, dearfach)", answer: "tugtar", hint1: ""},
  {question: "____ ___________ aire mhaith don madra gach lá. (mé, dearfach)", answer: "tugaim", hint1: ""},
  {question: "____ ___________ lón linn gach maidin. (sinn, dearfach)", answer: "tugaimid", answer2: "tugann muid", hint1: ""},
  {question: "____ ___________ mé dóibh é go dtí go mbeidh mé críochnaithe leis. (diúltach) ", answer: "ní thabharfaidh", hint1: ""},
  {question: "___ ___________ aghaidh ar Mhaigh Eo ag tús na seachtaine seo chugainn. (sinn, dearfadh) ", answer: "tabharfaimid", answer2: "tabharfaidh muid", hint1: ""},
  {question: "____ ___________ aon seans eile duit muna dtógann tú anois é. (briathar saor, aimsir fháistineach, diúltach)", answer: "ní thabharfar", hint1: ""},
  {question: "______ ___________ aon fhreagra orthu go dtí go mbeimid cinnte. (sinn, diúltach) ", answer: "ní thabharfaimid", answer2: "ní thabharfaidh muid", hint1: ""},
  {question: "Buail ar an doras agus ___________ Síle an rothar duit. (dearfach)", answer: "tabharfaidh", hint1: ""},
  {question: "____ ___________duit é agus fáilte dá mbeadh sé agam. (mé, dearfach)", answer: "thabharfainn", answer2: "thabharfadh mé", hint1: ""},
  {question: "____ ___________ Seán an greim as a bhéal duit. (modh coinníollach, dearfach)", answer: "thabharfadh", hint1: ""},
  {question: "Dúirt sé____ ___________ sé suas an t-ól ach ní mar sin a tharla. (dearfach)", answer: "go dtabharfadh", hint1: ""},
  {question: "Gheall siad ____ ___________an leabhar d’aon duine eile. (siad, modh coinníollach, diúltach) ", answer: "nach dtabharfaidís", answer2: "nach dtabharfadh siad", hint1: ""},
  {question: "___________ aon rud ar iasach dóibh siúd. (tú, modh coinníollach, diúltach)", answer: "thabharfá", answer2: "thabharfadh tú", hint1: ""},
];

var teighQuiz = [
  {question: "___________ mé isteach agus ní raibh éinne istigh romham. (dearfach)", answer: "chuaigh", hint1: ""},
  {question: "_____ __________ ar laethanta saoire go dtí an Fhrainc anuraidh. (sinn, dearfach)", answer: "chuamar", answer2: "chuaigh muid", hint1: ""},
  {question: "___ ___________ sí in aon áit an oíche sin ina dhiaidh sin is uile. (diúltach)", answer: "ní dheachaigh", hint1: ""},
  {question: "___  ___________ amach ar chor ar bith oíche Dé Sathairn seo caite. (sinn, diúltach) ", answer: "ní dheachamar", answer2: "ní dheachaigh muid", hint1: ""},
  {question: "____ ___________ tú go dtí an cluiche an Domhnach seo caite? (dearfach)", answer: "an dheachaigh", hint1: ""},
  {question: "______ ___________ éinne eile isteach in éineacht leat? (diúltach) ", answer: "an dheachaigh", hint1: ""},
  {question: "Dúirt sé liom ___ ___________ sé caol díreach abhaile an oíche sin. (dearfach)", answer: "go ndeachaigh", hint1: ""},
  {question: "Chuala mé____ ___________rudaí go rómhaith dóibh ag an deireadh seachtaine. (diúltach)", answer: "nach ndeachaigh", hint1: ""},
  {question: "____ ___________ tú go dtí an Iodáil ar laethanta saoire gach bliain? (dearfach)", answer: "an dtéann", hint1: ""},
  {question: "____ ___________ suas an bealach sin gach uair. (sinn, diúltach)", answer: "ní théimid", answer2: "ní théann muid", hint1: ""},
  {question: "____ ___________ sí abhaile gach aon deireadh seachtaine. (dearfach) ", answer: "téann", hint1: ""},
  {question: "Ceapaim ___ ___________ siad ar chúrsa Gaeltachta beagnach gach bliain. (dearfadh) ", answer: "go dtéann", hint1: ""},
  {question: "____ ___________ mé isteach chugat ar ball beag. (dearfach)", answer: "rachaidh", hint1: ""},
  {question: "______ ___________ an capall sin isteach sa stábla go héasca an uair seo. (diúltach) ", answer: "rachaidh", hint1: ""},
  {question: "___________ go léir isteach i dteannta a chéile i gceann cúpla nóiméad. (dearfach)", answer: "rachaimid", answer2: "rachaidh muid", hint1: ""},
  {question: "____ ___________an madra sin abhaile le duine ar bith dá bhfágfaí amuigh mar sin é. (dearfach)", answer: "rachadh", hint1: ""},
  {question: "Dúirt siad ____ ___________ go dtí an léacht ach chuaigh. (siad, diúltach)", answer: "nach rachaidís", answer2: "nach rachadh siad", hint1: ""},
  {question: "____ ___________ aon duine le haon chiall ag snámh in áit mar sin. (diúltach)", answer: "ní rachadh", hint1: ""},
  {question: "____ ___________ ann dá mbeadh Seán ag dul ann freisin? (tú, dearfach) ", answer: "an rachfá", answer2: "an rachadh tú", hint1: ""},
  {question: "Dúirt siad ___ ___________ go dtí an Rúis i lár an gheimhridh go brách arís. (siad, diúltach)", answer: "nach rachaidís", answer2: "nach rachadh siad", hint1: ""},
];

var abairAimsirChaiteQuestions = [
  {question: "___________ sí go raibh sé ar fheabhas.", answer: "dúirt", hint1: "dearfach, aimsir chaite"},
  {question: "___________ Liam go raibh sé tinn.", answer: "dúirt", hint1: "dearfach, aimser chaite"},
  {question: "___________ na buachaillí nach raibh éinne eile ann.", answer: "dúirt", hint1: "dearfach, aimser chaite"},
  {question: "___________ (sinn) nár chualamar an scéal sin riamh.", answer: "dúramar", hint1: "dearfach, aimser chaite"},
  {question: "___________ mé é sin leat cheana.", answer: "dúirt", hint1: "dearfach, aimser chaite"},
  {question: "___________ bean liom go ndúirt bean léi.", answer: "dúirt", hint1: "dearfach, aimser chaite"},
  {question: "___________ (sinn) ár bpaidreacha ina dhiaidh sin.", answer: "dúramar", hint1: "dearfach, aimser chaite"},
  {question: "___________ Síle go raibh an scéal sin fíor.", answer: "dúirt", hint1: "dearfach, aimser chaite"},
  {question: "___________ sé go raibh brón air.", answer: "dúirt", hint1: "dearfdearfach, aimser chaiteach"},
  {question: "B’shin é a ___________ mé leat.", answer: "dúirt", hint1: "dearfach, aimser chaite"}
];

var abairAimsirChaiteNi = [
  {question: "____ ___________ mé a leithéid riamh.", answer: "ní dúirt", hint1: "diúltach, aimsir chaite"},
  {question: "____ ___________ éinne é sin liom.", answer: "ní dúirt", hint1: "diúltach, aimsir chaite"},
  {question: "____ ___________ sí faic.", answer: "ní dúirt", hint1: "diúltach, aimsir chaite"},
  {question: "____ ___________ (sinn) go rabhamar bréan bailithe de.", answer: "ní dúramar", hint1: "diúltach, aimsir chaite"},
  {question: "____ ___________ tú é sin liom riamh.", answer: "ní dúirt", hint1: "diúltach, aimsir chaite"},
  {question: "____ ___________ Deirdre aon rud faoi.", answer: "ní dúirt", hint1: "diúltach, aimsir chaite"},
  {question: "____ ___________ (sinn) faic le héinne.", answer: "ní dúramar", hint1: "diúltach, aimsir chaite"},
  {question: "____ ___________ siad go raibh ocras orthu.", answer: "ní dúirt", hint1: "diúltach, aimsir chaite"},
  {question: "____ ___________ sibh aon rud liom.", answer: "ní dúirt", hint1: "diúltach, aimsir chaite"},
  {question: "____  ___________ tú é sin linn ag an am.", answer: "ní dúirt", hint1: "diúltach, aimsir chaite"}
];

var abairACBriatharSaor = [
  {question: "___________ gur fear láidir a bhí ann ach níl a fhios ag éinne.", answer: "dúradh", hint1: "dearfach, briathar saor"},
  {question: "___________ gur ghoid sí é ach ní chreidim é sin.", answer: "dúradh", hint1: "dearfach, briathar saor"},
  {question: "____ ___________ aon rud mar sin sa chúirt.", answer: "ní dúradh", hint1: "diúltach, briathar saor"},
  {question: "____ ___________ riamh go raibh sé béalscaoilteach.", answer: "ní dúradh", hint1: "diúltach, briathar saor"},
  {question: "___________ go raibh sé beo bocht nuair a cailleadh é.", answer: "dúradh", hint1: "dearfach, briathar saor"},
  {question: "____ ___________ aon rud faoina cumas ceoil.", answer: "ní dúradh", hint1: "diúltach, briathar saor"},
  {question: "___________ go raibh sé i ndeireadh na feide faoin am a fuair siad é.", answer: "dúradh", hint1: "dearfach, briathar saor"},
  {question: "___________ nach raibh maith na muice lena deartháir riamh.", answer: "dúradh", hint1: "dearfach, briathar saor"},
  {question: "___________ gur tógadh go dealbh bocht iad.", answer: "dúradh", hint1: "dearfach, briathar saor"},
  {question: "___________ go raibh sí ar buile nuair a chuala sí é.", answer: "dúradh", hint1: "dearfach, briathar saor"}
];

var abairACCeisteach = [
  {question: "____ ___________ tú leis go raibh tú tinn?", answer: "an ndúirt", answer2:"nach ndúirt", hint1: "nach/an"},
  {question: "____ ___________ (sinn) leat go rabhamar ag dul ar laethanta saoire?", answer: "an ndúramar", answer2: "nach ndúramar", hint1: "sinn"},
  {question: "____ ___________ mé é sin leat cheana?", answer: "an ndúirt", answer2: "nach ndúirt", hint1: "nach/an"},
  {question: "____ ___________ tú go raibh tú críochnaithe?", answer: "an ndúirt", answer2: "nach ndúirt", hint1: "nach/an"},
  {question: "___________ mé leat é míle is céad uair cheana?", answer: "nach ndúirt", hint1: "diúltach"},
  {question: "____ ___________ é sin i gcónaí? (Briathar Saor)", answer: "nach ndúradh", hint1: "diúltach"},
  {question: "____ ___________ (sinn) go mbeimis ag dul ann amárach?", answer: "an ndúramar", answer2: "nach ndúramar", hint1: "sinn"},
  {question: "____ ___________ sé aon rud leat?", answer: "an ndúirt", answer2: "nach ndúirt", hint1: "nach/an"},
  {question: "____ ___________ siad aon rud leat faoi na fadhbanna a bhí acu?", answer: "an ndúirt", answer2: "nach ndúirt", hint1: "nach/an"}
];

var abairACSpleach = [
  {question: "Tá mé cinnte ____ ___________ siad é. (dearfach)", answer: "go ndúirt", hint1: "dearfach"},
  {question: "Tá mé cinnte ____ ___________ siad é. (diúltach)", answer: "nach ndúirt", hint1: "diúltach"},
  {question: "An é ____ ___________ tú aon rud leo? (diúltach)", answer: "nach ndúirt", hint1: "diúltach"},
  {question: "D’admhaigh sí ____ ___________ sí é. (dearfach)", answer: "go ndúirt", hint1: "dearfach"},
  {question: "Ní dóigh liom ____ ___________ siad a leithéid. (dearfach)", answer: "go ndúirt", hint1: "dearfach"},
  {question: "Tá mé lánchinnte ____ ___________(sinn) é sin riamh. (diúltach)", answer: "nach ndúramar", hint1: "diúltach, sinn"},
  {question: "Tá a fhios ag Dia ____ ___________ sí é glan amach. (dearfach)", answer: "go ndúirt", hint1: "dearfach"},
  {question: "Dúirt bean liom ____ ___________ bean léi (dearfach)", answer: "go ndúirt", hint1: "dearfach"},
  {question: "Shéan siad ____ ___________siad aon rud mar sin (dearfach)", answer: "go ndúradar", hint1: "dearfach"},
  {question: "Is cuimhin liom ____ ___________sí aon rud faoi ag an am (diúltach)", answer: "nach ndúirt", hint1: "diúltach"},
];

var abairACExtraQuestions = [
  {question: "___________ Seán liom go raibh an-lá acu.", answer: "dúirt", hint1: "dearfach"},
  {question: "____ ___________ mé a leithéid riamh i mo shaol.", answer: "ní dúirt", hint1: "diúltach"},
  {question: "____ ___________ tú é sin le héinne eile?", answer: "an ndúirt", answer2: "nach ndúirt", hint1: "ceisteach"},
  {question: "____ ___________ mé leat gan é sin a rá go brách arís!", answer: "nach ndúirt", hint1: "ceisteach"},
  {question: "Tá súil agam  ____ ___________ tú leis é. (dearfach)", answer: "go ndúirt", hint1: "dearfach"},
  {question: "Tá súil agam  ____ ___________ tú a leithéid sin léi siúd (diúltach)", answer: "nach ndúirt", hint1: "diúltach, ceisteach"},
  {question: "Tá gach ____ ___________ siad fíor is cosúil.", answer: "a dúirt", hint1: "dearfach"},
  {question: "____ ___________ tú inné nach raibh spéis dá laghad agat ann? (diúltach)", answer: "nach ndúirt", hint1: "diúltach, ceisteach"},
  {question: "Ní dóigh liom ____ ___________ mé é sin.", answer: "go ndúirt", hint1: "dearfach"},
  {question: "___________ i gcónaí gur tháinit an bhean sídhe nuair a bhí duine i mbéal a bháis.", answer: "dúradh", hint1: "dearfach, briathar saor"}
];

var abairAimsirLaithreachQuestions = [
  {question: "___________ é sin i gcónaí (mé).", answer: "deirim", hint1: "dearfach"},
  {question: "___________ siad go bhfuil siad tuirseach de.", answer: "deir", hint1: "dearfach"},
  {question: "___________ siad go bhfuil sé go maith.", answer: "deir", hint1: "dearfach"},
  {question: "___________ sí go bhfuil gach duine críochnaithe.", answer: "deir", hint1: "dearfach"},
  {question: "___________ an rud céanna gach uair (sinn).", answer: "deirimid", hint1: "dearfach"},
  {question: "___________ Liam go bhfuil siad beagnach críochnaithe.", answer: "deir", hint1: "dearfach"},
  {question: "___________ gach duine é sin ach níl sé fíor.", answer: "deir", hint1: "dearfach"},
  {question: "___________ na manaigh paidreacha an chéad rud gach maidin.", answer: "deir", hint1: "dearfach"},
  {question: "___________ leat go bhfuil siad sásta (mé).", answer: "deirim", hint1: "dearfach"},
  {question: "___________ an rud ceart i gcónaí (sinn).", answer: "deirimid", hint1: "dearfach"}
];

var abairAimsirLaithreachNi = [
  {question: "____ ___________ mo chara rudaí mar sin riamh.", answer: "ní deir", hint1: "diúltach"},
  {question: "____ ___________ aon rud faoi riamh.", answer: "ní deirim", hint1: "diúltach"},
  {question: "____ ___________ siad go mbíonn siad míshásta.", answer: "ní deir", hint1: "diúltach"},
  {question: "____ ___________ na rudaí sin riamh (sinn).", answer: "ní deirimid", hint1: "diúltach"},
  {question: "____ ___________ aon rud ag an tús (sinn).", answer: "ní deirimid", hint1: "diúltach"},
  {question: "____ ___________ aon phaidreacha ar maidin (mé).", answer: "ní deirim", hint1: "diúltach"},
  {question: "____ ___________ Séamas aon rud faoin timpiste a tharla dó riamh.", answer: "ní deir", hint1: "diúltach"},
  {question: "____ ___________ siad aon rud má bhíonn siad faoi bhrú.", answer: "ní deir", hint1: "diúltach"},
  {question: "____ ___________ aon rud faoin eachtra le Deirdre riamh (sinn).", answer: "ní deirimid", hint1: "diúltach"},
  {question: "____ ___________ aon rud faoi le Daithí riamh (mé).", answer: "ní deirim", hint1: "diúltach"}
];

var abairALBriathorSaor = [
  {question: "___________ go bhfuil sé go maith ach níl a fhios agam faoi.", answer: "deirtear", hint1: "dearfach"},
  {question: "____ ___________ mar sin é i nGaeilge Uladh.", answer: "ní deirtear", hint1: "diúltach"},
  {question: "___________ go mbeidh samhradh maith againn ach níl a fhios ag éinne.", answer: "deirtear", hint1: "dearfach"},
  {question: "___________ go bhfuil gach rud an-daor sa siopa sin.", answer: "deirtear", hint1: "dearfach"},
  {question: "___________ go bhfuil Nóra an-mhaith ag Mata.", answer: "deirtear", hint1: "dearfach"},
  {question: "___________ go bhfuil seans maith ag Loch Garman Craobh na hÉireann a bhuachan i mbliana.", answer: "deirtear", hint1: "dearfach"},
  {question: "____ ___________ aon rud faoin mBreatimeacht níos mó.", answer: "ní deirtear", hint1: "diúltach"},
  {question: "___________ go mbeidh stoirm againn ag an deireadh seachtaine.", answer: "deirtear", hint1: "dearfach"},
  {question: "____ ___________ aon rud faoi sin níos mó.", answer: "ní deirtear", hint1: "diúltach"},
  {question: "____ ___________ mórán faoin easpa fostaíochta atá sa cheantar sin níos mó.", answer: "ní deirtear", hint1: "diúltach"}
];

var abairALCeisteach = [
  {question: "___________ é sin i mBéarla Shasana (dearfach, briathar saor).", answer: "an ndeirtear", hint1: "dearfach"},
  {question: "____ ___________ go bhfuil na taibléidí sin go dona don gcroí? (diúltach, briathar saor)", answer: "nach ndeirtear", hint1: "diúltach"},
  {question: "___________ go bhfuil sé sin as a mheabhar ar fad? (diúltach, briathar saor)", answer: "nach ndeirtear", hint1: "diúltach"},
  {question: "___________ aon rud faoin aighneas a bhí acu níos mó? (dearfach, briathar saor).", answer: "an ndeirtear", hint1: "dearfach"},
  {question: "___________ é sin rómhinic leat? (dearfach, mé).", answer: "an ndeirim", hint1: "dearfach"},
  {question: "___________ aon rud mícheart riamh (dearfach, mé).", answer: "an ndeirim", hint1: "dearfach"},
  {question: "____ ___________ sí é sin go minic? (diúltach).", answer: "nach ndeir", hint1: "diúltach"},
  {question: "____ ___________ é sin leo gach aon uair? (diúltach, sinn)", answer: "nach ndeirimid", hint1: "diúltach"},
  {question: "____ ___________ Seán go bhfuil siad an-sona san áit ina bhfuil siad? (diúltach).", answer: "nach ndeir", hint1: "diúltach"},
  {question: "____ ___________ gach duine go bhfuil mí-ádh ag dul leis an teach sin? (diúltach).", answer: "nach ndeir", hint1: "diúltach"}
];

var abairALSpleach = [
  {question: "Ceapaim ____ ___________ é sin. (briathar saor)", answer: "go ndeirtear", answer2: "nach ndeirtear", hint1: "go/nach"},
  {question: "Is dóigh liom ____ ___________ siad é sin go minic.", answer: "go ndeir", answer2: "nach ndeir", hint1: "go/nach"},
  {question: "Deir Síle ____ ___________ Máire an rud céanna? ", answer: "go ndeir", answer2: "nach ndeir", hint1: "go/nach"},
  {question: "An bhful sé fíor ____ ___________ Rónán go bhfuil sé chun éirí as? (dearfach)", answer: "go ndeir", hint1: "dearfach"},
  {question: "Tá mé cinnte ____ ___________ é sin riamh. (briathar saor, diúltach)", answer: "nach ndeirtear", hint1: "diúltach"},
  {question: "Deir sí ____ ___________ sí rudaí mar sin riamh. (diúltach)", answer: "nach ndeir", hint1: "diúltach"},
  {question: "Tá sé ag séanadh ____ ___________ sé a leithéid lena rang go rialta.", answer: "go ndeir", hint1: "dearfach"},
  {question: "Is é an trua ____ ___________é sin níos minicí. (briathar saor, diúltach)", answer: "nach ndeirtear", hint1: "diúltach"},
  {question: "An bhfuil tú ag rá liom ____ ___________rudaí mar sin riamh? (briathar saor)", answer: "go ndeirtear", hint1: "dearfach"}
];

var abairALCoibhneasta = [
  {question: "Scríobh síos go beacht gach _____ _______ ____ leat. (mé) ", answer: "a ndeir mé", hint1: "dearfach"},
  {question: "Ní bhíonn gach ____ ___________ an fear sin fíor i gcónaí.", answer: "a ndeir", hint1: "dearfach"},
  {question: "Níl ach plámas i ngach ____ ___________ sé siúd. ", answer: "a ndeir", hint1: "dearfach"},
  {question: "Tá gach ____ ______ _____ leat fíor (lom na fírinne atá ann). (sinn)", answer: "a ndeir muid", hint1: "sinn"},
  {question: "Creid uaimse é. Tá gach  ____ ___________ sí fíor. ", answer: "a ndeir", hint1: "dearfach"},
  {question: "Cheapfá ón méid  ____ ___________ faoi go bhfuil sé ar an bhfadhb is mó riamh. (briathar saor)", answer: "a ndeirtear", hint1: "dearfach, briathar saor"},
  {question: "Cé go mbíonn siad ag ligean orthu féin go mbíonn siad ag éisteacht imíonn gach  ____ ___________ tú le gaoth. ", answer: "a ndeir", hint1: "dearfach"},
  {question: "An fíor ____ ___________ faoi Sheán? (briathar saor)", answer: "a ndeirtear", hint1: "dearfach, briathar saor"},
  {question: "Éist go cúramach le gach ____ ___________ leat. (briathar saor)", answer: "a ndeirtear", hint1: "dearfach"},
  {question: "Tá gach ______ ___________ faoi fíor. (briathar saor) ", answer: "a ndeirtear", hint1: "dearfach, briathar saor"},
];

var abairALExtraQuestions = [
  {question: "_____ Bríd é sin liom go minic. ", answer: "deir", hint1: "dearfach"},
  {question: "____ ___________ a leithéid sin faoi riamh (briathar saor, diúltach).", answer: "ní deirtear", hint1: "diúltach"},
  {question: "Creidim gach ____ ___________ tú liom. ", answer: "a deir", hint1: "dearfach"},
  {question: "____ ___________ siad rudaí mar sin rómhinic. (diúltach)", answer: "a ndeir muid", hint1: "dearfach, sinn"},
  {question: "____ ___________ Mairéad go bhfuil sé go maith? ", answer: "an ndeir", hint1: "dearfach"},
  {question: "___________ paidreacha gach lá. (mé)", answer: "deirim", hint1: "dearfach"},
  {question: "___________ gach duine gur bhain siad taitneamh as. ", answer: "deir", hint1: "dearfach"},
  {question: "Tá a fhios agam ____ ___________ é sin ach ní chreidim focal de. (briathar saor)", answer: "go ndeirtear", hint1: "briathar saor"},
  {question: "____ ___________ aon rud sa leabhar faoi? (briathar saor)", answer: "an ndeirtear", hint1: "briathar saor"},
  {question: "Cad a ___________ i gcónaí. (sinn) ", answer: "deirimid", answer2: "deir muid", hint1: "dearfach, sinn"}
];

var abairAFQuestions = [
  {question: "___________ mé leat é níos déanaí.", answer: "déarfaidh", hint1: "dearfach"},
  {question: "___________ siad linn é nuair a thiocfaidh siad isteach.", answer: "déarfaidh", hint1: "dearfach"},
  {question: "___________ Seán glan amach é, táim cinnte.", answer: "déarfaidh", hint1: "dearfach"},
  {question: "___________ leo é níos déanaí. (sinn)", answer: "déarfaimid", hint1: "dearfach"},
  {question: "Éist anois agus ___________ Brian beag an dán atá aige.", answer: "déarfaidh", hint1: "dearfach"},
  {question: "___________ mo mháthair liom é gan dabht.", answer: "déarfaidh", hint1: "dearfach"},
  {question: "___________ siad go bhfuil tú as do mheabhair má dhéanann tú é sin.", answer: "déarfaidh", hint1: "dearfach"},
  {question: "___________ siad rud éigin deas faoi, is dócha.", answer: "déarfaidh", hint1: "dearfach"},
  {question: "___________ Seán leat nach bhfuil aon fhadhb aige.", answer: "déarfaidh", hint1: "dearfach"},
  {question: "___________ na cailíní nach bhfuil siad sásta leis an áit.", answer: "déarfaidh", hint1: "dearfach"}
];

var abairAFNi = [
  {question: "____ ___________ mé é sin le héinne.", answer: "ní déarfaidh", hint1: "diúltach"},
  {question: "____ ___________ Micheál é sin le Nóra, tá mé cinnte.", answer: "ní déarfaidh", hint1: "diúltach"},
  {question: "____ ___________ faic leis go dtí go mbeidh sé críochnaithe ar fad. (sinn)", answer: "ní déarfaimid", hint1: "diúltach"},
  {question: "____ ___________ mé faic le Brídín go fóill.", answer: "ní déarfaidh", hint1: "diúltach"},
  {question: "____ ___________ leis é go fóill. (sinn)", answer: "ní déarfaimid", hint1: "diúltach"},
  {question: "____ ___________ mise faic faoi má choimeádann tusa do bhéal dúnta.", answer: "ní déarfaidh", hint1: "diúltach"},
  {question: "____ ___________ siadsan aon rud leat.", answer: "ní déarfaidh", hint1: "diúltach"},
  {question: "____ ___________ éinne é sin leat.", answer: "ní déarfaidh", hint1: "diúltach"},
  {question: "____ ___________ mé a thuilleadh faoi. Tá mo dhóthain ráite agam.", answer: "ní déarfaidh", hint1: "diúltach"},
  {question: "____ ___________ é sin leis go brách. (sinn)", answer: "ní déarfaimid", hint1: "diúltach"},
];

var abairAFBriatharSaor = [
  {question: "___________ go bhfuil tú leisciúil muna gcríochnaíonn tú é.", answer: "déarfar", hint1: "dearfach"},
  {question: "____ ___________ an Coróin Mhuire ar a shon ar a hocht anocht.", answer: "déarfar", hint1: "dearfach"},
  {question: "____ ___________ é sin os ard go brách. (diúltach)", answer: "ní déarfar", hint1: "diúltach"},
  {question: "___________ go leor faoi ach ní dhéanfar faic mar gheall air.", answer: "déarfar", hint1: "dearfach"},
  {question: "___________ gur cur amú airgid atá ann muna n-éiríonn leis.", answer: "déarfar", hint1: "diúltach"},
  {question: "____ ___________ aon rud faoin ar tharla. (diúltach)", answer: "ní déarfar", hint1: "dearfach"},
  {question: "____ ___________ go brách gur air féin a bhí an locht. (diúltach)", answer: "ní déarfar", hint1: "diúltach"},
  {question: "___________ gur as do mheabhar atá tú má dhéanann tú é sin.", answer: "déarfar", hint1: "dearfach"},
  {question: "Sin é an scéal a cuireadh amach agus ____ ___________ a mhalairt go brách. (diúltach)", answer: "ní déarfar", hint1: "diúltach"},
  {question: "___________ go bhfuil an fhírinne searbh.", answer: "déarfar", hint1: "dearfach"}
];

var abairAFCeisteach = [
  {question: "___ ___________ tú liom é chomh luath is a chloiseann tú faoi? (diúltach)", answer: "nach ndéarfaidh", hint1: "diúltach"},
  {question: "____ ___________ tú rud éigin faoi ag an díospóireacht anocht? (dearfach)", answer: "an ndéarfaidh", hint1: "dearfach"},
  {question: "___________ nach fiú tráithnín é i gceann cúpla bliain eile? (dearfach)", answer: "an ndéarfaidh", hint1: "dearfach"},
  {question: "___________ sé é sin, dar leat? (dearfach).", answer: "an ndéarfaidh", hint1: "dearfach"},
  {question: "___________ tú rud éigin leis faoin eachtra? (diúltach).", answer: "nach ndéarfaidh", hint1: "diúltach"},
  {question: "___________ leis é anocht? (sinn).", answer: "an ndéarfaimid", hint1: "dearfach, sinn"},
  {question: "____ ___________ go raibh dul amú air? (diúltach, briathar saor).", answer: "nach ndéarfar", hint1: "diúltach"},
  {question: "____ ___________ siad nach raibh an t-am acu é a dhéanamh? (dearfach)", answer: "an ndéarfaidh", hint1: "dearfach"},
  {question: "____ ___________ amach anseo gur imríodh cos ar bolg air? (diúltach, briathar saor).", answer: "nach ndéarfar", hint1: "diúltach"},
  {question: "____ ___________ tú leis go bhfuil mé á lorg? (dearfach).", answer: "an ndéarfaidh", hint1: "dearfach"}
];

var abairAFSpleach = [
  {question: "Ceapaim ____ ___________ mé leis é anocht. (dearfach)", answer: "nach ndéarfaidh", hint1: "dearfach"},
  {question: "Ní dóigh liom ____ ___________ sé aon rud. (dearfach)", answer: "go ndéarfaidh", hint1: "dearfach"},
  {question: "Ceapaim ____ ___________ a thuilleadh faoi? (diúltach, briathar saor) ", answer: "nach ndéarfar", hint1: "diúltach"},
  {question: "Tá a fhios agam go maith ____ ___________ Marc aon rud faoi? (diúltach)", answer: "nach ndéarfaidh", hint1: "diúltach"},
  {question: "Tá gach éinne a rá ____ ___________ Seán anocht é. (dearfach)", answer: "go ndéarfaidh", hint1: "dearfach"},
  {question: "Fan  ____ ___________ mé leat é. (dearfach) ", answer: "go ndéarfaidh", hint1: "dearfach"},
  {question: "Táim ag fanacht ____ ___________ sí liom é. (dearfach))", answer: "go ndéarfaidh", hint1: "dearfach"},
  {question: "Táim den tuairim ____ ___________ aon rud faoi anocht. (diúltach, briathar saor)", answer: "nach ndéarfar", hint1: "diúltach, briathar saor"},
  {question: "Tá mé á rá leat ____ ___________sí aon rud leat go brách. (briathar saor, diúltach)", answer: "nach ndéarfaidh", hint1: "diúltach"},
  {question: "Ní dóigh liom ____ ___________mé aon rud. (dearfach)", answer: "go ndéarfaidh", hint1: "dearfach"},
];

var abairAFCoibhneasta = [
  {question: "Beidh gach _____ _______ sí leat thar a bheith tábhachtach.", answer: "a ndéarfaidh", hint1: "a ______"},
  {question: "Éist lena ___________ siad leat.", answer: "ndéarfaidh", hint1: "n______"},
  {question: "Beidh gach ____ ___________ sí lán le féin-mholadh. ", answer: "a ndéarfaidh", hint1: "a _________"},
  {question: "Ná creid ____ ___________ siad leat. (sinn)", answer: "a ndéarfaimid", hint1: "sinn"},
  {question: "Scríobhfar síos gach  ____ ___________ tú leo. ", answer: "a ndéarfaidh", hint1: "a _________"},
  {question: "Éist go cúramach lena  ___________ gach duine acu. ", answer: "ndéarfaidh", hint1: "n________"},
  {question: "Beidh gach  ____ ___________ sí spéisiúil. ", answer: "a ndéarfaidh", hint1: "a ________"},
  {question: "Sin a ___________ mé don uair seo.", answer: "ndéarfaidh", hint1: "n__________"},
  {question: "Cuirfidh ____ ___________ siad leat déistin ort. ", answer: "a ndéarfaidh", hint1: "a _________"},
  {question: "Caithfimid a bheith cúramach faoi gach ______ ___________ leo. (sinn) ", answer: "a ndéarfaimid", hint1: "sinn"},
];

var abairAFExtraQuestions = [
  {question: "____ ___________ mé aon rud leis. (diúltach)", answer: "ní déarfaidh", hint1: "diúltach"},
  {question: "___________ Máire liom é níos déanaí ar aon nós. (dearfach)", answer: "déarfaidh", hint1: "dearfach"},
  {question: "____ ___________ mé a thuilleadh faoi go dtí anocht. (diúltach)", answer: "ní déarfaidh", hint1: "dearfach"},
  {question: "____ ___________ tú le Seán go bhfuil gach duine tuirseach de? (dearfach)", answer: "an ndéarfaidh", hint1: "dearfach"},
  {question: "Tá súil agam ____ ___________ Róisín aon rud faoi. ", answer: "nach ndéarfaidh", hint1: "diúltach"},
  {question: "Déan nóta de gach ______ ___________ siad leat. ", answer: "a déarfaidh", hint1: "dearfach"},
  {question: "___________ nach bhfuil maith na muice leat muna gcríochnaíonn tú é. (briathar saor)", answer: "déarfar", hint1: "briathar saor"},
  {question: "____ ___________ mé faic go fóill. (diúltach)", answer: "ní déarfaidh", hint1: "diúltach"},
  {question: "____ ___________ tú leis é nó an bhfágfaidh tú marbh é? (dearfach)", answer: "an ndéarfaidh", hint1: "dearfach"},
  {question: "____ ___________ go bhfuilimid sásta go leor leis?  ", answer: "an ndéarfaimid", answer2: "nach ndéarfaimid", hint1: "diúltach, sinn"}
];

var abairMCQuestions = [
  {question: "___________ go bhfuil sé imithe. (mé)", answer: "déarfainn", hint1: "dearfach"},
  {question: "___________ Séamas rud ar bith chun fáil amach as.", answer: "déarfadh", hint1: "dearfach"},
  {question: "Ní raibh sí istigh léi féin, mar a ___________. (tú)", answer: "déarfá", hint1: "dearfach"},
  {question: "___________ leat é dá mbeadh sé ar eolas againn. (sinn)", answer: "déarfaimis", hint1: "dearfach"},
  {question: "Cad a ___________ faoi sin, dar leat? (siad)", answer: "déarfaidís", answer2: "déarfadh siad", hint1: "dearfach"},
  {question: "Sin é a ___________ Síle dá mbeadh sí anseo.", answer: "déarfadh", hint1: "dearfach"},
  {question: "___________ go bhfuil gach duine críochnaithe anois. (mé)", answer: "déarfainn", hint1: "dearfach"},
  {question: "___________ go bhfuil sé sin ceart go leor anois. (mé)", answer: "déarfainn", hint1: "dearfach"},
  {question: "Ná bac leo sin. ___________ aon rud chun éalú amach as an trioblóid.", answer: "déarfaidís", hint1: "dearfach"},
  {question: "Cad a ___________ sibhse faoin bplean sin.", answer: "déarfadh", hint1: "dearfach"}
];

var abairMCNi = [
  {question: "____ ___________ go raibh an freagra sin ceart. (mé)", answer: "ní déarfainn", hint1: "diúltach"},
  {question: "____ ___________ an múinteoir rud mar sin.", answer: "ní déarfadh", hint1: "diúltach"},
  {question: "____ ___________ rud mar sin dá mbeadh an scéal ar fad agat. (tú)", answer: "ní déarfá", hint1: "diúltach"},
  {question: "____ ___________ mo chara is fearr rud mar sin liom.", answer: "ní déarfadh", hint1: "diúltach"},
  {question: "____ ___________ rud mar sin dá mbeidís glic. ", answer: "ní déarfaidís", hint1: "diúltach"},
  {question: "____ ___________ Nóra a leithéid riamh.", answer: "ní déarfadh", hint1: "diúltach"},
  {question: "____ ___________ go raibh sé caillte murach go bhfuil. (sinn)", answer: "ní déarfaimis", answer2: "ní déarfadh muid", hint1: "diúltach"},
  {question: "____ ___________ linn é ar ór ná ar airgead. (siad)", answer: "ní déarfaidís", hint1: "diúltach"},
  {question: "____ ___________ go raibh pingin ina phóca aige. (mé)", answer: "ní déarfainn", hint1: "diúltach"},
  {question: "____ ___________ Mairéad aon rud amach ós ard ag an gcruinniú. ", answer: "ní déarfadh", hint1: "diúltach"},
];

var abairMCBriatharSaor = [
  {question: "_____ ___________ é sin murach go bhfuil sé go han-dona. (diúltach)", answer: "ní déarfaí", hint1: "diúltach"},
  {question: "____ ___________ é sin dá mbeadh an aimsir go han-dona. (dearfach)", answer: "déarfaí", hint1: "dearfach"},
  {question: "____ ___________ é sin murach go bhfuil sé cinnte. (diúltach)", answer: "ní déarfaí", hint1: "diúltach"},
  {question: "___________ é dá mba ghá é a rá. (dearfach)", answer: "déarfaí", hint1: "dearfach"},
  {question: "____ ___________ é sin gan chúis. (diúltach)", answer: "ní déarfaí", hint1: "diúltach"},
  {question: "___________ glan amach é dá mbeadh sé fíor. ", answer: "déarfaí", hint1: "dearfach"},
  {question: "____ ___________ rud mar sin ag cruinniú foirmeálta. (diúltach)", answer: "ní déarfaí", hint1: "diúltach"},
  {question: "____ ___________ é dá mbeadh aon slí eile timpeall air. (diúltach)", answer: "ní déarfaí", hint1: "diúltach"},
  {question: "____ ___________ rud mar sin ón altóir riamh ná coíche. ", answer: "ní déarfaí", hint1: "diúltach"},
  {question: "____ ___________ é sin dá mbeadh aon dul as.", answer: "ní déarfaí", hint1: "diúltach"},
];

var abairMCCeisteach = [
  {question: "___ ___________ go bhfuil sé sin fíor? (tú, diúltach)", answer: "nach ndéarfá", hint1: "diúltach"},
  {question: "____ ___________ éinne sin leat? (diúltach)", answer: "nach ndéarfadh", hint1: "diúltach"},
  {question: "____ ___________ Seán leat é dá mbeadh a fhios aige faoi? (diúltach)", answer: "nach ndéarfadh", hint1: "diúltach"},
  {question: "____ ___________ é sin dá mbeadh gach rud sásúil san áit? (dearfach, briathar saor).", answer: "an ndéarfaí", hint1: "dearfach, briathar saor"},
  {question: "____ ___________  madraí an bhaile é sin leat? (diúltach).", answer: "nach ndéarfadh", hint1: "diúltach"},
  {question: "____ ___________  go bhfuil Caitlín sásta lena post nua? (tú).", answer: "an ndéarfá", answer2: "nach ndéarfá", hint1: "diúltach"},
  {question: "____ ___________ é dá mbeadh sé fíor? (diúltach, siad).", answer: "nach ndéarfaidís", hint1: "diúltach"},
  {question: "____ ___________ Tomás é dá mbeadh aon dabht air? (diúltach)", answer: "nach ndéarfadh", hint1: "diúltach"},
  {question: "____ ___________ é dá mbeidís faoi bhrú? (dearfach).", answer: "an ndéarfaidís", hint1: "dearfach"},
  {question: "____ ___________ go bhfuil seans maith acu? (dearfach, tú).", answer: "an ndéarfá", hint1: "dearfach"},
];

var abairMCSpleach = [
  {question: "Ní dóigh liom ____ ___________ mo chara rud mar sin fúm. ", answer: "go ndéarfadh", hint1: "dearfach"},
  {question: "Tá mé cinnte ____ ___________ aon duine le ciall aon rud mar sin. (diúltach)", answer: "nach ndéarfadh", hint1: "diúltach"},
  {question: "Tá mé cinnte ____ ___________ aon rud mar sin? (mé, diúltach) ", answer: "nach ndéarfainn", hint1: "diúltach"},
  {question: "Dá ___________ éinne eile é sin déarfaí go raibh sé as a mheabhair? ", answer: "ndéarfadh", hint1: "dearfach"},
  {question: "Tá mé cinnte ____ ___________ sé é sin dá gcaithfeadh sé. (dearfach)", answer: "go ndéarfadh", hint1: "dearfach"},
  {question: "An gceapann tusa  ____ ___________ Bríd é sin. (dearfach) ", answer: "go ndéarfadh", hint1: "dearfach"},
  {question: "Bhí a fhios agam go maith ____ ___________ sibhse é sin. (dearfach)", answer: "go ndéarfadh", hint1: "dearfach"},
  {question: "Dá ___________ é sin leat chaithfinn an tír a fhágáil. (mé)", answer: "ndéarfainn", hint1: "mé"},
  {question: "Dá ___________glan amach é bheadh deireadh leis. (siad)", answer: "ndéarfaidís", hint1: "siad"},
  {question: "Ní dóigh liom ____ ___________Aoife é sin riamh. (dearfach)", answer: "go ndéarfadh", hint1: "dearfach"},
];

var abairMCExtraQuestions = [
  {question: "___________ go bhfuil an ceann sin go maith. (mé)", answer: "déarfainn", hint1: "mé"},
  {question: "____ ___________ go bhfuil siad críochnaithe go fóill. (mé, diúltach)", answer: "déarfaidh", hint1: "diúltach"},
  {question: "Cad a ___________ dá gcloisfidís an scéal sin? (siad)", answer: "déarfaidís", hint1: "siad"},
  {question: "Cad a ___________ Máirtín faoi sin, dar leat? ", answer: "déarfadh", hint1: "dearfach"},
  {question: "____ ___________ go bhfuil sé sin ceart anois? (tú)", answer: "an ndéarfá", answer2: "nach ndéarfá", hint1: "tú"},
  {question: "______ ___________ éinne é sin. (diúltach) ", answer: "ní déarfadh", hint1: "diúltach"},
  {question: "______ ___________ sibhse é sin?", answer: "an déarfadh", hint1: "dearfach"},
  {question: "Cad eile a ___________? (siad)", answer: "déarfaidís", hint1: "siad"},
  {question: "Ní dóigh liom ____ ___________ muintir na háite é sin faoi? (dearfach)", answer: "go ndéarfadh", hint1: "dearfach"},
  {question: "____ ___________ é sin faoi dá mbeadh sé saibhir? (briathar saor)", answer: "an ndéarfaí", answer2: "nach ndéarfaí", hint1: "briathar saor"},
];

var faighACQuestions = [
  {question: "___________ mé bronntanas deas do mo bhreithlá.", answer: "fuair", hint1: "dearfach"},
  {question: "___________ siad an ceann is fearr orainn.", answer: "fuair", hint1: "dearfach"},
  {question: "___________ tú an rud a bhí ag dul duit.", answer: "fuair", hint1: "dearfach"},
  {question: "___________ freagra ar ais ar deireadh. (sinn)", answer: "fuaireamar", hint1: "dearfach, sinn"},
  {question: "___________ tusa an dara duais.", answer: "fuair", hint1: "dearfach"},
  {question: "___________ torthaí na scrúduithe inné. (sinn)", answer: "fuaireamar", hint1: "dearfach"},
  {question: "___________ siad bróga nua sa siopa.", answer: "fuair", hint1: "dearfach"},
  {question: "___________ sé gach a raibh ag dul dó.", answer: "fuair", hint1: "dearfach"},
  {question: "___________ sí luach a saothair.", answer: "fuair", hint1: "dearfach"},
  {question: "___________ amach ar deireadh cé a bhí taobh thiar de. (sinn)", answer: "fuaireamar", hint1: "dearfach, sinn"},
];

var faighACNi = [
  {question: "____ ___________ mé amach riamh cé a rinne é.", answer: "ní bhfuair", hint1: "diúltach"},
  {question: "____ ___________ sí aon fhreagra ar a hiarratas.", answer: "ní bhfuair", hint1: "diúltach"},
  {question: "____ ___________ aon sásamh uaidh. (sinn)", answer: "ní bhfuaireamar", hint1: "diúltach"},
  {question: "____ ___________ siad aon áit cheart le fanacht i mBaile Átha Cliath.", answer: "ní bhfuair", hint1: "diúltach"},
  {question: "____ ___________ sí aon scéal faoin madra a chaill sí.", answer: "ní bhfuair", hint1: "diúltach"},
  {question: "____ ___________ aon fhreagra go fóill. (sinn)", answer: "ní bhfuaireamar", hint1: "diúltach"},
  {question: "____ ___________ siad aon rud ceart le n-ithe.", answer: "ní bhfuair", hint1: "diúltach"},
  {question: "____ ___________ mé aon rud a bhí uaim sa siopa sin.", answer: "ní bhfuair", hint1: "diúltach"},
  {question: "____ ___________ siad a gcearta riamh san áit sin.", answer: "ní bhfuair", hint1: "diúltach"},
  {question: "____  ___________ aon duais an uair seo. (sinn)", answer: "ní bhfuaireamar", hint1: "diúltach"},
];

var faighACBriathorSaor = [
  {question: "___________ tásc ná tuairisc air ón lá a d’imigh sé. (diúltach)", answer: "ní bhfuarthas", hint1: "diúltach"},
  {question: "___________ an t-airgead a chaill mé san ionad siopadóireachta. (dearfach)", answer: "fuarthas", hint1: "dearfach"},
  {question: "Bhí sé os comhair na cúirte agus ___________ ciontach é.", answer: "fuarthas", hint1: "dearfach"},
  {question: "Cuardaíodh an teach ó bhun go barr ach ____ ___________ aon rud ann. (diúltach)", answer: "ní bhfuarthas", hint1: "diúltach"},
  {question: "___________ piscín beag sa pháirc agus níl a fhios ag éinne cé leis é.", answer: "fuarthas", hint1: "dearfach"},
  {question: "Tar éis an lá a chaitheamh ag cuardach ___________ é ar deireadh.", answer: "fuarthas", hint1: "dearfach"},
  {question: "____ ___________ amach riamh cé a rinne an slad sa halla.", answer: "ní bhfuarthas", hint1: "diúltach"},
  {question: "Cailleadh é agus ____ ___________ ar ais é riamh ó shin.", answer: "ní bhfuarthas", hint1: "diúltach"},
  {question: "____ ___________ amach riamh cár chuir sí na fáinní cluaise i bhfolach.", answer: "ní bhfuarthas", hint1: "diúltach"},
  {question: "___________ sionnach marbh ar thaobh an bhóthair.", answer: "fuarthas", hint1: "dearfach"},
];

var faighACCeisteach = [
  {question: "____ ___________ tú amach aon rud faoin timpiste? (dearfach)", answer: "an bhfuair", hint1: "dearfach"},
  {question: "____ ___________ tú aon scéal ó Chathal? (dearfach)", answer: "an bhfuair", hint1: "dearfach"},
  {question: "____ ___________ Síle a leabhar ar ais fós? (dearfach)", answer: "an bhfuair", hint1: "dearfach"},
  {question: "____ ___________ siad an méid a bhí uatha? (diúltach)", answer: "nach bhfuair", hint1: "diúltach"},
  {question: "Cuardaíodh an áit ach ____ ___________ faic na ngrást ann.", answer: "an bhfuair", hint1: "dearfach"},
  {question: "____ ___________ beirt fhear ciontach as bean óg a mharú inniu? (briathar saor, dearfach)", answer: "an bhfuarthas", hint1: "dearfach, briathar saor."},
  {question: "____ ___________ aon rud sa seomra? (siad, dearfach)", answer: "an bhfuaireadar", hint1: "dearfadh, siad"},
  {question: "____ ___________ tú do dhóthain fós? (diúltach)", answer: "nach bhfuair", hint1: "diúltach"},
  {question: "____ ___________ corp an fhir a thit le faill fós? (briathar saor, dearfach)", answer: "an bhfuarthas", hint1: "dearfach, briathar saor."},
  {question: "____ ___________ amach cad ba chúis leis an tinneas a bhí orthu (siad, dearfach)", answer: "an bhfuaireadar", hint1: "dearfach, siad"},
];

var faighACSpleach = [
  {question: "Tá súil agam ____ ___________ tú é. (dearfach)", answer: "go bhfuair", hint1: "dearfach"},
  {question: "Tá súil agam ____ ___________ tú an fliú. (diúltach)", answer: "nach bhfuair", hint1: "diúltach"},
  {question: "An fíor ____ ___________ Breandán post nua? (dearfach)", answer: "go bhfuair", hint1: "dearfach"},
  {question: "Ceapaim ____ ___________ tú an rud céanna is a fuair mise. (dearfach)", answer: "go bhfuair", hint1: "dearfach"},
  {question: "An dóigh leat ____ ___________ sí gach a raibh uaithi? (dearfach)", answer: "go bhfuair", hint1: "dearfach"},
  {question: "Tá súil agam ____ ___________tú aon drochscéal. (diúltach)", answer: "nach bhfuair", hint1: "diúltach"},
  {question: "Tá a fhios agam ____ ___________ tásc ná tuairisc orthu ó shin. (diúltach, briathar saor)", answer: "nach bhfuarthas", hint1: "diúltach, briathar saor"},
  {question: "An dóigh leat ____ ___________ sí mórán airgid as an leabhar a scríobh sí? (dearfach)", answer: "go bhfuair", hint1: "dearfach"},
  {question: "An gceapann tú ____ ___________sí an scoláireacht? (dearfach)", answer: "go bhfuair", hint1: "dearfach"},
  {question: "Deirtear ____ ___________siad bás den ocras (dearfach)", answer: "go bhfuair", hint1: "dearfach"},
];

var faighACCoibhneasta = [
  {question: "B’shin ____ ___________ sa chófra. (briathar saor)", answer: "a bhfuarthas", hint1: "briathar saor"},
  {question: "B’shin  ____ ___________ sí sa teach sin. ", answer: "a bhfuair", hint1: "dearfach"},
  {question: "Chaill siad gach ____ ___________ siad sa chasaíne. ", answer: "a bhfuair", hint1: "dearfach"},
  {question: "Tá gach ____ ___________ siad ar maidin imithe anois. ", answer: "a bhfuair", hint1: "dearfach"},
  {question: "Tá gach  ____ ___________ sí riamh fós aici. ", answer: "a bhfuair", hint1: "dearfach"},
  {question: "Tá gach ____ ___________ an madra ite aige. ", answer: "a bhfuair", hint1: "dearfach"},
  {question: "Tá gach ____ ___________ siad ite acu. ", answer: "a bhfuair", hint1: "dearfach"},
  {question: "B’shin ____ ___________ tar éis na hiarrachta ar fad. (briathar saor)", answer: "a bhfuarthas", hint1: "briathar saor"},
  {question: "B’shin  ____ ___________ an gadaí sa teach.", answer: "a bhfuair", hint1: "dearfach"},
  {question: "Tá gach ____ ___________ caillte arís.", answer: "a bhfuair", hint1: "dearfach"},
];

var faighACExtraQuestions = [
  {question: "___________ mé litir sa phost ar maidir. ", answer: "fuair", hint1: "dearfach"},
  {question: "____ ___________ tú aon scéal ó do chara fós?", answer: "an bhfuair", answer2: "nach bhfuair", hint1: "ceisteach"},
  {question: "____ ___________ mé néal codlata aréir. (diúltach) ", answer: "ní bhfuair", hint1: "diúltach"},
  {question: "____ ___________ aon chuireadh don phósadh sin. (sinn, diúltach) ", answer: "ní bhfuaireamar", hint1: "diúltach, sinn"},
  {question: "____ ___________ tú do charr ar ais fós? (diúltach)", answer: "nach bhfuair", hint1: "diúltach"},
  {question: "Tá súil agam  ____ ___________ tú d’fhón ar ais. (dearfach)", answer: "go bhfuair", hint1: "dearfach"},
  {question: "Tá a fhios agam ____ ___________ siad oiread is iasc amháin ón loch i mbliana. (diúltach) ", answer: "nach bhfuair", hint1: "diúltach"},
  {question: "____ ___________ bosca mór seacláide nuair a bhíomar críochnaithe. (dearfach)", answer: "fuaireamar", hint1: "dearfach"},
  {question: "Tá ____ ___________ siad de mhilseáin ite acu.", answer: "a bhfuair", hint1: "dearfach"},
  {question: "Ní fiú a bheith ag caint faoi na rudaí ____ ___________ . (sinn, diúltach)", answer: "nach bhfuaireamar", hint1: "diúltach, sinn"},
];

var faighALQuestions = [
  {question: "___________ sí páipéar nuachta gach maidin agus í ag dul ag obair.", answer: "faigheann", hint1: "dearfach"},
  {question: "___________ ár gcuid nuachta ó na meáin shóisialta don gcuid is mó. (sinn)", answer: "faighimid", hint1: "dearfach, sinn"},
  {question: "___________ sí lón sa bhialann beagnach gach lá.", answer: "faigheann", hint1: "dearfach"},
  {question: "___________ sé airgead maith ar an obair a dhéanann sé.", answer: "faigheann", hint1: "dearfach"},
  {question: "___________ iasacht ón gcomhar creidmheasa ó am go chéile. (mé)", answer: "faighim", hint1: "dearfach, mé"},
  {question: "___________ tú luach do shaothair i gcónaí.", answer: "faigheann", hint1: "dearfach"},
  {question: "___________ bronntanas Nollag gach bliain. (sinn)", answer: "faighimid", hint1: "dearfach"},
  {question: "___________ siad leabhair ón leabharlann gach seachtain.", answer: "faigheann", hint1: "dearfach"},
  {question: "___________ an-deacair é uaireanta. (mé)", answer: "faighim", hint1: "dearfach"},
  {question: "___________ sé bainne ón siopa gach tráthnóna.", answer: "faigheann", hint1: "dearfach"},
];

var faighALNi = [
  {question: "____ ___________ sí aon mholadh riamh as a cuid oibre.", answer: "ní fhaigheann", hint1: "diúltach"},
  {question: "____ ___________ siad sin torthaí maithe sna scrúduithe riamh.", answer: "ní fhaigheann", hint1: "diúltach"},
  {question: "____ ___________ aon rud sa bhreis uatha sin riamh. (sinn)", answer: "ní fhaighimid", hint1: "diúltach"},
  {question: "____ ___________ siad aon rud nach mbíonn ag dul dóibh.", answer: "ní fhaigheann", hint1: "diúltach"},
  {question: "____ ___________ ach drochnuacht san áit seo. (sinn)", answer: "ní fhaighimid", hint1: "diúltach"},
  {question: "Bíonn sí i gcónaí gnóthach. ____ ___________ sí sos riamh.", answer: "ní fhaigheann", hint1: "diúltach"},
  {question: "____ ___________ tú aon rud nach mbíonn tuillte go maith agat.", answer: "ní fhaigheann", hint1: "diúltach"},
  {question: "____ ___________ codladh na hoíche, fiú, leis an méid imní atá air.", answer: "ní fhaigheann", hint1: "diúltach"},
  {question: "____ ___________ na páistí sin cead a gcos riamh.", answer: "ní fhaigheann", hint1: "diúltach"},
  {question: "____ ___________ daoine áirithe a gcearta riamh.", answer: "ní fhaigheann", hint1: "diúltach"},
];

var faighALBriathorSaor = [
  {question: "___________ ór i mianaigh san Afraic Theas.", answer: "faightear", hint1: "dearfach"},
  {question: "____ ___________ fíoruisce glégheal ón tobar sin.", answer: "faightear", hint1: "dearfach"},
  {question: "___________ amach faoi na pleananna rúnda i gcónaí.", answer: "faightear", hint1: "dearfach"},
  {question: "___________ sméara dubha deasa ó na driseacha sa bhfómhar.", answer: "faightear", hint1: "dearfach"},
  {question: "___________ úlla ó Ard Mhacha.", answer: "faightear", hint1: "dearfach"},
  {question: "____ ___________ torthaí arda sa scoil sin riamh. (diúltach)", answer: "ní fhaightear", hint1: "diúltach"},
  {question: "____ ___________ muisiriúin a fhásann go fiáin sa pháirc sin níos mó.", answer: "ní fhaightear", hint1: "diúltach"},
  {question: "____ ___________ ach corrcheann anois is arís.", answer: "ní fhaightear", hint1: "diúltach"},
  {question: "___________ sionnaigh marbh ar an mbóthar sin go rialta.", answer: "faightear", hint1: "dearfach"},
  {question: "____ ___________ fuil as cloch!", answer: "ní fhaightear", hint1: "diúltach"},
];
var faighALCeisteach = [
  {question: "___________ tú uair an chloig saor ag am lóin? (dearfach).", answer: "an bhfaigheann", hint1: "dearfach"},
  {question: "____ ___________ éinne an rud atá uathu? (dearfach)", answer: "an bhfaigheann", hint1: "dearfach"},
  {question: "_____ ___________ sí a deis go rímhinic? (diúltach)", answer: "nach bhfaigheann", hint1: "diúltach"},
  {question: "_____ ___________tú an seans chun dul ar ais abhaile go minic? (dearfach)", answer: "an bhfaigheann", hint1: "dearfach"},
  {question: "_____ ___________ na micléinn seachtain léitheoireachta i mí Eanáir? (dearfach).", answer: "an bhfaigheann", hint1: "dearfach"},
  {question: "_____ ___________ an traonach in Éirinn níos mó (diúltach, briathar saor).", answer: "nach bhfaightear", hint1: "dearfach"},
  {question: "____ ___________ Éamonn áit ar an bhfoireann go rialta? (diúltach).", answer: "nach bhfaigheann", hint1: "diúltach"},
  {question: "____ ___________ tú do chuid glasraí díreach ón bhfeirm? (dearfach)", answer: "an bhfaigheann", hint1: "dearfach"},
  {question: "____ ___________ mórán de na micléinn an freagra ceart ar an gceist sin? (dearfach).", answer: "an bhfaigheann", hint1: "dearfach"},
  {question: "____ ___________ é sin uathu gach bliain? (sinn, diúltach).", answer: "nach bhfaighimid", hint1: "diúltach, sinn"},
];

var faighALSpleach = [
  {question: "Cén fáth ____ ___________ tú rothar nua duit féin? (diúltach)", answer: "nach bhfaigheann", hint1: "diúltach"},
  {question: "Is dóigh liom ____ ___________ sí an traein isteach gach maidin.", answer: "go bhfaigheann", hint1: "dearfach"},
  {question: "An bhfuil tú cinnte ____ ___________ sé síob abhaile gach lá? (diúltach)", answer: "nach bhfaigheann", hint1: "diúltach"},
  {question: "Tá a fhios agam go maith ____ ___________ an páiste sin cead a chin i gcónaí? (dearfach)", answer: "go bhfaigheann", hint1: "dearfach"},
  {question: "Tá mé cruthaithe ____ ___________ daoine bochta bás ag aois níos óige ná daoine saibhre. (dearfach)", answer: "go bhfaigheann", hint1: "dearfach"},
  {question: "An bhfuil tú cinnte ____ ___________ siad airgead breise ar an obair sin? (diúltach)", answer: "nach bhfaigheann", hint1: "diúltach"},
  {question: "Tá a fhios agam ____ ___________ airgead an-mhaith ach is obair chrua í. (mé, dearfach)", answer: "go bhfaigheann", hint1: "dearfach"},
  {question: "Deir sí ____ ___________ sí sásamh as na cuimhní cinn atá aici. (dearfach)", answer: "go bhfaigheann", hint1: "dearfach"},
  {question: "Deirtear ____ ___________sé pinsean ó rialtas na Breataine freisin. (dearfach)", answer: "go bhfaigheann", hint1: "dearfach"},
  {question: "Tá a fhios agam ____ ___________siad bia folláin ar scoil gach lá? (dearfach)", answer: "go bhfaigheann", hint1: "dearfach"},
];

var faighALCoibhneasta = [

];

var faighALExtraQuestions = [
  {question: "___________Siobhán a cuid glasraí sa mhargadh sráide. (dearfach) ", answer: "faigheann", hint1: "dearfach"},
  {question: "___________ ár ndóthain le n-ithe san áit ach seachas sin níl rudaí go maith anseo. (sinn, dearfach).", answer: "faighimid", hint1: "dearfach, sinn"},
  {question: "___________ gach duine an méid atá ag dul dóibh. (dearfach) ", answer: "faigheann", hint1: "dearfach"},
  {question: "____ ___________ tú ríomhphost uaidh ó am go chéile? (dearfach)", answer: "an bhfaigheann", hint1: "dearfach, ceisteach"},
  {question: "____ ___________ sí scéal uaidh ach anois is arís. (diúltach) ", answer: "ní fhaigheann", hint1: "diúltach"},
  {question: "An bhfuil tú cinnte _____ ___________ an lámh in uachtar air go minic? (diúltach)", answer: "nach bhfaigheann", hint1: "diúltach"},
  {question: "_____ ___________ sí airgead óna tuismitheoirí go rialta. (diúltach) ", answer: "ní fhaigheann", hint1: "diúltach"},
  {question: "___________ siúcra as biotas. (briathar saor)", answer: "faightear", hint1: "dearfach, briathar saor"},
  {question: "Táim cinnte ____ ___________ siadsan aon chúnamh ó éinne? (diúltach)", answer: "nach bhfaigheann", hint1: "diúltach"},
  {question: "_____ ___________ tusa an bus isteach gach maidin? ", answer: "an bhfaigheann", hint1: "dearfach"},
];

var faighAFQuestions = [
  {question: "___________ lón istigh i lár na cathrach níos déanaí.", answer: "gheobhaimid", hint1: "dearfach"},
  {question: "___________ tú ard-mholadh má dhéanann tú é sin.", answer: "gheobhaidh", hint1: "dearfach"},
  {question: "___________ tú amach é sách luath.", answer: "gheobhaidh", hint1: "dearfach"},
  {question: "___________ mé tuairisc air sin duit maidin amárach.", answer: "gheobhaidh", hint1: "dearfach"},
  {question: "___________ sí gach a bhfuil uaithi sa siopa sin.", answer: "gheobhaidh", hint1: "dearfach"},
  {question: "___________ tú bás luath má leanann tú leis sin.", answer: "gheobhaidh", hint1: "dearfach"},
  {question: "Níl a fhios agam ach ___________ mé amach duit é.", answer: "gheobhaidh", hint1: "dearfach"},
  {question: "___________ sé post maith amach anseo má leanann sé mar sin.", answer: "gheobhaidh", hint1: "dearfach"},
  {question: "Ná bí buartha. ___________ amach é níos déanaí. (sinn)", answer: "gheobhaimid", hint1: "dearfach"},
  {question: "Fan soicind agus ___________ gheobhaidh mé mála duit.", answer: "gheobhaidh", hint1: "dearfach"},
];

var faighAFNi = [
  {question: "____ ___________ tú aon leabhar maith ar an seilf sin.", answer: "ní bhfaighidh", hint1: "diúltach"},
  {question: "____ ___________ Cathal amach faoina chuid torthaí go dtí amárach.", answer: "ní bhfaighidh", hint1: "diúltach"},
  {question: "Ní fiú a bheith ag éisteach leis seo. ____ ___________ aon sásamh uaidh. (sinn)", answer: "ní bhfaighimid", hint1: "diúltach"},
  {question: "____ ___________ amach cé a rinne é sin go brách. (sinn)", answer: "ní bhfaighimid", hint1: "diúltach"},
  {question: "____ ___________ tú aon toradh ar an obair sin. ", answer: "ní bhfaighidh", hint1: "diúltach"},
  {question: "____ ___________ sí an eochair sin ar ais níos mó.", answer: "ní bhfaighidh", hint1: "diúltach"},
  {question: "____ ___________ tú aon rud amach muna gcuireann tú ceist.", answer: "ní bhfaighidh", hint1: "diúltach"},
  {question: "Tá sé imithe. ____ ___________ anocht é ach go háirithe. (sinn)", answer: "ní bhfaighimid", hint1: "diúltach"},
  {question: "____ ___________ tú bus eile anois go dtí maidin amárach.", answer: "ní bhfaighidh", hint1: "diúltach"},
  {question: "____ ___________ an bus sin. Beidh sé róluath dúinn. (sinn)", answer: "ní bhfaighimid", hint1: "diúltach"},
];

var faighAFBriathorSaor = [
  {question: "___________ é luath nó mall. (dearfach)", answer: "gheofar", hint1: "dearfach"},
  {question: "____ ___________ amach mar gheall air sin riamh ná choíche. (diúltach)", answer: "ní bhfaighfear", hint1: "diúltach"},
  {question: "___________ é má leanann siad orthu den chuardach. (dearfach)", answer: "gheofar", hint1: "dearfach"},
  {question: "_____ ___________ amach cé a ghoid an pictiúr sin go brách. (diúltach)", answer: "ní bhfaighfear", hint1: "diúltach"},
  {question: "_____ ___________ aon torthaí ar na hiarrachtaí laga sin atá ar bun acu . (diúltach)", answer: "ní bhfaighfear", hint1: "diúltach"},
  {question: "____ ___________ cúnamh nuair a bheidh sé ródhéanach. (dearfach)", answer: "gheofar", hint1: "dearfach"},
  {question: "____ ___________ amach é má leanann sé air ag fiosrú. (dearfach)", answer: "gheofar", hint1: "dearfach"},
  {question: "___________ faic na ngrást san áit sin. (diúltach)", answer: "ní bhfaighfear", hint1: "diúltach"},
  {question: "___________ é ar deireadh má leanann siad orthu ag cuardach. (dearfach)", answer: "gheofar", hint1: "dearfach"},
  {question: "Tá siad amuigh i lár na farraige in áit éigin agus _____ ___________ go brách arís iad.", answer: "ní bhfaighfear", hint1: "diúltach"},
];

var faighAFCeisteach = [
  {question: "___ ___________ sé aon toradh air sin, dar leat? (dearfach)", answer: "an bhfaighidh", hint1: "dearfach"},
  {question: "____ ___________ siad an chéad duais, dar leat? (dearfach)", answer: "an bhfaighidh", hint1: "dearfach"},
  {question: "____ ___________ siad rud éigin as? (diúltach)", answer: "nach bhfaighidh", hint1: "diúltach"},
  {question: "____ ___________ tú anocht é, an gceapann tú? (dearfach).", answer: "an bhfaighidh", hint1: "dearfach"},
  {question: "____ ___________ Tadhg cúiteamh airgid as ana málaí a cailleadh ag an aerfort? (diúltach).", answer: "nach bhfaighidh", hint1: "diúltach"},
  {question: "____ ___________ tú rud éigin deas dom? (diúltach).", answer: "nach bhfaighidh", hint1: "diúltach"},
  {question: "____ ___________ siad na torthaí go luath? (dearfach).", answer: "an bhfaighidh", hint1: "dearfach"},
  {question: "____ ___________ suíochán ansiúd in aice na fuinneoige? (sinn, dearfach)", answer: "an bhfaighidh", hint1: "dearfach, sinn"},
  {question: "____ ___________ lá saor Dé Máirt an gceapann tú? (sinn, dearfach).", answer: "an bhfaighidh", hint1: "dearfach, sinn"},
  {question: "____ ___________ tú rud éigin deas duit féin leis an airgead sin? (diúltach).", answer: "nach bhfaighidh", hint1: "diúltach"},
];

var faighAFSpleach = [
  {question: "Tá a fhios agam ____ ___________ sé an ceann sin ar ais.", answer: "", hint1: "(diúltach)"},
  {question: "An fíor ____ ___________ breis airgid ar an obair seo?", answer: "", hint1: "(sinn, dearfach)"},
  {question: "Tá mé cinnte ____ ___________ sí ceann eile go brách? ", answer: "", hint1: "(diultach)"},
  {question: "Is dócha ____ ___________ tú an rud céanna is a fuair tú anuradh.", answer: "", hint1: "dearfach"},
  {question: "Is dóigh liom ____ ___________ radharc maith air ón áit seo.", answer: "", hint1: "(sinn, dearfach)"},
  {question: "Tá gach seans ann  ____ ___________ siad amach mar gheall air.", answer: "", hint1: "(dearfach)"},
  {question: "Tá mé cinnte éinne  ____ ___________  amach mar gheall ar an gceann sin.", answer: "", hint1: "(diúltach)"},
  {question: "An dóigh leat ____ ___________ an grúpa sin an chéad duais?", answer: "", hint1: "(dearfach)"},
  {question: "Caithfidh ____ ___________ciontach iad. Féachann sé an-dubh is bán domsa.", answer: "", hint1: "(briathar saor, dearfach)"},
  {question: "An dóigh leat ____ ___________sé a mhisneach ar ais go brách?", answer: "", hint1: "(dearfach)"},
];

var faighAFCoibhneasta = [

];

var faighAFExtraQuestions = [
  {question: "Ná bí buartha, ___________ mé ceann eile duit. (dearfach)", answer: "gheobhaidh", hint1: "dearfach"},
  {question: "___________ tacsaí go dtí an aerfort seachas bus. (sinn, dearfach)", answer: "gheobhaimid", hint1: "dearfach, sinn"},
  {question: "____ ___________ tú aon fhreagra uaidh sin go brách. (diúltach)", answer: "ní bhfaighidh", hint1: "diúltach"},
  {question: "B’fhéidir ____ ___________ tú an seans arís muna dtógann tú anois é? (diúltach)", answer: "nach bhfaighidh", hint1: "diúltach"},
  {question: "___________ adhmaid luachmhar ón bhforaois sin amach anseo. (briathar saor, dearfach) ", answer: "fuarthas", hint1: "dearfach, briathar saor"},
  {question: "______ ___________ tú caifé le tógaint linn le do thoil? ", answer: "an bhfaighidh", hint1: "dearfach"},
  {question: "______ ___________ bronntanas Nollaig di i mbliana. (sinn, dearfach)", answer: "an bhfaighimid", hint1: "dearfach"},
  {question: "____ ___________ tusa pé rud atá uait ar aon nós? (diúltach)", answer: "nach bhfaighidh", hint1: "diúltach"},
  {question: "Táimid beagnach ann. ___________ boladh úr na farraige go luath anois. (sinn, dearfach)", answer: "gheobhaimid", hint1: "dearfach, sinn"},
  {question: "____ ___________ tú sos go brách muna gcríochnaíonn tú é sin go tapaidh? (diúltach)", answer: "ní bhfaighidh", hint1: "diúltach"},
];

var faighMCQuestions = [
  {question: "___________ carr nua dá mbeadh an t-airgead agam. (mé)", answer: "gheobhainn", hint1: "dearfach, mé"},
  {question: "___________ sé duais dó sin dá gcuirfeadh sé snas air.", answer: "gheobhadh", hint1: "dearfach"},
  {question: "___________ airgead maith air sin dá ndíolfaidís é. (siad)", answer: "gheobhaidís", hint1: "dearfach, siad"},
  {question: "___________ sí an traein go Béal Feirste ach amhain go raibh an bus níos tapúla. ", answer: "gheobhadh", hint1: "dearfach"},
  {question: "Tá sé daor. ___________ dhá cheann sa siopa eile ar an bpraghas sin. (tú)", answer: "gheofá", hint1: "dearfach, tú"},
  {question: " ___________ duine margadh ceart go leor dá mbeadh sé istigh in am.", answer: "gheobhadh", hint1: "dearfach"},
  {question: "___________ sé bronntanas dó dá mbeadh aon mheas aici air. ", answer: "gheobhadh", hint1: "dearfach"},
  {question: "___________ ceann nua duit dá mbeadh an ceann sin briste. (mé)", answer: "gheobhainn", hint1: "dearfach"},
  {question: "___________ síob ar ais dá mbeadh ceann ag teastáil uainn. (sinn)", answer: "gheobhaimis", answer2: "gheobhadh muid", hint1: "dearfach, sinn"},
  {question: "___________ tuilleadh oibrithe don tionscnamh seo dá mbeinn féin i gceannas. (mé)", answer: "gheobhainn", hint1: "dearfach"},
];

var faighMCNi = [
  {question: "____ ___________ sé é sin dá gcaithfeadh sé fiche bliain á lorg.", answer: "ní bhfaigheadh", hint1: "diúltach"},
  {question: "____ ___________ deoch dó ach amháin go raibh a fhios agam go raibh sé briste. (mé)", answer: "ní bhfaighinn", hint1: "diúltach, mé"},
  {question: "____ ___________ an diabhal an ceann is fearr uirthi sin. ", answer: "ní bhfaigheadh", hint1: "diúltach"},
  {question: "____ ___________ an freagra go brách murach go raibh míniú air ar an idirlíon. (siad)", answer: "ní bhfaighidís", answer2: "Ní bhfaigheadh siad", hint1: "diúltach, siad"},
  {question: "Ní leabhar luachmhar é. ____ ___________ mórán air sa siopa athláimhe. (tú) ", answer: "ní bhfaighfeá", hint1: "diúltach, tú"},
  {question: "____ ___________ Seán ceann nua go brách dá mbeadh aon dul as aige.", answer: "ní bhfaigheadh", hint1: "diúltach"},
  {question: "____ ___________ sin aon toradh dá mbeidís ag gabháil dó go lá Philib an Chleite. (siad)", answer: "ní bhfaighidís", answer2: "Ní bhfaigheadh siad", hint1: "diúltach, siad"},
  {question: "____ ___________ post mar sin gan céim mháistreachta a bheith agat. (tú)", answer: "ní bhfaighfeá", hint1: "diúltach"},
  {question: "____ ___________ an diabhal an ceann is fearr ar asal.", answer: "ní bhfaigheadh", hint1: "diúltach"},
  {question: "____ ___________ sí an chéad áit murach gur tharraing an bheirt eile siar.", answer: "ní bhfaigheadh", hint1: "diúltach"},
];

var faighMCBriatharSaor = [
  {question: "___________ é dá mbeadh sé ann.", answer: "gheofaí", hint1: "dearfach"},
  {question: "____ ___________ ceann chomh maith sin arís ach amháin trí sheans.", answer: "ní bhfaighfí", hint1: "diúltach"},
  {question: "___________ rudaí suimiúla sa sean-siopa sin dá mbeadh an t-am ag duine dul tríd.", answer: "gheofaí", hint1: "dearfach"},
  {question: "____ ___________ an seodra sa teach riamh murach gur inis an seanbhean dom faoi sula bhfuair sí bás.", answer: "ní bhfaighfí", hint1: "diúltach"},
  {question: "____ ___________ na drugaí sa teach murach gur chuir fear an tí ann iad. ", answer: "ní bhfaighfí", hint1: "diúltach"},
  {question: "____ ___________ ciontach é murach go raibh an giúiré lán-chinnte go ndearna sé é.", answer: "ní bhfaighfí", hint1: "diúltach"},
  {question: "___________ amach é dá mbeadh aon duine sách cliste ann chun dul ag obair ar an gcás.", answer: "gheofaí", hint1: "dearfach"},
  {question: "___________ é gan dabht dá mbeadh sé ann.", answer: "gheofaí", hint1: "dearfach"},
  {question: "____ ___________ aon locht ar Eithne mar cheannaire dá gceapfaí don bpost í.", answer: "ní bhfaighfí", hint1: "diúltach"},
  {question: "___________ lochtanna air fiú dá mbeadh sé foirfe.", answer: "gheofaí", hint1: "dearfach"},
];

var faighMCCeisteach = [
  {question: "___ ___________ lá saor dá ndéanfá obair bhreise san oíche? (tú, diúltach)", answer: "nach bhfaighfeá", hint1: "diúltach, tú"},
  {question: "____ ___________ Seán scoláireacht dá mbeadh a chuid torthaí beagáinín ní ba fhearr? (dearfach)", answer: "an bhfaigheadh", hint1: "dearfach"},
  {question: "____ ___________ éinne acu an freagra sin ceart, dar leat? (dearfach)", answer: "an bhfaigheadh", hint1: "dearfach"},
  {question: "____ ___________ aon duine an réiteach ar an bhfadhb sin dá gcuirfidís chuige? (diúltach).", answer: "nach bhfaigheadh", hint1: "diúltach"},
  {question: "____ ___________  margadh maith dá mbeifeá istigh in am? (dearfach, tú).", answer: "an bhfaighfeá", hint1: "dearfach"},
  {question: "____ ___________  sí é dá gcuirfeadh sí chuige i gceart?", answer: "an bhfaigheadh", hint1: "dearfach"},
  {question: "____ ___________ plumaí ag fás go fiáin sna díoga dá ndéanfaí cuardach ceart? (diúltach, briathar saor).", answer: "an bhfaighfí", hint1: "dearfach, briathar saor"},
  {question: "____ ___________ an láimh in uachtar orthu dá leanfaí tamall eile leis an iarracht mhór sin? (diúltach, briathar saor)", answer: "nach bhfaighfí", hint1: "diúltach"},
  {question: "____ ___________ an litir dá mbeadh an seoladh ceart uirthi? (diúltach, tú).", answer: "nach bhfaighfeá", hint1: "diúltach"},
  {question: "____ ___________ Nóirín pas sa scrúdú dá mbeadh aiste istigh in am aici? (diúltach).", answer: "nach bhfaigheadh", hint1: "diúltach"},
];

var faighMCSpleach = [
  {question: "Bhí mé cinnte ____ ___________ sí an chéad duas ach ní bhfuair.", answer: "go bhfaigheadh", hint1: "dearfach"},
  {question: "Cheap mé  ____ ___________ éinne an freagra ceart ar an gceist sin. (diúltach)", answer: "nach bhfaigheadh", hint1: "diúltach"},
  {question: "An dóigh leat ____ ___________ sé é dá rachadh sé á lorg?  ", answer: "go bhfaigheadh", hint1: "dearfach"},
  {question: "Bhí a fhios agam go maith ____ ___________ an freagra ceart. (tú, diúltach) ", answer: "nach bhfaighfeá", hint1: "diúltach"},
  {question: "Bhí a fhios acu ____ ___________an chéad áit ba chuma cad a dhéanfaidís. (siad, diúltach)", answer: "nach bhfaighidís", answer2: "nach bhfaigheadh siad", hint1: "diúltach, siad"},
  {question: "Bhí mé cinnte ____ ___________ sí an ríomhaire a chaill sí ar ais. (dearfach)", answer: "go bhfaigheadh", hint1: "dearfach"},
  {question: "Níor cheap mé  ____ ___________ sé an ceann is fearr uirthi. (dearfach)", answer: "go bhfaigheadh", hint1: "dearfach"},
  {question: "Dúirt sé ____ ___________ sé é ach ní bhfuair. (dearfach)", answer: "go bhfaigheadh", hint1: "dearfach"},
  {question: "Cheap siad ___ ___________ freagra sásúil ach ní bhfuair. (siad, dearfach)", answer: "go bhfaighidís", answer2: "go bhfaigheadh siad", hint1: "dearfach"},
  {question: "Bhí a fhios agam ___ ___________é luath nó mall. (briathar saor, dearfach)", answer: "go bhfaighfí", hint1: "dearfach, briathar saor"},
];

var faighMCExtraQuestions = [
];

var tarACQuestions = [
  {question: "___________ sé isteach. Dúirt sé a chuid agus d’imigh sé.", answer: "tháinig", hint1: "dearfach"},
  {question: "___________ an bháisteach roimh dheireadh an chluiche.", answer: "tháinig", hint1: "dearfach"},
  {question: "___________ biseach uirthi laistigh de sheachtain san ospidéal.", answer: "tháinig", hint1: "dearfach"},
  {question: "D’imigh sin is___________ seo. ", answer: "tháinig", hint1: "dearfach"},
  {question: "___________ olc orthu nuair a dúradh é sin.", answer: "tháinig", hint1: "dearfach"},
  {question: "___________ tuirse ar na bpáiste agus thit sí ina codladh.", answer: "tháinig", hint1: "dearfach"},
  {question: "___________ abhaile go luath an tráthnóna áirithe sin. (sinn)", answer: "thángamar", answer2: "tháinig muid", hint1: "dearfach"},
  {question: "___________ siad chomh fada leis an líne agus stop siad.", answer: "tháinig", hint1: "dearfach"},
  {question: "___________ an dubh ar na prátaí in Éirinn in 1845.", answer: "tháinig", hint1: "dearfach"},
  {question: "___________ feabhas mór uirthi le bliain anuas.", answer: "tháinig", hint1: "dearfach"},
];

var tarACNi = [
  {question: "____ ___________ éinne amach roimh dheireadh an chluiche.", answer: "níor tháinig", hint1: "diúltach"},
  {question: "____ ___________ aon athrú ar an scéal ó shin i leith.", answer: "níor tháinig", hint1: "diúltach"},
  {question: "____ ___________ ar fheagra na ceist sin fós. (sinn)", answer: "níor thángamar", hint1: "diúltach"},
  {question: "____ ___________ aon cheathanna inniu sa taobh seo tíre.", answer: "níor tháinig", hint1: "diúltach"},
  {question: "____ ___________ mé abhaile an oíche sin.", answer: "níor tháinig", hint1: "diúltach"},
  {question: "____ ___________ na Gardaí ar an té a bhí freagrach as fós.", answer: "níor tháinig", hint1: "diúltach"},
  {question: "____ ___________ deireadh leis an aighneas a bhí eatarthu fós.", answer: "níor tháinig", hint1: "diúltach"},
  {question: "____ ___________ éinne amach inár gcoinne.", answer: "níor tháinig", hint1: "diúltach"},
  {question: "____ ___________ duine ná deoraí amach le fáiltiú rompu abhaile.", answer: "níor tháinig", hint1: "diúltach"},
  {question: "____  ___________ abhaile go dtí go rabih sé anon go maith san oíche. (sinn)", answer: "níor thángamar", hint1: "diúltach, sinn"},
];

var tarACBriathorSaor = [
  {question: "___________ ar chorp fhir i dteach tréigthe aréir. (dearfach)", answer: "thángthas", hint1: "dearfach"},
  {question: "Lorgaíodh é an lá ar fad agus ___________ air déanach tráthnóna. (dearfach)", answer: "thángthas", hint1: "dearfach"},
  {question: "___________ ar an airgead a goideadh i gcúinne na páirce. (dearfach)", answer: "thángthas", hint1: "dearfach"},
  {question: "___________ ar dhéagóir a bhí ar iarraidh le seachtain inniu. (dearfach)", answer: "thángthas", hint1: "dearfach"},
  {question: "Cuardaíodh an áit ar fad ach ____ ___________ ar aon rud. (diúltach)", answer: "níor thángthas", hint1: "diúltach"},
  {question: "___________ ar an mbád a chuaigh go tóin poill aréir. (dearfach)", answer: "thángthas", hint1: "dearfach"},
  {question: "Tá an thaighneas ag dul ar aghaidh agus ____ ___________ ar aon réiteach. (diúltach)", answer: "níor thángthas", hint1: "diúltach"},
  {question: "Chuaigh na cainteanna ar aghaidh ar feadh seachtaine ach ___________ ar chomhaontú ar deireadh. (dearfach)", answer: "thángthas", hint1: "dearfach"},
  {question: "___________ ar chnámha i bpoll portaigh gar don teach. (dearfach)", answer: "thángthas", hint1: "dearfach"},
  {question: "____ ___________ ar réiteach na faidhbe sin go fóill.", answer: "níor thángthas", hint1: "diúltach"},
];

var tarACCeisteach = [
  {question: "____ ___________ na cailíní abhaile fós? (dearfach)", answer: "ar tháinig", hint1: "dearfach"},
  {question: "____ ___________ tú ar an bpeann a chaill tú fós? (dearfach)", answer: "ar tháinig", hint1: "dearfach"},
  {question: "____ ___________ an t-otharcharr go han-tapaidh? (diúltach)", answer: "nár tháinig", hint1: "diúltach"},
  {question: "____ ___________ an bháisteach san áit ina raibh sibhse? (dearfach)", answer: "ar tháinig", hint1: "dearfach"},
  {question: "____ ___________ athrú ar bith ar an áit ón uair a d’imigh mise. (dearfach)", answer: "ar tháinig", hint1: "dearfach"},
  {question: "____ ___________ Liam abhaile fós? (diúltach)", answer: "ar tháinig", hint1: "diúltach"},
  {question: "____ ___________ siad ar ais óna laethanta saoire go fóill? (dearfach)", answer: "ar tháinig", hint1: "dearfach"},
  {question: "____ ___________ ar na coirp a bádh sa bhfarraige fós? (briathar saor, dearfach)", answer: "ar thángthas", hint1: "dearfach"},
  {question: "____ ___________ sí abhaile riamh ón am a d’fhág sí? (dearfach)", answer: "ar tháinig", hint1: "dearfach"},
  {question: "Is cuma ____ ___________ amach as slán ag deireadh an lae? (sinn, dearfadh)", answer: "ar thángamar", hint1: "dearfach"},
];

var tarACSpleach = [
  {question: "Dúirt do dheartháir liom ____ ___________ tú abhaile don deireadh seachtaine. (dearfach)", answer: "gur tháinig", hint1: "dearfach"},
  {question: "Ní dóigh liom ____ ___________ feabhas ar bith ar an scéal ó shin. (dearfach)", answer: "gur tháinig", hint1: "dearfach"},
  {question: "Táim beagnach cinnte ____ ___________ aon duine slán ón timpiste? (diúltach)", answer: "nár tháinig", hint1: "diúltach"},
  {question: "Ar chuala tú ____ ___________ siad ar ais arís tar éis seachtaine? (dearfach)", answer: "gur tháinig", hint1: "dearfach"},
  {question: "____ ___________ éinne in éineacht leat? (diúltach)", answer: "nár tháinig", hint1: "diúltach"},
  {question: "Chuala mé ____ ___________ar an leabhar sin a bhí ar iarraidh ón leabharlann fós. (briathar saor, diúltach)", answer: "nár thángthas", hint1: "diúltach"},
  {question: "Chuala mé ____ ___________ slua mór cairde isteach sa chúirt leo. (dearfach)", answer: "gur tháinig", hint1: "dearfach"},
  {question: "Dúirt sí ____ ___________ ach slua an-bheag go dtí an ceolchoirm? (diúltach)", answer: "nár tháinig", hint1: "diúltach"},
  {question: "Ba léir ____ ___________an ghomh air nuair a chonaic sé iad ag déanamh air? (dearfach)", answer: "gur tháinig", hint1: "dearfach"},
  {question: "An bhfuil tú cinnte ____ ___________aon duine isteach tríd an doras sin? (diúltach)", answer: "nár tháinig", hint1: "diúltach"},
];

var tarACCoibhneasta = [

];

var tarACExtraQuestions = [
  {question: "___________ sí isteach déanach agus chuaigh sí suas go barr an ranga.", answer: "tháinig", hint1: "dearfach"},
  {question: "____ ___________ aon athrú air le dhá lá anois. (diúltach)", answer: "níor tháinig", hint1: "diúltach"},
  {question: "____ ___________ aon bhriseadh ar an aimsir an tseachtain ar fad. (diúltach) ", answer: "níor tháinig", hint1: "diúltach"},
  {question: "____ ___________ aon duien slán as an timpiste traenach. (diúltach) ", answer: "níor tháinig", hint1: "diúltach"},
  {question: "____ ___________ ar eochracha a cailleadh ar an trá inniu? (briathar saor, dearfach)", answer: "ar thángthas", hint1: "dearfach"},
  {question: "____ ___________ do dheirfiúr abhaile i mbliana fós? (dearfach)", answer: "ar tháinig", hint1: "dearfach"},
  {question: "____ ___________ ar an madra a d’imigh ar strae fós? (briathar saor, diúltach) ", answer: "ar thángthas", hint1: "diúltach, briathar saor"},
  {question: "____ ___________ ach slua beag go dtí an cluiche sin. (diúltach)", answer: "níor tháinig", hint1: "diúltach"},
  {question: "___________ sé slán ar éigean. (dearfach)", answer: "tháinig", hint1: "dearfach"},
  {question: "___________ dath an bháis uirthi nuair a chuala sí an scéal. (dearfach)", answer: "tháinig", hint1: "dearfach"},
];

var tarALQuestions = [
  {question: "___________ Séamas ar scoil ar a rothar.", answer: "tagann", hint1: "dearfach"},
  {question: "___________ na páistí ar scoil gach maidin sa bhus scoile. ", answer: "tagann", hint1: "dearfach"},
  {question: "___________ na fáinleoga ar ais go dtí an áit chéanna gach bliain.", answer: "tagann", hint1: "dearfach"},
  {question: "___________ isteach luath gach maidin chun an obair a chríochnú. (sinn)", answer: "tagaimid", hint1: "dearfach, sinn"},
  {question: "___________ go maith os cionn milliún cuairteoirí go dtí an tír seo gach bliain.", answer: "tagann", hint1: "dearfach"},
  {question: "___________ siad isteach de réir a chéile.", answer: "tagann", hint1: "dearfach"},
  {question: "___________ an aois ar gach duine ar deireadh thiar thall.", answer: "tagann", hint1: "dearfach"},
  {question: "___________ na fianna anuas ó na sléibhte sa gheimhreadh.", answer: "tagann", hint1: "dearfach"},
  {question: "___________ athrú ar an aimsir sa bhfómhar de ghnáth. ", answer: "tagann", hint1: "dearfach"},
  {question: "___________ na mílte daoine go Fleadh Ceoil na hÉireann gach bliain.", answer: "tagann", hint1: "dearfach"},
  {question: "Dá fhad é an lá ___________ an oíche.", answer: "tagann", hint1: "dearfach"},
];

var tarALNi = [
  {question: "____ ___________ Deirdre isteach chugainn ach anois is arís.", answer: "ní thagann", hint1: "diúltach"},
  {question: "____ ___________ sí isteach in am riamh.", answer: "ní thagann", hint1: "diúltach"},
  {question: "____ ___________ na héin bheaga isteach sa ghairdín níos mó. ", answer: "ní thagann", hint1: "diúltach"},
  {question: "____ ___________ an bus anuas an bother seo níos mó.", answer: "ní thagann", hint1: "diúltach"},
  {question: "____ ___________ aon athrú ar an scéal ó bhliain go bliain. ", answer: "ní thagann", hint1: "diúltach"},
  {question: "____ ___________ isteach ach daoine a bhfuil fíor-spéis acu san ealaín.", answer: "ní thagann", hint1: "diúltach"},
  {question: "____ ___________ siad isteach anseo rómhinic.", answer: "ní thagann", hint1: "diúltach"},
  {question: "____ ___________ an traein sin go dtí cearthrú chun a seacht.", answer: "ní thagann", hint1: "diúltach"},
  {question: "____ ___________ aon sneachta go dtí tar éis na Nollag de ghnáth.", answer: "ní thagann", hint1: "diúltach"},
  {question: "____ ___________ ráflaí amach ón Rialtas ach anois is arís.", answer: "ní thagann", hint1: "diúltach"},
];

var tarALCeisteach = [
  {question: "___________ an fharraige isteach chomh fada seo? (dearfach).", answer: "an dtagann", hint1: "dearfach"},
  {question: "____ ___________ tusa isteach ar do rothar go rialta? (diúltach)", answer: "nach dtagann", hint1: "diúltach"},
  {question: "_____ ___________ do dheartháir abhaile ó na Stáit Aontaithe go rialta? (diúltach)", answer: "nach dtagann", hint1: "diúltach"},
  {question: "_____ ___________dath dearg ar na duilleoga sin sa bhfómhar? (diúltach)", answer: "nach dtagann", hint1: "diúltach"},
  {question: "_____ ___________ tú go ceolchoirmeacha anseo sa cheoláras go rialta? (dearfach).", answer: "an dtagann", hint1: "dearfach"},
  {question: "_____ ___________ mórán cuairteoirí go dtí an taobh seo tíre? (dearfach).", answer: "an dtagann", hint1: "dearfach"},
  {question: "____ ___________ sí sa tríú háit go rialta? (diúltach).", answer: "nach dtagann", hint1: "diúltach"},
  {question: "Ceist mhór! ____ ___________ ciall le haois? (dearfach)", answer: "an dtagann", hint1: "dearfach"},
  {question: "____ ___________ mórán cuairteoirí isteach go Coláiste na Tríonóide gach bliain? (dearfach).", answer: "an dtagann", hint1: "dearfach"},
  {question: "____ ___________ go leor daoine ón gCraobh sin de Chomhaltas go Fleadh Ceoil na hÉireann gach bliain? (diúltach).", answer: "nach dtagann", hint1: "diúltach"},
];

var tarALSpleach = [
  {question: "Ní dóigh liom ____ ___________ siad go Páirc an Chrócaigh go rómhinic. (dearfach)", answer: "go dtagann", hint1: "dearfach"},
  {question: "Ní dóigh liom ____ ___________ náire orthu sin riamh.", answer: "go dtagann", hint1: "dearfach"},
  {question: "Tá a fhios agam ____ ___________ an bus sin timpeall anseo ach dhá lá sa tseachtain. (diúltach)", answer: "nach dtagann", hint1: "diúltach"},
  {question: "An bhfuil a fhios agat ____ ___________ laigeacht orm aon uair a chloisim faoi rudaí mar sin? (dearfach)", answer: "go dtagann", hint1: "dearfach"},
  {question: "Tá a fhios agam ____ ___________ an traein sin isteach déanach go minic. (dearfach)", answer: "go dtagann", hint1: "dearfach"},
  {question: "Chuala mé ____ ___________ aon bhus aníos an bother sin níos mó. (diúltach)", answer: "nach dtagann", hint1: "diúltach"},
  {question: "Deirtear ____ ___________ ciall roimh aois ach níl a fhios agam faoi sin. (dearfach)", answer: "go dtagann", hint1: "dearfach"},
  {question: "Chuala mé ____ ___________ sí ar ais go hÉirinn níos mó. (diúltach)", answer: "nach dtagann", hint1: "diúltach"},
  {question: "An bhfuil sé fíor ____ ___________an bhean sídhe nuair atá duine ag fáil bháis? (dearfach)", answer: "go dtagann", hint1: "dearfach"},
  {question: "Tá a fhios go maith agam ____ ___________seisean isteach in am riamh? (diúltach)", answer: "nach dtagann", hint1: "diúltach"},
];

var tarALCoibhneasta = [

];

var tarALExtraQuestions = [
  {question: "___________fás ar gach neach beo de réir a nádúir féin. (dearfach) ", answer: "tagann", hint1: "dearfach"},
  {question: "Dá fhad é an lá ___________ an oíche. (dearfach).", answer: "tagann", hint1: "dearfach"},
  {question: "___ ___________ tú go Baile Átha Cliath go minic? (dearfach) ", answer: "an dtagann", hint1: "dearfach"},
  {question: "____ ___________ aimsir mar seo gach bliain? (dearfach)", answer: "an dtagann", hint1: "dearfach"},
  {question: "An é ____ ___________ sioc trom sa Gheimhreadh níos mó. (diúltach) ", answer: "nach dtagann", hint1: "diúltach"},
  {question: "_____ ___________ sí isteach anseo go rómhinic. (diúltach)", answer: "ní thagann", hint1: "diúltach"},
  {question: "Tá mé beagnach cinnte _____ ___________ an bus sin isteach ar a ceathrú taréis a hocht. (dearfach) ", answer: "go dtagann", hint1: "dearfach"},
  {question: "___________ easpa misnigh orm nuair a chloisim drochscéalta mar sin. (dearfach)", answer: "tagann", hint1: "dearfach"},
  {question: "___________ fadhbanna chun cinn ar bhonn laethúil ach bímid ábalta deileáil leo. (diúltach)", answer: "tagann", hint1: "diúltach"},
  {question: "___________ sé ar bhoinn airgid anois is arís agus é ar an trá. (dearfach) ", answer: "tagann", hint1: "dearfach"},
];

var tarAFQuestions = [
  {question: "___________ sí isteach nuair a bheidh sí críochnaithe.", answer: "tiocfaidh", hint1: "dearfach"},
  {question: "___________ siad abhaile arís ag deireadh na míosa.", answer: "tiocfaidh", hint1: "dearfach"},
  {question: "___________ feabhas ort le cleachtadh.", answer: "tiocfaidh", hint1: "dearfach"},
  {question: "___________ an samhradh is fásfaidh an féar. ", answer: "tiocfaidh", hint1: "dearfach"},
  {question: "___________ abhaile go luath arís anocht. (sinn)", answer: "tiocfaimid", hint1: "dearfach, sinn"},
  {question: "___________ athrú ar an aimsir ag deiredh na seachtaine seo.", answer: "tiocfaidh", hint1: "dearfach"},
  {question: "___________ lá na cinniúna luath nó mall.", answer: "tiocfaidh", hint1: "dearfach"},
  {question: "___________ do lá. Bí foighneach.", answer: "tiocfaidh", hint1: "dearfach"},
  {question: "___________ mé in éineacht leat má fhanann tú cúpla nóiméad. ", answer: "tiocfaidh", hint1: "dearfach"},
  {question: "___________ go dtí an cheist sin ar ball beag. (sinn)", answer: "tiocfaimid", hint1: "dearfach, sinn"},
];

var tarAFNi = [
  {question: "____ ___________ aon athrú ar an aimsir go ceann cúpla lá eile.", answer: "ní thiocfaidh", hint1: "diúltach"},
  {question: "____ ___________ sí ar ais go dtí an tseachtain seo chugainn.", answer: "ní thiocfaidh", hint1: "diúltach"},
  {question: "____ ___________ ciall chuige sin go brách. ", answer: "ní thiocfaidh", hint1: "diúltach"},
  {question: "____ ___________ aon bháisteach inniu. ", answer: "ní thiocfaidh", hint1: "diúltach"},
  {question: "____ ___________ aon athrú ar an bplean atá leagtha amach don turas. ", answer: "ní thiocfaidh", hint1: "diúltach"},
  {question: "____ ___________ ar ais anseo go brách na breithe. (sinn)", answer: "ní thiocfaimid", hint1: "diúltach"},
  {question: "____ ___________ an madra isteach má bhíonn eagla air.", answer: "ní thiocfaidh", hint1: "diúltach"},
  {question: "____ ___________ feabhas ort muna gcloíonn tú leis an mbia ceart. ", answer: "ní thiocfaidh", hint1: "diúltach"},
  {question: "____ ___________ air gan an áit a chuardach go mion. (sinn)", answer: "ní thiocfaimid", hint1: "diúltach"},
  {question: "____ ___________ aon toradh ar na hiarrachtaí sin atá ar bun acu.", answer: "ní thiocfaidh", hint1: "diúltach"},
];

var tarAFBriathorSaor = [

];

var tarAFCeisteach = [
  {question: "___ ___________ tú amach le haghaidh lóin níos déanaí? (dearfach)", answer: "an dtiocfaidh", hint1: "dearfach"},
  {question: "____ ___________ do chara in éineacht linn? (dearfach)", answer: "an dtiocfaidh", hint1: "dearfach"},
  {question: "____ ___________ abhaile díreach tar éis an cluiche? (sinn)", answer: "an dtiocfaimid", answer2: "nach dtiocfaimid", hint1: "sinn"},
  {question: "____ ___________ siad ar ais go brách arís, dar leat? (dearfach)", answer: "an dtiocfaidh", hint1: "dearfach"},
  {question: "____ ___________ tú go dtí an ceolchoirm linn? (diúltach).", answer: "nach dtiocfaidh", hint1: "diúltach"},
  {question: "____ ___________ sibh linn go dtí an chóisir níos déanaí? (diúltach).", answer: "nach dtiocfaidh", hint1: "diúltach"},
  {question: "____ ___________ an freagra céanna suas arís má leanaimid mar seo? (diúltach).", answer: "nach dtiocfaidh", hint1: "diúltach"},
  {question: "____ ___________ sé sin ar réiteach na faidhbe go brách? (dearfach)", answer: "an dtiocfaidh", hint1: "dearfach"},
  {question: "Nach cuma? ____ ___________ duine éigin eile isteach ina áit siúd? (diúltach).", answer: "nach dtiocfaidh", hint1: "diúltach"},
  {question: "____ ___________ aon rud ón bhfiosrúchán atá ar siúl faoi láthair, dar leat? (dearfach).", answer: "an dtiocfaidh", hint1: "dearfach"},
];

var tarAFSpleach = [
  {question: "Níl an chuma air ____ ___________ sé ar ais anocht. (dearfach)", answer: "go dtiocfaidh", hint1: "dearfach"},
  {question: "An dóigh leat ____ ___________ siad ar ais go brách? (dearfach)", answer: "go dtiocfaidh", hint1: "dearfach"},
  {question: "Tá mé nach mór cinnte ____ ___________ siad ar ais níos déanaí. (dearfach) ", answer: "go dtiocfaidh", hint1: "dearfach"},
  {question: "Deirtear ar réamhfháisnéis na haimsire ____ ___________ báisteach throm anocht. (dearfach)", answer: "go dtiocfaidh", hint1: "dearfach"},
  {question: "Is cosúil ____ ___________ aon athrú ar an scéal go ceann tamaill eile. (diúltach)", answer: "nach dtiocfaidh", hint1: "diúltach"},
  {question: "Deir sí  ____ ___________ sí abhaile arís go dtí go mbeidh a cúrsa críochnaithe aici. (diúltach) ", answer: "nach dtiocfaidh", hint1: "diúltach"},
  {question: "Is cosúil  ____ ___________  na torthaí amach go dtí deireach na míosa seo. (diúltach)", answer: "nach dtiocfaidh", hint1: "diúltach"},
  {question: "Tá mé cinnte ____ ___________ sí ar ais sar i bhfad? (dearfach)", answer: "go dtiocfaidh", hint1: "dearfach"},
  {question: "Ní dóigh liom ____ ___________siad air. Tá sé rófhada caillte. (dearfach)", answer: "go dtiocfaidh", hint1: "dearfach"},
  {question: "Níl sé soiléir ____ ___________aon rud fiúntach as an taighde sin. (dearfach)", answer: "go dtiocfaidh", hint1: "dearfach"},
];

var tarAFCoibhneasta = [

];

var tarAFExtraQuestions = [
  {question: "___________ mé ar ais níos déanaí. (dearfach)", answer: "tiocfaidh", hint1: "dearfach"},
  {question: "___ ___________ aon rud as an gcás sin. (diúltach)", answer: "ní thiocfaidh", hint1: "diúltach"},
  {question: "Tá súil agam ____ ___________ tú ar ais chugainn go luath. (dearfach)", answer: "go thiocfaidh", hint1: "dearfach"},
  {question: "____ ___________ tú isteach go lár na cathrach liom? (dearfach)", answer: "an dtiocfaidh", hint1: "dearfach"},
  {question: "___________ aon athrú ar an scéal i mbliana, dar leat? (dearfach) ", answer: "an dtiocfaidh", hint1: "dearfach"},
  {question: "______ ___________ tú ar ais arís go luath? (diúltach) ", answer: "an dtiocfaidh", hint1: "diúltach"},
  {question: "___________ ar an bhfreagra ceart pé fada gearr a thógfaidh sé. (sinn, dearfach)", answer: "tiocfaimid", answer2: "tiocfaidh muid", hint1: "dearfach"},
  {question: "____ ___________ an madra ar ais , dar leat? (dearfach)", answer: "an dtiocfaidh", hint1: "dearfach"},
  {question: "Tá mé lánchinnte ____ ___________ siad ar ais go brách arís. (diúltach)", answer: "nach dtiocfaidh", hint1: "diúltach"},
  {question: "____ ___________ ar ais le chéile san áit seo tar éis an chluiche? (sinn, diúltach)", answer: "ní thiocfaimid", answer2: "ní thiocfaidh muid", hint1: "diúltach"},
];

var tarMCQuestions = [
  {question: "___________ sí isteach dá mbeadh tuirse uirthi. ", answer: "thiocfadh", hint1: "dearfach"},
  {question: "___________ i gcabhair air dá mbeadh a fhios agam go raibh sé istigh ann. (mé)", answer: "thiocfainn", hint1: "dearfach, mé"},
  {question: "___________ leat go hiomlán sa mhéid a dúirt tú. (mé)", answer: "thiocfainn", hint1: "dearfach, mé"},
  {question: "___________ amach arís dá mbeidís scanraithe. (siad) ", answer: "thiocfaidís", answer2: "thiocfadh siad", hint1: "dearfach, siad"},
  {question: "___________ an t-otharcharr dá gcuirfí glaoch air. ", answer: "thiocfadh", hint1: "dearfach"},
  {question: " ___________ na bláthanna amach dá mbeadh an aimsir níos fearr.", answer: "thiocfadh", hint1: "dearfach"},
  {question: "___________ ar ais anseo dá mbeadh ceol ann. (siad)", answer: "thiocfaidís", answer2: "thiocfadh siad", hint1: "dearfach"},
  {question: "___________ ar ais dá mbeadh a fhios agat go raibh sé seo. (tú)", answer: "thiocfá", hint1: "dearfach, tú"},
  {question: "___________ ar ais dá mbrisfeadh an carr síos. (siad)", answer: "thiocfaidís", answer2: "thiocfadh siad", hint1: "dearfach"},
  {question: "___________ sí isteach dá mbeadh sí fuar. ", answer: "thiocfadh", hint1: "dearfach"},
];

var tarMCNi = [
  {question: "____ ___________ sí in éineacht liom ar ór ná ar airgead. ", answer: "ní thiocfadh", hint1: "diúltach"},
  {question: "____ ___________ an saol idir é féin agus a chuid bia. ", answer: "ní thiocfadh", hint1: "diúltach"},
  {question: "____ ___________ éinne isteach agus an madra ag an ngeata. ", answer: "ní thiocfadh", hint1: "diúltach"},
  {question: "____ ___________ ar ais mar gheall ar an drochchuma a bhí ar an áit. (siad) ", answer: "ní thiocfaidís", answer2: "ní thiocfadh siad", hint1: "diúltach, siad"},
  {question: "____ ___________ aon sionnach gar den teach mar gheall ar na madraí.", answer: "ní thiocfadh", hint1: "diúltach"},
  {question: "____ ___________ isteach mar bhí siad róchúthalach. (siad)", answer: "ní thiocfaidís", answer2: "ní thiocfadh siad", hint1: "diúltach, siad"},
  {question: "____ ___________ sí abhaile mar bhí sí róghnóthach dar léi féin. ", answer: "ní thiocfadh", hint1: "diúltach"},
  {question: "____ ___________ an tarbh amach as an bpáirc beag ná mór. ", answer: "ní thiocfadh", hint1: "diúltach"},
  {question: "____ ___________ ar ais murach go raibh an ceol ar fheabhas. (sinn)", answer: "ní thiocfaimís", hint1: "diúltach, sinn"},
];

var tarMCBriatharSaor = [

];

var tarMCCeisteach = [
  {question: "___ ___________ ar ais go hÉirinn dá mbeadh post maith ar fáil duit? (tú)", answer: "an dtiocfá", hint1: "dearfach, tú"},
  {question: "____ ___________ _____ go dtí an ceolchoirm dá mbeadh traein ar fáil dúinn? (sibh)", answer: "an dtiocfadh sibh", hint1: "dearfach, sibh"},
  {question: "____ ___________ sa bhus liomsa dá mbeadh tú gan charr? (tú)", answer: "an dtiocfá", hint1: "dearfach, tú"},
  {question: "____ ___________ isteach dá mbeadh ocras orthu? (siad, diúltach).", answer: "nach dtiocfaidís", answer2: "nach dtiocfadh siad", hint1: "diúltach"},
  {question: "____ ___________  níos mó cuairteoirí dá mbeadh an aimsir níos fearr in Éirinn? (dearfach).", answer: "an dtiocfadh", hint1: "dearfach"},
  {question: "____ ___________  an madra isteach dá gcuirfinn bia os a chomhair? ", answer: "an dtiocfadh", hint1: "dearfach"},
  {question: "____ ___________ ar réiteach na faidhbe dá mbeadh na bunfhíricí acu? (siad, diúltach).", answer: "nach dtiocfaidís", answer2: "nach dtiocfadh siad", hint1: "diúltach"},
  {question: "____ ___________ ar ais leat dá mbeadh a fhios agam go raibh tú leat féin? (mé, diúltach)", answer: "nach dtiocfainn", hint1: "diúltach"},
  {question: "____ ___________ ar ais ar aon nós? (siad, diúltach).", answer: "nach dtiocfaidís", answer2: "nach dtiocfadh siad", hint1: "diúltach"},
  {question: "____ ___________ an cat isteach dá bhfágfainn an fhuinneog ar oscailt? (dearfach).", answer: "an dtiocfadh", hint1: "dearfach"},
];

var tarMCSpleach = [
  {question: "Bhí a fhios agam go maith ____ ___________ sí ar ais go luath. (diúltach) ", answer: "nach dtiocfadh", hint1: "diúltach"},
  {question: "Dúirt siad  ____ ___________ go dtí an teach tábhairne, ach níor tháinig. (siad, dearfach)", answer: "go dtiocfaidís", answer2: "go dtiocfadh siad", hint1: "dearfach"},
  {question: "Bhí mé ag súil ____ ___________ sé in éineacht linn, ach níor tháinig?  ", answer: "go dtiocfadh", hint1: "dearfach"},
  {question: "Bhí a fhios agam ____ ___________ aon mhaith as a chuid iarrachtaí. (diúltach) ", answer: "nach dtiocfadh", hint1: "diúltach"},
  {question: "Cheap siad ____ ___________in éineacht leo ach, buíochas le Dia, níor tháinig. (tú, dearfach)", answer: "go dtiocfá", answer2: "go dtiocfadh tú", hint1: "dearfach"},
  {question: "Bhí mé cinnte ____ ___________ ar ais go brách arís. (siad, diúltach)", answer: "nach dtiocfaidís", answer2: "nach dtiocfadh siad", hint1: "diúltach"},
  {question: "Bhí mé ag súil  ____ ___________ feabhas ar an aimsir, ach níor tháinig. (dearfach) ", answer: "go dtiocfadh", hint1: "dearfach"},
  {question: "Bhí siad ag rá ____ ___________ an fhírinne amach, ach níor tháinig. (dearfach)", answer: "go dtiocfadh", hint1: "dearfach"},
  {question: "Tá a fhios agat ___ ___________ idir tú féin is do ghrá geal. (mé, diúltach)", answer: "nach dtiocfainn", hint1: "diúltach, mé"},
  {question: "Dúirt siad go léir ___ ___________sé, ach tháinig. (diúltach)", answer: "nach dtiocfadh", hint1: "diúltach"},
];

var tarMCExtraQuestions = [
  {question: "___________ amach dá mbeadh an aimsir níos fearr. (siad, dearfach) ", answer: "thiocfaidís", answer2: "thiocfadh siad", hint1: "dearfach"},
  {question: "Dá ____ ___________ Seán in éineacht linn bheadh an-spórt againn. ", answer: "dtiocfadh", hint1: "dearfach"},
  {question: "____ ___________ ar ais dá mbeadh an aimsir geallta go maith don deireadh seachtaine. (sinn)  ", answer: "thiocfaimis", hint1: "dearfach, sinn"},
  {question: "Nach raibh a fhios go maith agat ____ ___________ éin isteach tríd an bhfuinneog sin? (dearfach) ", answer: "go dtiocfadh", hint1: "dearfach"},
  {question: "____ ___________do chara linn dá mbeadh spás againn dó sa charr? ", answer: "an dtiocfadh", hint1: "dearfach"},
  {question: "Dúirt sí ____ ___________ sí isteach an chéad rud ar maidin, ach níor tháinig. (dearfach)", answer: "go dtiocfadh", hint1: "dearfach"},
  {question: "___ ___________ linn ar ór na cruinne. (siad, diúltach) ", answer: "ní thiocfaidís", answer2: "ní thiocfadh siad", hint1: "diúltach"},
  {question: "____ ___________ leat sa mhéid a dúirt tú ansin. (mé, diúltach)", answer: "ní thiocfainn", hint1: "diúltach"},
  {question: "___ ___________ in éineacht linn dá dtabharfaimis cuireadh dóibh? (siad, dearfach)", answer: "an dtiocfaidís", answer2: "an thiocfadh siad", hint1: "dearfach"},
  {question: "Bhí a fhios agam go maith ___ ___________sibh ar ais go luath. (diúltach)", answer: "nach dtiocfadh", hint1: "diúltach"},
];

var biACQuestions = [
  {question: "___________ an scéal ag éirí níos measa in aghaidh an lae.", answer: "bhí", hint1: "dearfach"},
  {question: "___________ ina suí cois trá, bolg le grian, gan chíos, cás ná cathú.", answer: "bhíodar", answer2: "bhí said", hint1: "dearfach"},
  {question: "___________ préachta leis an bhfuacht an mhaidin áirithe sin. (sinn)", answer: "bhíomar", answer2: "bhí muid", hint1: "dearfach"},
  {question: "___________ an diabhal thíos ina bholg. ", answer: "bhí", hint1: "dearfach"},
  {question: "___________ an saol is a mháthair ag faire amach dóibh.", answer: "bhí", hint1: "dearfach"},
  {question: "___________ rud éigin ag dó na geirbe aige ó mhaidin.", answer: "bhí", hint1: "dearfach"},
  {question: "___________ loinnir ina shúile an mhaidin sin. ", answer: "bhí", hint1: "dearfach"},
  {question: "___________ bréan bailithe den scéal ar fad.", answer: "bhíos", answer2: "bhí mé", hint1: "dearfach"},
  {question: "___________ an an t-ádh dearg orm.", answer: "bhí", hint1: "dearfach"},
  {question: "Ní mó ná sásta a ___________ sé.", answer: "bhí", hint1: "dearfach"},
];

var biACNi = [
  {question: "____ ___________ faic na ngrás le feiceáil san áit.", answer: "ní raibh", hint1: "diúltach"},
  {question: "____ ___________ aon locht agam air.", answer: "ní raibh", hint1: "diúltach"},
  {question: "____ ___________ ar ár gcompord ó thosaigh sé ag caint. (sinn)", answer: "ní rabhamar", answer2: "ní raibh muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ in ann an fód a sheasamh rófhada. (siad)", answer: "ní rabhadar", answer2: "ní raibh siad", hint1: "diúltach, siad"},
  {question: "____ ___________ i mo chónaí san áit ach ar feadh seachtaine.", answer: "ní rabhas", answer2: "ní raibh mé", hint1: "diúltach"},
  {question: "____ ___________ aon ní ag cur isteach orainn an lá sin.", answer: "ní raibh", hint1: "diúltach"},
  {question: "____ ___________ sí ar a suaimhneas riamh a fhad a bhí sí ann.", answer: "ní raibh", hint1: "diúltach"},
  {question: "____ ___________ sé ach leathchéad bliain nuair a cailleadh é.", answer: "ní raibh", hint1: "diúltach"},
  {question: "____ ___________ le déanamh ach ár dtoil a chur le toil Dé.", answer: "ní raibh", hint1: "diúltach"},
  {question: "____  ___________ in ann faic a dhéanamh faoin uafás a bhí ag stánadh idir an dá shúil orthu. (siad)", answer: "ní rabhadar", answer2: "ní raibh siad", hint1: "diúltach"},
];

var biACBriathorSaor = [
  {question: "___________ ag tuar go dtitfeadh praghas na mairteola le fada. (dearfach)", answer: "bhíothas", hint1: "dearfach"},
  {question: "____ ___________ ag súil le toradh maith ar an taighde a bhí ar siúl san áit. (diúltach)", answer: "ní rabhathas", hint1: "diúltach"},
  {question: "___________ den tuairim nach n-éireodh leo an bheart a thabhairt chun críche. (dearfach)", answer: "bhíothas", hint1: "dearfach"},
  {question: "___________ den tuairim gur as a meabhair a bhí sí ag dul. (dearfach)", answer: "bhíothas", hint1: "dearfach"},
  {question: "____ ___________ róchinnte go dtiocfadh sé slán as an timpiste. (diúltach)", answer: "ní rabhathas", hint1: "diúltach"},
  {question: "____ ___________ ar aon tuairim faoi cad ba cheart a dhéanamh. (diúltach)", answer: "ní rabhathas", hint1: "diúltach"},
  {question: "____ ___________ róshásta leis an Rialtas ina dhiaidh sin. (diúltach)", answer: "bhíothas", hint1: "diúltach"},
  {question: "___________ lánsásta go raibh toradh dearfach ar na trialacha. (dearfach)", answer: "bhíothas", hint1: "dearfach"},
  {question: "___________ dóchasach go dtiocfadh deascéal roimh dheireadh an lae. (dearfach)", answer: "bhíothas", hint1: "dearfach"},
  {question: "____ ___________ ag súil le haon rud ní b’fhearr. (diúltach)", answer: "ní rabhathas", hint1: "diúltach"},
];

var biACCeisteach = [
  {question: "____ ___________ tú ar an gCarraig nó an bhfaca tú féin mo ghrá? (dearfach)", answer: "an raibh", hint1: "dearfach"},
  {question: "____ ___________ faic eile le déanamh agat ach a bheith ag seasamh timpeall? (diúltach)", answer: "nach raibh", hint1: "diúltach"},
  {question: "____ ___________ mórán le rá aici? (dearfach)", answer: "an raibh", hint1: "dearfach"},
  {question: "____ ___________ sásta? Bí cinnte go raibh! (sinn, dearfach)", answer: "an rabhamar", answer2: "an raibh muid", hint1: "dearfach"},
  {question: "____ ___________ aon ní eile ag cur isteach orthu? (dearfach)", answer: "an raibh", hint1: "dearfach"},
  {question: "____ ___________ an-oíche againn! (diúltach)", answer: "nach raibh", hint1: "diúltach"},
  {question: "____ ___________ an t-ádh dearg leo gur tháinig siad slán. (diúltach)", answer: "nach raibh", hint1: "diúltach"},
  {question: "____ ___________ siad thar a bheith buíoch díot? (siad, diúltach)", answer: "nach rabhamar", answer2: "nach raibh muid", hint1: "diúltach, siad"},
  {question: "____ ___________ ag súil le torthaí ní b’fhearr? (briathar saor, dearfach)", answer: "an rabhathas", hint1: "dearfach, briathar saor"},
  {question: "____ ___________ fírinne an scéil ar eolas go maith acu. (diúltach)", answer: "nach raibh", hint1: "diúltach"},
];

var biACSpleach = [
  {question: "Bhí mé cinnte ____ ___________ sé imithe a chodladh ag an am sin. (dearfach)", answer: "go raibh", hint1: "dearfach"},
  {question: "Dúirt sí liom ____ ___________ sí chun dul ar ais níos mó. (diúltach)", answer: "nach raibh", hint1: "diúltach"},
  {question: "Bí cinnte de ____ ___________ mórán le rá acu ina dhiaidh sin. (diúltach)", answer: "nach raibh", hint1: "diúltach"},
  {question: "Chuala mé ____ ___________ sé ar fónamh le tamall anuas. (dearfach)", answer: "nach raibh", hint1: "dearfach"},
  {question: "Bhí eagla an domhain orainn____ ___________ i mbaol ár mbáite an lá sin. (dearfach)", answer: "go rabhadar", answer2: "go raibh muid", hint1: "dearfach"},
  {question: "Bhí a fhios againn ____ ___________ sásta ach ní raibh aon teacht timpeall air. (siad, diúltach)", answer: "go raibh", hint1: "diúltach, siad"},
  {question: "Dúirt siad ____ ___________ siad chun teacht chugainn ach níor thángadar. (dearfach)", answer: "go raibh", hint1: "dearfach"},
  {question: "Bhí má bhí, ach níor chuala mise ____ ___________. (dearfach)", answer: "go raibh", hint1: "dearfach"},
  {question: "Dúirt sé ____ ___________ar an ngrúpa ab fhearr a bhí aige riamh? (sinn, dearfach)", answer: "go rabhadar", answer2: "go raibh muid", hint1: "dearfach"},
  {question: "Chuala mé ____ ___________siad ann ach ar feadh cúpla lá. (diúltach)", answer: "nach raibh", hint1: "diúltach"},
];

var biACCoibhneasta = [
  {question: "Chuala mé ____ ___________ le rá aici ag an gcruinniú. ", answer: "a raibh", hint1: "a ______"},
  {question: "B’shin ____ ___________ le déanamh ach ní dhearna sibh é. ", answer: "a raibh", hint1: "a ______"},
  {question: "Bhí gach ____ ___________ i láthair sna trithí gáire. ", answer: "a raibh", hint1: "a ______"},
  {question: "Chonaiceamar ____ ___________ ann agus bhailíomar linn. ", answer: "a raibh", hint1: "a ______"},
  {question: "B’shin ____ ___________ acu le hithe ar feadh trí lá. ", answer: "a raibh", hint1: "a ______"},
  {question: "Chuir sé iontas ar gach ____ ___________ i láthair an oíche úd.", answer: "a raibh", hint1: "a ______"},
  {question: "Bhí gach ____ ___________ múinte ar an gcúrsa ar bharr a teanga aici. ", answer: "a raibh", hint1: "a ______"},
  {question: "Ghoid siad ____ ___________ d’airgead sa teach ag an sean-bhean. ", answer: "a raibh", hint1: "a ______"},
  {question: "B’shin  ____ ___________ fágtha sa chuisneoir an mhaidin dar gcionn. ", answer: "a raibh", hint1: "a ______"},
  {question: "B’shin ____ ___________ le rá aige is gan aon mhíniú eile aige ar an scéal. ", answer: "a raibh", hint1: "a ______"},
];

var biACExtraQuestions = [
  {question: "___________ an ghomh uirthi an lá sin gan aon bhréag ná magadh. ", answer: "bhí", hint1: "dearfach"},
  {question: "____ ___________ aon dul as againn ach é a íoc. ", answer: "ní raibh", hint1: "diúltach"},
  {question: "____ ___________aon scéal ná duan uaithi ar feadh an achair. (diúltach) ", answer: "ní raibh", hint1: "diúltach"},
  {question: "____ ___________ in ainm is a bheith ag dul ansin ag tús na bliana? (sinn, diúltach) ", answer: "ní rabhamar", answer2: "ní raibh muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ aon rud ag cur isteach ná amach orainn an lá sin. (diúltach)", answer: "ní raibh", hint1: "diúltach"},
  {question: "Bhí ____ ___________ le rá aici suimiúil. ", answer: "a raibh", hint1: "dearfach"},
  {question: "___________ ag súil le rud éigin ní b’fhearr ná sin. (briathar saor, dearfach) ", answer: "bhíothas", hint1: "dearfach"},
  {question: "____ ___________ sibh ábalta é a chríochnú in am? (diúltach)", answer: "an raibh", hint1: "diúltach"},
  {question: "___________ aon chuma ar an rud a rinne siad? (dearfach)", answer: "an raibh", hint1: "dearfach"},
  {question: "Dúirt sí ____ ___________ in áit an-chontúirteach agus go mba cheart dúinn bogadh láithreach. (sinn, dearfach)", answer: "go rabhamar", answer2: "go raibh muid", hint1: "dearfach"},
];

var biALQuestions = [
  {question: "___________ san oifig gach maidin ar a naoi a chlog. ", answer: "bím", answer2: "bíonn mé", hint1: "dearfach"},
  {question: "___________ tusa in am i gcónaí. ", answer: "bíonn", hint1: "dearfach"},
  {question: "___________ slua mór ag an bhféile sin gach bliain.", answer: "bíonn", hint1: "dearfach"},
  {question: "___________ ag faire amach dó go rialta. (sinn)", answer: "bímid", answer2: "bíonn muid", hint1: "dearfach, sinn"},
  {question: "___________ siad á rá is bíonn siad á rá.", answer: "bíonn", hint1: "dearfach"},
  {question: "___________ sé fud fad na háite i gcónaí.", answer: "bíonn", hint1: "dearfach"},
  {question: "___________ istigh in am gach maidin.", answer: "bímid", answer2: "bíonn muid", hint1: "dearfach"},
  {question: "___________ an-tóir ar thicéid do Chraobh na hÉireann gach bliain.", answer: "bíonn", hint1: "dearfach"},
  {question: "___________ ag fanacht leis ag an doras go rialta. (mé) ", answer: "bíonn", hint1: "dearfach, mé"},
  {question: "___________ sí sásta nuair a fhaigheann sí breith a béil féin.", answer: "bíonn", hint1: "dearfach"},
];

var biALNi = [
  {question: "____ ___________ féin ag plé leis na cúrsaí sin níos mó. (mé)", answer: "ní bhím", answer2: "ní bhíonn mé", hint1: "diúltach, mé"},
  {question: "____ ___________ sí déanach riamh ar éigean.", answer: "ní bhíonn", hint1: "diúltach"},
  {question: "____ ___________ aon bhrú ag baint leis an obair sin níos mó.", answer: "ní bhíonn", hint1: "diúltach"},
  {question: "____ ___________ ag gearán muna mbíonn cúis an-mhaith againn. (sinn)", answer: "ní bhímid", answer2: "ní bhíonn muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ aon chur is cúiteamh faoin gceist níos mó. ", answer: "ní bhíonn", hint1: "diúltach"},
  {question: "____ ___________ mórán le rá acu na laethanta seo.", answer: "ní bhíonn", hint1: "diúltach"},
  {question: "____ ___________ seans agam dul ann ach anois is arís.", answer: "ní bhíonn", hint1: "diúltach"},
  {question: "____ ___________ críochnaithe aon lá go dtí ardtráthnóna. (sinn)", answer: "ní bhímid", answer2: "ní bhíonn muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ an traonach le cloisteáil ach i gcúpla ceantar in Éirinn faoin láthair.", answer: "ní bhíonn", hint1: "diúltach"},
  {question: "____ ___________ aon dul amú uirthi sin riamh.", answer: "ní bhíonn", hint1: "diúltach"},
];

var biALCeisteach = [
  {question: "___________ sé mar seo i gcónaí? (dearfach).", answer: "an mbíonn", hint1: "dearfach"},
  {question: "____ ___________ sí chomh ciúin sin gcónaí? (dearfach)", answer: "an mbíonn", hint1: "dearfach"},
  {question: "_____ ___________ faic eile le rá aige riamh? (dearfach)", answer: "an mbíonn", hint1: "dearfach"},
  {question: "_____ ___________siadsan sona riamh? (dearfach)", answer: "an mbíonn", hint1: "dearfach"},
  {question: "_____ ___________ siad istigh ansin gach dara lá? (diúltach).", answer: "nach mbíonn", hint1: "diúltach"},
  {question: "_____ ___________ á rá sin go minic? (sinn, diúltach).", answer: "nach mbímid", answer2: "nach mbíonn muid", hint1: "diúltach"},
  {question: "____ ___________ sí sin san oifig roimh gach éinne eile ar maidin? (diúltach).", answer: "nach mbíonn", hint1: "diúltach"},
  {question: "____ ___________ ann sách minic? (sinn, diúltach)", answer: "nach mbímid", answer2: "nach mbíonn muid", hint1: "diúltach"},
  {question: "____ ___________ag caint leis go rialta? (mé, diúltach).", answer: "nach mbím", answer2: "nach mbíonn mé", hint1: "diúltach"},
  {question: "____ ___________ na daoine sin sa teach tábhairne gach tráthnóna? (dearfach).", answer: "nach mbíonn", hint1: "dearfach"},
];

var biALSpleach = [
  {question: "Cloisim ____ ___________ an bia an-mhaith sa bhialann sin. (dearfach)", answer: "go mbíonn", hint1: "dearfach"},
  {question: "Deir siad ____ ___________ aon trioblóid acu leis riamh. (diúltach)", answer: "nach mbíonn", hint1: "diúltach"},
  {question: "Ní dóigh liom ____ ___________ sise anseo ró-mhinic. (dearfach)", answer: "go mbíonn", hint1: "dearfach"},
  {question: "An bhfuil a fhios agat ____ ___________ dochtúir ar fáil dóibh ach uair sa tseachtain? (diúltach)", answer: "nach mbíonn", hint1: "diúltach"},
  {question: "An bhfuil tú a rá liom ____ ___________ sí réidh in am riamh. (diúltach)", answer: "nach mbíonn", hint1: "diúltach"},
  {question: "Ní dóigh liom ____ ___________ seisean sásta le haon rud riamh. (dearfach)", answer: "go mbíonn", hint1: "dearfach"},
  {question: "Ní dóigh liomsa ____ ___________ aon rud fiúntach san iris sin riamh. (dearfach)", answer: "go mbíonn", hint1: "dearfach"},
  {question: "Deirtear liom ____ ___________ fáil air gach maidin Luain. (dearfach)", answer: "nach mbíonn", hint1: "dearfach"},
  {question: "Cloisim ____ ___________dochtúir le fáil ar an oileán níos mó. (diúltach)", answer: "nach mbíonn", hint1: "diúltach"},
  {question: "Ní dóigh liom ____ ___________aon rud maith ar an teilifís ag an deireadh seachtaine níos mó. (dearfach)", answer: "go mbíonn", hint1: "dearfach"},
];

var biALCoibhneasta = [
];

var biALExtraQuestions = [
  {question: "___________acu sa teach tábhairne sin gach oíche. (dearfach) ", answer: "bíonn", hint1: "dearfach"},
  {question: "____  ___________ aon rud le déanamh agamsa leo níos mó. (diúltach).", answer: "ní bhíonn", hint1: "diúltach"},
  {question: "___ ___________ aon rud le rá aicisin riamh? (diúltach) ", answer: "nach mbíonn", hint1: "diúltach"},
  {question: "____ ___________ siad ag caint, is ag caint, is ag caint. (dearfach)", answer: "bíonn", hint1: "dearfach"},
  {question: "Tá a fhios agam go maith ____ ___________ siad anseo go rialta. (diúltach) ", answer: "nach mbíonn", hint1: "diúltach"},
  {question: "An dóigh leat _____ ___________ siad ag insint na fírinne? (dearfach)", answer: "go mbíonn", hint1: "dearfach"},
  {question: "___________ blas ar an mbeagán! (dearfach) ", answer: "bíonn", hint1: "dearfach"},
  {question: "___________ ann sách minic? (sinn, dearfach)", answer: "an mbímid", answer2: "an mbíonn muid", hint1: "dearfach, sinn"},
  {question: "___________ focal maith le rá aige sin riamh? (dearfach)", answer: "an mbíonn", hint1: "dearfach"},
  {question: "_____ ___________ tusa ag caint léi sin go minic? (diúltach) ", answer: "nach mbíonn", hint1: "diúltach"},
];

var biAFQuestions = [
  {question: "___________ saol an mhadaidh bháin againn amárach.", answer: "beidh", hint1: "dearfach"},
  {question: "___________ oíche go maidin acu.", answer: "beidh", hint1: "dearfach"},
  {question: "___________ gálaí gaoithe ag leathnú soir trasna na tíre anocht.", answer: "beidh", hint1: "dearfach"},
  {question: "___________ an nuacht á craoladh beo ar a sé tráthnóna. ", answer: "beidh", hint1: "dearfach"},
  {question: "___________ an gabhar á róstadh ar Thrá na Cille tráthnóna. ", answer: "beidh", hint1: "dearfach"},
  {question: "___________ gá le hiarracht mhór má táimid chun an beart a dhéanamh.", answer: "beidh", hint1: "dearfach"},
  {question: "___________ mé chugaibh a luaithe agus is féidir liom.", answer: "beidh", hint1: "dearfach"},
  {question: "___________ na sluaite ag tarraingt ar an Ardchathair don gcluiche.", answer: "beidh", hint1: "dearfach"},
  {question: "___________ an saol is a mháthair ann anocht má bhí riamh. ", answer: "beidh", hint1: "dearfach"},
  {question: "___________ ceol go frathacha ag an gcóisir anocht. ", answer: "beidh", hint1: "dearfach"},
];

var biAFNi = [
  {question: "____ ___________ aon rud le cur isteach ná amach ort anseo.", answer: "ní bheidh", hint1: "diúltach"},
  {question: "____ ___________ deireadh ráite aige go brách.", answer: "ní bheidh", hint1: "diúltach"},
  {question: "____ ___________ aon leisce ort é sin a dhéanamh arís. ", answer: "ní bheidh", hint1: "diúltach"},
  {question: "____ ___________ réidh in am le dul ar an traein sin. (sinn) ", answer: "ní bheidh", hint1: "diúltach, sinn"},
  {question: "____ ___________ mé in ann cur suas leis sin rófhada. ", answer: "ní bheidh", hint1: "diúltach"},
  {question: "____ ___________ cíos, cás ná cathú orthu go ceann i bhfad anois. ", answer: "ní bheidh", hint1: "diúltach"},
  {question: "____ ___________ tú ábalta é sin a iompar leat féin.", answer: "ní bheidh", hint1: "diúltach"},
  {question: "____ ___________ mé ábalta an obair ar fad a chríochnú liom féin. ", answer: "ní bheidh", hint1: "diúltach"},
  {question: "____ ___________ fonn ná fiach air siúd maidin amárach. ", answer: "ní bheidh", hint1: "diúltach"},
  {question: "____ ___________ ábalta iad sin a shásamh go brách. (sinn)", answer: "ní bheimid", answer2: "ní bheidh muid", hint1: "diúltach, sinn"},
];

var biAFBriathorSaor = [
];

var biAFCeisteach = [
  {question: "___ ___________ tú ábalta é sin a dhéanamh leat féin? (dearfach)", answer: "an mbeidh", hint1: "dearfach"},
  {question: "____ ___________ aon duine eile in éineacht leat? (diúltach)", answer: "nach mbeidh", hint1: "diúltach"},
  {question: "____ ___________ ort é sin a dhéanamh ina dhiaidh seo? (dearfach)", answer: "an mbeidh", hint1: "dearfach"},
  {question: "____ ___________ éinne ann chun cabhrú leat? (dearfach)", answer: "an mbeidh", hint1: "dearfach"},
  {question: "____ ___________ sé ceart go leor mar sin anois? (diúltach).", answer: "nach mbeidh", hint1: "diúltach"},
  {question: "____ ___________ laethanta saoire agat faoi cheann seachtaine eile? (diúltach).", answer: "nach mbeidh", hint1: "diúltach"},
  {question: "____ ___________ ábalta é a chríochnú anocht, dar leat? (sinn, dearfach).", answer: "an mbeimid", answer2: "an mbeidh muid", hint1: "dearfach"},
  {question: "____ ___________ tú ar fáil an chéad rud maidin amárach? (dearfach)", answer: "an mbeidh", hint1: "dearfach"},
  {question: "____ ___________ comhluadar maith agat ag an mbainis sin? (diúltach).", answer: "nach mbeidh", hint1: "diúltach"},
  {question: "____ ___________ go leor ama agat chun é a dhéanamh an tseachtain seo chugainn? (diúltach).", answer: "nach mbeidh", hint1: "diúltach"},
];

var biAFSpleach = [
  {question: "Tá a fhios agam go maith ____ ___________ sé ann. (diúltach)", answer: "nach mbeidh", hint1: "diúltach"},
  {question: "Is dóigh liom ____ ___________ mé críochnaithe leis anocht. (dearfach)", answer: "go mbeidh", hint1: "dearfach"},
  {question: "Tá súil agam ____ ___________ siad ar fad anseo in am. (dearfach) ", answer: "go mbeidh", hint1: "dearfach"},
  {question: "Ceapann sí ____ ___________ ticéid fós ar fáil tráthnóna. (dearfach)", answer: "go mbeidh", hint1: "dearfach"},
  {question: "Ní dóigh liom ____ ___________ mórán daoine i láthair. (dearfach)", answer: "go mbeidh", hint1: "dearfach"},
  {question: "Tá sí ag gealladh  ____ ___________sí ag cur isteach orainn níos mó. (diúltach) ", answer: "nach mbeidh", hint1: "diúltach"},
  {question: "Tuigfidh siad go luath ____ ___________toradh maith ar a gcuid pleananna. (dearfach)", answer: "go mbeidh", hint1: "dearfach"},
  {question: "Tá súil agam ____ ___________ fágtha anseo don oíche. (sinn, diúltach)", answer: "nach mbeimid", answer2: "nach mbeidh muid", hint1: "diúltach, sinn"},
  {question: "Tá sí cinnte ____ ___________ gach rud go breá ach níl a fhios agamsa faoi sin. (dearfach)", answer: "go mbeidh", hint1: "dearfach"},
  {question: "Ceaptar ____ ___________aon duine fágtha sa pharóiste lá an chluiche. (diúltach)", answer: "nach mbeidh", hint1: "diúltach"},
];

var biAFCoibhneasta = [

];

var biAFExtraQuestions = [
  {question: "___________ mé ag súil le freagra uait ar do chaoithiúlacht. (dearfach)", answer: "beidh", hint1: "dearfach"},
  {question: "___________ díomá orthu muna bhfaigheann siad duais éigin. (dearfach)", answer: "beidh", hint1: "dearfach"},
  {question: "____ ___________ aon rud le cur isteach ná amach ort anseo. (diúltach)", answer: "ní bheidh", hint1: "diúltach"},
  {question: "____ ___________ duine ná deoraí san áit sin le linn an gheimhridh. (diúltach)", answer: "ní bheidh", hint1: "diúltach"},
  {question: "____ ___________ fáilte is fiche romhaibh ar fad, a stóir? (diúltach) ", answer: "nach mbeidh", hint1: "diúltach"},
  {question: "______ ___________ ar ais in am don traein má théimid suas ansin? (sinn, dearfach) ", answer: "an mbeimid", answer2: "an mbeidh muid", hint1: "dearfach, sinn"},
  {question: "____ ___________ do chuid cairde in éineacht leat? (diúltach)", answer: "nach mbeidh", hint1: "diúltach"},
  {question: "Ní dóigh liom ____ ___________ siad in ann teacht tráthnóna. ", answer: "go mbeidh", hint1: "dearfach"},
  {question: "Tá mé lánchinnte ____ ___________ éinne ag cur isteach ort anseo. (diúltach)", answer: "nach mbeidh", hint1: "diúltach"},
  {question: "Má bhuailim isteach chugat ar a sé ____ ___________ tú réidh?", answer: "an mbeidh", hint1: "dearfach"},
];

var biMCQuestions = [
  {question: "___________ lánsásta leis an méid sin dá bhfaighinn é. (mé) ", answer: "bheinn", hint1: "dearfach, mé"},
  {question: "___________ saol an mhadaidh bháin agat ansin dá mbeadh an aimsir go maith.", answer: "bheadh", hint1: "dearfach"},
  {question: "___________ ciall leis sin ach ní dhéanfaidh siad é. ", answer: "bheadh", hint1: "dearfach"},
  {question: "___________ seans maith agatsa an rás sin a bhuachan.  ", answer: "bheadh", hint1: "dearfach"},
  {question: "___________ sé sin ceart go leor dá mbeadh seirbhís mhaith traenach ann. ", answer: "bheadh", hint1: "dearfach"},
  {question: " ___________ sona sásta dá mbeadh áit cheart acu le fanacht. (siad)", answer: "bheidís", hint1: "dearfach, siad"},
  {question: "___________ slua an-mhór ann murach an droch-aimsir. ", answer: "bheadh", hint1: "dearfach"},
  {question: "___________ go leor le rá aici dá bhfaigheadh sí cead cainte. ", answer: "bheadh", hint1: "dearfach"},
  {question: "___________ an iomarca deacrachtaí ag dul leis sin. Fágfaimid é.", answer: "bheadh", hint1: "dearfach"},
  {question: "___________ ort a lán airgid a chaitheamh chun aon chuma a chur ar an teach sin. ", answer: "bheadh", hint1: "dearfach"},
];

var biMCNi = [
  {question: "____ ___________ féin sásta rud mar sin a dhéanamh. (mé) ", answer: "ní bheinn", hint1: "diúltach, mé"},
  {question: "____ ___________ ábalta é sin ar fad a chríochnú in aon lá amháin. (mé)", answer: "ní bheinn", hint1: "diúltach"},
  {question: "____ ___________ aon chur ina choinne agamsa. ", answer: "ní bheadh", hint1: "diúltach"},
  {question: "____ ___________ sé sin ceart ná cóir. ", answer: "ní bheadh", hint1: "diúltach"},
  {question: "____ ___________ ar ais in am dá rachaimis isteach ar an oileán. (sinn) ", answer: "ní bheimís", hint1: "diúltach, sinn"},
  {question: "____ ___________ aon chiall le rud mar sin.", answer: "ní bheadh", hint1: "diúltach"},
  {question: "____ ___________ ábalta na trialacha sin a dhéanamh gan Ghaeilge mhaith a bheith agat. (tú)", answer: "ní bheifeá", hint1: "diúltach, tú"},
  {question: "____ ___________ Seán ábalta dó sin níos mó. Tá sé róshean. ", answer: "ní bheadh", hint1: "diúltach"},
  {question: "____ ___________ aon seans agamsa dá mbeinn istigh leo sin. ", answer: "ní bheadh", hint1: "diúltach"},
  {question: "____ ___________ a fhios agat. Níl deireadh déanta fós. ", answer: "ní bheadh", hint1: "diúltach"},
];

var biMCBriatharSaor = [

];

var biMCCeisteach = [
  {question: "___ ___________ aon mhaith ina leithéid de rud dúinne? (dearfach)", answer: "an mbeadh", hint1: "dearfach"},
  {question: "____ ___________ _____ sí sásta dá bhfaigheadh sí an méid sin? (diúltach)", answer: "nach mbeadh", hint1: "diúltach"},
  {question: "____ ___________ sé níos fearr agat é a chaitheamh uait ar fad? (diúltach)", answer: "nach mbeadh", hint1: "diúltach"},
  {question: "____ ___________ sé chomh maith againn é a fhágáil mar atá? (diúltach).", answer: "nach mbeadh", hint1: "diúltach"},
  {question: "____ ___________  sé chomh maith agat an rud ar fad a chaitheamh san aer ag an bpointe seo? (diúltach).", answer: "nach mbeadh", hint1: "diúltach"},
  {question: "____ ___________  níos fearr as gan é? (sinn, dearfach)", answer: "an mbeimís", answer2: "an mbeadh muid", hint1: "dearfach"},
  {question: "____ ___________ aon eolas ag Antoin faoi dá rachaimis chuige? (dearfach).", answer: "an mbeadh", hint1: "dearfach"},
  {question: "____ ___________ sé fós ann murach gur thóg duine éigin é? (diúltach)", answer: "nach mbeadh", hint1: "diúltach"},
  {question: "____ ___________ níos fearr as dá bhfanfaidís anseo? (siad, diúltach).", answer: "nach mbeidís", answer2: "nach mbeadh siad", hint1: "diúltach"},
  {question: "____ ___________ sásta é a dhíol liom ar chéad Euro? (tú, dearfach).", answer: "an mbeifeá", answer2: "an mbeadh tú", hint1: "dearfach"},
];

var biMCSpleach = [
  {question: "Dúirt siad ____ ___________ sásta é a dhéanamh. (siad, dearfach) ", answer: "go mbeidís", answer2: "go mbeadh siad", hint1: "dearfach, siad"},
  {question: "Chuala mé  ____ ___________ ag teacht go dtí an cluiche Dé Domhnaigh. (siad, diúltach)", answer: "nach mbeidís", answer2: "nach mbeadh siad", hint1: "diúltach"},
  {question: "Ní dóigh liom ____ ___________ sí le haon cheann eile seachas an ceann seo.", answer: "go mbeadh", hint1: "dearfach"},
  {question: "Ní raibh mise róchinnte ____ ___________ an madra sásta fanacht leatsa. (dearfach) ", answer: "go mbeadh", hint1: "dearfach"},
  {question: "Chuala mé ____ ___________dianslándáil i bhfeidhm do chuairt an phrionsa. (dearfach)", answer: "go mbeadh", hint1: "dearfach"},
  {question: "An dóigh leat ____ ___________ níos fearr as fanacht leis an gcéad cheann? (sinn, dearfach)", answer: "go mbeimís", answer2: "go mbeadh muid", hint1: "dearfach"},
  {question: "Ba dhóigh leat ____ ___________ ciall cheannaithe aici faoin dtráth seo! (dearfach) ", answer: "go mbeadh", hint1: "dearfach"},
  {question: "Bhí siad den tuairim ____ ___________ gach rud go breá faoi cheann cúpla lá. (dearfach)", answer: "go mbeadh", hint1: "dearfach"},
  {question: "Dúrach ___ ___________ seans acu ach bhuaigh siad i ndeireadh thiar thall. (diúltach)", answer: "nach mbeadh", hint1: "diúltach"},
  {question: "Dúirt sí ___ ___________sí sásta dul ann léi féin. (diúltach)", answer: "nach mbeadh", hint1: "diúltach"},
];

var biMCExtraQuestions = [
  {question: "___________ sé sin ceart go leor dá mbeinn saor amárach. (dearfach) ", answer: "bheadh", hint1: "dearfach"},
  {question: "____ ___________ marbh faoi seo dá leanfaidís ar aghaidh mar a bhí siad. (siad, dearfach) ", answer: "bheidís", hint1: "dearfach, siad"},
  {question: "____ ___________ a fhios agat. B’fhéidir go dtiocfaidh sí.  (diúltach) ", answer: "ní bheadh", hint1: "diúltach"},
  {question: "____ ___________ seans ag Seán bocht i gcoinne na n-imreoirí proifisiúnta sin. (diúltach) ", answer: "ní bheadh", hint1: "diúltach"},
  {question: "____ ___________sásta géilleadh murach an brú a cuireadh orthu. (siad, diúltach) ", answer: "ní bheidís", answer2: "ní bheadh siad", hint1: "diúltach"},
  {question: "___________ ar mhuin na muice dá dtitfeadh sé amach mar sin. (sinn, dearfach)", answer: "bheimís", hint1: "dearfach"},
  {question: "An dóigh leat ___ ___________ aon mhaitheas i gceann mar sin dúinne? (dearfach) ", answer: "go mbeadh", hint1: "dearfach"},
  {question: "Dúirt siad ____ ___________ lán sásta cabhrú linn. (siad, dearfach)", answer: "go mbeidís", answer2: "go mbeadh siad", hint1: "dearfach, sinn"},
  {question: "Dúramar ___ ___________ ábalta cabhrú leo níos mó. (sinn, dearfach)", answer: "nach mbeimís", answer2: "go mbeadh muid", hint1: "dearfach"},
  {question: "___ ___________aon chur ina choinne agatsa dá bhfanfainn seachtain eile anseo? (dearfach)", answer: "an mbeadh", hint1: "dearfach"},
];

var tabhairACQuestions = [
  {question: "___________ mé bronntanas deas do Niamh don Nollaig.", answer: "thug", hint1: "dearfach"},
  {question: "___________ sí amach dom mar bhí mé déanach.", answer: "thug", hint1: "dearfach"},
  {question: "___________ seans maith dó ach níor ghlac sé leis. (sinn)", answer: "thugamar", answer2: "thug muid", hint1: "dearfach, sinn"},
  {question: "___________ sí stracfhéachaint air ach ní raibh aon suim aici ann. ", answer: "thug", hint1: "dearfach"},
  {question: "___________ sé an leabhar ar iasacht dom. ", answer: "thug", hint1: "dearfach"},
  {question: "___________ aghaidh ar an Róimh ina dhiaidh sin. (sinn)", answer: "thugamar", answer2: "thug muid", hint1: "dearfach"},
  {question: "___________ sí íde na muc is na madraí dúinn. ", answer: "thug", hint1: "dearfach"},
  {question: "___________ tú an ceann sin dom cheana.", answer: "thug", hint1: "dearfach"},
  {question: "___________ bata is bother dóibh mar bhí an teach scriosta acu. (sinn)", answer: "thugamar", answer2: "thug muid", hint1: "dearfach"},
  {question: "___________ aire mhaith don mhadra a fhad is a bhí sé againn.", answer: "thugamar", answer2: "thug muid", hint1: "dearfach"},
];

var tabhairACNi = [
  {question: "____ ___________ sí aon eolas breise dúinn faoin eachtra.", answer: "níor thug", hint1: "diúltach"},
  {question: "____ ___________ aon aird ar an gclampar a bhí taobh thiar dínn. (sinn)", answer: "níor thugamar", answer2: "níor thug muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ mé faoi deara go raibh sé briste go dtí anois.", answer: "níor thug", hint1: "diúltach"},
  {question: "____ ___________ mé faoi deara ansin tú. ", answer: "níor thug", hint1: "diúltach"},
  {question: "____ ___________ siad aon chabhair dúinn lá an ghátair.", answer: "níor thug", hint1: "diúltach"},
  {question: "____ ___________ isteach don mbrú a cuireadh orainn. (sinn)", answer: "níor thugamar", answer2: "níor thug muid", hint1: "diúltach"},
  {question: "____ ___________ aon rud as an ngnách faoi deara an oíche sin. (sinn)", answer: "níor thugamar", answer2: "níor thug muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ sí aon litir dom go fóill ar aon nós.", answer: "níor thug", hint1: "diúltach"},
  {question: "____ ___________ siad aon seans dom an aiste a chríochnú.", answer: "níor thug", hint1: "diúltach"},
  {question: "____  ___________ siad aon bhreithmheas ar an obair ar fad a bhí déanta againn. ", answer: "níor thug", hint1: "diúltach"},
];

var tabhairACBriathorSaor = [
  {question: "___________ ard-mholadh dóibh as an taighde a rinne siad. (dearfach)", answer: "tugadh", hint1: "dearfach"},
  {question: "____ ___________ cluas le héisteacht dúinn ach b’shin a raibh ann. (dearfach)", answer: "tugadh", hint1: "dearfach"},
  {question: "___ ___________ aon fhianaise faoin eachtra os comhair na cúirte. (diúltach)", answer: "níor tugadh", hint1: "diúltach"},
  {question: "___ ___________ aon rud le fios domsa faoin scéal. (diúltach)", answer: "níor tugadh", hint1: "diúltach"},
  {question: "___________ íde na muc is na madraí dúinn ar fad. (dearfadh)", answer: "tugadh", hint1: "dearfach"},
  {question: "___________ beirt os comhair na cúirte mar gheall ar an eachtra . (dearfach)", answer: "tugadh", hint1: "dearfach"},
  {question: "____ ___________ aon suntas don scéal ag an am. (diúltach)", answer: "níor tugadh", hint1: "diúltach"},
  {question: "___________ dúinn ach an chluas bhodhar. (diúltach)", answer: "níor tugadh", hint1: "diúltach"},
  {question: "___________ gach cabhair agus cúnamh dóibh ach ba chuma leo. (dearfach)", answer: "tugadh", hint1: "dearfach"},
  {question: "____ ___________ fios fátha an scéil dúinn an chéad lá. (dearfach)", answer: "tugadh", hint1: "dearfach"},
];

var tabhairACCeisteach = [
  {question: "____ ___________ tú an leabhar ar ais do Mháire? (dearfach)", answer: "ar thug", hint1: "dearfach"},
  {question: "____ ___________ na torthaí amach inné? (briathar saor, diúltach)", answer: "nár tugadh", hint1: "diúltach"},
  {question: "____ ___________ tusa cabhair di leis an aiste a scríobh sí? (dearfach)", answer: "ar thug", hint1: "dearfach"},
  {question: "____ ___________ aon chabhair duit? (siad, dearfach)", answer: "ar thugadar", answer2: "ar thug siad", hint1: "dearfach"},
  {question: "____ ___________tú a dhóthain bia don madra sin ar maidin? (diúltach)", answer: "nár tugadh", hint1: "diúltach"},
  {question: "____ ___________  na bronntanais amach fós? (briathar saor, diúltach)", answer: "nár tugadh", hint1: "diúltach, briathar saor"},
  {question: "____ ___________ sibh cuairt ar an oileán riamh? (dearfach)", answer: "ar thug", hint1: "dearfach"},
  {question: "____ ___________ praghas ró-ard dó ar an gcarr sin? (sinn, diúltach)", answer: "ar thugamar", answer2: "ar thug muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ tú an t-airgead ar ais dó? (dearfach)", answer: "ar thug", hint1: "dearfach"},
  {question: "____ ___________ na Gardaí rabhadh dó sular thóg siad é? (diúltach)", answer: "ar thug", hint1: "diúltach"},
];

var tabhairACSpleach = [
  {question: "Dúirt sí ____ ___________ sí amach dá hiníon. (diúltach)", answer: "gur thug", hint1: "diúltach"},
  {question: "Mhaígh sé ____ ___________ aon rud le n-ithe dóibh an lá ar fad. (briathar saor, diúltach)", answer: "nár tugadh", hint1: "diúltach, briathar saor"},
  {question: "Bhí a fhios agam ____ ___________ ár ndóthain airde ar an deacracht sin. (sinn, diúltach)", answer: "nár thugamar", answer2: "nár thug muid", hint1: "diúltach"},
  {question: "Mhaígh siad ____ ___________ bia ceart dóibh i rith na seachtaine. (briathar saor, diúltach)", answer: "nár tugadh", hint1: "diúltach"},
  {question: "Ní fíor ____ ___________ aon droch-shampla dóibh. (briathar saor, dearfach)", answer: "gur thug", hint1: "dearfach"},
  {question: "Creidim ____ ___________ cothrom na féinne dóibh go léir. (briathar saor, dearfach)", answer: "gur thug", hint1: "dearfach"},
  {question: "An é ____ ___________ tú an rothar faoi deara? (diúltach)", answer: "nár thug", hint1: "diúltach"},
  {question: "Dúirt siad ____ ___________ aon chuireadh dóibh dul ann. (briathar saor, diúltach)", answer: "nár tugadh", hint1: "diúltach"},
  {question: "Dúramar ____ ___________an múinteoir aon obair bhaile dúinn. (diúltach)", answer: "nár thug", hint1: "diúltach"},
  {question: "Lig sé air ____ ___________fear an phoist an litir dó. (diúltach)", answer: "nár thug", hint1: "diúltach"},
];

var tabhairACCoibhneasta = [

];

var tabhairACExtraQuestions = [
  {questions: "___________ mé gach a raibh agam dóibh. (dearfach) ", answer: "thug", hint1: "dearfach"},
  {questions: "____ ___________ cuairt ar an áit sin cúpla uair. (sinn, dearfach) ", answer: "thugamar", answer2: "thug muid", hint1: "dearfach, sinn"},
  {questions: "____ ___________aon aird ar an madra a bhí ag tafann lasmuigh. (diúltach) ", answer: "níor thugamar", answer2: "níor thug muid", hint1: "diúltach"},
  {questions: "___________ mé cúpla iarracht air ach theip glan orm. (dearfach) ", answer: "thug", hint1: "dearfach"},
  {questions: "___________ gach seans dó ach níor éist sé le héinne. (briathar saor, dearfach)", answer: "tugadh", hint1: "dearfach"},
  {questions: "____ ___________tú an peann ar ais dom? (dearfach) ", answer: "ar thug", hint1: "dearfach"},
  {questions: "____ ___________ go leor seansanna dó cheana? (briathar saor, diúltach) ", answer: "nár tugadh", hint1: "diúltach"},
  {questions: "___ ___________ tú an leabhar ar ais don leabharlann fós? (diúltach) ", answer: "nár thug", hint1: "diúltach"},
  {questions: "Dúirt sí ____ ___________sí isteach don mbrú a cuireadh uirthi. (diúltach)", answer: "nár thug", hint1: "diúltach"},
  {questions: "____ ___________ aon rogha dó agus b’éigean dó é a dhéanamh. (sinn, diúltach)", answer: "níor thugamar", answer2: "níor thug muid", hint1: "diúltach"},
];

var tabhairALQuestions = [
  {question: "___________ bia do na héin i rith an gheimhridh. (mé) ", answer: "tugaim", answer2: "tugann mé", hint1: "dearfach, mé"},
  {question: "___________ sí togha na haire do na páistí óga. ", answer: "tugann", hint1: "dearfach"},
  {question: "___________ aghaidh ar an bhFleadh Cheoil gach bliain. (sinn)", answer: "tugaimid", answer2: "tugann muid", hint1: "dearfach, sinn"},
  {question: "___________ tusa aire mhaith duit féin i gcónaí. ", answer: "tugann", hint1: "dearfach"},
  {question: "___________ an ceol sin ardú croí dom gach uair a chloisim é. ", answer: "tugann", hint1: "dearfach"},
  {question: "___________ cuairt ar mo dheirfiúr sna Stáit Aontaighe ó am go chéile. (mé)", answer: "tugaim", answer2: "tugann mé", hint1: "dearfach, mé"},
  {question: "___________ sí gach rud faoi deara cé go bhfuil sí an-óg fós.", answer: "tugann", hint1: "dearfach"},
  {question: "___________ gach séisiúr a dhraíocht féin leis.", answer: "tugann", hint1: "dearfach"},
  {question: "___________ sí glasraí dúinn óna gairdín féin uaireanta.  ", answer: "tugann", hint1: "dearfach"},
  {question: "___________ cuairt ghearr ghairid ar an áit ó am go chéile. (sinn)", answer: "tugaimid", answer2: "tugann muid", hint1: "dearfach, sinn"},
];

var tabhairALNi = [
  {question: "____ ___________ sé aon aire dó féin. ", answer: "ní thugann", hint1: "diúltach"},
  {question: "____ ___________ milseáin do na páistí riamh. (mé)", answer: "ní thugaim", answer2: "ní thugann mé", hint1: "diúltach, mé"},
  {question: "____ ___________ amach do dhaoine toisc botún a bheith déanta acu. (sinn)", answer: "ní thugaimid", answer2: "ní thugann muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ sí a focal ach amháin nuair a bhíonn sí an-chinnte. ", answer: "ní thugann", hint1: "diúltach"},
  {question: "____ ___________ aon aird ar na daoine a bhíonn i gcónaí ag gearán. (sinn) ", answer: "ní thugaimid", answer2: "ní thugann muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ an chuach aon aire dá gearcaigh féin. ", answer: "ní thugann", hint1: "diúltach"},
  {question: "____ ___________ an múinteoir aon leid faoi na scrúduithe roimhré.", answer: "ní thugann", hint1: "diúltach"},
  {question: "____ ___________siad ach féar glas do na beithigh sa samhradh. ", answer: "ní thugann", hint1: "diúltach"},
  {question: "____ ___________ isteach do dhaoine drochbhéasacha riamh. (sinn)", answer: "ní thugaimid", answer2: "ní thugann muid", hint1: "diúltach"},
  {question: "____ ___________ an scéal sin aon sásamh intinne domsa.", answer: "ní thugann", hint1: "diúltach"},
];

var tabhairALBriatharSaor = [
  {question: "___________ duaiseanna amach sa scoil ag deireadh na bliana. (dearfach).", answer: "tugtar", hint1: "dearfach"},
  {question: "____ ___________ aon éisteacht do mhionlaigh sa tír sin. (diúltach)", answer: "ní thugtar", hint1: "diúltach"},
  {question: "_____ ___________ cothrom na féinne do na daltaí ar fad sa scoil. (dearfach)", answer: "tugtar", hint1: "dearfach"},
  {question: "_____ ___________’leibide’ ar dhuine nach bhfuil ciall ná réasún aige. (dearfach)", answer: "tugtar", hint1: "dearfach"},
  {question: "_____ ___________ an oiread sin teifeach isteach sa tír seo. (diúltach).", answer: "ní thugtar", hint1: "diúltach"},
  {question: "_____ ___________ aon ugach do scoláirí a bhíonn fiáin. (diúltach).", answer: "tugtar", hint1: "diúltach"},
  {question: "____ ___________ breith a mbéal féin do mhicléinn ollscoile go minic. (dearfach).", answer: "tugtar", hint1: "dearfach"},
  {question: "____ ___________ aon aird ar an luasteorainn ar an mbóthar contúirteach sin. (diúltach)", answer: "ní thugtar", hint1: "diúltach"},
  {question: "____ ___________scoláireacht don duine is fearr Gaeilge gach bliain. (dearfach).", answer: "tugtar", hint1: "dearfach"},
  {question: "____ ___________ na mílte daoine isteach go Sceilg Mhichíl gach bliain. (dearfach).", answer: "tugtar", hint1: "dearfach"},
];

var tabhairALCeisteach = [
  {question: "___________ tú aire mhaith don madra? (dearfach).", answer: "an dtugann", hint1: "dearfach"},
  {question: "____ ___________ sé misneach duit nuair a fhéachann tú air? (diúltach)", answer: "nach dtugann", hint1: "diúltach"},
  {question: "_____ ___________ tú bia don gcat fiáin sin gach lá? (dearfach)", answer: "an dtugann", hint1: "dearfach"},
  {question: "_____ ___________sibh cuairt ar an áit go minic? (dearfach)", answer: "an dtugann", hint1: "dearfach"},
  {question: "_____ ___________ an bhean sin isteach riamh? (dearfach).", answer: "an dtugann", hint1: "dearfach"},
  {question: "_____ ___________ tú an difríocht atá eatarthu faoi deara? (diúltach).", answer: "nach dtugann", hint1: "diúltach"},
  {question: "____ ___________ gach aon chabhair agus cúnamh dóibh? (briathar saor, diúltach).", answer: "nach dtugtar", hint1: "diúltach, briathar saor"},
  {question: "____ ___________ sibh aire mhaith dá chéile? (diúltach)", answer: "nach dtugann", hint1: "diúltach"},
  {question: "____ ___________cothrom na féinne do gach duine faoi láthair? (sinn, diúltach).", answer: "nach dtugaimid", answer2: "nach dtugann muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ i bhfad an iomarca saoirse do dhéagóirí óga na laethanta seo? (briathar saor, dearfach).", answer: "an dtugann", hint1: "dearfach, briathar saor"},
];

var tabhairALSpleach = [
  {question: "Deirtear ____ ___________ sí suas an-éasca. (dearfach)", answer: "go dtugann", hint1: "dearfach"},
  {question: "Deir sé ____ ___________ sé isteach don dream sin riamh. (diúltach)", answer: "nach dtugann", hint1: "diúltach"},
  {question: "Deir siad ____ ___________ siad an chluas bhodhar do dhaoine a bhíonn ag gearán de shíor. (dearfach)", answer: "go dtugann", hint1: "dearfach"},
  {question: "Glacaim leis ____ ___________ siad mórán trioblóide dúinn riamh. (diúltach)", answer: "nach dtugtar", hint1: ""},
  {question: "Cloisim ____ ___________ na torthaí amach go dtí ard-tráthnóna. (briathar saor, diúltach)", answer: "nach dtugann", hint1: "diúltach, briathar saor"},
  {question: "Deirtear liom ____ ___________ mil cosaint duint ar thinneas. (dearfach)", answer: "go dtugann", hint1: "dearfach"},
  {question: "Aithnítear ____ ___________ crios sábhála an-chosaint duit i gcás timpiste. (dearfach)", answer: "go dtugann", hint1: "dearfach"},
  {question: "Deir sí ____ ___________ aon aird ar bhotúin ghramadaí a fhad a bhíonn an téacs intuigthe. (briathar saor, diúltach)", answer: "nach dtugtar", hint1: "diúltach, briathar saor"},
  {question: "Tá a fhios agam ____ ___________ciall ar dhaoine áirithe riamh. (diúltach)", answer: "nach dtugann", hint1: "diúltach"},
  {question: "Tá sé intuigthe ____ ___________siad cabhair do dhaoine óga i gcónaí. (mé, diúltach)", answer: "go dtugann", hint1: "diúltach"},
];

var tabhairALCoibhneasta = [

];

var tabhairALExtraQuestions = [
  {question: "___________sé ardú croí dom é sin a chloisteáil. (dearfach) ", answer: "tugann", hint1: "dearfach"},
  {question: "___________ sé seo aon fhaoiseamh duit ón bpian? (dearfach).", answer: "an dtugann", hint1: "dearfach"},
  {question: "___ ___________ siadsan na difríochtaí beaga sin faoi deara. (diúltach) ", answer: "ní thugann", hint1: "diúltach"},
  {question: "____ ___________ an duine cróga suas ró-éasca? (diúltach)", answer: "ní thugann", hint1: ""},
  {question: "An é ____ ___________ tú aon aird ar na rudaí atá timpeall ort? (diúltach) ", answer: "nach dtugann", hint1: "diúltach"},
  {question: "_____ ___________ suas ar deireadh ar an duine nach bhfuil sásta cabhrú leis féin. (briathar saor, dearfach)", answer: "tugtar", hint1: "dearfach, briathar saor"},
  {question: "Deirtear ___________ drochíde do theifigh ar fud an domhain. (briathar saor, dearfach) ", answer: "go dtugtar", hint1: "dearfach, Briathar saor"},
  {question: "___ ___________ tú síob isteach dóibh go minic? (dearfach)", answer: "an dtugann", hint1: "dearfach"},
  {question: "___ ___________ sé an dara rogha dom go minic ach é a chaitheamh amach. (diúltach)", answer: "ní thugann", hint1: "diúltach"},
  {question: "Is minic _____ ___________ aon aitheantas don duine ciúin díograiseach. (briathar saor, diúltach) ", answer: "nach dtugtar", hint1: "diúltach, briathar saor"},
];

var tabhairAFQuestions = [
  {question: "___________ mé lámh chúnta duit níos déanaí. ", answer: "tabharfaidh", hint1: "dearfach"},
  {question: "___________ mé m’fhocal nach ndéanfaidh mé é sin arís.", answer: "tabharfaidh", hint1: "dearfach"},
  {question: "___________ mé seans amháin eile duit mar sin.", answer: "tabharfaidh", hint1: "dearfach"},
  {question: "___________ aghaidh ar Shligeach an chéad rud ar maidin. (sinn) ", answer: "tabharfaimid", answer2: "tabharfaidh muid", hint1: "dearfach, sinn"},
  {question: "___________ sé droim láimhe duine má théann tú chuige le scéal mar sin. ", answer: "tabharfaidh", hint1: "dearfach"},
  {question: "___________ ar ais duit é nuair a bheimid críochnaithe leis. (sinn)", answer: "tabharfaimid", answer2: "tabharfaidh muid", hint1: "dearfach, sinn"},
  {question: "___________ faoin gceist sin a luaithe is a bhíonn an ceann seo críochnaithe againn. (sinn)", answer: "tabharfaimid", answer2: "tabharfaidh muid", hint1: "dearfach, sinn"},
  {question: "___________ mé aire mhaith do do theach a fhad a bhíonn tú imithe.", answer: "tabharfaidh", hint1: "dearfach"},
  {question: "___________ an chéad duais don gceann seo. (sinn)", answer: "tabharfaimid", answer2: "tabharfaidh muid", hint1: "dearfach, sinn"},
  {question: "Níl a fhios agam ach ___________ mé buille faoi thuairim. ", answer: "tabharfaidh", hint1: "dearfach"},
];

var tabhairAFNi = [
  {question: " ____ ___________ mé aon rud dó ar iasacht go brách arís.", answer: "ní thabharfaidh", hint1: "diúltach"},
  {question: "____ ___________ tú faoi deara é muna mbíonn tú an-chúramach.", answer: "ní thabharfaidh", hint1: "diúltach"},
  {question: "____ ___________ aon fhreagra orthu sin go fóill. (sinn) ", answer: "ní thabharfaimid", answer2: "ní thabharfaidh muid", hint1: "diúltach"},
  {question: "____ ___________ siad faoin obair muna n-íoctar i dtosach iad.  ", answer: "ní thabharfaidh", hint1: "diúltach"},
  {question: "____ ___________ mé le rá é nach ndearna mé beart de réir mo bhriathair. ", answer: "ní thabharfaidh", hint1: "diúltach"},
  {question: "____ ___________ isteach dóibh sin más féidir linn. (sinn) ", answer: "ní thabharfaimid", answer2: "ní thabharfaidh muid", hint1: "diúltach"},
  {question: "____ ___________ pingin rua dó go dtí go mbíonn an obair críochnaithe i gceart aige. (sinn)", answer: "ní thabharfaimid", answer2: "ní thabharfaidh muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ sé é sin ar ais duit go brách. ", answer: "ní thabharfaidh", hint1: "diúltach"},
  {question: "____ ___________ mé aon rud eile dó le déanamh go fóill. ", answer: "ní thabharfaidh", hint1: "diúltach"},
  {question: "____ ___________ a oiread is seans amháin eile dóibh. (sinn)", answer: "ní thabharfaimid", answer2: "ní thabharfaidh muid", hint1: "diúltach"},
];

var tabhairAFBriathorSaor = [
  {question: "___________ ach seans amháile eile dó. (diúltach)", answer: "ní thabharfar", hint1: "diúltach"},
  {question: "____ ___________ aitheantas oifigiúil dó in am is i dtráth. (dearfach)", answer: "tabharfar", hint1: "dearfach"},
  {question: "___________ na duaiseanna amach tar éis lóin. (dearfach)", answer: "tabharfar", hint1: "dearfach"},
  {question: "_____ ___________ duit ach a laghad agus is féidir. (diúltach)", answer: "ní thabharfar", hint1: "diúltach"},
  {question: "___________ gach cúnamh don té atá foighneach. (dearfach)", answer: "tabharfar", hint1: "dearfach"},
  {question: "___________ tús áite do dhaoine a bhfuil ceol acu. (dearfach)", answer: "tabharfar", hint1: "dearfach"},
  {question: "____ ___________ an chéad duais don gcapall glas, ceapaim. (dearfach)", answer: "tabharfar", hint1: "dearfach"},
  {question: "Cailleadh mo mhálaí ag an aerfort ach ___________ abhaile iad níos déanaí. (dearfach)", answer: "tabharfar", hint1: "dearfach"},
  {question: "____ ___________ bricfeasta duit má fhanann tú sa leaba ródhéanach. (diúltach)", answer: "ní thabharfar", hint1: "diúltach"},
  {question: "_____ ___________ cead duit dul amach san oíche nuair a bheidh tú san arm. (diúltach)", answer: "ní thabharfar", hint1: "diúltach"},
];

var tabhairAFCeisteach = [
  {question: "___ ___________ tú faoi chéim mháistreachta ina dhiaidh seo? (dearfach)", answer: "an dtabharfaidh", hint1: "dearfach"},
  {question: "____ ___________ roinnt leabhar linn ar laethanta saoire? (sinn, dearfach)", answer: "an dtabharfaimid", answer2: "an dtabharfaidh muid", hint1: "dearfach, sinn"},
  {question: "____ ___________ tú suas ar an gceist sin go brách? (dearfach)", answer: "an dtabharfaidh", hint1: "dearfach"},
  {question: "____ ___________ do mháthair aire don madra duit? (diúltach)", answer: "nach dtabharfaidh", hint1: "diúltach"},
  {question: "____ ___________ amach duit muna mbíonn an obair déanta agat? (briathar saor, dearfach).", answer: "an dtabharfar", hint1: "dearfach, briathar saor"},
  {question: "____ ___________ an corn sin don luthchleasaí is fearr? (briathar saor, diúltach).", answer: "nach dtabharfar", hint1: "diúltach"},
  {question: "____ ___________ faoin obair an chéad rud maidin amárach? (sinn, dearfach).", answer: "an dtabharfaimid", answer2: "an dtabharfaidh muid", hint1: "dearfach"},
  {question: "____ ___________ isteach iad i gcomhair chupán tae? (sinn, dearfach)", answer: "an dtabharfaimid", answer2: "an dtabharfaidh muid", hint1: "dearfach"},
  {question: "____ ___________ tú aire mhaith do mo mhadra a fhad is atáim imithe? (diúltach).", answer: "nach dtabharfaidh", hint1: "diúltach"},
  {question: "____ ___________ tú mo mhála ar ais leat nuair a bheidh tú ag teacht abhaile? (diúltach).", answer: "nach dtabharfaidh", hint1: "diúltach"},
];

var tabhairAFSpleach = [
  {question: "Deir sí ____ ___________ sé aon aird ar na daoine sin níos mó. (diúltach)", answer: "nach dtabharfaidh", hint1: "diúltach"},
  {question: "Creidim ____ ___________ aitheantas speisialta di ag an searmanas. (briathar saor, dearfach)", answer: "go dtabharfar", hint1: "dearfach, briathar saor"},
  {question: "Deir sé ____ ___________ sé an dara rogha dóibh. (diúltach) ", answer: "nach dtabharfaidh", hint1: "diúltach"},
  {question: "Tá gach éinne á rá ____ ___________ bata is bóthar dó ag deireadh na seachtaine. (briathar saor, dearfach)", answer: "go dtabharfar", hint1: "dearfach"},
  {question: "Tá a fhios agam go maith ____ ___________ aon aird orm. (briathar saor, diúltach)", answer: "nach dtabharfar", hint1: "diúltach"},
  {question: "Bíonn sé ag rá  ____ ___________sé a chara abhaile in éineacht leis. (dearfach) ", answer: "go dtabharfaidh", hint1: "dearfach"},
  {question: "Ní dóigh liom ____ ___________aon éisteacht cheart dóibh. (briathar saor, dearfach)", answer: "go dtabharfar", hint1: "dearfach"},
  {question: "Tá mé cinnte ____ ___________ sí cathaoireacha breise isteach ón ngaráiste. (dearfach)", answer: "go dtabharfaidh", hint1: "dearfach"},
  {question: "Tá súil ag an bpobal ____ ___________ deontas breise dóibh chun an obair a chríochnú. (briathar saor, dearfach)", answer: "go dtabharfar", hint1: "dearfach"},
  {question: "Deir siad ____ ___________an dara rogha dúinn ach géilleadh. (briathar saor, diúltach)", answer: "nach dtabharfar", hint1: "diúltach"},
];

var tabhairAFCoibhneasta = [

];

var tabhairAFExtraQuestions = [
  {question: "___________ mé iasacht duit más maith leat. (dearfach)", answer: "tabharfaidh", hint1: "dearfach"},
  {question: "___________ seans amháin eile dóibh. (sinn, dearfach)", answer: "tabharfaimid", answer2: "tabharfaidh muid", hint1: "dearfach, sinn"},
  {question: "____ ___________ isteach ná ní ghéillfimid orlach dóibh. (sinn, diúltach)", answer: "ní thabharfaimid", answer2: "ní thabharfaidh muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ siadsan aon rud amach saor in aisce. (diúltach)", answer: "ní thabharfaidh", hint1: "diúltach"},
  {question: "____ ___________ duais speisialta dóibh ag deireadh na bliana. (briathar saor, dearfach)", answer: "tabharfar", hint1: "dearfach, briathar saor"},
  {question: "Tá súil agam ______ ___________ siad drochíde don bpáiste bocht. (diúltach) ", answer: "nach dtabharfaidh", hint1: "dearfach"},
  {question: "____ ___________ tú an leabhar ar ais dom a luaithe is a bhíonn tú críochnaithe leis? (diúltach)", answer: "nach dtabharfaidh", hint1: "dearfach"},
  {question: "Deir sí____ ___________ sí isteach agus go leanfaidh sí uirthi. (diúltach) ", answer: "nach dtabharfaidh", hint1: "dearfach"},
  {question: "____ ___________ tú rud éigin deas abhaile leat don dinnéar? (diúltach)", answer: "nach dtabharfaidh", hint1: "dearfach"},
  {question: "____ ___________ suas air go fóill. (sinn, diúltach)", answer: "ní thabharfaimid", answer2: "ní thabharfaidh muid", hint1: "dearfach"},
];

var tabhairMCQuestions = [
  {question: "___________ aon rud ach an leabhar sin a fháil ar ais. (mé) ", answer: "thabharfainn", answer2: "thabharfadh mé", hint1: "dearfach, mé"},
  {question: "___________ duit é dá mbeadh sé agam. (mé)", answer: "thabharfainn", answer2: "thabharfadh mé", hint1: "dearfach, mé"},
  {question: "___________ timpeall cead Euro ar cheann mar sin. (mé) ", answer: "thabharfainn", answer2: "thabharfadh mé", hint1: "dearfach"},
  {question: "___________ sí an carr duit ar iasacht murach an t-árachas. ", answer: "thabharfadh", hint1: "dearfach"},
  {question: "___________ caoga Euro air sin sna siopaí móra. (tú) ", answer: "thabharfá", answer2: "thabharfadh tú", hint1: "dearfach, tú"},
  {question: " ___________ aon rud dóibh dá dtabharfaidís an madra ar ais dúinn. (sinn) ", answer: "thabharfaimis", answer2: "thabharfadh muid", hint1: "dearfach, sinn"},
  {question: "___________ aire mhaith dó dá mbeadh sé againn. (sinn) ", answer: "thabharfaimis", answer2: "thabharfadh muid", hint1: "dearfach"},
  {question: "___________ faoi dá gceapfainn go raibh aon seans agam. (mé) ", answer: "thabharfainn", answer2: "thabharfadh mé", hint1: "dearfach"},
  {question: "___________ airgead maith dóibh dá mbeidís sásta an obair a dhéanamh i gceart. (sinn)", answer: "thabharfaimis", answer2: "thabharfadh muid", hint1: "dearfach"},
  {question: "___________ tinneas cinn duit dá mbeifeá ag éisteacht leo. (siad) ", answer: "thabharfaidís", answer2: "thabharfadh siad", hint1: "dearfach, siad"},
];

var tabhairMCNi = [
  {question: "____ ___________ aon rud le fios dó sin. (mé) ", answer: "ní thabharfainn", answer2: "ní thabharfadh mé", hint1: "diúltach, mé"},
  {question: "____ ___________ aon aird orthu. Caint san aer í sin. (mé)", answer: "ní thabharfainn", answer2: "ní thabharfadh mé", hint1: "diúltach, mé"},
  {question: "____ ___________ de shásamh dóibh é. (mé) ", answer: "ní thabharfainn", answer2: "ní thabharfadh mé", hint1: "diúltach"},
  {question: "____ ___________ Máire aon fhreagra ar mo cheist. ", answer: "ní thabharfadh", hint1: "diúltach"},
  {question: "____ ___________ aon aird orainn cé go rabhamar ag impí orthu gan é a dhéanamh. (siad)  ", answer: "ní thabharfaidís", answer2: "ní thabharfadh siad", hint1: "diúltach"},
  {question: "____ ___________ sé aon eolas breise seachas an méid a bhí sa ráiteas oifigiúil.", answer: "ní thabharfadh", hint1: "diúltach"},
  {question: "____ ___________ Mairéad leasainm mar sin ar éinne. ", answer: "ní thabharfadh", hint1: "diúltach"},
  {question: "____ ___________ obair dóibh sin mar gheall ar an droch-cháil atá orthu. (sinn) ", answer: "ní thabharfaims", answer2: "ní thabharfadh muid", hint1: "diúltach"},
  {question: "____ ___________ aon lacáiste dúinn ar an bpraghas sin. (siad)", answer: "ní thabharfaidís", answer2: "ní thabharfadh siad", hint1: "diúltach"},
  {question: "____ ___________ le rá é gur theip orthu ina gcuid iarrachtaí. (siad) ", answer: "ní thabharfaidís", answer2: "ní thabharfadh siad", hint1: "diúltach, siad"},
];

var tabhairMCBriatharSaor = [
  {question: "___________ bata is bóthar dóibh dá mbeidis trioblóideach mar sin. (dearfach) ", answer: "thabharfaí", hint1: "dearfach"},
  {question: "____ ___________ aitheantas d’obair ar an gcaighdeán sin dá mbeadh na gnáthmholtóirí ann i mbliana. (dearfach) ", answer: "thabharfaí", hint1: "dearfach"},
  {question: "___________ cead duit dul isteach in áit atá chomh dainséarach sin. (diúltach) ", answer: "ní thabharfaí", hint1: "diúltach"},
  {question: "____ ___________ aon aird air murach go raibh cuma scanraithe air. (diúltach)", answer: "ní thabharfaí", hint1: "diúltach"},
  {question: "____ ___________ cead isteach sa chlub di gan Gaeilge a bheith aici. (diúltach) ", answer: "ní thabharfaí", hint1: "diúltach"},
  {question: "____ ___________ an capall go dtí an ráschúrsa sin murach go mbeadh seans maith aige. (diúltach) ", answer: "ní thabharfaí", hint1: "diúltach"},
  {question: "___________ gach cabhair dóibh dá ndéanfaidís aon iarracht iad féin. (dearfach) ", answer: "thabharfaí", hint1: "dearfach"},
  {question: "___________ na báid isteach dá mbeadh aon bhaol stoirme ann. (dearfach) ", answer: "thabharfaí", hint1: "dearfach"},
  {question: "____ ___________ aon aird ar na botúin bheaga sin de ghnáth. (diúltach) ", answer: "ní thabharfaí", hint1: "diúltach"},
  {question: "___________ aon aird uirthi murach go raibh sí chomh mór sin trína chéile. (diúltach)", answer: "ní thabharfaí", hint1: "diúltach"},
];

var tabhairMCCeisteach = [
  {question: "___ ___________ dó é dá mbeadh sé á lorg? (tú, dearfach)", answer: "an dtabharfá", answer2: "an dtabharfadh tú", hint1: "dearfach, tú"},
  {question: "____ ___________ sé cabhair dúinn dá mbemis á lorg? (dearfach)", answer: "an dtabharfadh", hint1: "dearfach"},
  {question: "____ ___________ cead dúinn dá lorgóimis é go béasach? (briathar saor, dearfach)", answer: "an dtabharfaí", hint1: "dearfach, briathar saor"},
  {question: "____ ___________ sé isteach dá gcuirfí ina luí air go raibh sé mícheart? (dearfach).", answer: "an dtabharfadh", hint1: "dearfach"},
  {question: "____ ___________  sí misneach duit dá mbeifeá in isle brí? (diúltach).", answer: "nach dtabharfadh", hint1: "diúltach"},
  {question: "____ ___________  duit é dá mbeadh sé acu? (siad, diúltach)", answer: "an dtabharfaidis", answer2: "an dtabharfadh siad", hint1: "diúltach, siad"},
  {question: "____ ___________ faoi deara é dá mbeadh sé fágtha ar an mbord? (tú, diúltach).", answer: "an dtabharfá", answer2: "an dtabharfadh tú", hint1: "diúltach"},
  {question: "____ ___________ isteach ar an oileán iad dá mbeadh aon spéis acu dul ann? (briathar saor, diúltach)", answer: "nach dtabharfaí", hint1: "diúltach, briathar saor"},
  {question: "____ ___________ sé uaidh é dá rachaimis chuige? (dearfach).", answer: "an dtabharfadh", hint1: "dearfach"},
  {question: "____ ___________ éisteacht dóibh dá ndéanfaidís a gcás i gceart? (briathar saor, dearfach).", answer: "an dtabharfaí", hint1: "dearfach"},
];

var tabhairMCSpleach = [
  {question: "Gheall siad ____ ___________ dúinn é. (siad, dearfach) ", answer: "go dtabharfaidís", answer2: "go dtabharfadh siad", hint1: "dearfach"},
  {question: "Tugadh le fios  ____ ___________ deontas dúinn chun an obair a chríochnú. (briathar saor, diúltach)", answer: "nach dtabharfaí", hint1: "diúltach"},
  {question: "Bhí a fhios agam ____ ___________ sí dom é. (diúltach)  ", answer: "nach dtabharfadh", hint1: "diúltach"},
  {question: "Dúirt siad ____ ___________ aire mhaith dó. (siad, dearfach) ", answer: "go dtabharfaidís", answer2: "go dtabharfadh siad", hint1: "dearfach"},
  {question: "Bhí a fhios agam ____ ___________seans eile dó. (briathar saor, dearfach)", answer: "go dtabharfaí", hint1: "dearfach, briathar saor"},
  {question: "Mhaígh siad ____ ___________ suas ar ór ná ar airgead. (siad, diúltach)", answer: "nach dtabharfaidís", answer2: "nach dtabharfadh siad", hint1: "diúltach"},
  {question: "Bhí sé soiléir ____ ___________ mo dhuine isteach luath nó mall. (dearfach) ", answer: "go dtabharfadh", hint1: "dearfach"},
  {question: "Dúramar ____ ___________ ceann eile dóibh ina dhiaidh sin. (sinn, dearfach)", answer: "go dtabharfaimis", answer2: "go dtabharfadh muid", hint1: "dearfach"},
  {question: "Tá seans maith ann ___ ___________ duit é dá rachfá á lorg. (siad, dearfach)", answer: "go dtabharfaidís", answer2: "go dtabharfadh siad", hint1: "dearfach"},
  {question: "Ní raibh aon seans ann ___ ___________sé isteach ar an gceann sin. (dearfach)", answer: "go dtabharfadh", hint1: "dearfach"},
];

var tabhairMCExtraQuestions = [
  {question: "___________ aon rud ach an leabhar sin a fháil ar ais. (mé, dearfach) ", answer: "thabharfainn", answer2: "thabharfadh mé", hint1: "dearfach, mé"},
  {question: "____ ___________ faoi dá mbeadh aon duine eile á dhéanamh. (mé, dearfach) ", answer: "thabharfainn", answer2: "thabharfadh mé", hint1: "dearfach, mé"},
  {question: "____ ___________ sé aon rud duit dá mbeadh sé aige.  (dearfach) ", answer: "thabharfadh", hint1: "dearfach"},
  {question: "____ ___________ sí an seod sin uaithi ar ór na cruinne. (diúltach) ", answer: "ní thabharfadh", hint1: "diúltach"},
  {question: "____ ___________ar ais dom é. (siad, diúltach) ", answer: "ní thabharfaidís", answer2: "ní thabharfadh siad", hint1: "diúltach"},
  {question: "Dúirt sé ____ ___________ sé dom é ach níor thug. (dearfach)", answer: "go dtabharfadh", hint1: "dearfach"},
  {question: "Cheapas ___ ___________ sé sin ábhar misnigh dó ach bhí dul amú orm. (dearfach) ", answer: "go dtabharfadh", hint1: "dearfach"},
  {question: "____ ___________ sí seans dom é a dhéanamh. (diúltach)", answer: "ní thabharfadh", hint1: "diúltach"},
  {question: "Bhí a fhios agam ___ ___________ freagra díreach orainn. (siad, diúltach)", answer: "nach dtabharfaidís", answer2: "nach dtabharfadh siad", hint1: "dearfach"},
  {question: "___ ___________faoi dá mbeinn féin sásta cabhrú leat? (tú, dearfach)", answer: "an dtabharfá", answer2: "an dtabharfadh siad", hint1: "dearfach, tú"},
];

var teighACQuestions = [
  {question: "___________ sí go dtí an siopa chun arán a cheannach.", answer: "chuaigh", hint1: "dearfach"},
  {question: "___________ an t-am thart go tapaidh.", answer: "chuaigh", hint1: "dearfach"},
  {question: "___________ i mbun staidéir ar an gceist láithreach. (sinn)", answer: "chuamar", answer2: "chuaigh muid", hint1: "dearfach"},
  {question: "___________ an bád go tóin poill sa stoirm. ", answer: "chuaigh", hint1: "dearfach"},
  {question: "___________ siad go dtí an phictiúrlann aréir. ", answer: "chuaigh", hint1: "dearfach"},
  {question: "___________ siad i mbun oibre láithreach.", answer: "chuaigh", hint1: "dearfach"},
  {question: "___________ go dtí an Spáinn ar ár laethanta saoire. (sinn)", answer: "chuamar", answer2: "chuaigh muid", hint1: "dearfach"},
  {question: "___________ an chaint sin i bhfeidhm orm go mór.", answer: "chuaigh", hint1: "dearfach"},
  {question: "D’éistíomar leis ach ___________ ina choinne sa deireadh. (sinn)", answer: "chuamar", answer2: "chuaigh muid", hint1: "dearfach"},
  {question: "Bhí mé beagnach ann ach ___________ réiteach na faidhbe sa bhfraoch orm. ", answer: "chuaigh", hint1: "dearfach"},
];

var teighACNi = [
  {question: "____ ___________ aon rud ar strae orm fós, ach go háirithe.", answer: "ní dheachaigh", hint1: "diúltach"},
  {question: "____ ___________ fear an phoist thar an doras fós.", answer: "ní dheachaigh", hint1: "diúltach"},
  {question: "____ ___________ amach in aon chor aréir. D’fhanamar sa bhaile. (sinn)", answer: "ní dheachamar", answer2: "ní dheachaigh muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ siad in aon áit. D’fhan siad anseo. ", answer: "ní dheachaigh", hint1: "diúltach"},
  {question: "____ ___________ sí thar lear go dtí go raibh sí anonn go maith sna blianta.", answer: "ní dheachaigh", hint1: "diúltach"},
  {question: "____ ___________ rófhada ar strae, ach ní bhfuaireamar an áit. (sinn)", answer: "ní dheachamar", answer2: "ní dheachaigh muid", hint1: "diúltach"},
  {question: "____ ___________ mé isteach go dtí go raibh sé ródhéanach.", answer: "ní dheachaigh", hint1: "diúltach"},
  {question: "____ ___________ an scéal sin i bhfeidhm uirthi go rómhaith.", answer: "ní dheachaigh", hint1: "diúltach"},
  {question: "____ ___________ siad thar fóir leis an scéal riamh.", answer: "ní dheachaigh", hint1: "diúltach"},
  {question: "____  ___________ chomh fada le Port Láirge ina dhiaidh sin agus uile. (sinn)", answer: "ní dheachamar", answer2: "ní dheachaigh muid", hint1: "diúltach, sinn"},
];

var teighACBriathorSaor = [
];

var teighACCeisteach = [
  {question: "____ ___________ tú abhaile díreach aréir? (dearfach)", answer: "an ndeachaigh", hint1: "dearfach"},
  {question: "____ ___________ tú ar ais go Luimneach ó shin? (dearfach)", answer: "an ndeachaigh", hint1: "dearfach"},
  {question: "____ ___________ sibh ag snámh sa linn nua fós? (dearfach)", answer: "an ndeachaigh", hint1: "dearfach"},
  {question: "____ ___________ ar strae nó cad a tharla dúinn? (sinn, dearfach)", answer: "an ndeachamar", answer2: "an ndeachaigh muid", hint1: "dearfach, sinn"},
  {question: "____ ___________ sibh in aon áit dheas don samhradh? (dearfach)", answer: "an ndeachaigh", hint1: "dearfach"},
  {question: "____ ___________  abhaile luath aréir? (sinn, diúltach)", answer: "nach ndeachamar", answer2: "nach ndeachaigh muid", hint1: "diúltach"},
  {question: "____ ___________ tusa go Nua Eabhrac nuair a bhí tú sa chéad bhliain? (diúltach)", answer: "nach ndeachaigh", hint1: "diúltach"},
  {question: "____ ___________ an bheirt eile abhaile leatsa aréir? (diúltach)", answer: "nach ndeachaigh", hint1: "diúltach"},
  {question: "____ ___________ an tseachtain sin thart go han-tapaidh? (diúltach)", answer: "nach ndeachaigh", hint1: "diúltach"},
  {question: "____ ___________ tú ann leat féin? (dearfach)", answer: "an ndeachaigh", hint1: "dearfach"},
];

var teighACSpleach = [
  {question: "An bhfuil tú cinnte ____ ___________ sí isteach ann? (diúltach)", answer: "nach ndeachaigh", hint1: "diúltach"},
  {question: "Tá a fhios agam go maith ____ ___________ tú ann. (dearfach)", answer: "go ndeachaigh", hint1: "dearfach"},
  {question: "Bhí mé cinnte ____ ___________ sé abhaile leis an gcuid eile. (dearfach)", answer: "go ndeachaigh", hint1: "dearfach"},
  {question: "Ceapaim ____ ___________ sí go dtí an dochtúir tráthnóna inné. (dearfach)", answer: "go ndeachaigh", hint1: "dearfach"},
  {question: "Chuala mé ____ ___________ an cóisir go maith duit ag an deireadh seachtaine. (dearfach)", answer: "go ndeachaigh", hint1: "dearfach"},
  {question: "Deirtear liom ____ ___________ an scéal i bhfeidhm go mór ar an lucht éisteachta. (dearfach)", answer: "go ndeachaigh", hint1: "dearfach"},
  {question: "An bhfuil a fhios agat ____ ___________ gar do lár na cathrach, fiú? (sinn, diúltach)", answer: "nach ndeachamar", answer2: "nach ndeachaigh muid", hint1: "diúltach, sinn"},
  {question: "Tá súil agam ____ ___________ aon rud ar strae uirthi. (diúltach)", answer: "nach ndeachaigh", hint1: "diúltach"},
  {question: "Tá a fhios ag gach éinne ____ ___________seisean ar aghaidh chun a chéim a chríochnú. (diúltach)", answer: "nach ndeachaigh", hint1: "diúltach"},
  {question: "Dúradh liom ____ ___________sí faoi scian san ospidéal inné. (dearfach)", answer: "go ndeachaigh", hint1: "diúltach"},
];

var teighACCoibhneasta = [
];

var teighACExtraQuestions = [
  {question: "___________ mé isteach agus dhún mé an doras. (dearfach) ", answer: "chuaigh", hint1: "dearfach"},
  {question: "____ ___________ ar fad abhaile i dteannta a chéile. (dearfach) ", answer: "chuaigh", answer2: "chuaigh muid", hint1: "dearfach"},
  {question: "____ ___________sí sin ar aon chúrsa Gaeltachta. (diúltach) ", answer: "ní dheachaigh", hint1: "diúltach"},
  {question: "____ ___________ abhaile go dtí go raibh sé an-déanach san oíche. (sinn, diúltach) ", answer: "ní dheachamar", answer2: "ní dheachaigh muid", hint1: "diúltach"},
  {question: "____ ___________ tú go dtí an cluich Dé Domhnaigh? (dearfach)", answer: "an ndeachaigh", hint1: "dearfach"},
  {question: "Cloisim ____ ___________ an rang ar fad amach le chéile ag deireadh na scrúduithe. (dearfach) ", answer: "go ndeachaigh", hint1: "dearfach"},
  {question: "Chuala mé ____ ___________ na páipéir ar fad ar strae ar na Gardaí. (dearfach) ", answer: "go ndeachaigh", hint1: ""},
  {question: "Cá ___________ tú aréir? ", answer: "ndeachaigh", hint1: ""},
  {question: "Tá súil agam ____ ___________siad thar fóir leis an bpleidhcíocht. (diúltach)", answer: "nach ndeachaigh", hint1: "diúltach"},
  {question: "Dúirt sí ____ ___________ sí ann in aon chor. (diúltach)", answer: "nach ndeachaigh", hint1: "diúltach"},
];

var teighALQuestions = [
  {question: "___________ sí abhaile gach deireadh seachtaine. ", answer: "téann", hint1: "dearfach"},
  {question: "___________ sé sa tseans go rómhinic. ", answer: "téann", hint1: "dearfach"},
  {question: "___________ siad timpeall na tíre ag bailiú amhrán ó sheandaoine.", answer: "téann", hint1: "dearfach"},
  {question: "___________ ar cuairt chuici anois is arís. (mé)", answer: "téim", answer2: "téann mé", hint1: "dearfach, mé"},
  {question: "___________ amach le chéile cúpla uair sa bhliain. (sinn)", answer: "téimid", answer2: "téann muid", hint1: "dearfach, sinn"},
  {question: "___________ ag siopadóireacht gach maidin Dé Sathairn. (mé)", answer: "téim", answer2: "téann mé", hint1: "dearfach, mé"},
  {question: "___________ daoine i dtaithí air tar éis tamaill.", answer: "téann", hint1: "dearfach"},
  {question: "___________ scéalta amach fúithi ó am go chéile.", answer: "téann", hint1: "dearfach"},
  {question: "___________ sé dian orm é a admháil ach tá sé fíor.  ", answer: "téann", hint1: "dearfach"},
  {question: "___________ sí i mbun a cuid oibre le stuaim.", answer: "téann", hint1: "dearfach"},
];

var teighALNi = [
  {question: "____ ___________ daoine isteach ar an oileán sin ach amháin sa samhradh. ", answer: "ní théann", hint1: "diúltach"},
  {question: "____ ___________ thar lear ach uair sa bhliain. (sinn)", answer: "ní théimid", answer2: "ní théann muid", hint1: "diúltach"},
  {question: "____ ___________ mórán daoine isteach san óstán sin. ", answer: "ní théann", hint1: "diúltach"},
  {question: "____ ___________ sí a chodladh go dtí uair an mheán oíche. ", answer: "ní théann", hint1: "diúltach"},
  {question: "____ ___________ an bád amach ach tí lá sa tseachtain. ", answer: "ní théann", hint1: "diúltach"},
  {question: "____ ___________ thar fóir leis an magadh  nuair a bhíonn seisean i láthair. (sinn)", answer: "ní théimid", answer2: "ní théann muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ na páistí amach ag súgradh ar an mbóthar níos mó.", answer: "ní théann", hint1: "diúltach"},
  {question: "____ ___________ sí i bhfeidhm ar dhaoine níos mó. ", answer: "ní théann", hint1: "diúltach"},
  {question: "____ ___________ ar laethanta saoire go rómhinic níos mó. (sinn)", answer: "ní théimid", answer2: "ní théann muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ focal cineálta ar strae riamh.", answer: "ní théann", hint1: "diúltach"},
];

var teighALBriatharSaor = [
];

var teighALCeisteach = [
  {question: "___________ tú go dtí do chuid léachtaí go rialta? (diúltach).", answer: "nach dtéann", hint1: "diúltach"},
  {question: "____ ___________ ar an turas céanna sin go rómhinic? (sinn, diúltach)", answer: "nach dtéimid", answer2: "nach dtéann muid", hint1: "diúltach, sinn"},
  {question: "_____ ___________ tú ar ais go Corcaigh riamh? (dearfach)", answer: "an dtéann", hint1: "dearfach"},
  {question: "_____ ___________seisean fiáin aon uair a mbíonn deoch aige? (diúltach)", answer: "nach dtéann", hint1: "diúltach"},
  {question: "_____ ___________ tú go dtí an ionad siopadóireachta sin riamh? (dearfach).", answer: "an dtéann", hint1: "dearfach"},
  {question: "_____ ___________ tú isteach ansin i gcomhair lóin riamh? (dearfach).", answer: "an dtéann", hint1: "dearfach"},
  {question: "____ ___________ go dtí an Fleadh Cheoil gach bliain? (sinn, diúltach).", answer: "nach dtéimid", answer2: "nach dtéann muid", hint1: "diúltach"},
  {question: "____ ___________ tusa go dtí an amharclann go rialta? (dearfach)", answer: "an dtéann", hint1: "dearfach"},
  {question: "____ ___________bád farantóireachta ó Chorcaigh go Santander dhá lá sa tseachtain? (diúltach).", answer: "nach dtéann", hint1: "diúltach"},
  {question: "____ ___________ siad ar ais go dtí an áit chéanna gach bliain? (dearfach).", answer: "an dtéann", hint1: "dearfach"},
];

var teighALSpleach = [
  {question: "Deirtear liom ____ ___________ siad go dtí an Meánoirthear go rialta. (dearfach)", answer: "go dtéann", hint1: "dearfach"},
  {question: "An fíor ____ ___________ sí amach ag siúl i lár na hoíche? (dearfach)", answer: "go dtéann", hint1: "dearfach"},
  {question: "Deirtear ____ ___________ airgead amú ón siopa go rialta. (dearfach)", answer: "go dtéann", hint1: "dearfach"},
  {question: "Ní dóigh liomsa ____ ___________ an scaif sin leis an gcóta beag ná mór. (dearfach)", answer: "go dtéann", hint1: "dearfach"},
  {question: "An bhfuil a fhios agat ____ ___________ go dtí an trá ach go hannamh. (sinn, diúltach)", answer: "nach dtéimid", answer2: "nach dtéann muid", hint1: "diúltach, sinn"},
  {question: "Tá a fhios agam ____ ___________ sí ar an mbus níos mó. (diúltach)", answer: "nach dtéann", hint1: "diúltach"},
  {question: "Cloisim ____ ___________ siad ag siúl go luath gach maidin. (dearfach)", answer: "go dtéann", hint1: "dearfach"},
  {question: "Ní dóigh liom ____ ___________ siad amach ag iascaireacht níos mó. (dearfach)", answer: "go dtéann", hint1: "dearfach"},
  {question: "Nach bhfeiceann tú ____ ___________an dá rud sin le chéile? (diúltach)", answer: "nach dtéann", hint1: "diúltach"},
  {question: "Tá mé á rá leat ____ ___________ag argóint leis sin níos mó. (mé, diúltach)", answer: "nach dtéim", answer2: "nach dtéann mé", hint1: "diúltach, mé"},
];

var teighALCoibhneasta = [

];

var teighALExtraQuestions = [
  {question: "___________ag siopadóireacht gach maidin Dé Sathairn. (sinn, dearfach) ", answer: "téimid", answer2: "téann muid", hint1: "dearfach, sinn"},
  {question: "___________ go dtí na rásaí capall chomh minic agus is féidir liom. (mé, dearfach).", answer: "téim", answer2: "téann mé", hint1: "dearfach, mé"},
  {question: "___ ___________ ann ach anois is arís. (mé, diúltach) ", answer: "ní théim", answer2: "ní théann mé", hint1: "diúltach, mé"},
  {question: "____ ___________ tú go dtí na ranganna sin maidin Dé Sathairn níos mó? (dearfach)", answer: "an dtéann", hint1: "dearfach"},
  {question: "Cloisim ____ ___________ sí as a meabhair má chuirtear an cheist sin uirthi. (dearfach) ", answer: "go dtéann", hint1: "dearfach"},
  {question: "Deir siad _____ ___________ siad ag seoltóireacht gach deireadh seachtaine. (dearfach)", answer: "go dtéann", hint1: "dearfach"},
  {question: "___________ sibh thar lear i gcomhair laethanta saoire gach bliain? (dearfach) ", answer: "an dtéann", hint1: "dearfach"},
  {question: "___________ go dtí an club sin níos mó. (sinn, diúltach)", answer: "ní théimid", answer2: "ní théann muid", hint1: "diúltach, sinn"},
  {question: "___________ tú ann níos mó? (dearfach)", answer: "an dtéann", hint1: "dearfach"},
  {question: "Tá a fhios agam _____ ___________ sé dian uirthi é a admháil. (dearfach) ", answer: "go dtéann", hint1: "dearfach"},
];

var teighAFQuestions = [
  {question: "___________ amach níos déanaí. (sinn)", answer: "rachaimid", answer2: "rachaidh muid", hint1: "dearfach"},
  {question: "___________ mé in éineacht leat.", answer: "rachaidh", hint1: "dearfach"},
  {question: "___________ an madra ar strae muna gcoimeádann tú súil ghéar air.", answer: "rachaidh", hint1: "dearfach"},
  {question: "Is in olcas a ___________ an scéal muna stopann siad anois. ", answer: "rachaidh", hint1: "dearfach"},
  {question: "___________ ag snámh ina dhiaidh seo. (sinn) ", answer: "rachaimid", answer2: "rachaidh muid", hint1: "dearfach"},
  {question: "___________ tú i dtaithí air de réir a chéile.", answer: "rachaidh", hint1: "dearfach"},
  {question: "___________ na ba isteach thar an gclaí seo.", answer: "rachaidh", hint1: "dearfach"},
  {question: "___________ isteach níos déanaí. (sinn)", answer: "rachaimid", answer2: "rachaidh muid", hint1: "dearfach"},
  {question: "___________ sa tóir air láithreach. (sinn)", answer: "rachaimid", answer2: "rachaidh muid", hint1: "dearfach"},
  {question: "___________ tú ar strae ansin muna mbíonn tú an-aireach.", answer: "rachaidh", hint1: "dearfach"},
];

var teighAFNi = [
  {question: "Ná bí buartha, ____ ___________ aon rud amú ort.", answer: "ní rachaidh", hint1: "diúltach"},
  {question: "____ ___________ sé siúd níos faide leis an scéal.", answer: "ní rachaidh", hint1: "diúltach"},
  {question: "____ ___________ an scéal amach má choimeádann tusa do bhéal dúnta. ", answer: "ní rachaidh", hint1: "diúltach"},
  {question: "____ ___________ ann go dtí go mbeimid críochnaithe anseo. (sinn) ", answer: "ní rachaimid", answer2: "ní rachaidh muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ isteach sa phluais sin. Tá sí ródhainséarach. (sinn) ", answer: "ní rachaimid", answer2: "ní rachaidh muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ ar aghaidh níos faide go dtí go mbeidh gach duine anseo. (sinn) ", answer: "ní rachaimid", answer2: "ní rachaidh muid", hint1: "diúltach"},
  {question: "____ ___________ sé i bhfad má fhanann sé leis an bplean sin.", answer: "ní rachaidh", hint1: "diúltach"},
  {question: "____ ___________ mise ansin arís go brách na breithe. ", answer: "ní rachaidh", hint1: "diúltach"},
  {question: "____ ___________ sí siúd rófhada amú, táim cinnte. ", answer: "ní rachaidh", hint1: "diúltach"},
  {question: "Táim ar mo sháimhín só anseo agus ____ ___________ mé amach arís go maidin. ", answer: "ní rachaidh", hint1: "diúltach"},
];

var teighAFBriathorSaor = [

];

var teighAFCeisteach = [
  {question: "___ ___________ tú ar ais ann arís an bhliain seo chugainn? (dearfach)", answer: "an rachaidh", hint1: "dearfach"},
  {question: "____ ___________ éinne eile in éineacht leat? (dearfach)", answer: "an rachaidh", hint1: "dearfach"},
  {question: "____ ___________ siad ar strae ansin, an dóigh leat? (dearfach)", answer: "an rachaidh", hint1: "dearfach"},
  {question: "____ ___________ an bád sin i bhfad amach sula gcasfaidh sí ar ais? (dearfach)", answer: "an rachaidh", hint1: "dearfach"},
  {question: "____ ___________ ann uair amháin eile? (sinn, dearfach).", answer: "an rachaimid", answer2: "an rachaidh muid", hint1: "dearfach, sinn"},
  {question: "____ ___________ tusa isteach im’ áitse? (dearfach).", answer: "an rachaidh", hint1: "dearfach"},
  {question: "____ ___________ mórán den airgead a bailíodh chun sochair do dhaoine gan dídean? (dearfach).", answer: "an rachaidh", hint1: "dearfach"},
  {question: "____ ___________ ar fad ann le chéile? (dearfach)", answer: "an rachaimid", answer2: "an rachaidh muid", hint1: "dearfach"},
  {question: "____ ___________ an madra sin ar mire má ligeann tú amach é? (diúltach).", answer: "nach rachaidh", hint1: "diúltach"},
  {question: "____ ___________ siad ar strae má leanann siad orthu suas an cosán sin? (diúltach).", answer: "nach rachaidh", hint1: "diúltach"},
];

var teighAFSpleach = [
  {question: "Tá súil agam ____ ___________ siad timpeall an oileáin ar fad. (dearfach)", answer: "go rachaidh", hint1: "dearfach"},
  {question: "Ní dóigh liom ____ ___________ an bus gar don staid ina mbeidh an cluiche ar siúl. (dearfach)", answer: "go rachaidh", hint1: "dearfach"},
  {question: "Tá a fhios agam ____ ___________ sí as a meabhair má chloiseann sí é sin. (dearfach) ", answer: "go rachaidh", hint1: "dearfach"},
  {question: "Tá súil agam ____ ___________ an scéal níos faide ná seo anois. (diúltach)", answer: "go rachaidh", hint1: "diúltach"},
  {question: "Táim den tuairim ____ ___________ sí ar saoire ag deireadh na míosa. (dearfach)", answer: "go rachaidh", hint1: "dearfach"},
  {question: "Tá súil agam  ____ ___________na ba isteach ar an líne traenach. (diúltach) ", answer: "nach rachaidh", hint1: "diúltach"},
  {question: "Tá súil le Dia agam ____ ___________gach rud go maith dóibh. (dearfach)", answer: "go rachaidh", hint1: "dearfach"},
  {question: "Deir siad ____ ___________ siad ann ach níl a fhios agam fúthu. (dearfach)", answer: "nach rachaidh", hint1: "dearfach"},
  {question: "Tá a fhios agam go maith ____ ___________ siad in aon ghiorracht den áit. (diúltach)", answer: "nach rachaidh", hint1: "diúltach"},
  {question: "Tá a fhios agam ____ ___________siad isteach luath nó mall. (dearfach)", answer: "go rachaidh", hint1: "dearfach"},
];

var teighAFCoibhneasta = [

];

var teighAFExtraQuestions = [
  {question: "___________ mé in éineacht leat níos déanaí. (dearfach)", answer: "rachaidh", hint1: "dearfach"},
  {question: "___________ ar ais an bealach céanna a thángamar. (sinn, dearfach)", answer: "rachaimid", answer2: "rachaidh muid", hint1: "dearfach, sinn"},
  {question: "____ ___________ an bus seo caol díreach isteach i lár na cathrach. (dearfach)", answer: "rachaidh", hint1: "dearfach"},
  {question: "____ ___________ ar ais ansin go deo arís. (sinn, diúltach)", answer: "ní rachaimid", answer2: "ní rachaidh muid", hint1: "diúltach, sinn"},
  {question: "____ ___________ abhaile go dtí níos déanaí? (sinn, diúltach) ", answer: "ní rachaimid", answer2: "ní rachaidh muid", hint1: "diúltach"},
  {question: "______ ___________ mé thar do dhoras gan bualadh isteach chugat. (diúltach) ", answer: "ní rachaidh", hint1: "diúltach"},
  {question: "____ ___________ tú ar saoire eile roimh dheireadh na bliana? (dearfach)", answer: "an rachaidh", hint1: "dearfach"},
  {question: "____ ___________ tú go dtí an amharclann oíche amárach? (dearfach) ", answer: "an rachaidh", hint1: "dearfach"},
  {question: "Tá súil agam ____ ___________ an cat isteach tríd an bhfuinneog. (diúltach)", answer: "nach rachaidh", hint1: "diúltach"},
  {question: "Glacaim leis ____ ___________ tú ar ais i mbun oibre arís go luath. (dearfach)", answer: "go rachaidh", hint1: "dearfach"},
];

var teighMCQuestions = [
  {question: "___________ in éineacht leat dá mbeadh an t-am agam. (mé) ", answer: "rachainn", hint1: "dearfach, mé"},
  {question: "___________ sise ann dá mbeadh an t-airgead aici.", answer: "rachadh", hint1: "dearfach"},
  {question: "___________ go dtí an cluiche dá mbeadh mórán spéise acu sa pheil. (siad) ", answer: "rachaidís", answer2: "rachadh siad", hint1: "dearfach, siad"},
  {question: "___________ in aon áit chun bualadh leo sin arís. (mé)  ", answer: "rachainn", hint1: "dearfach, mé"},
  {question: "___________ go dtí an trá dá mbeadh an aimsir níos fearr. (mé) ", answer: "rachainn", hint1: "dearfach, mé"},
  {question: " ___________ sí go hifreann agus ar ais chun an páiste a shábháil. ", answer: "rachadh", hint1: "dearfach"},
  {question: "___________ sibh ann dá mbeadh Baile Átha Cliath ag imirt. ", answer: "rachadh", hint1: "dearfach"},
  {question: "___________ go Corcaigh dá mbeadh suíochán ar fáil ar an traein. (mé) ", answer: "rachainn", hint1: "dearfach"},
  {question: "___________ i bhfad níos mó daoine go dtí an fhéile dá mbeadh a fhios acu fúithi.", answer: "rachadh", hint1: "dearfach"},
  {question: "___________ an madra amach thar gheata mar sin. ", answer: "rachadh", hint1: "dearfach"},
];

var teighMCNi = [
  {questions: "____ ___________ trasna an bhóthair leis. (mé) ", answer: "ní rachainn", hint1: "diúltach, mé"},
  {questions: "____ ___________ go dtí an Astráil sa samhradh mar bíonn an aimsir róthe. (mé)", answer: "ní rachainn", hint1: "diúltach, mé"},
  {questions: "____ ___________ Máire in aon áit gan Diarmaid.", answer: "ní rachadh", hint1: "diúltach"},
  {questions: "____ ___________ isteach ann gan chúis mhaith. (siad) ", answer: "ní rachaidís", hint1: "diúltach"},
  {questions: "____ ___________ an páiste isteach ar scoil gan a mháthair.  ", answer: "ní rachadh", hint1: "diúltach"},
  {questions: "____ ___________ sé isteach sa leabharlann mar bhí sé róthuirseach.", answer: "ní rachadh", hint1: "diúltach"},
  {questions: "____ ___________ éinne isteach sa bhád mar bhí droch chuma uirthi. ", answer: "ní rachadh", hint1: "diúltach"},
  {questions: "____ ___________ ag snámh sa linn sin ar ór ná ar airgead. (mé) ", answer: "ní rachainn", hint1: "diúltach, mé"},
  {questions: "____ ___________ sí isteach go lár na cathrach léi féin. ", answer: "ní rachadh", hint1: "diúltach"},
  {questions: "____ ___________ an bád amach an lá sin mar bhí drochaimsir geallta. ", answer: "ní rachadh", hint1: "diúltach"},
];

var teighMCBriatharSaor = [

];

var teighMCCeisteach = [
  {question: "___ ___________ go Meirceá Theas ar laethanta saoire? (tú, dearfach)", answer: "an rachfá", hint1: "dearfach, tú"},
  {question: "____ ___________ na sionnaigh isteach tríd an bhfuinneog i ndiaidh na sicíní? (diúltach)", answer: "nach rachadh", hint1: "diúltach"},
  {question: "____ ___________ slua maith daoine ann dá mbeadh busanna ar fáil dóibh? (dearfach)", answer: "an rachadh", hint1: "dearfach"},
  {question: "____ ___________ amú dá bhfágfaí leo féin iad? (siad, diúltach).", answer: "nach rachaidís", answer2: "nach rachadh siad", hint1: "diúltach, siad"},
  {question: "____ ___________  sé dian air dá mbeadh air filleadh abhaile arís? (diúltach).", answer: "nach rachadh", hint1: "diúltach"},
  {question: "____ ___________  sibhse go Páras linn dá n-eagróinnse an turas? (dearfach)", answer: "an rachadh", hint1: "dearfach"},
  {question: "____ ___________ glan as a meabhair dá gcloisfidís é sin? (siad, diúltach).", answer: "nach rachadh", hint1: "diúltach, siad"},
  {question: "____ ___________ i bhfad níos mó daoine go dtí an cruinniú dá mbeadh sé ar siúl san oíche? (diúltach)", answer: "nach rachadh", hint1: "diúltach"},
  {question: "____ ___________ Seán ar thuras mar sin, dar leat? (dearfach).", answer: "an rachadh", hint1: "dearfach"},
  {question: "____ ___________ caint mar sin síos go maith lena mhuintir féin, dar leat? (dearfach).", answer: "an rachadh", hint1: "dearfach"},
];

var teighMCSpleach = [
  {question: "Dúirt sí ____ ___________ sí ann ach ní dheachaigh. (dearfach) ", answer: "go rachadh", hint1: "dearfach"},
  {question: "Chuala mé  ____ ___________ sí isteach sa bhád ar ór na cruinne. (diúltach)", answer: "nach rachadh", hint1: "diúltach"},
  {question: "Bhí a fhios agam ____ ___________ go dtí an ceolchoirm le chéile. (siad, dearfach)  ", answer: "go rachaidís", answer2: "go rachadh said", hint1: "dearfach, siad"},
  {question: "Bhí an scéal amuigh ____ ___________ an Taoiseach go dtí an cruinniú sin. (diúltach) ", answer: "nach rachadh", hint1: ""},
  {question: "Chuala mé ____ ___________sé ar ais go dtí an áit riamh arís. (diúltach)", answer: "nach rachadh", hint1: "diúltach"},
  {question: "Bhí a fhios agam ____ ___________ an nuacht sin an-dian air. (dearfach)", answer: "go rachadh", hint1: "dearfach"},
  {question: "Bhí sé de cháil orthu ____ ___________ pingin amú orthu riamh! (diúltach) ", answer: "nach rachadh", hint1: "diúltach"},
  {question: "Ba é an nós a bhí ann ná ____ ___________ éinne amach oíche Nollag. (diúltach)", answer: "nach rachadh", hint1: "diúltach"},
  {question: "Dúirt siad ___ ___________ ann dá bhfaighidís an seans. (dearfach)", answer: "nach rachadh", hint1: "dearfach"},
  {question: "Bhí a fhios agam ___ ___________sé ar strae sa cheist sin mar bhí sí an-deacair. (dearfach)", answer: "go rachadh", hint1: "dearfach"},
];

var teighMCExtraQuestions = [
  {question: "___________ go hÁrainn dá mbeinn timpeall an cheantair sin. (mé, dearfach) ", answer: "rachainn", answer2: "rachadh mé", hint1: "dearfach, mé"},
  {question: "____ ___________ amach sa bhád dá mbeadh an aimsir ní ba chiúine. (sinn, dearfach) ", answer: "rachaimís", answer2: "rachadh muid", hint1: "dearfach, sinn"},
  {question: "____ ___________ ceist mar sin dian air le freagairt go macánta.  (dearfach) ", answer: "rachadh", hint1: "dearfach"},
  {question: "____ ___________ sí in aon áit riamh gan a fón póca. (diúltach) ", answer: "ní rachadh", hint1: "diúltach"},
  {question: "____ ___________thar an táirseach sin arís fiú dá dtabharfaidís míle Euro dom. (mé, diúltach) ", answer: "ní rachainn", answer2: "ní rachadh mé", hint1: "diúltach"},
  {question: "____ ___________ abhaile a fhad is a bhí aon chomhluadar fágtha san áit. (siad, diúltach)", answer: "ní rachaidís", answer2: "ní rachadh siad", hint1: "diúltach"},
  {question: "___ ___________ go dtí an cluiche dá n-eagróimis bus don ghrúpa ar fad? (tú, dearfach) ", answer: "an rachfá", answer2: "an rachadh tú", hint1: "dearfach, tú"},
  {question: "Níl mé cinnte ach dúirt siad ____ ___________ ann. (siad, dearfach)", answer: "go rachaidís", answer2: "go rachadh siad", hint1: "dearfach, siad"},
  {question: "Nach raibh a fhios agat go maith ___ ___________ ann liom féin. (mé, diúltach)", answer: "nach rachainn", answer2: "nach rachadh mé", hint1: "diúltach"},
  {question: "Bhí eagla orm ___ ___________ar strae sa cheo an oíche sin. (siad, dearfach)", answer: "go rachaidís", answer2: "go rachadh siad", hint1: "dearfach"},
];
