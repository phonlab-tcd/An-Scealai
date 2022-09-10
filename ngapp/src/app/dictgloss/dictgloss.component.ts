import { Component, OnInit } from '@angular/core';
import { SynthItem } from 'app/synth-item';
import { SynthesisService } from 'app/services/synthesis.service';
import { TranslationService } from 'app/translation.service';
import { timeStamp } from 'console';

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

  //I recognise that using parallel arrays wasn't the most intuitive move - Fionn
  texts: string;
  wrong_words_div: string = '';
  words: string[] = [];
  shownWords: string[] = [];
  wrongWords: string[] = [];
  wordsPunc: string[] = [];
  hasText: boolean = false;
  hasIncorrect: boolean = false;
  synthText: string;
  guess: string;
  regex: any = /[^a-zA-Z0-9áÁóÓúÚíÍéÉ]+/;
  regexg: any = /([^a-zA-Z0-9áÁóÓúÚíÍéÉ]+)/g;

  displayText(text) {
    console.log("displayText: " + text);
    
    //global lists of words
    this.words = [];
    this.shownWords = [];
    this.wrongWords = [];
    this.wordsPunc = [];
    this.synthText = '';
    this.wrong_words_div = "";
    
    this.words = text.split(this.regex);
    this.wordsPunc = text.split(this.regexg);

    this.texts = '';

    //Gets rid of multiple spaces
    for(let i = 0 ; i < this.wordsPunc.length; i++){
      if(this.wordsPunc[i] === ''){
        this.wordsPunc.splice(i, 1);
        if(i > 0){
          i--;
        }
      } else {
        if(this.regex.test(this.wordsPunc[i])){
          this.shownWords.push(this.wordsPunc[i]); //For every punctuation mark, add it to the list of shown words(purely for comparing arrays)
        } else {
          let dashes = "";
          for(let j = 0; j < this.wordsPunc[i].length; j++){
            dashes += '-';  //For every character, adds a dash.
          }
          this.shownWords.push(dashes); //For every word add the dashes.
        }
      }
    }

    for(let i = 0 ; i < this.words.length; i++){
      if(this.words[i] === ''){
        this.words.splice(i, 1);
        if(i > 0){
          i--;
        }
      }
    }

    //Gets rid of first character space that breaks program
    if(this.words[0] == " "){
      this.words.splice(0, 1);
    }
    
    if(this.wordsPunc[0] == " "){
      this.wordsPunc.splice(0, 1);
    }

    for(let i = 0; i < this.words.length; i++){
      this.synthText += this.words[i] + " ";
    }

    console.log('This is the synth input', this.synthText);
    this.dictglossSynthRefresh();
    
    console.log("WORDS: ", this.words);
    console.log("PUNCTUATED WORDS: ", this.wordsPunc);
    console.log("SHOWN WORDS: ", this.shownWords);
    
    
  }

  firstChar(index: number) {
    if(this.shownWords[index] !== this.wordsPunc[index]){
      this.shownWords[index] = this.wordsPunc[index].slice(0, 1);
    }
  }

  audio_urls: any;
  showReplay: boolean = false;
  synthItem: SynthItem;
  dictglossLoad() {
    this.allGuessed = false;
    var selector = document.getElementById("textSelector") as HTMLInputElement;
    this.texts = selector.value;

    let isValid = false;
    for(let i = 0; i < this.texts.length; i++){
      if(this.texts[i] !== " "){
        isValid = true;
        break;
      }
    }

    if(this.texts.length > 0 && isValid){
      this.hasText = true;
    } else {
      this.hasText = false;
    }

    console.log(this.texts.length, this.hasText);
    

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

  isNotPunctuated(i: string) {
    if(this.regex.test(i)){
      return false;
    } else {
      return true;
    }
  }

  allGuessed: boolean = false;
  guessCheck: boolean = false;
  checkWord() {
    //Word input field
    let word: string;
    var word_input = document.getElementById("guesses_input") as HTMLInputElement;
    word = word_input.value;

    console.log(word);
    
    if (this.wordsPunc.indexOf(word) == -1 && !this.wrongWords.includes(word)) {
      //If the typed word is not in the words list
      this.hasIncorrect = true;
      this.wrong_words_div += word + "<br>";
      this.wrongWords.push(word);
    } else {
      //If the word is found, loop through the list and show the word in the right position
      var start_index = 0;
      while (this.wordsPunc.indexOf(word, start_index) !== -1) {
        let word_index = this.wordsPunc.indexOf(word, start_index);
        this.shownWords[word_index] = this.wordsPunc[word_index];
        start_index = word_index + 1;
      }
    }

    this.guessCheck = true;
    for(let i = 0; i < this.wordsPunc.length; i++){
      if(this.wordsPunc[i] !== this.shownWords[i]){
        this.guessCheck = false;
        break;
      }
    }
    if(this.guessCheck){
      this.allGuessed = true;
    }
    word_input.value = "";
  }

  //For if there is a single letter word that is pressed last.
  generalCheck(){
    this.guessCheck = true;
    for(let i = 0; i < this.wordsPunc.length; i++){
      if(this.wordsPunc[i] !== this.shownWords[i]){
        this.guessCheck = false;
        break;
      }
    }
    if(this.guessCheck){
      this.allGuessed = true;
    }
  }
}
