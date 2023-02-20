import { Component, OnInit, ViewEncapsulation, Input, ElementRef, ViewChild } from '@angular/core';
import { TranslationService } from '../../translation.service';
import { StoryService } from '../../story.service'
import { AuthenticationService } from 'app/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SynthesisService, Voice } from 'app/services/synthesis.service';
import { SynthItem } from 'app/synth-item';
import { HttpClient } from '@angular/common/http';
import { GrammarEngine } from '../../lib/grammar-engine/grammar-engine';
import { anGramadoir } from '../../lib/grammar-engine/checkers/an-gramadoir';
import { ErrorTag } from '../../lib/grammar-engine/types';
import { PROMPT_DATA } from "../prompt-data";

type TagForHighlight = {
  fromx: number;
  tox: number;
};

@Component({
  selector: 'app-part-of-speech',
  templateUrl: './part-of-speech.component.html',
  styleUrls: ['./part-of-speech.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class PartOfSpeechComponent implements OnInit {

  wordDatabase;
  WORD_PROMPT = 'Please choose a word type';
  givenWord = 'Please choose a word type';
  wordBank = [];
  arrayString = '';
  newStoryForm: FormGroup;
  grammarEngine: GrammarEngine;
  bankHighlights: Observable<any>;
  indiceValues: TagForHighlight[] = [];
  innerHTMLWordBank: string = '';
  bankHighlightsLoading: boolean = true;
  synthItem: SynthItem;
  wordTypes: string[] = [];

  buttonsLoading: boolean = false;
  errorButtons: string[];

  selected: Voice;
  
  constructor(
    private storyService: StoryService,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    public ts: TranslationService,
    private synth: SynthesisService,
    private http: HttpClient,
  ) { 
    this.wordDatabase = PROMPT_DATA['part-of-speech'];
    this.wordTypes = Object.keys(this.wordDatabase);
    this.posCreateForm(); 
  }

  ngOnInit(): void {
    this.grammarEngine = new GrammarEngine([anGramadoir], this.http, this.auth);
    this.refresh();
  }

  refresh(voice: Voice = undefined) {
    if(voice) this.selected = voice;
    if (this.synthItem) {
      this.synthItem.audioUrl = undefined;
      this.synthItem.dispose();
      this.synthItem = null;
    }

    this.makeSynth();
    // setTimeout is just for juice (Neimhin Fri 28 Jan 2022 23:19:46)
    if(this.arrayString === "") return;
  }

  makeSynth(){
    if (!this.arrayString) {return;}
    this.synthItem = this.getSynthItem(this.arrayString);
    this.synthItem.text = "Play Prompt";
  }

  getSynthItem(line: string) {
    return new SynthItem(line, this.selected, this.synth);
  }

  posSynthRefresh() {
    if (this.synthItem?.dispose instanceof Function) this.synthItem.dispose();
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
    this.storyService.saveStory(this.auth.getUserDetails()._id, title, new Date(), dialect, text, this.auth.getUserDetails().username, true);
  }

  async selectWord(type: keyof typeof this.wordDatabase) {
    this.givenWord = this.randomWord(this.wordDatabase[type]);
  }

  posConfirmation(isConfirmed: Boolean) {
    if (isConfirmed && this.givenWord != this.WORD_PROMPT) {
      this.wordBank.push(this.givenWord);
      this.createWordBankString(this.wordBank);
      this.getBankHighlights();
      this.posSynthRefresh();
    } else {
      this.givenWord = this.WORD_PROMPT;
    }
  }

  //While this is loading the text should be shown unhighlighted.
  async getBankHighlights() {
    this.bankHighlightsLoading = true;
    this.grammarEngine.check$(this.arrayString).subscribe({
      next: (tag: ErrorTag) => {
        let entry:TagForHighlight =
          {
            fromx: Number(tag.fromX),
            tox: Number(tag.toX)
          }
        this.indiceValues.push(entry);
      },
      error: function () {},
      complete: () => {
        if (this.indiceValues.length !== 0) {
          let newStart: number = 0;
          let lastBitToAdd: number = 0;
          this.innerHTMLWordBank = '';
          for (var i = 0; i < this.indiceValues.length; i++) {
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
      },
    });
  }

  createWordBankString(array: Array<string>) {
    let arrayString = '';
    if (array.length > 0) {
      for (var i = 0; i < array.length; i++) {
        arrayString += array[i];
        arrayString += ' ';
      }
      arrayString = arrayString.slice(0, -1) + '.';
      arrayString = arrayString.charAt(0).toUpperCase() + arrayString.slice(1);
      this.arrayString = arrayString;
    }
    this.makeSynth();
    return arrayString;
  }

  resetWordBank() {
    this.wordBank = [];
    this.indiceValues = [];
    this.createWordBankString(this.wordBank);
    this.getBankHighlights();
  }

  randomWord(wordList: Array<string>) {
    return wordList[Math.floor(Math.random() * wordList.length)];
  }

}