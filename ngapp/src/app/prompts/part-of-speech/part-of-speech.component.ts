import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { StoryService } from "app/core/services/story.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, } from "@angular/forms";
import { Router } from "@angular/router";
import { SynthesisService, Voice } from "app/core/services/synthesis.service";
import { PromptDataRow } from "app/core/models/prompt";
import { SynthItem } from "app/core/models/synth-item";
import { GrammarEngine } from "lib/grammar-engine/grammar-engine";
import { ErrorTag } from "lib/grammar-engine/types";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "app/dialogs/basic-dialog/basic-dialog.component";
import { CommonModule } from "@angular/common";
import { SynthItemModule } from "app/synth-item/synth-item.module";
import { SynthVoiceSelectModule } from "app/synth-voice-select/synth-voice-select.module";
import { PromptService } from "app/core/services/prompt.service";

type TagForHighlight = {
  fromx: number;
  tox: number;
};

type PartOfSpeechData = {
  partOfSpeech: string;
  word: string;
  translation: string;
};

@Component({
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, SynthItemModule, SynthVoiceSelectModule, ],
  selector: "app-part-of-speech",
  templateUrl: "./part-of-speech.component.html",
  styleUrls: ["./part-of-speech.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PartOfSpeechComponent implements OnInit {
  wordDatabase: Record<string, PartOfSpeechData[]> = {};
  givenWordEntry: PartOfSpeechData = {} as PartOfSpeechData;
  wordBank: string[] = [];
  constructedPrompt: string = "";
  newStoryForm: FormGroup;
  //grammarEngine: GrammarEngine;
  //: Observable<any>;
  highlightIndices: TagForHighlight[] = [];
  synthItem: SynthItem | null = null;
  wordTypes: string[] = [];
  showSynthesis: boolean = false;
  dialogRef: MatDialogRef<unknown>;
  buttonsLoading: boolean = false;
  errorButtons: string[] = [];
  selectedVoice: Voice | undefined;
  showTranslation: boolean = false;
  posInformation: { [key: string]: string } = {
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
    private router: Router,
    public ts: TranslationService,
    private synth: SynthesisService,
    private dialog: MatDialog,
    private promptService: PromptService
  ) {
    this.newStoryForm = this.fb.group({
      title: ["", Validators.required],
      dialect: ["connemara"],
    });
  }

  ngOnInit(): void {
    this.getPOSData();
    this.refreshSynthesis();
  }

  /**
   * Get POS data from the database
   * Create a dictionary of pos types and array of coresponding word objects
   * e.x: {noun: [{1}, {2}, {3}, ...], verb: [{1}, {2}, {3}], ...}
   */
  getPOSData() {
    this.promptService.getPromptDataRows("partOfSpeech").subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          data.forEach((entry: PromptDataRow) => {
            if (!this.wordDatabase[entry.partOfSpeech!]) {
              this.wordDatabase[entry.partOfSpeech!] = []; // initialise key as empty array
            }
            this.wordDatabase[entry.partOfSpeech!].push({
              partOfSpeech: entry.partOfSpeech!,
              word: entry.word!,
              translation: entry.translation!,
            }); // push data to key
          });
          this.wordTypes = Object.keys(this.wordDatabase); // create an array from the keys (the parts of speech)
        }
      },
      error: (err) => {
        alert(err.error);
        this.wordDatabase = {};
      },
    });
  }

  /**
   * Reset synthesis voice and audio url
   * @param voice Selected synthetic voice
   */
  refreshSynthesis(voice: Voice | undefined = undefined) {
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
   * Save new story to DB
   */
  createNewStory() {
    const user = this.auth.getUserDetails();
    if (!user) {
      console.log("Can't create new story from prompt, current user is null");
      return;
    }
    this.storyService
      .saveStory(
        user._id,
        this.newStoryForm.controls["title"].value,
        new Date(),
        this.newStoryForm.controls["dialect"].value,
        this.constructedPrompt,
        user.username,
        true
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl("/student/dashboard");
        },
        error: () => {
          alert("Not able to create a new story");
        },
      });
  }

  /**
   * Select a random word from the given part of speech list in the data
   * @param type part of speech
   */
  selectRandomWord(type: keyof typeof this.wordDatabase) {
    const wordList = this.wordDatabase[type];
    this.givenWordEntry = wordList[Math.floor(Math.random() * wordList.length)];
  }

  /**
   * Add randomly selected word to the word bank
   */
  addToWordBank() {
    if (this.givenWordEntry) {
      this.wordBank.push(this.givenWordEntry.word);
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
  // async getBankHighlights() {
  //   this.grammarEngine.check$(this.constructedPrompt).subscribe({
  //     next: (tag: ErrorTag) => {
  //       let entry: TagForHighlight = {
  //         fromx: Number(tag.fromX),
  //         tox: Number(tag.toX),
  //       };
  //       this.highlightIndices.push(entry);
  //     },
  //     error: function () {},
  //     complete: () => {
  //       if (this.highlightIndices.length !== 0) {
  //         let newStart: number = 0;
  //         let lastBitToAdd: number = 0;
  //         for (let i = 0; i < this.highlightIndices.length; i++) {
  //           let nonHighlightStart: number = newStart;
  //           let highlightStart: number = this.highlightIndices[i].fromx;
  //           let highlightEnd: number = this.highlightIndices[i].tox + 1;
  //           lastBitToAdd = highlightEnd;

  //           // this.innerHTMLWordBank +=
  //           //   this.arrayString.slice(nonHighlightStart, highlightStart)
  //           //   + '<b class="highlight">' + this.arrayString.slice(highlightStart, highlightEnd) + '</b>';

  //           newStart = this.highlightIndices[i].tox + 1;
  //         }
  //         // this.innerHTMLWordBank += this.arrayString.slice(lastBitToAdd, this.arrayString.length);
  //       } else {
  //         // this.innerHTMLWordBank = this.arrayString;
  //       }
  //     },
  //   });
  // }

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
