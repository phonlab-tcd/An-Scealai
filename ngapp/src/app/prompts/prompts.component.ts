import { Component, Input, OnInit, ViewChild, ViewEncapsulation,  } from '@angular/core';
import { GrammarService } from 'app/grammar.service';
import { List } from 'lodash';
import { TranslationService } from '../translation.service';
import { HighlightTag } from 'angular-text-input-highlight';
import { StoryService } from '../story.service'
import { AuthenticationService } from 'app/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SynthesisPlayerComponent } from 'app/student-components/synthesis-player/synthesis-player.component';
import { SynthesisService, Dialect } from 'app/services/synthesis.service';
import { SynthItem } from 'app/synth-item';
import { SynthesisBankService } from 'app/services/synthesis-bank.service';

@Component({
  selector: 'app-prompts',
  templateUrl: './prompts.component.html',
  styleUrls: ['./prompts.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class PromptsComponent implements OnInit {
  @ViewChild('audioElement') audioElement;

  //Unsure whether some of this stuff should be in the constructor.
  WORD_PROMPT = 'Please choose a word type';
  givenWord = 'Please choose a word type';
  wordBank = [];
  arrayString = '';
  newStoryForm: FormGroup;
  bankHighlights: Observable<any>;
  indiceValues: {fromx: number; tox: number}[] = [];
  innerHTMLWordBank: string = '';
  bankHighlightsLoading: boolean = true;
  synthItem: SynthItem;

  constructor(
    private gs : GrammarService,
    private storyService: StoryService,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    public ts : TranslationService,
    private synth: SynthesisService,
    ) { this.posCreateForm(); }

  ngOnInit(): void {
    console.log("pos-prompt-init");
  }

  //Possible data leak?
  posSynthRefresh() {
    this.synthItem = new SynthItem(this.arrayString, this.newStoryForm.get('dialect').value, this.synth);
    return this.synthItem;
  }
  
  //Could perhaps use createForm() from the dashboard component instead
  posCreateForm() {
    this.newStoryForm = this.fb.group({
      title: ['', Validators.required],
      dialect: ['connemara']
    });
  }

  posAddNewStory(title, dialect, text) {
    let date = new Date();
    let username = this.auth.getUserDetails().username;
    let studentId = this.auth.getUserDetails()._id;
    this.storyService.saveStory(studentId, title, date, dialect, text, username);
  }

  async selectWord(type: String) {
    if (type === 'verb')          { this.givenWord = this.randomWord(this.tempWordDatabase.verbs); }
    if (type === 'noun')          { this.givenWord = this.randomWord(this.tempWordDatabase.nouns); }
    if (type === 'adjective')     { this.givenWord = this.randomWord(this.tempWordDatabase.adjectives); }
    if (type === 'adverb')        { this.givenWord = this.randomWord(this.tempWordDatabase.adverbs); }
    if (type === 'pronoun')       { this.givenWord = this.randomWord(this.tempWordDatabase.pronouns); }
    if (type === 'determiner')    { this.givenWord = this.randomWord(this.tempWordDatabase.determiners); }
    if (type === 'article')       { this.givenWord = this.randomWord(this.tempWordDatabase.articles); }
    if (type === 'adposition')    { this.givenWord = this.randomWord(this.tempWordDatabase.adpositions); }
    if (type === 'conjunction')   { this.givenWord = this.randomWord(this.tempWordDatabase.conjunctions); }
    if (type === 'numeral')       { this.givenWord = this.randomWord(this.tempWordDatabase.numerals); }
  }
  


  posConfirmation(isConfirmed: Boolean) {
    if(isConfirmed && this.givenWord != this.WORD_PROMPT){
      this.wordBank.push(this.givenWord);
      this.createWordBankString(this.wordBank);
      this.getBankHighlights();
    } else {
      this.givenWord = this.WORD_PROMPT;
    }
  }

  //While this is loading the text should be shown unhighlighted.
  async getBankHighlights(){
    this.bankHighlightsLoading = true;
    this.bankHighlights = this.gs.gramadoirDirectObservable(this.arrayString, 'ga');
    this.bankHighlights.subscribe(res => {
      console.log(res,'<SUBSCRIBE STRING>');
      this.indiceValues = res.map(element => 
        new Object(
          {
            fromx: Number(element.fromx), 
            tox: Number(element.tox)
          }
        )
      )
      console.log(this.indiceValues, 'INDICEVALS');
      if (this.indiceValues.length !== 0) {
        let newStart: number = 0;
        let lastBitToAdd: number = 0;
        this.innerHTMLWordBank = '';
        for(var i = 0; i < this.indiceValues.length; i++){
          let nonHighlightStart: number = newStart;
          let highlightStart: number = this.indiceValues[i].fromx;
          let highlightEnd: number = this.indiceValues[i].tox + 1;
          lastBitToAdd = highlightEnd;
          
          this.innerHTMLWordBank += 
          this.arrayString.slice(nonHighlightStart, highlightStart)
          + '<b class="highlight">' + this.arrayString.slice(highlightStart, highlightEnd) + '</b>';

          newStart = this.indiceValues[i].tox + 1;
          console.log(newStart, '(Should have newStart in it)');
        }
        this.innerHTMLWordBank += this.arrayString.slice(lastBitToAdd, this.arrayString.length);
      } else {
        this.innerHTMLWordBank = this.arrayString;
      }
      this.bankHighlightsLoading = false;
    });
  } 
  
  createWordBankString(array: Array<string>){
    let arrayString = '';
    if (array.length > 0){
      for(var i = 0; i < array.length; i++){
        arrayString += array[i];
        arrayString += ' ';
      }
      arrayString = arrayString.slice(0, -1) + '.';
      arrayString = arrayString.charAt(0).toUpperCase() + arrayString.slice(1);
      this.arrayString = arrayString;
    }
    return arrayString;
  }

  resetWordBank(){
    this.wordBank = [];
    this.indiceValues = [];
    this.createWordBankString(this.wordBank);
    this.getBankHighlights();
  }

  randomWord(wordList: Array<string>){
    return wordList[Math.floor(Math.random() * wordList.length)];
  }

  tempWordDatabase = {
    nouns:        ['an chistin', 'an t-urlár', 'an fear', 'an bád'],
    verbs:        ['buail', 'ith', 'clois', 'tabhair'],
    adjectives:   ['ard', 'deas', 'mór', 'te'],
    pronouns:     ['sé', 'mé', 'tú', 'sibh'],
    determiners:  ['seo', 'a', 'cé', 'an'],
    articles:     ['an'],
    adverbs:      ['síos', 'mar', 'conas', 'siar'],
    adpositions:  ['le', 'sa'],
    conjunctions: ['agus', 'go'],
    numerals:     ['trí', 'céad', 'triúr', 'ceathrar']
  }

  tempWordDatabaseEnglish = {
    nouns:        ['the kitchen', 'the floor', 'the man', 'the boat'],
    verbs:        ['to hit/meet', 'to eat', 'to listen', 'to give'],
    adjectives:   ['tall', 'nice', 'big', 'hot'],
    pronouns:     ['him', 'I', 'you', 'you(plural)'],
    determiners:  ['his/her/theirs', 'this', 'who', 'the'],
    articles:     ['the'],
    adverbs:      ['down', 'because', 'how', 'behind'],
    adpositions:  ['with', 'in'],
    conjunctions: ['and', 'to'],
    numerals:     ['3', '100', '3(Person)', '4(People)']
  }
}