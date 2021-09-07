//webkitURL is deprecated but nevertheless 
URL = window.URL || window.webkitURL;
var gumStream;
//stream from getUserMedia() 
var rec;
//Recorder.js object 
var input;


var constraints = {
  audio: true,
  video: false
};

function startRecording(){
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioContext = new AudioContext;
  var recordButton = document.getElementById("start-record");
  var stopButton = document.getElementById("stop-record");
  var cancelButton = document.getElementById('cancel-recording');
  stopButton.disabled = false;
  recordButton.disabled = true;
  cancelButton.disabled = true;
  console.log('recoring clicked');
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
    console.log("getUserMedia() success, stream created, initializing Recorder.js ..."); 
    /* assign to gumStream for later use */
    gumStream = stream;
    /* use the stream */
    input = audioContext.createMediaStreamSource(stream);
    /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
    rec = new Recorder(input, {
        numChannels: 1
    }) 
    //start the recording process 
    rec.record()
    console.log("Recording started");
    $('#recording-message').css('display', 'block');
  }).catch(function(err){
    //enable the record button if getUserMedia() fails 
    recordButton.disabled = false;
    stopButton.disabled = true;
  });
}

function stopRecording() {
  var recordButton = document.getElementById("start-record");
  var stopButton = document.getElementById("stop-record");
  var cancelButton = document.getElementById('cancel-recording');
  console.log("stopButton clicked");
  stopButton.disabled = true;
  recordButton.disabled = false;
  cancelButton.disabled = false;
  rec.stop(); //stop microphone access
  $('#recording-message').css('display', 'none');
  gumStream.getAudioTracks()[0].stop();
  rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob){
  var url = URL.createObjectURL(blob);
  console.log(blob);
  var au = document.getElementById('recording-player');
  var link = document.createElement('a');
  //add controls to the <audio> element 
  au.src = url;
  au.style.display = 'block';
  //link the a element to the blob 
  link.href = url;
  link.download = new Date().toISOString() + '.wav';
  console.log(link);
  link.innerHTML = link.download;
  //link.click();

  var send = document.createElement('button');
  send.setAttribute('id', 'send-recording');
  send.innerText = 'Send Answer?';
  send.onclick = function(){
    sendRecording(blob);
  }
  $('#recording-promptbackendUrl + ').append(send);
}

function sendRecording(blob){
  var req = new XMLHttpRequest();
  var form = new FormData();
  form.append("file", blob);
  req.open("POST", backendUrl + "/Chatbot/sendRecordedAnswer", true);
  req.send(form);
  req.onload = function(){
    console.log(this.response);
    let resp = JSON.parse(this.response);
    if(resp.status == 200){
      showContents('recording-prompt', 'bg-background', false);
      appendMessage(false, true, resp.text);
    }
  };
}
