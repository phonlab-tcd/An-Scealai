import { Component, OnInit } from '@angular/core';
import { SynthItem } from 'app/synth-item';
import { SynthesisService } from 'app/services/synthesis.service';
import { TranslationService } from 'app/translation.service';

@Component({
  selector: 'app-dictgloss',
  templateUrl: './dictgloss.component.html',
  styleUrls: ['./dictgloss.component.scss']
})

export class DictglossComponent implements OnInit {

  constructor(
    private synth: SynthesisService,
    public ts: TranslationService,
  ) { }

  ngOnInit(): void {
  }
  //HB no point in showing the controls anyway as it is now, only the last sentence can be played again.
  //Instead a button to replay everything.
  //Do we want to be able to replay at all? Replay each sentence separately?
  show_audio_controls: boolean = false;
  show_replay_button: boolean = true;
  //If false, text inputs only appear after the last sound file has been played
  show_text_input_immediately: boolean = false;
  texts: string;
  container_id: string = "dictgloss_container";
  defaultText: string = "--";


  init() {
    //If the page is loaded with a 'text' as url parameter, load that text instead of using the ones listed here
    //Example: dictgloss.html?text={"name":"urltest","txt":"test/story.txt","wavs":["test/audio/wav/paragraph_1.wav","test/audio/wav/paragraph_2.wav"]}
    if (location.search !== "") {
      console.log("Loading text from location.search: " + location.search);

      var sp = new URLSearchParams(location.search)
      var text = JSON.parse(sp.get("text"))
      console.log(text);
      console.log("text.name: " + text.name);
      this.dictgloss(text);
    } else {
      console.log("Loading texts from " + this.texts);
    }
  }

  wrong_words_div: any;
  words: string[] = [];
  displayText(text) {
    console.log("displayText: " + text);
    var container = document.getElementById(this.container_id);
    container.innerHTML = "";

    var words_div = document.createElement("div");
    container.appendChild(words_div);
    var input_div = document.createElement("div");
    container.appendChild(input_div);

    //global div for wrong guesses
    this.wrong_words_div = document.createElement("div");
    container.appendChild(this.wrong_words_div);

    //global list of words
    this.words = [];


    //split text by newline and loop over list..
    var text_sentences = text.split(/\n+/);
    this.displaySentences(text_sentences, words_div);



    //Word input field
    var word_input = document.createElement("input");
    word_input.type = "entry";
    word_input.setAttribute("onkeydown", "checkWord(this, event);");
    input_div.appendChild(word_input);

    word_input.focus();
  }

  displaySentences(text_sentences, sentences_div) {
    var counter = 0;
    for (let i in text_sentences) {
      var sentence = text_sentences[i];

      console.log("Counter: " + counter);


      var text_words = sentence.split(/\s+/);
      var counter = this.displayWords(text_words, sentences_div, counter);

      var br = document.createElement("hr");
      sentences_div.appendChild(br);
    }
  }


  displayWords(text_words, words_div, counter) {
    //console.log(text_words);
    let iCounter: number;
    for (let i in text_words) {
      var word = text_words[i];

      //if the word begins or ends with punctuation, add label(s) before or after
      var prepunctRegexp = /^(["'])(.+)$/;
      var match = prepunctRegexp.exec(word);
      if (match) {
        var prepunct = match[0];
        word = match[1];

        //console.log("prepunct: "+prepunct+" word: "+word);

        var prepunct_label = document.createElement("button");
        prepunct_label.innerText = prepunct;
        prepunct_label.setAttribute("style", "height:2em;width:2em;color:blue;"); //COULD NOT WORK - FIONN
        words_div.appendChild(prepunct_label);

      }

      var punctRegexp = /^(.+)([?!,.:;'"]+)$/;
      var punct_label = null;
      match = punctRegexp.exec(word);
      if (match) {
        word = match[1];
        var punct = match[2];

        //console.log("punct: "+punct+" word: "+word);

        punct_label = document.createElement("button");
        punct_label.innerText = punct;
        punct_label.style = "height:2em;width:2em;color:blue;";
      }

      //global word list should not contain punctuation
      this.words.push(word);

      //make the word label
      var labelwidth = word.length + 1;
      //console.log(word+": "+labelwidth);
      var label = document.createElement("button");
      var labelid = +i + +counter;
      label.id = "word_" + labelid;
      //console.log("label.id: "+label.id);

      //console.log("Pushed "+label.id+" to words list: "+words.length);




      //The defaultText is what we want to begin with
      label.innerText = this.defaultText;
      //just for testing
      //label.innerText = word;


      label.setAttribute("style", "height:2em;width:" + labelwidth + "em;color:blue;"); //Could not work - Fionn

      //If user clicks the label, show first letter as hint
      label.setAttribute("onclick", "document.getElementById(\"" + label.id + "\").innerText = \"" + word.charAt(0) + "\";");

      //console.log("Appending label for: "+word);
      words_div.appendChild(label);

      //finally append punct_label if needed
      if (punct_label) {
        //console.log("Appending label for: "+punct);
        words_div.appendChild(punct_label);
      }
      iCounter++;
    }
    //+ before number makes js see it as a number and not a string ..
    return +counter + +iCounter + 1;
  }


  audio_urls: any;
  showReplay: boolean = false;
  synthItem: SynthItem;
  dictglossLoad() {
    console.log("dictglossLoad()");
    /*
    if (this.texts !== undefined){
      this.showReplay = true;
    }
    **/
    var selector = document.getElementById("textSelector") as HTMLInputElement;
    this.texts = selector.value;
    this.dictglossSynthRefresh();

    console.log('The input text is:', this.texts);
    this.dictgloss(this.texts);
  }

  dictglossSynthRefresh() {
    if (this.synthItem?.dispose instanceof Function) this.synthItem.dispose();
    this.synthItem = new SynthItem(this.texts, 'connemara', this.synth);
    console.log("REQUEST URL:",this.synthItem.requestUrl);  //Could be not working as you need to use this variable from this.synthItem instead of audioUrl
    
  }

  dictgloss(text) {
    var text_url = this.synthItem.audioUrl;
    console.log("text_url: " + text_url);

    this.audio_urls = this.synthItem.audioUrl;    //Make Synth (UNDEFINED!?!?!)
    console.log("audio_urls: " + this.audio_urls);

    
    document.getElementById("url_display").innerText = "Audio Playback";
    document.getElementById(this.container_id).innerHTML = "";

    this.loadAudioUrls();
    
    this.getTextFromUrl(this.audio_urls);

    if (this.show_text_input_immediately) {
      this.showTextInputs();
    }
  }

  showTextInputs() {
    var container = document.getElementById(this.container_id);
    container.setAttribute("style", "display:block");
  }


  getTextFromUrl(url) {
    if (url.endsWith("txt")) {
      var content_type = "text";
    } else {
      var content_type = "html";
    }

    if (content_type == "text") {
      this.getTextFromTxtUrl(url);
    } else {
      this.getTextFromHtmlUrl(url);
    }
  }

  getTextFromTxtUrl(url) {
    console.log("getTextFromUrl: " + url);

    function reqListener() {
      var text = this.responseText.trim();
      //console.log(text);
      console.log("MADE IT TO getTextFromTextUrl");
      
      this.displayText(text);
    }

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", reqListener);
    xhr.open("GET", url);
    xhr.send();

  }

  
  getTextFromHtmlUrl(url) {
    var xhr = new XMLHttpRequest();
    xhr.onload = () => {
      //console.log(this.responseXML);
      //text = this.responseXML.body.textContent.trim();
      //text = text.replace(/\s+/g," ");
      this.displayText(this.synthItem.audioUrl);
      console.log("MADE IT TO getTextFromHtmlUrl");

      var paragraphs = document.getElementsByTagName("p");
      console.log(paragraphs);

      var par_text_list = [];
      for (let i = 0; i < paragraphs.length; i++) {
        var par_text = paragraphs[i].textContent.trim();
        par_text = par_text.replace(/\s+/g, " ");
        par_text_list.push(par_text);
      }
      var text = par_text_list.join("\n");
      this.displayText(text);

    }
    xhr.open("GET", url);
    xhr.responseType = "document";
    xhr.send();
  }


  checkWord(element, event) {
    if (event.keyCode == 13) {
      let word = element.value;
      console.log("checkWord: " + word);

      if (this.words.indexOf(word) == -1) {
        //If the typed word is not in the words list
        var wrongWordElement = document.createElement("div");
        wrongWordElement.innerText = word;
        this.wrong_words_div.appendChild(wrongWordElement);
      } else {
        //If the word is found, loop through the list and show the word in the right position
        var start_index = 0;
        while (this.words.indexOf(word, start_index) != -1) {
          let word_index = this.words.indexOf(word, start_index);
          console.log("Found " + word + " at " + word_index + " in " + this.words);
          var wordElement = document.getElementById("word_" + word_index);
          wordElement.innerText = word;
          start_index = word_index + 1;
        }
      }
      element.value = "";
      element.focus();

    }

  }
  

  playing_index: any;
  loadAudioUrls() {
    let audio = new Audio(this.synthItem.audioUrl);
    audio.pause();

    if (this.show_audio_controls) {
      audio.setAttribute("controls", "true");
    }
    if (this.show_replay_button) {
      let replayButton = document.getElementById("replayButton");
      replayButton.setAttribute("style", "display:block");
    }

    //audio.addEventListener("ended", this.playNext);
    //this.playing_index = -1;
    //this.playNext();
  }
/** 
  playNext() {
    let audio = document.getElementById("audio_player") as HTMLAudioElement;
    this.playing_index++;
    if (this.playing_index < this.audio_urls.length) {
      var audio_url = this.audio_urls[this.playing_index];
      console.log("Playing: " + audio_url);
      audio.src = audio_url;
      audio.play();
    } else {
      this.showTextInputs();
    }
  }
  */
}
