import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'app/authentication.service';
import config from 'abairconfig';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  constructor(private http: HttpClient, public auth: AuthenticationService) { }

  // audio(newReply, id, isUser, audio_reply){
  //   console.log("Getting audio...")
  //   audio_reply = newReply;
  //   let thisId = id;
  //   let newBubble;
  //   var bubbleText = "";
  //   if(isUser == false){
  //     // message is from bot
  //     // remove html and rivescript tags
  //     let editedMessage = this.editMessageForAudio();
  
  //     // check if message from bot is a hint
  //     if(editedMessage[2] == "//www"){
  //       bubbleText = "Úsáid tearma.ie chun cabhrú leat munar thuig tú téarma ar leith.";
  //       newBubble = { text: bubbleText, id: thisId, url: null, isUser: isUser };
  //     }
  //     else if(editedMessage[3] == "//www"){
  //       bubbleText = "An bhfuil aon fhocail nár thuig tú? Féach sa bhfoclóir ag teanglann.ie.";
  //       newBubble = { text: bubbleText, id: thisId, url: null, isUser: isUser };
  //     }
  //     else if(editedMessage != null){
  //       var notAHint = true;
  //       for(let i = 0; i < editedMessage.length; i++){
  //         if(editedMessage[i].indexOf("teanglann") != -1){
  //           notAHint = false;
  //           //@ts-ignore
  //           bubbleText = "Mícheart, beagnach ceart ach féach arís air, a " + getName() + ". Hint: teanglann.ie"
  //           newBubble = { text: bubbleText, id: thisId, url: null, isUser: isUser };
  //         }
  //       }
  //       if(notAHint){
  //         for(let i = 0; i < editedMessage.length; i++){
  //           bubbleText = bubbleText.concat(editedMessage[i], ".");
  //         }
  //         newBubble = { text: bubbleText , id: thisId, url: null, isUser: isUser };
  //       }
  //     }
  //     // bot message contains no rivescript/html tags
  //     else{
  //       bubbleText = this.audio_reply;
  //       newBubble = { text: this.audio_reply , id: thisId, url: null, isUser: isUser };
  //     }
  //   }
  //   else{
  //     // message is from user or bot message is not a hint
  //     bubbleText = this.audio_reply;
  //     newBubble = { text: this.audio_reply , id: thisId, url: null, isUser: isUser };
  //   }
  
  //   newBubble.text = newBubble.text.replace(/(<([^>]+)>)/gi, "");
  //   bubbleText = bubbleText.replace(/(<([^>]+)>)/gi, "");
  //   if(this.currentLanguage == 'Gaeilge'){
  //     this.bubbleObjArr.push(newBubble);
  //     //console.log(newBubble);
  //     //makeMessageObj(isUser, bubbleText);
  //     // if(this.currentEngine == 'DNN') testDNN(newBubble, thisId);        // TODO implement this function
  //     // else if(this.currentEngine == 'HTS') callAudio(newBubble, thisId); // TODO implement this function
  //     this.callAudio(newBubble, thisId)
  //   }
  // }

  // async callAudio(testString, id, currentDialect){
  //   console.log("In call audio")
  //   var messageBubble = {};
  //   if(currentDialect == ''){
  //     currentDialect = 'MU'; 
  //   }
  //   if(testString.isUser){
  //     messageBubble = {text: testString.text, dialect: currentDialect};
  //   }
  //   else{
  //     messageBubble = {text: testString.text, dialect: 'MU'};
  //   }
  //   const headers = { 'Authorization': 'Bearer ' + this.auth.getToken(), 'Content-Type': 'application/json' }
  //   const body = {
  //     messageBubble
  //   };
  //   this.http.post<any>(config.baseurl + 'Chatbot/getAudio/', body, {headers}).subscribe({
  //     next: (audioRes) => {
  //       console.log(audioRes);
  //       let bubbleUrl = audioRes.audio;
  //       //assign audio url to message bubble
  //       let bubble = this.bubbleObjArr.find(obj => obj['id'] == id);
  //       bubble['url'] = bubbleUrl;
  //       if(this.audioCheckbox.checked == true){
  //         this.playAudio(bubble);
  //       }
  //     }, 
  //     error: (error) => {console.log(error)}
  //   });
  // }

  // playAudio(bubble){
  //   if(bubble.url){
  //     this.audioPlayer.src = bubble.url;
  //     var playPromise = this.audioPlayer.play();
  //     if(playPromise !== undefined){
  //       playPromise.then(_ => {
  //       }).catch(error => {
  //         console.log(error);
  //       });
  //     }
  //   }
  // }
}
