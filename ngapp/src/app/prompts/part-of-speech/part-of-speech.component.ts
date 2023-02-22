import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslationService } from "../../translation.service";
import { StoryService } from "../../story.service";
import { AuthenticationService } from "app/authentication.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { SynthesisService, Voice } from "app/services/synthesis.service";
import { SynthItem } from "app/synth-item";
import { HttpClient } from "@angular/common/http";
import { GrammarEngine } from "../../lib/grammar-engine/grammar-engine";
import { anGramadoir } from "../../lib/grammar-engine/checkers/an-gramadoir";
import { ErrorTag } from "../../lib/grammar-engine/types";
import { PROMPT_DATA } from "../prompt-data";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasicDialogComponent } from '../../dialogs/basic-dialog/basic-dialog.component';

type TagForHighlight = {
  fromx: number;
  tox: number;
};

@Component({
  selector: "app-part-of-speech",
  templateUrl: "./part-of-speech.component.html",
  styleUrls: ["./part-of-speech.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PartOfSpeechComponent implements OnInit {
  wordDatabase: any;
  givenWord = "";
  wordBank = [];
  constructedPrompt: string = "";
  newStoryForm: FormGroup;
  grammarEngine: GrammarEngine;
  bankHighlights: Observable<any>;
  highlightIndices: TagForHighlight[] = [];
  synthItem: SynthItem;
  wordTypes: string[] = [];
  showSynthesis: boolean = false;
  dialogRef: MatDialogRef<unknown>;
  buttonsLoading: boolean = false;
  errorButtons: string[];
  selectedVoice: Voice;

  constructor(
    private storyService: StoryService,
    public auth: AuthenticationService,
    private fb: FormBuilder,
    public ts: TranslationService,
    private synth: SynthesisService,
    private http: HttpClient,
    private dialog: MatDialog,
  ) {
    this.wordDatabase = PROMPT_DATA["part-of-speech"];
    this.wordTypes = Object.keys(this.wordDatabase);
    this.createStoryForm();
  }

  ngOnInit(): void {
    this.grammarEngine = new GrammarEngine([anGramadoir], this.http, this.auth);
    this.refreshSynthesis();
  }

  /**
   * Reset synthesis voice and audio url
   * @param voice Selected synthetic voice
   */
  refreshSynthesis(voice: Voice = undefined) {
    if (voice) this.selectedVoice = voice;
    if (this.synthItem) {
      this.synthItem.audioUrl = undefined;
      this.synthItem.dispose();
      this.synthItem = null;
    }
    this.makeSynth();
  }

  /**
   * Synthesise the word bank
   */
  makeSynth() {
    if (!this.constructedPrompt) {
      return;
    }
    this.synthItem = new SynthItem(
      this.constructedPrompt,
      this.selectedVoice,
      this.synth
    );
    this.synthItem.text = this.ts.l.play;
    this.showSynthesis = true;
  }

  /**
   * Create a story form for saving a new story
   */
  createStoryForm() {
    this.newStoryForm = this.fb.group({
      title: ["", Validators.required],
      dialect: ["connemara"],
    });
  }

  /**
   * Save new story to DB
   */
  createNewStory() {
    this.storyService.saveStory(
      this.auth.getUserDetails()._id,
      this.newStoryForm.controls["title"].value,
      new Date(),
      this.newStoryForm.controls["dialect"].value,
      this.constructedPrompt,
      this.auth.getUserDetails().username,
      true
    );
  }

  /**
   * Select a random word from the given part of speech list in the data
   * @param type part of speech
   */
  selectRandomWord(type: keyof typeof this.wordDatabase) {
    let wordList = this.wordDatabase[type];
    this.givenWord = wordList[Math.floor(Math.random() * wordList.length)];
  }

  /**
   * Add randomly selected word to the word bank
   */
  addToWordBank() {
    if (this.givenWord) {
      this.wordBank.push(this.givenWord);
    }
  }

  /**
   * Reset the word bank
   */
  resetWordBank() {
    this.wordBank = [];
    this.highlightIndices = [];
    this.refreshSynthesis();
    this.constructedPrompt = "";
    this.showSynthesis = false;
  }

  /**
   * Open dialog for instructions
   */
  openInformationDialog() {    
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.pos_instructions,
        type: 'simpleMessage',
        message: `
        <h6 align="justify">
          <p>${this.ts.l.pos_instructions_description_1}</p>
          <p>${this.ts.l.pos_instructions_description_2}</p>
        </h6>
        `,
        confirmText: this.ts.l.done,
      },
      width: '80vh',
    });
    
    this.dialogRef.afterClosed().subscribe( (_) => {
        this.dialogRef = undefined;
    });
  }

  /**
   * Add grammar highlighting to constructed prompt (Currently disabled)
   */
  async getBankHighlights() {
    this.grammarEngine.check$(this.constructedPrompt).subscribe({
      next: (tag: ErrorTag) => {
        let entry: TagForHighlight = {
          fromx: Number(tag.fromX),
          tox: Number(tag.toX),
        };
        this.highlightIndices.push(entry);
      },
      error: function () {},
      complete: () => {
        if (this.highlightIndices.length !== 0) {
          let newStart: number = 0;
          let lastBitToAdd: number = 0;
          for (let i = 0; i < this.highlightIndices.length; i++) {
            let nonHighlightStart: number = newStart;
            let highlightStart: number = this.highlightIndices[i].fromx;
            let highlightEnd: number = this.highlightIndices[i].tox + 1;
            lastBitToAdd = highlightEnd;

            // this.innerHTMLWordBank +=
            //   this.arrayString.slice(nonHighlightStart, highlightStart)
            //   + '<b class="highlight">' + this.arrayString.slice(highlightStart, highlightEnd) + '</b>';

            newStart = this.highlightIndices[i].tox + 1;
          }
          // this.innerHTMLWordBank += this.arrayString.slice(lastBitToAdd, this.arrayString.length);
        } else {
          // this.innerHTMLWordBank = this.arrayString;
        }
      },
    });
  }
}
