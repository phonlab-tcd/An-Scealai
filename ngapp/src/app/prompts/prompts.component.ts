import { Component, OnInit, SimpleChanges, ViewEncapsulation,  } from '@angular/core';
import { GrammarService } from 'app/grammar.service';
import { TranslationService } from '../translation.service';
import { StoryService } from '../story.service'
import { AuthenticationService } from 'app/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SynthesisService } from 'app/services/synthesis.service';
import { SynthItem } from 'app/synth-item';


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

  //This is for the highlighting of buttons based on whether they can be used next in the sentence.
  //It is not so easy with such loosely defined word types. I have also never done computational morphology before.
  //Don't have the following properly defined in tempWordDatabase: subject, object, 
  //'dir.object', 'ind.object', 'local modifier', 'modal modifier', 'temportal modifier''etc.', 'dir.pronominal object'
  /**
  subject: string[] = ['pronoun', 'noun'];
  object: string[] = ['pronoun', 'noun'];

  wordOrder = [
    ['verb', this.subject, this.object],
    ['verb', this.subject, 'dir.object', 'ind.object', 'local modifier', 'modal modifier', 'temportal modifier'],
    ['verb', this.subject, 'ind.object', 'etc.', 'dir.pronominal object'],
  ]
   */
  //I realize there is too much nuance between words that would take too long to accomodate for, I will try
  //it the slow way using Gramadoir.

  
  /** tempWordDatabaseEnglish = {
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
  } */


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

  buttonsLoading: boolean = false;
  errorButtons: string[];

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

  //Slow way of checking first word in each word type list to give button "viability" color.
  /** Note: Doesn't work currently, just leaving here incase I use it. Even if it did work however,
   * it would be extremely slow most likely
  async buttonHighlighting() {
    this.buttonsLoading = true;
    for(let key in this.tempWordDatabase){
      let first = this.tempWordDatabase[key][0];
      let next = this.gs.gramadoirDirectObservable(this.arrayString + " " + first, 'ga');
      let error;
      next.subscribe(res => {
      console.log(res,'<CHECKING FOR ERRORS>');
        error = res.map(element => 
          new Object(
            {
              errorText: String(element.errortext)
            }
          )
        )
      });
      //if(error[-1].errorText !== "undefined" || undefined) {
        this.errorButtons.push(this.wordTypes[-1]);
        console.log(this.errorButtons, '(NEW BUTTON ADDED)');
      //} else {
      //  console.log('(NO ERROR)');
      //}
      //console.log(error[0].errorText,"<ERROR ERROR ERROR>");
    }
  } */

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
