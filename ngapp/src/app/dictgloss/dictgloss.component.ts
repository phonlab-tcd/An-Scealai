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
    } else {
      console.log("Loading texts from " + this.texts);
    }
  }

  wrong_words_div: string = '';
  words: string[] = [];
  hasText: boolean = false;
  hasIncorrect: boolean = false;
  guess: string;
  displayText(text) {
    this.hasText = true;
    console.log("displayText: " + text);
    
    //global list of words
    this.words = [];


    //split text by newline and loop over list..
    //var text_sentences = text.split(/\n+/);

    //split text by full stops and loop over list..
    var text_sentences: string[] = text.split(".");
    console.log("Text sentences:", text_sentences);
    for(let i = 0; i < text_sentences.length; i++){
      let curr = text_sentences[i].split(" " || ",");
      this.words = this.words.concat(curr);
    }

    for(let i = 0 ; i < this.words.length; i++){
      if(this.words[i] === ''){
        this.words.splice(i, 1);
        if(i > 0){
          i--;
        }
      }
    }

    console.log("WORDS SPLIT", this.words);
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
    if(this.texts.length !== 0){
      this.hasText = true;
    }
    this.dictglossSynthRefresh();

    console.log('The input text is:', this.texts);
    this.displayText(this.texts);
  }

  dictglossSynthRefresh() {
    if (this.synthItem?.dispose instanceof Function) this.synthItem.dispose();
    this.synthItem = new SynthItem(this.texts, 'connemara', this.synth);
    console.log("REQUEST URL:",this.synthItem.requestUrl);
  }

  checkWord() {
    //Word input field
    let word: string;
    var word_input = document.getElementById("guesses_input") as HTMLInputElement;
    word = word_input.value;

    console.log(word);
    
    if (this.words.indexOf(word) == -1) {
      //If the typed word is not in the words list
      this.hasIncorrect = true;
      this.wrong_words_div += word + "\n";
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
  }
}
