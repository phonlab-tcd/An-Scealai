import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "app/authentication.service";
import config from "abairconfig";
import { TranslationService } from "app/translation.service";
import { ClassroomService } from "app/classroom.service";
import { HttpClient } from "@angular/common/http";
import { ChatbotService } from "app/services/chatbot.service";
import { firstValueFrom } from "rxjs";

export type Quiz = {
  title: string;
  owner: string;
  numOfQuestions: number;
  classroomCode: string;
  botScript: string;
  content: string;
}

export type ChatBubble = {
  id: string;
  text: string;
  audioUrl: string;
  isFromUser: boolean;
}


@Component({
  selector: "app-chatbot",
  templateUrl: "./chatbot.component.html",
  styleUrls: ["./chatbot.component.scss"],
})

export class ChatbotComponent implements OnInit {
  autoPlayAudio: boolean = true;
  audioPlayer: HTMLAudioElement;
  videoPlayer: HTMLVideoElement;
  selectedDialect: HTMLButtonElement;
  bubbleId: number = 0;
  currentLanguage: string = "";
  bubbleObjArr: Object[] = [];
  selectedSynthesisAlgo: string = "HTS";
  currentDialect: string = "MU";
  pandoraID: string = "";
  user: any;
  currentScripts: Quiz[] = [];
  personal_buttons: string[] = [];
  selectedFile: string = "";
  currentFile: string = "";
  quiz_score: number = 0;
  currentNumberofQuestions: number = 0;
  current_qandanswers: string = "";

  constructor(
    public auth: AuthenticationService,
    public ts: TranslationService,
    private http: HttpClient,
    private classroomService: ClassroomService,
    private chatbotService: ChatbotService
  ) {}

  /**
   * Set any initial variables
   * Get any quizzes made by the user (or user's teacher)
   * Set up the initial bot chat
   */
  async ngOnInit() {
    this.audioPlayer = document.getElementById("botaudio") as HTMLAudioElement;
    this.videoPlayer = document.getElementById("chimp") as HTMLVideoElement;
    this.selectedDialect = document.getElementById( "dialect-MU" ) as HTMLButtonElement;
    this.currentLanguage = this.ts.getCurrentLanguage();
    let botSetupFileName = "";

    if (this.auth.isLoggedIn()) {
      botSetupFileName = "startLoggedIn";
      this.user = this.auth.getUserDetails();
      this.pandoraID = "da387bedce347878";
      this.getQuizzes();
    } else {
      botSetupFileName = "startNotLoggedIn";
      this.pandoraID = "c08188e27e34571c";
    }

    // @ts-ignore
    await setup(botSetupFileName, config.baseurl, this.currentLanguage);
    this.chatSetup("start" + this.currentLanguage, false, false);
    this.currentFile = "start";
  }

  async getQuizzes() {
    // Get any user-made quizzes
    let userQuizzes: Quiz[] = await firstValueFrom( this.chatbotService.getUserQuizzes(this.user) );
    if (userQuizzes && userQuizzes.length > 0) {
      this.currentScripts = userQuizzes;
    }

    if (this.user.role == "STUDENT") {
      let classroom = await firstValueFrom(this.classroomService.getClassroomOfStudent(this.user._id));
      if (classroom) {
        let classroomQuizzes: Quiz[] = await firstValueFrom( this.chatbotService.getClassroomQuizzes(classroom._id) );
        if (classroomQuizzes && classroomQuizzes.length > 0) {
          for (let quiz of classroomQuizzes) 
            this.currentScripts.push(quiz);
        } 
      }
      this.addToQuizzList( this.currentScripts, this.user.role.toLowerCase() );
    }
  }

  /**
   *
   * @param {*} text e.x: 'start'
   * @param {*} holdMessages true | false => true for autoplay audio
   * @param {*} showButtons true | false => true for manual audio
   * @returns
   */
  async chatSetup(text: string, holdMessages: boolean, showButtons: boolean) {
    console.log("Setting up chat with: ", text);

    //autoplay is on & bot is sending multiple consecutive bubbles
    if (holdMessages && this.autoPlayAudio) {
      this.audioPlayer.onended = async () => {
        if (text != "") {
          // @ts-ignore
          let reply = await testBotReply(text);
          if (reply && reply != "" && !reply.includes("ERR")) {
            console.log("Reply: " + reply);
            this.appendTypingIndicator();
            setTimeout(function () {
              this.appendMessage(true, false, reply);
              this.audio(reply, this.bubbleId, false);
              $(".chatlogs").animate(
                { scrollTop: $(".chatlogs")[0].scrollHeight },
                200
              );
            }, 2200);
          }
        }
      };
    }
    // autoplay is off => no need to wait for audio to play for consecutive bubbles
    else {
      // @ts-ignore
      let reply = await testBotReply(text);
      console.log(reply);
      if (reply && reply != "" && !reply.includes("ERR")) {
        console.log("Reply: " + reply);
        this.appendTypingIndicator(); // show bot typing
        // wait for the bot to 'finish typing'
        setTimeout(() => {
          this.appendMessage(true, false, reply);
          this.audio(reply, this.bubbleId, false);
          $(".chatlogs").animate(
            { scrollTop: $(".chatlogs")[0].scrollHeight },
            200
          );
        }, 2200);
      }
    }
  }

  /**
   * Display the css for dots when the bot is typing
   */
  appendTypingIndicator() {
    $("#bot-messages").append( $( '<div class="typing-indicator"><div class="bot-message-photo"><img src="assets/img/logo-S.png" id="bot-img"></div><div class="dots"><p class="bot-message-ind"><span id="typ1"></span><span id="typ2"></span><span id="typ3"></span></p></div></div></div>' ) );
    $(".typing-indicator").delay(2000).fadeOut("fast"); // make the typing dots dissapear
    $(".chatlogs").animate({ scrollTop: $(".chatlogs")[0].scrollHeight }, 200);
  }

  /**
   * Create a new message in the chatbot window
   * @param isBot true if message is from bot
   * @param isUser true if message is from human
   * @param text message text
   */
  appendMessage(isBot, isUser, text) {
    console.log("appending message");
    this.bubbleId++;
    var newMessage = document.createElement("div");
    newMessage.setAttribute("class", "message_parent");
    newMessage.setAttribute("id", this.bubbleId.toString());

    var newP = document.createElement("p");
    var newSpan = document.createElement("span");
    var photoDiv = document.createElement("div");
    var photo = document.createElement("img");

    if (isBot) {
      newP.setAttribute("class", "bot-message");
      photoDiv.setAttribute("class", "bot-message-photo");
      photo.src = "assets/img/logo-S.png";
      photo.setAttribute("id", "bot-img");
    } else {
      newP.setAttribute("class", "user-message");
      photoDiv.setAttribute("class", "user-message-photo");
      photo.src = "assets/img/apple-user.svg";
      photo.setAttribute("id", "user-img");
    }

    photoDiv.appendChild(photo);
    newMessage.appendChild(photoDiv);
    newSpan.setAttribute("class", "this-message");
    newSpan.innerHTML = text;
    newP.appendChild(newSpan);

    newMessage.ondblclick = function () {
      // manualPlay(newMessage.id);  TODO
    };

    let isAQuestion = false; // WHAT IS THIS
    let dictOn = false; // WHAT IS THIS
    if (isAQuestion) {
      var dictPopup;
      var dictTri;
      var dictText;
      var dictImg;
      dictImg = document.createElement("img");
      dictImg.src = "assets/img/dict.png";
      dictImg.setAttribute("class", "dictButton");
      dictImg.style.display = "none";
      dictImg.onclick = function () {
        if (dictOn == false) {
          dictPopup.style.display = "flex";
          dictTri.style.display = "flex";
          dictText.innerHTML = this.currentQuestion.translation;
          dictOn = true;
        } else if (dictOn) {
          dictPopup.style.display = "none";
          dictTri.style.display = "none";
          dictOn = false;
        }
      };
      newP.appendChild(dictImg);
      isAQuestion = false;
    }

    let messages = document.getElementById("bot-messages") as HTMLElement;
    newMessage.appendChild(newP);
    messages.appendChild(newMessage);
  }

  chatAIML() {
    let output = "";
    var input = (document.getElementById("bot-user_input") as HTMLInputElement).value;
    $("form").on("submit", (event) => {
      event.preventDefault();
    });
    if (input != "") {
      (document.getElementById("bot-user_input") as HTMLInputElement).value = "";
      this.appendMessage(false, true, input);
      this.audio(input, this.bubbleId, true);
      setTimeout(() => {
        this.videoPlayer.play();
        $(".chatlogs").animate( { scrollTop: $(".chatlogs")[0].scrollHeight }, 200 );

        this.chatbotService.chatAIML(input, this.pandoraID).subscribe({
            next: (response) => {
              if (response.reply) {
                output = /<that>(.*?)<\/that>/g.exec(response.reply)[1];
                this.appendTypingIndicator();
                setTimeout(() => {
                  this.appendMessage(true, false, output);
                  $(".chatlogs").animate(
                    { scrollTop: $(".chatlogs")[0].scrollHeight },
                    200
                  );
                  this.audio(output, this.bubbleId, false);
                  //videoPlayer.pause();
                }, 2200);
                //callAudio(output, 'GD');
              }
            },
            error: (error) => {
              console.log(error);
            },
          });
      }, 2200);
    }
  }

  audio(newReply, id, isUser) {
    console.log("Getting audio...");
    let thisId = id;
    let newBubble;
    var bubbleText = "";
    if (isUser == false) {
      // message is from bot
      // remove html and rivescript tags
      let editedMessage = this.editMessageForAudio(newReply);

      // check if message from bot is a hint
      if (editedMessage[2] == "//www") {
        bubbleText = "Úsáid tearma.ie chun cabhrú leat munar thuig tú téarma ar leith.";
        newBubble = { text: bubbleText, id: thisId, url: null, isUser: isUser };
      } else if (editedMessage[3] == "//www") {
        bubbleText = "An bhfuil aon fhocail nár thuig tú? Féach sa bhfoclóir ag teanglann.ie.";
        newBubble = { text: bubbleText, id: thisId, url: null, isUser: isUser };
      } else if (editedMessage != null) {
        var notAHint = true;
        for (let i = 0; i < editedMessage.length; i++) {
          if (editedMessage[i].indexOf("teanglann") != -1) {
            notAHint = false;
            //@ts-ignore
            bubbleText = "Mícheart, beagnach ceart ach féach arís air, a " + getName() + ". Hint: teanglann.ie";
            newBubble = {
              text: bubbleText,
              id: thisId,
              url: null,
              isUser: isUser,
            };
          }
        }
        if (notAHint) {
          for (let i = 0; i < editedMessage.length; i++) {
            bubbleText = bubbleText.concat(editedMessage[i], ".");
          }
          newBubble = {
            text: bubbleText,
            id: thisId,
            url: null,
            isUser: isUser,
          };
        }
      }
      // bot message contains no rivescript/html tags
      else {
        bubbleText = newReply;
        newBubble = {
          text: newReply,
          id: thisId,
          url: null,
          isUser: isUser,
        };
      }
    } else {
      // message is from user or bot message is not a hint
      bubbleText = newReply;
      newBubble = {
        text: newReply,
        id: thisId,
        url: null,
        isUser: isUser,
      };
    }

    newBubble.text = newBubble.text.replace(/(<([^>]+)>)/gi, "");
    bubbleText = bubbleText.replace(/(<([^>]+)>)/gi, "");
    if (this.currentLanguage == "Gaeilge") {
      this.bubbleObjArr.push(newBubble);
      console.log(newBubble);
      //makeMessageObj(isUser, bubbleText); (not used in originial)
      // if(this.selectedSynthesisAlgo == 'DNN') testDNN(newBubble, thisId);        // TODO implement this function
      // else if(this.selectedSynthesisAlgo == 'HTS') callAudio(newBubble, thisId); // TODO implement this function
      this.callAudio(newBubble, thisId);
    }
  }

  editMessageForAudio(newReply: string) {
    let inp = [];
    var inputString = newReply;
    var j = 0;
    var length;
    if (inputString.indexOf("<p") != -1) {
      var i = inputString.indexOf("<");
      var j = inputString.indexOf(">");
      inputString = inputString.replace('<p style="display:none">', "");
      inputString = inputString.replace("</p>", "");
      inp.push(inputString);
      return;
    } else {
      for (i = 0; i < inputString.length; i++) {
        if (
          inputString[i] == "." ||
          inputString[i] == ":" ||
          inputString[i] == "?" ||
          inputString[i] == "!"
        ) {
          length = i - j;
          var newString = inputString.substring(j, length);
          j = i + 1;
          if (newString != "ERR" && newString != " ") inp.push(newString);
        }
        if (inputString[i] == "'") {
          inputString[i] == inputString[i].replace("'", "");
        }
      }
      var currentSentence;
      for (i = 0; i < inp.length; i++) {
        currentSentence = inp[i];
        for (j = 0; j < currentSentence.length; j++) {
          let indexOf1 = currentSentence.indexOf("<b>");
          let indexOf2 = currentSentence.indexOf("<i>");
          let indexOf3 = currentSentence.indexOf("</b>");
          let indexOf4 = currentSentence.indexOf("</i>");
          let indexOf5 = currentSentence.indexOf("<br>");
          let indexOf6 = currentSentence.indexOf("-");
          if (indexOf1 != -1) {
            inp[i] = inp[i].replace("<b>", "");
          }
          if (indexOf2 != -1) {
            inp[i] = inp[i].replace("<i>", "");
          }
          if (indexOf3 != -1) {
            inp[i] = inp[i].replace("</b>", "");
          }
          if (indexOf4 != -1) {
            inp[i] = inp[i].replace("</i>", "");
          }
          if (indexOf5 != -1) {
            inp[i] = inp[i].replace("<br>", "");
          }
          if (indexOf6 != -1) {
            inp[i] = inp[i].replace("-", "");
          }
        }
      }
    }
    return inp;
  }

  async callAudio(testString, id) {
    var messageBubble = {};
    if (this.currentDialect == "") {
      this.currentDialect = "MU";
    }
    if (testString.isUser) {
      messageBubble = { text: testString.text, dialect: this.currentDialect };
    } else {
      messageBubble = { text: testString.text, dialect: "MU" };
    }
    const headers = {
      Authorization: "Bearer " + this.auth.getToken(),
      "Content-Type": "application/json",
    };
    const body = {
      messageBubble,
    };
    this.http.post<any>(config.baseurl + "Chatbot/getAudio/", body, { headers }).subscribe({
      next: (audioRes) => {
        let bubbleUrl = audioRes.audio;
        //assign audio url to message bubble
        let bubble = this.bubbleObjArr.find((obj) => obj["id"] == id);
        if (bubble) bubble["url"] = bubbleUrl;
        if (this.autoPlayAudio) {
          this.playAudio(bubble);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  playAudio(bubble) {
    if (bubble.url) {
      this.audioPlayer.src = bubble.url;
      var playPromise = this.audioPlayer.play();
      if (playPromise !== undefined) {
        playPromise.then((_) => {}).catch((error) => {
          console.log(error);
        });
      }
    }
  }

  /**
   * Add quizzes to HTML
   * @param scripts list of quizzes
   * @param role role of user
   */
  addToQuizzList(quizzes: Quiz[], role) {
    let button_id = role + "_script_";
    //console.log(scripts);
    //append buttons to personal-topics
    for (let quiz of quizzes) {
      //label for button
      let topicname = quiz.title;
      //check not already in DOM
      if (!this.personal_buttons.includes(button_id + topicname)) {
        //create button
        let topic = document.createElement("button");
        topic.setAttribute("class", "add-personal-topics");
        topic.innerText = topicname;
        topic.setAttribute("id", button_id + topicname);
        //set teacher quizzes display to none if student
        if (topic.id.includes("teacher") && this.user.role == "STUDENT") {
          topic.style.display = "none";
          topic.style.backgroundColor = "#138D75";
          topic.innerText = topicname.replace("teacher_", "");
        } else if (
          topic.id.includes("teacher") &&
          this.user.role == "TEACHER"
        ) {
          topic.innerText = topicname.replace("teacher_", "");
        } else topic.style.display = "inline";

        //keep track of buttons
        this.personal_buttons.push(topic.id);
        topic.onclick = () => {
          //console.log(selectedFile);
          if (this.selectedFile != "") {
            $("#" + this.selectedFile).css("border", "none");
          }
          topic.style.border = "thick solid #F4D03F";
          $("#delete-script").css("display", "block");
          $("#open-script").css("display", "block");
          this.selectedFile = topic.id;
          //showContents('p', 'popup-background', false);
          //load(topic.innerText);
        };

        setTimeout(function () {
          //append new button
          $("#personal-container").append(topic);
        }, 500);
      }
    }
    console.log(this.personal_buttons)
  }

  /**
   * Get any quizzes from the DB that the teacher made for the clas
   */
  async getTeacherScripts() {
    this.classroomService.getClassroomOfStudent(this.user._id).subscribe({
      next: (classroom) => {
        this.http.get<any>( config.baseurl + "chatbot/getTeacherScripts/" + classroom._id).subscribe({
          next: (quizzes: Quiz[]) => {
            console.log(quizzes)
            if (quizzes && quizzes.length > 0) {
              for (let quiz of quizzes) 
                this.currentScripts.push(quiz);
              this.addToQuizzList( quizzes, this.user.role.toLowerCase() );
                
            } else {
              console.log(quizzes);
            }
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  /**
   * Show modal popups for different user options (quizzes, recording, dialects, etc)
   * @param content_id id of element clicked
   * @param background_id id of background element for clicked section
   * @param show true if open modal, false if close
   */
  showContents(content_id, background_id, show) {
    $("form").on("submit", (event) => {
      event.preventDefault();
    });
    if (content_id == "recording-prompt") {
      $("#send-recording").css("display", "none");
      $("#recording-player").css("display", "none");
    }

    let contentPopup = document.getElementById(content_id);
    let backgroundPopup = document.getElementById(background_id);

    if (show) {
      //show contents
      contentPopup.style.display = "inline-block";
      backgroundPopup.style.display = "flex";
      setTimeout(function () {
        contentPopup.style.opacity = "1";
        backgroundPopup.style.opacity = "0.6";
      }, 50);

      if (content_id == "p" && this.user.role == "TEACHER") {
        $("#to-create").css("margin-top", "5%");
        $("#to-create").css("left", "5%");
      }
    } else {
      //hide contents
      contentPopup.style.opacity = "0";
      backgroundPopup.style.opacity = "0";
      setTimeout(function () {
        contentPopup.style.display = "none";
        backgroundPopup.style.display = "none";
      }, 500);
    }
  }

  /**
   * Show any personal scripts loaded from the DB depending on user role
   * @param role user role
   */
  showPersonal(role) {
    if (this.selectedFile != "")
      $("#" + this.selectedFile).css("border", "none");
    if (role == "student") {
      $(".personal-topics #teacher").css("background-color", "#FBFCFC");
      $(".personal-topics #student").css("background-color", "#F4D03F");
      $("#delete-script").prop("disabled", false);
    } else {
      $(".personal-topics #student").css("background-color", "#FBFCFC");
      $(".personal-topics #teacher").css("background-color", "#F4D03F");
      $("#delete-script").prop("disabled", true);
    }
    for (let id of this.personal_buttons) {
      let button = document.getElementById(id);
      if (id.includes(role)) {
        button.style.display = "inline";
      } else button.style.display = "none";

      if (role == "student" && id.includes("teacher"))
        button.style.display = "none";

      $("#delete-script").css("display", "none");
      $("#open-script").css("display", "none");
    }
  }

  closePersonal() {
    this.showContents("p", "popup-background", false);
    if (this.user.role == "STUDENT") this.showPersonal("student");
    if (this.selectedFile != "") {
      $("#" + this.selectedFile).css("border", "none");
      $("#open-script").css("display", "none");
      $("#delete-script").css("display", "none");
    }
  }

  /**
   * Load in a community quizz
   * @param fileId quizz name
   * @param start 'start'
   * @param content_id 'c'
   */
  async load(fileId, start, content_id) {
    this.audioPlayer.pause();
    let send = document.getElementById("bot-message-button");
    send.onclick = () => {
      console.log("Button clicked!!!!!");
      this.sendInput();
    };

    // close popup window
    if (content_id) this.showContents(content_id, "popup-background", false);

    // empty bot text from original greeting message
    if (this.currentFile == "start") {
      $("#bot-messages").empty();
    } else {
      this.currentFile = fileId;
    }

    console.log(fileId);

    // @ts-ignore
    await testBotLoad(fileId, start);

    if (start == null) start = "start";
    this.chatSetup(start, false, false);
  }

  /**
   * Clear out the user input box
   */
  sendInput() {
    let input = (document.getElementById("bot-user_input") as HTMLInputElement).value;
    $("form").on("submit", (event) => {
      event.preventDefault();
    });
    if (input != "") {
      (document.getElementById("bot-user_input") as HTMLInputElement).value = "";
      this.appendMessage(false, true, input);
      this.videoPlayer.play();
      setTimeout(() => {
        this.chatSetup(input, true, false);
        this.audio(input, this.bubbleId, true);
      }, 1500);
      $(".chatlogs").animate( { scrollTop: $(".chatlogs")[0].scrollHeight }, 200 );
    }
  }

  selectEngine(engine) {
    $(engine).css("backgroundColor", "#F5B041");
    if (engine == "#select-DNN") {
      this.selectedSynthesisAlgo = "DNN";
      $("#select-HTS").css("backgroundColor", "#FBFCFC");
      $("#dialect-CM").css("display", "none");
      $("#dialect-GD").css("display", "none");
      $("#dialect-MU").css("display", "none");

      $("#dialect-UL").css("display", "block");
      $("#dialect-CO").css("display", "block");
      $("#dialect-MU-DNN").css("display", "block");
    } else {
      this.selectedSynthesisAlgo = "HTS";
      $("#select-DNN").css("backgroundColor", "#FBFCFC");
      $("#dialect-CM").css("display", "block");
      $("#dialect-GD").css("display", "block");
      $("#dialect-MU").css("display", "block");

      $("#dialect-UL").css("display", "none");
      $("#dialect-CO").css("display", "none");
      $("#dialect-MU-DNN").css("display", "none");
    }
  }

  /**
   * Set the dialect preference and css styles of dialog popup modal
   * @param dialect selected dialect
   */
  dialectSelection(dialect: string) {
    this.autoPlayAudio = true;

    // reset colour of previously selected dialect button
    if (this.currentDialect) {
      this.selectedDialect.style.backgroundColor = "#1ABC9C";
      this.selectedDialect.style.fontWeight = "";
    }
    // set dialect preference
    this.currentDialect = dialect.substring(8, dialect.length);

    // set chatbot header text for selected dialect
    let dialectElement = document.getElementById("this-dialect") as HTMLElement;
    if (this.currentDialect == "MU-DNN") this.currentDialect = "MU";

    if (this.selectedSynthesisAlgo == "HTS") {
      if (this.currentDialect == "CM")
        dialectElement.innerHTML = "Dialect: Connemara - HTS";
      else if (this.currentDialect == "GD")
        dialectElement.innerHTML = "Dialect: Donegál - HTS";
      else dialectElement.innerHTML = "Dialect: Kerry - HTS";
    } else {
      if (this.currentDialect == "CO")
        dialectElement.innerHTML = "Dialect: Connemara - DNN";
      else if (this.currentDialect == "UL")
        dialectElement.innerHTML = "Dialect: Gaoth Dobhair - DNN";
      else dialectElement.innerHTML = "Dialect: Kerry - DNN";
    }

    // set the colour of selected dialect button
    this.selectedDialect = document.getElementById( dialect ) as HTMLButtonElement;
    this.selectedDialect.style.backgroundColor = "#117A65";
    this.selectedDialect.style.fontWeight = "bold";
  }

  openScript() {
    this.quiz_score = 0;
    let toLoad = "";
    this.showContents("p", "popup-background", false);
    $("#" + this.selectedFile).css("border", "none");
    $("#open-script").css("display", "none");
    $("#delete-script").css("display", "none");
    //console.log(selectedFile);
    if (this.selectedFile.includes("student"))
      toLoad = this.selectedFile.replace("student_script_", "");
    else toLoad = this.selectedFile.replace("teacher_script_", "");
    var quiz = this.currentScripts.find((quiz) => quiz.title.includes(toLoad));
    if (quiz) {
      if (quiz.numOfQuestions)
        this.currentNumberofQuestions = quiz.numOfQuestions;
      if (quiz.content)
        this.current_qandanswers = quiz.content;
    }
    console.log(quiz);
    this.loadQuiz(toLoad);
  }

  async loadQuiz(quizTitle: string) {
    $("#bot-messages").empty();
    let send = document.getElementById("bot-message-button");
    send.onclick = () => {
      this.sendInput();
    };
    var quiz = this.currentScripts.find((quiz) => quiz.title.includes(quizTitle));
    console.log(quiz.content)

    // @ts-ignore
    await testLoadQuiz(quiz.botScript);
    this.chatSetup("start", false, false);
  }

  deleteScript() {
    var toDelete = "";
    if (this.selectedFile.includes("student"))
      toDelete = this.selectedFile.replace("student_script_", "");
    else toDelete = this.selectedFile.replace("teacher_script_", "");
    console.log("to delete: " + toDelete);

    this.chatbotService.deleteScript(toDelete, this.user._id).subscribe({
      next: (response) => {
        console.log(response);
        if (response.message == "script deleted") {
          console.log("if entered");
          $("#" + this.selectedFile).remove();
          var index = this.personal_buttons.indexOf(this.selectedFile);
          if (index != -1) this.personal_buttons.splice(index, 1);
          this.showContents("p", "popup-background", false);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
