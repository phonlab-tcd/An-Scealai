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
import { ErrorTag } from "../../lib/grammar-engine/types";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "../../dialogs/basic-dialog/basic-dialog.component";
import config from "../../../abairconfig";

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
  givenWordEntry: Object = {};
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
  showTranslation: boolean = false;
  posInformation: Object = {
    noun: "/assets/pdf/noun_information_ga.pdf",
    verb: "/assets/pdf/verb_information_ga.pdf",
    adjective: "/assets/pdf/adjective_information_ga.pdf",
    adverb: "/assets/pdf/adverb_information_ga.pdf",
    article: "/assets/pdf/article_information_ga.pdf",
    conjunction: "/assets/pdf/conjugation_information_ga.pdf",
    pronoun: "/assets/pdf/pronoun_information_ga.pdf",
    preposition: "/assets/pdf/preposition_information_ga.pdf",
  };

  constructor(
    private storyService: StoryService,
    public auth: AuthenticationService,
    private fb: FormBuilder,
    public ts: TranslationService,
    private synth: SynthesisService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.wordDatabase = {};
    this.createStoryForm();
  }

  ngOnInit(): void {
    this.getPosData();
    this.refreshSynthesis();
  }

  /**
   * Get POS data from the database
   * Create a dictionary of pos types and array of coresponding word objects
   * e.x: {noun: [{1}, {2}, {3}, ...], verb: [{1}, {2}, {3}], ...}
   */
  getPosData() {
    const headers = { Authorization: "Bearer " + this.auth.getToken() };
    this.http.get<any>(config.baseurl + "prompt/getData/partOfSpeech", { headers }).subscribe({
      next: (data) => {
        data.forEach((entry) => {
          if (!this.wordDatabase[entry.partOfSpeechData.partOfSpeech]) {
            this.wordDatabase[entry.partOfSpeechData.partOfSpeech] = []; // initialise key as empty array
          }
          this.wordDatabase[entry.partOfSpeechData.partOfSpeech].push(
            entry.partOfSpeechData
          ); // push data to key
        });
        this.wordTypes = Object.keys(this.wordDatabase); // create an array from the keys (the parts of speech)
      },
      error: (err) => {
        console.log(err);
        this.wordDatabase = {};
      },
    });
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
   * Synthesise the constructed prompt
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
    this.givenWordEntry = wordList[Math.floor(Math.random() * wordList.length)];
  }

  /**
   * Add randomly selected word to the word bank
   */
  addToWordBank() {
    if (this.givenWordEntry) {
      this.wordBank.push(this.givenWordEntry["word"]);
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

  /**
   * Open dialog for part of speech descriptions
   */
  openPartOfSpeechDescription(type: string) {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.pos_instructions[type],
        type: "PDF",
        data: this.posInformation[type],
        confirmText: this.ts.l.done,
      },
      width: "90vh",
    });

    this.dialogRef.afterClosed().subscribe((_) => {
      this.dialogRef = undefined;
    });
  }
}
