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
  shownWords: string[] = [];
  wrongWords: string[] = [];
  wordsPunc: string[] = [];
  hasText: boolean = false;
  hasIncorrect: boolean = false;
  synthText: string;
  guess: string;
  displayText(text) {
    this.hasText = true;
    console.log("displayText: " + text);
    
    //global lists of words
    this.words = [];
    this.shownWords = [];
    this.wrongWords = [];
    this.wordsPunc = [];
    this.synthText = '';
    this.wrong_words_div = "";
    
    this.words = text.split(/[ .,";!?(){}\r\n\t\s]+/);
    this.wordsPunc = text.split(/([ .,";!?(){}\r\n\t\s]+)/g);

    this.texts = '';
    //Gets rid of multiple spaces
    for(let i = 0 ; i < this.words.length; i++){
      if(this.words[i] === ''){
        this.words.splice(i, 1);
        if(i > 0){
          i--;
        }
      } else {
        this.shownWords.push("...");
      }
    }

    for(let i = 0; i < this.words.length; i++){
      this.synthText += this.words[i] + " ";
    }

    console.log('This is the synth input', this.synthText);
    this.dictglossSynthRefresh();
    
    console.log("WORDS: ", this.words);
    console.log("PUNCTUATED WORDS: ", this.wordsPunc);
    
  }

  firstChar(index: number) {
    if(this.shownWords[index] !== this.words[index]){
      this.shownWords[index] = this.words[index].slice(0, 1);
    }
  }

  audio_urls: any;
  showReplay: boolean = false;
  synthItem: SynthItem;
  dictglossLoad() {
    var selector = document.getElementById("textSelector") as HTMLInputElement;
    this.texts = selector.value;

    if(this.texts.length !== 0){
      this.hasText = true;
    }

    console.log('The input text is:', this.texts);
    this.displayText(this.texts);
    selector.value = "";
  }

  dictglossSynthRefresh() {
    if (this.synthItem?.dispose instanceof Function) this.synthItem.dispose();
    this.synthItem = new SynthItem(this.synthText, 'connemara', this.synth);
    this.synthItem.text = "Play Text";  //Makes the text in the synth item not visible
    console.log("REQUEST URL:",this.synthItem.requestUrl);
  }

  allGuessed: boolean = false;
  guessCheck: boolean = false;
  checkWord() {
    this.allGuessed = false;
    //Word input field
    let word: string;
    var word_input = document.getElementById("guesses_input") as HTMLInputElement;
    word = word_input.value;

    console.log(word);
    
    if (this.words.indexOf(word) == -1 && !this.wrongWords.includes(word)) {
      //If the typed word is not in the words list
      this.hasIncorrect = true;
      this.wrong_words_div += word + "<br>";
      this.wrongWords.push(word);
    } else {
      //If the word is found, loop through the list and show the word in the right position
      var start_index = 0;
      while (this.words.indexOf(word, start_index) != -1) {
        let word_index = this.words.indexOf(word, start_index);
        //console.log("Found " + word + " at " + word_index + " in " + this.words); commented out because user could see in console
        this.shownWords[word_index] = this.words[word_index];
        start_index = word_index + 1;
      }
    }

    this.guessCheck = true;
    for(let i = 0; i < this.words.length; i++){
      if(this.words[i] !== this.shownWords[i]){
        this.guessCheck = false;
        break;
      }
    }
    if(this.guessCheck){
      this.allGuessed = true;
    }
    word_input.value = "";
  }
}
