URL = window.URL || window.webkitURL;
var gumStream;
var rec;
var input;
var AudioContext = window.AudioContext || window.webkitAudioContenxt;
var audioContext = new AudioContext;
var recordButton = document.querySelector(".record");
var stopButton = document.querySelector("#stopRecording");
if(stopButton) stopButton.disabled = true;
var recordList = document.querySelector(".recList");
var thisBlob;


var constraints = {
  audio: true,
  video: false
};

function startRecording(){
  stopButton.disabled = false;
  recordButton.disabled = true;
  console.log("recordButton clicked");
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
    console.log("getUserMedia() success, stream created, initializing Recorderjs....");
    gumStream = stream;
    input = audioContext.createMediaStreamSource(stream);
    rec = new Recorder(input, {
      numChannels: 1
    });
    rec.record();
    console.log("Recording started");
  }).catch(function(err){
    console.log(err);
  });
}

function stopRecording() {
  console.log("stopButton clicked");
  stopButton.disabled = true;
  recordButton.disabled = false;
  rec.stop(); //stop microphone access
  gumStream.getAudioTracks()[0].stop();
  rec.exportWAV(createDownloadLink);
}
var url;
function createDownloadLink(blob){
  thisBlob = blob;
  console.log(thisBlob);
  url = URL.createObjectURL(blob);
  var au = document.createElement("audio");
  var div = document.createElement("div");
  var link = document.createElement("a");
  au.controls  = true;
  au.src = url;
  link.href = url;
  link.download = new Date().toISOString() + ".wav";
  link.innerHTML = link.download;
  div.appendChild(au);
  div.appendChild(link);

  var filename = new Date().toISOString() + ".wav";
  var upload = document.createElement("button");
  upload.innerHTML = "upload";
  upload.addEventListener("click", sendRecording);
  div.appendChild(upload) //add the upload link to li
  recordList.appendChild(div);
}

function sendRecording(){
  event.preventDefault();
  var req = new XMLHttpRequest();
  var form = new FormData();
  form.append("audio", thisBlob, "RecordedAnswer.wav");
  console.log(form);
  req.open("POST", "http://localhost:4000/Chatbot/addAudio", true);
  req.setRequestHeader("Content-Type", "multipart/form-data");
  req.send(thisBlob);
  req.onload = function(){
    console.log(this.response);
  };
}
