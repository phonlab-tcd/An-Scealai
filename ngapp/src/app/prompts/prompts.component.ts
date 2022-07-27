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
  tempWordDatabase = {
    noun:        ['an chistin', 'an t-urlár', 'an fear', 'an bád'],
    verb:        ['buail', 'ith', 'clois', 'tabhair'],
    adjective:   ['ard', 'deas', 'mór', 'te'],
    pronoun:     ['sé', 'mé', 'tú', 'sibh'],
    determiner:  ['seo', 'a', 'cé', 'an'],
    article:     ['an'],
    adverb:      ['síos', 'mar', 'conas', 'siar'],
    adposition:  ['le', 'sa'],
    conjunction: ['agus', 'go'],
    numeral:     ['trí', 'céad', 'triúr', 'ceathrar']
  }

  tempWordDatabaseEnglish = {
    noun:        ['the kitchen', 'the floor', 'the man', 'the boat'],
    verb:        ['to hit/meet', 'to eat', 'to listen', 'to give'],
    adjective:   ['tall', 'nice', 'big', 'hot'],
    pronoun:     ['him', 'I', 'you', 'you(plural)'],
    determiner:  ['his/her/theirs', 'this', 'who', 'the'],
    article:     ['the'],
    adverb:      ['down', 'because', 'how', 'behind'],
    adposition:  ['with', 'in'],
    conjunction: ['and', 'to'],
    numeral:     ['3', '100', '3(Person)', '4(People)']
  }


  // @ViewChild('audioElement') audioElement; // unused

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
  wordTypes = Object.keys(this.tempWordDatabase);

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
    if(this.synthItem?.dispose instanceof Function) this.synthItem.dispose();
    this.synthItem = new SynthItem(this.arrayString, this.newStoryForm.get('dialect').value, this.synth);
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

  async selectWord(type: keyof typeof this.tempWordDatabase) {
    this.givenWord  = this.randomWord(this.tempWordDatabase[type]);
  }
  

  posConfirmation(isConfirmed: Boolean) {
    if(isConfirmed && this.givenWord != this.WORD_PROMPT){
      this.wordBank.push(this.givenWord);
      this.createWordBankString(this.wordBank);
      this.getBankHighlights();
      this.posSynthRefresh();
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

}
