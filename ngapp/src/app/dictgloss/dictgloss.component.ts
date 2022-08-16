import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dictgloss',
  templateUrl: './dictgloss.component.html',
  styleUrls: ['./dictgloss.component.scss']
})

export class DictglossComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  /**
  //HB no point in showing the controls anyway as it is now, only the last sentence can be played again.
  //Instead a button to replay everything.
  //Do we want to be able to replay at all? Replay each sentence separately?
  show_audio_controls: boolean = false;
  show_replay_button: boolean = true;


  //If false, text inputs only appear after the last sound file has been played
  show_text_input_immediately: boolean = false;






  texts = [
    {
      "name": "test",
      "txt": "test/story.txt",
      "wavs":
        [
          "test/audio/wav/paragraph_1.wav",
          "test/audio/wav/paragraph_2.wav"
        ]
    },

    {
      "name": "Mo Sgéal Féin First paragraph",
      "txt": "test/msf/msf_1-9.txt",
      "wavs":
        [
          "test/msf/tcd_ga_mu_mnl_msf_0001.wav",
          "test/msf/tcd_ga_mu_mnl_msf_0002.wav",
          "test/msf/tcd_ga_mu_mnl_msf_0003.wav",
          "test/msf/tcd_ga_mu_mnl_msf_0004.wav",
          "test/msf/tcd_ga_mu_mnl_msf_0005.wav",
          "test/msf/tcd_ga_mu_mnl_msf_0006.wav",
          "test/msf/tcd_ga_mu_mnl_msf_0007.wav",
          "test/msf/tcd_ga_mu_mnl_msf_0008.wav",
          "test/msf/tcd_ga_mu_mnl_msf_0009.wav"
        ]
    },

    {
      "name": "dictogloss test",
      "txt": "http://www.abair.tcd.ie/anscealai/stories/users/harald/dictgloss-test/ga_CM/story.txt",
      "wavs":
        [
          "http://www.abair.tcd.ie/anscealai/stories/users/harald/dictgloss-test/ga_CM/audio/wav/paragraph_2.wav",
          "http://www.abair.tcd.ie/anscealai/stories/users/harald/dictgloss-test/ga_CM/audio/wav/paragraph_3.wav",
          "http://www.abair.tcd.ie/anscealai/stories/users/harald/dictgloss-test/ga_CM/audio/wav/paragraph_4.wav",
          "http://www.abair.tcd.ie/anscealai/stories/users/harald/dictgloss-test/ga_CM/audio/wav/paragraph_5.wav"
        ]
    }

  ]






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
      dictgloss(text);
    } else {
      console.log("Loading texts from " + texts);
      this.selectorLoad();
    }
  }


  displayText(text) {
    console.log("displayText: " + text);
    var container = document.getElementById(this.container_id);
    container.innerHTML = "";

    var words_div = document.createElement("div");
    container.appendChild(words_div);
    var input_div = document.createElement("div");
    container.appendChild(input_div);

    //global div for wrong guesses
    wrong_words_div = document.createElement("div");
    container.appendChild(wrong_words_div);

    //global list of words
    words = [];


    //split text by newline and loop over list..
    var text_sentences = text.split(/\n+/);
    displaySentences(text_sentences, words_div);



    //Word input field
    var word_input = document.createElement("input");
    word_input.type = "entry";
    word_input.setAttribute("onkeydown", "checkWord(this,event);");
    input_div.appendChild(word_input);

    word_input.focus();
  }

  displaySentences(text_sentences, sentences_div) {
    var counter = 0;
    for (i in text_sentences) {
      var sentence = text_sentences[i];

      console.log("Counter: " + counter);


      var text_words = sentence.split(/\s+/);
      counter = displayWords(text_words, sentences_div, counter);

      var br = document.createElement("hr");
      sentences_div.appendChild(br);
    }
  }


  displayWords(text_words, words_div, counter) {
    //console.log(text_words);
    for (i in text_words) {
      var word = text_words[i];

      //if the word begins or ends with punctuation, add label(s) before or after
      var prepunctRegexp = /^(["'])(.+)$/;
      match = prepunctRegexp.exec(word);
      if (match) {
        var prepunct = match[0];
        word = match[1];

        //console.log("prepunct: "+prepunct+" word: "+word);

        var prepunct_label = document.createElement("button");
        prepunct_label.innerText = prepunct;
        prepunct_label.style = "height:2em;width:2em;color:blue;";
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
      words.push(word);

      //make the word label
      var labelwidth = word.length + 1;
      //console.log(word+": "+labelwidth);
      label = document.createElement("button");
      var labelid = +i + +counter;
      label.id = "word_" + labelid;
      //console.log("label.id: "+label.id);

      //console.log("Pushed "+label.id+" to words list: "+words.length);




      //The defaultText is what we want to begin with
      label.innerText = defaultText;
      //just for testing
      //label.innerText = word;


      label.style = "height:2em;width:" + labelwidth + "em;color:blue;";

      //If user clicks the label, show first letter as hint
      label.setAttribute("onclick", "document.getElementById(\"" + label.id + "\").innerText = \"" + word.charAt(0) + "\";");

      //console.log("Appending label for: "+word);
      words_div.appendChild(label);

      //finally append punct_label if needed
      if (punct_label) {
        //console.log("Appending label for: "+punct);
        words_div.appendChild(punct_label);
      }

    }
    //+ before number makes js see it as a number and not a string ..
    return +counter + +i + 1;
  }

  selectorLoad() {
    var selectorDiv = document.getElementById("selectorDiv");
    selectorDiv.setAttribute("style", "display:block");
    var selector = document.getElementById("textSelector");
    for (let text of texts) {
      console.log("TEXT NAME: " + text.name);
      var opt = document.createElement("option");
      opt.text = text.name;
      selector.options.add(opt);
    }
  }


var audio_urls;
dictglossLoad() {
  console.log("dictglossLoad()");

  var selector = document.getElementById("textSelector");
  var selectedText = texts[selector.selectedIndex - 1];
  console.log("selectedText: " + selectedText.name);
  dictgloss(selectedText);
}

dictgloss(text) {
  var text_url = text.txt;
  console.log("text_url: " + text_url);

  audio_urls = text.wavs;
  console.log("audio_urls: " + audio_urls);

  document.getElementById("url_display").innerText = text_url;
  document.getElementById("dictgloss_container").innerHtml = "";

  loadAudioUrls();
  getTextFromUrl(text_url);

  if (show_text_input_immediately) {
    showTextInputs();
  }


}

showTextInputs() {
  var container = document.getElementById(container_id);
  container.setAttribute("style", "display:block");
}


getTextFromUrl(url) {
  if (url.endsWith("txt")) {
    content_type = "text";
  } else {
    content_type = "html";
  }

  if (content_type == "text") {
    getTextFromTxtUrl(url);
  } else {
    getTextFromHtmlUrl(url);
  }
}

getTextFromTxtUrl(url) {
  console.log("getTextFromUrl: " + url);

  reqListener() {
    var text = this.responseText.trim();
    //console.log(text);
    displayText(text);
  }

  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", reqListener);
  xhr.open("GET", url);
  xhr.send();

}

getTextFromHtmlUrl(url) {
  var xhr = new XMLHttpRequest();
  xhr.onload = () {
    console.log(this.responseXML);
    //text = this.responseXML.body.textContent.trim();
    //text = text.replace(/\s+/g," ");
    //displayText(text);

    var paragraphs = this.responseXML.body.getElementsByTagName("p");
    console.log(paragraphs);

    var par_text_list = [];
    for (let par of paragraphs) {
      var par_text = par.textContent.trim();
      par_text = par_text.replace(/\s+/g, " ");
      par_text_list.push(par_text);
    }
    text = par_text_list.join("\n");
    displayText(text);

  }
  xhr.open("GET", url);
  xhr.responseType = "document";
  xhr.send();
}


checkWord(element, event) {
  if (event.keyCode == 13) {
    word = element.value;
    console.log("checkWord: " + word);

    if (words.indexOf(word) == -1) {
      //If the typed word is not in the words list
      var wrongWordElement = document.createElement("div");
      wrongWordElement.innerText = word;
      wrong_words_div.appendChild(wrongWordElement);
    } else {
      //If the word is found, loop through the list and show the word in the right position
      var start_index = 0;
      while (words.indexOf(word, start_index) != -1) {
        word_index = words.indexOf(word, start_index);
        console.log("Found " + word + " at " + word_index + " in " + words);
        var wordElement = document.getElementById("word_" + word_index);
        wordElement.innerText = word;
        start_index = word_index + 1;
      }
    }
    element.value = "";
    element.focus();

  }

}

var playingIndex;
loadAudioUrls() {
  audio = document.getElementById("audio_player");
  audio.pause();

  if (show_audio_controls) {
    audio.setAttribute("controls", "true");
  }
  if (show_replay_button) {
    replayButton = document.getElementById("replayButton");
    replayButton.setAttribute("style", "display:block");
  }

  audio.addEventListener("ended", playNext);
  playing_index = -1;
  playNext();
}

playNext() {
  audio = document.getElementById("audio_player");
  playing_index++;
  if (playing_index < audio_urls.length) {
    var audio_url = audio_urls[playing_index];
    console.log("Playing: " + audio_url);
    audio.src = audio_url;
    audio.play();
  } else {
    showTextInputs();
  }
}
*/
}
