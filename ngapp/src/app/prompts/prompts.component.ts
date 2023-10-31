import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslationService } from "app/core/services/translation.service";
import { StoryService } from "app/core/services/story.service";
import { PromptDataRow } from "app/core/models/prompt";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormGroup, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "../dialogs/basic-dialog/basic-dialog.component";
import { CommonModule } from "@angular/common";
import { PartOfSpeechComponent } from "./part-of-speech/part-of-speech.component";
import { PromptService } from "app/core/services/prompt.service";

type combinationDataStructure = {
    word: string,
    translation: string
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PartOfSpeechComponent, MatDialogModule],
  selector: "app-prompts",
  templateUrl: "./prompts.component.html",
  styleUrls: ["./prompts.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PromptsComponent implements OnInit {
  data: PromptDataRow[] = [];
  promptType: string;
  dialogRef: MatDialogRef<unknown> | undefined;

  // options and forms for prompt preferences
  levelPreferences: string[] = ["jc", "lcol", "lchl"];
  combinationLevelPreferences: string[] = ["primary", "secondary", "tertiary"]
  dialectPreferences: string[] = ["munster", "connacht", "ulster"];
  levelForm: FormGroup;
  combinationLevelForm: FormGroup
  dialectForm: FormGroup;
  showTranslation: boolean = false;

  // variables for generating prompt
  prompt: string = '';
  translation: string = '';
  currentPromptBank: PromptDataRow[] = [];

  // variables for generating combination prompts
  chosenCharacter: combinationDataStructure = {word: "", translation: ""};
  chosenLocation: combinationDataStructure = {word: "", translation: ""};
  chosenTheme: combinationDataStructure = {word: "", translation: ""};

  currentCombinationPromptBank: {
    characters: combinationDataStructure[];
    locations: combinationDataStructure[];
    themes: combinationDataStructure[];
  } = {characters: [], locations: [], themes: []};

  constructor(
    private storyService: StoryService,
    public auth: AuthenticationService,
    private fb: FormBuilder,
    public ts: TranslationService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private promptService: PromptService
  ) {
    this.promptType = this.route.snapshot.params["type"];
    this.levelForm = this.fb.group({
      level: ["jc"],
    });
    this.combinationLevelForm = this.fb.group({
      combinationLevel: ["primary"],
    });
    this.dialectForm = this.fb.group({
      dialect: ["munster"],
    });
  }

  async ngOnInit() {
    this.getPromptData();
  }


  /**
   * Get prompt data from the database based on specified prompt type
   */
    getPromptData() {
      this.promptService.getPromptDataRows(this.promptType).subscribe({
        next: (data: any) => {
          if (data.length > 0) {
            this.data = data;
          }
        },
        error: (err) => { alert(err.error); },
      });
    }

  /**
   * Filter the data to create a bank of prompts relfecting a chosen
   * level, dialect, combination values, etc.
   */
  async generatePromptBank() {
    this.currentPromptBank = [];

    switch (this.promptType) {
      case "general":
        this.prompt = this.data[this.randomNumber(this.data.length)].prompt!;
        break;
      case "proverb":
        this.currentPromptBank = this.data.filter( (entry) => entry.dialect == this.dialectForm.controls["dialect"].value );
        const dialectPrompts = this.currentPromptBank[this.randomNumber(this.currentPromptBank.length)];
        this.prompt = dialectPrompts.prompt!
        this.translation = dialectPrompts.translation!
        break;
      case "exam":
        this.currentPromptBank = this.data.filter( (entry) => entry.level == this.levelForm.controls["level"].value );
        const levelPrompts = this.currentPromptBank[this.randomNumber(this.currentPromptBank.length)];
        this.prompt = levelPrompts.prompt!
        break;
      case "lara":
        this.prompt = this.data[this.randomNumber(this.data.length)].prompt!;
        break;
      case "combination":
        let combinationPrompts = this.data.filter( (entry) => entry.level == this.combinationLevelForm.controls["combinationLevel"].value );
        const characters: combinationDataStructure[] = []
        const locations: combinationDataStructure[] = [];
        const themes: combinationDataStructure[] = [];
        combinationPrompts.forEach((entry: PromptDataRow) => {
          if (entry.type == "character") characters.push({word: entry.prompt!, translation: entry.translation!});
          else if (entry.type == "location") locations.push({word: entry.prompt!, translation: entry.translation!});
          else themes.push({word: entry.prompt!, translation: entry.translation!});
          });
          this.currentCombinationPromptBank = { characters: characters, locations: locations, themes: themes, };
          this.getRandomCombinationPrompt();
        break;
      default:
        this.prompt = "Error: No prompts available"
        break;
    }
  }

  /**
   * Generate a combination prompt from the story prompt bank with a random character, location, and theme
   */
  getRandomCombinationPrompt() {
    this.chosenCharacter =
      this.currentCombinationPromptBank.characters[ this.randomNumber(this.currentCombinationPromptBank.characters.length) ];
    this.chosenLocation =
      this.currentCombinationPromptBank.locations[ this.randomNumber(this.currentCombinationPromptBank.locations.length) ];
    this.chosenTheme =
      this.currentCombinationPromptBank.themes[ this.randomNumber(this.currentCombinationPromptBank.themes.length) ];
    this.prompt = "Carachtar: " + this.chosenCharacter.word + "\n" + "Suíomh: " + this.chosenLocation.word + "\n" + "Téama: " + this.chosenTheme.word;
  }

  /**
   * Generate another random character, location, or theme of a story prompt
   * @param promptVariable either 'character', 'location', or 'theme'
   */
  changeCombinationPrompt(promptVariable: string) {
    if (promptVariable === "character") {
      this.chosenCharacter =
        this.currentCombinationPromptBank.characters[ this.randomNumber(this.currentCombinationPromptBank.characters.length) ];
    } else if (promptVariable === "location") {
      this.chosenLocation =
        this.currentCombinationPromptBank.locations[ this.randomNumber(this.currentCombinationPromptBank.locations.length) ];
    } else {
      this.chosenTheme =
        this.currentCombinationPromptBank.themes[ this.randomNumber(this.currentCombinationPromptBank.themes.length) ];
    }
    this.prompt = "Carachtar: " + this.chosenCharacter.word + "\n" + "Suíomh: " + this.chosenLocation.word + "\n" + "Téama: " + this.chosenTheme.word;
  }

  /**
   * Generate a random number to index the prompt bank array
   * @param arrayLength Length of prompt bank
   * @returns random index between 0 and length of prompt bank
   */
  randomNumber(arrayLength: number): number {
    return Math.floor(Math.random() * arrayLength);
  }

  /**
   * Create a new story from the generated prompt
   */
  createNewStory() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.story_details,
        type: "select",
        data: [
          this.ts.l.enter_title,
          [this.ts.l.connacht, this.ts.l.munster, this.ts.l.ulster],
          [this.ts.l.title, this.ts.l.dialect],
        ],
        confirmText: this.ts.l.save_details,
        cancelText: this.ts.l.cancel,
      },
      width: "50vh",
    });

    this.dialogRef.afterClosed().subscribe(async (res) => {
      this.dialogRef = undefined;
      // res[0] is the title, res[1] is the dialect
      if (res) {
        if (res[0]) {
          const user = this.auth.getUserDetails();
          if (!user) {
            console.log("Can't create new story from prompt, current user is null");
            return;
          }
          let dialect = "connemara";
          if (res[1] == this.ts.l.munster) dialect = "kerry";
          if (res[1] == this.ts.l.ulster) dialect = "donegal";
          this.storyService
          .saveStory( user._id, res[0], new Date(), dialect, this.prompt, user.username, true )
          .subscribe({
            next: () => {
              this.router.navigateByUrl("/student/dashboard");
            },
            error: () => {
              alert("Not able to create a new story");
            },
          });
        } else {
          alert(this.ts.l.title_required);
        }
      }
    });
  }

  /**
   * Dialog box to display instructions
   */
  openInformationDialog() {
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.cen_sceal,
        type: "simpleMessage",
        message: `
          <h5>${this.ts.l.what_is_cen_sceal}</h5><br>
          <h6>${this.ts.l.cen_sceal_description_1}</h6><br>

          <h5>${this.ts.l.how_does_it_work}</h5><br>
          <h6>${this.ts.l.cen_sceal_description_2}</h6><br>

          <h5>${this.ts.l.what_is_it_comprised_of}</h5><br>
          <h6>${this.ts.l.cen_sceal_description_3}</h6><br>

          <h5>${this.ts.l.the_themes}</h5><br>
          <ol>
            <li>${this.ts.l.general_prompts_description}</li>
            <li>${this.ts.l.combination_generator_description}</li>
            <li>${this.ts.l.proverb_prompts_description}</li>
            <li>${this.ts.l.exam_prompts_description}</li>
            <li>${this.ts.l.lara_prompts_description}</li>
            <li>${this.ts.l.pos_generator_description}</li>
          </ol>
          `,
        confirmText: this.ts.l.done,
      },
      width: "90vh",
    });

    this.dialogRef.afterClosed().subscribe((_) => {
      this.dialogRef = undefined;
    });
  }
}
