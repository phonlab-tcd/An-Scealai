var request = new XMLHttpRequest();
var audio_reply = "";
var audioPlayer;
var audioCheckbox;
var showingControls = false;
var currentEngine = 'HTS';

// Array of bubbles in chat containing text and audio
var bubbleObjArr = [];
var thisId = 0;
var isPlaying = false;

//sets up for messages to be edited and urls to be called
function audio(newReply, id, isUser){
  audio_reply = newReply;
  thisId = id;
  let newBubble;
  var bubbleText = "";
  if(isUser == false){
    // message is from bot
    // remove html and rivescript tags
    let editedMessage = editMessageForAudio();

    // check if message from bot is a hint
    if(editedMessage[2] == "//www"){
      bubbleText = "Úsáid tearma.ie chun cabhrú leat munar thuig tú téarma ar leith.";
      newBubble = { text: bubbleText, id: thisId, url: null, isUser: isUser };
    }
    else if(editedMessage[3] == "//www"){
      bubbleText = "An bhfuil aon fhocail nár thuig tú? Féach sa bhfoclóir ag teanglann.ie.";
      newBubble = { text: bubbleText, id: thisId, url: null, isUser: isUser };
    }
    else if(editedMessage != ""){
      var notAHint = true;
      for(i = 0; i < editedMessage.length; i++){
        if(editedMessage[i].indexOf("teanglann") != -1){
          notAHint = false;
          bubbleText = "Mícheart, beagnach ceart ach féach arís air, a " + getName() + ". Hint: teanglann.ie"
          newBubble = { text: bubbleText, id: thisId, url: null, isUser: isUser };
        }
      }
      if(notAHint){
        for(i = 0; i < editedMessage.length; i++){
          bubbleText = bubbleText.concat(editedMessage[i], ".");
        }
        newBubble = { text: bubbleText , id: thisId, url: null, isUser: isUser };
      }
    }
    // bot message contains no rivescript/html tags
    else{
      bubbleText = audio_reply;
      newBubble = { text: audio_reply , id: thisId, url: null, isUser: isUser };
    }
  }
  else{
    // message is from user or bot message is not a hint
    bubbleText = audio_reply;
    newBubble = { text: audio_reply , id: thisId, url: null, isUser: isUser };
  }
  if(!bubbleText.includes("Hi this is Taidhgín")){
    bubbleObjArr.push(newBubble);
    //console.log(bubbleObjArr);
    //makeMessageObj(isUser, bubbleText);
    if(currentEngine == 'DNN') testDNN(bubbleText, thisId);
    else if(currentEngine == 'HTS') callAudio(bubbleText, thisId);
  }
}

//edits messages to be played & adds them to array
function editMessageForAudio(){
  let inp = [];
  var inputString = audio_reply;
  var index = inputString.indexOf("Ceist:");
  var j = 0;
  var length;
  if(inputString.indexOf("<p") != -1){
    var i = inputString.indexOf("<");
    var j = inputString.indexOf(">");
    inputString = inputString.replace("<p style=\"display:none\">", "");
    inputString = inputString.replace("</p>", "");
    inp.push(inputString);
    return;
  }
  else{
    for(i = 0; i < inputString.length; i++){
      if(inputString[i] == "." || inputString[i] == ":" || inputString[i] == "?" || inputString[i] == "!"){
        length = i - j;
        var newString = inputString.substr(j, length);
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
  return inp;
}

function callAudio(testString, id){
  if(currentDialect == ''){
    currentDialect = 'MU'; 
  }
  var messageBubble = {text: testString, dialect: currentDialect};
  request.open('POST', backendUrl + 'Chatbot/getAudio', true);
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(messageBubble));
  request.onload = function(){
    //console.log(JSON.parse(this.response));
    var bubbleUrl =JSON.parse(this.response).audio;
    //assign audio url to message bubble
    let bubble = bubbleObjArr.find(obj => obj.id == id);
    bubble.url = bubbleUrl;
    if(audioCheckbox.checked == true){
      playAudio(bubble);
    }
  }
}

function testDNN(text, id){
  if(currentDialect != ''){
    var messageBubble = {text: text, dialect: currentDialect};
    request.open('POST', backendUrl + 'Chatbot/getDNNAudio', true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(JSON.stringify(messageBubble));
    request.onload = function(){
      //Get audio src strings
      var audioObj = JSON.parse(this.response).audio.sort((a, b) => { return a.id - b.id; });
      var audioStrings = [];
      for(obj of audioObj){
        audioStrings.push(obj.audioString);
      }
      var bubbleSrc = testMerge(audioStrings);
      let bubble = bubbleObjArr.find(obj => obj.id == id);
      bubble.url = bubbleSrc;
      if(audioCheckbox.checked == true){
        playAudio(bubble);
      }
    }
  }
}

//plays audio
function playAudio(bubble){
  if(bubble.url){
    audioPlayer.src = bubble.url;
    var playPromise = audioPlayer.play();
    if(playPromise !== undefined){
      playPromise.then(_ => {
      }).catch(error => {
        console.log(error);
      });
    }
  }
}

function manualPlay(id){
  let bubble = bubbleObjArr.find(obj => obj.id == id);
  if(bubble.url != undefined){
    if(!showingControls){
      if(!bubble.isUser)
        $('#' + id + '.message_parent .bot-message').append('<div class="controls-popup"><div class="controls"><i class="fas fa-pause-circle manual-pause" onclick="audioPlayer.pause();"></i> <i class="fas fa-play-circle manual-play" onclick="audioPlayer.play();"></i></div></div>');
      else
        $('#' + id + '.message_parent .user-message').append('<div class="controls-popup"><div class="controls"><i class="fas fa-pause-circle manual-pause" onclick="audioPlayer.pause();"></i> <i class="fas fa-play-circle manual-play" onclick="audioPlayer.play();"></i></div></div>');

        showingControls = true;
    }
    playAudio(bubble);
    audioPlayer.onended = function(){
      showingControls = false;
      if(!bubble.isUser)
        $('#' + id + '.message_parent .bot-message .controls-popup').remove();
      else
        $('#' + id + '.message_parent .user-message .controls-popup').remove();
    }
    }
}


//code from https://stackoverflow.com/questions/65767933/its-possible-to-merge-two-audio-base64data-strings-to-create-an-unique-audio-f
function testMerge(audioStuff){
  var buffers = [];
  for(let i = 0; i < audioStuff.length; i++){
    var data = audioStuff[i].split(',')[1];
    buffers.push(base64ToArrayBuffer(data));
  }

  var arrBytes = appendBuffer(buffers);
  var finalBuffer = getWavBytes(arrBytes, {
    isFloat: false, 
    numChannels: 2, 
    sampleRate: 48000,
  });

  var finalBase64 = 'data:audio/mp3;base64,' + arrayBufferToBase64(finalBuffer);

  return finalBase64;
}

function base64ToArrayBuffer(base64) {
  var binary_string =  window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array( len );
  for (var i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

function appendBuffer(buffers) {
  var bufferLength = 0;
  for(let i = 0; i < buffers.length; i++){
    bufferLength += buffers[i].byteLength;
  }
  var tmp = new Uint8Array(bufferLength);
  var tmpLength = 0;
  for(let i = 0; i < buffers.length; i++){
    if(i == 0) tmpLength = 0;
    else tmpLength += buffers[i-1].byteLength;
    tmp.set(new Uint8Array(buffers[i]), tmpLength);
  }
  //tmp.set(new Uint8Array(buffer1), 0);
  //tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp;
};

function arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}

function getWavBytes(buffer, options) {
  const type = options.isFloat ? Float32Array : Uint16Array
  const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT

  const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }))
  const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

  // prepend header, then add pcmBytes
  wavBytes.set(headerBytes, 0)
  wavBytes.set(new Uint8Array(buffer), headerBytes.length)

  return wavBytes
}

// adapted from https://gist.github.com/also/900023
// returns Uint8Array of WAV header bytes
function getWavHeader(options) {
  const numFrames =      options.numFrames
  const numChannels =    options.numChannels || 2
  const sampleRate =     options.sampleRate || 44100
  const bytesPerSample = options.isFloat? 4 : 2
  const format =         options.isFloat? 3 : 1

  const blockAlign = numChannels * bytesPerSample
  const byteRate = sampleRate * blockAlign
  const dataSize = numFrames * blockAlign

  const buffer = new ArrayBuffer(44)
  const dv = new DataView(buffer)

  let p = 0

  function writeString(s) {
    for (let i = 0; i < s.length; i++) {
      dv.setUint8(p + i, s.charCodeAt(i))
    }
    p += s.length
  }

  function writeUint32(d) {
    dv.setUint32(p, d, true)
    p += 4
  }

  function writeUint16(d) {
    dv.setUint16(p, d, true)
    p += 2
  }

  writeString('RIFF')              // ChunkID
  writeUint32(dataSize + 36)       // ChunkSize
  writeString('WAVE')              // Format
  writeString('fmt ')              // Subchunk1ID
  writeUint32(16)                  // Subchunk1Size
  writeUint16(format)              // AudioFormat
  writeUint16(numChannels)         // NumChannels
  writeUint32(sampleRate)          // SampleRate
  writeUint32(byteRate)            // ByteRate
  writeUint16(blockAlign)          // BlockAlign
  writeUint16(bytesPerSample * 8)  // BitsPerSample
  writeString('data')              // Subchunk2ID
  writeUint32(dataSize)            // Subchunk2Size

  return new Uint8Array(buffer)
}
