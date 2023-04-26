import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslationService } from "../translation.service";
import { StoryService } from "../story.service";
import { AuthenticationService } from "app/authentication.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "../dialogs/basic-dialog/basic-dialog.component";
import { HttpClient } from "@angular/common/http";
import config from "abairconfig";

@Component({
  selector: "app-prompts",
  templateUrl: "./prompts.component.html",
  styleUrls: ["./prompts.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PromptsComponent implements OnInit {
  data: any;
  promptType: string;
  dialogRef: MatDialogRef<unknown>;

  // options and forms for prompt preferences
  levelPreferences: string[] = ["jc", "lcol", "lchl"];
  dialectPreferences: string[] = ["munster", "connacht", "ulster"];
  levelForm: FormGroup;
  dialectForm: FormGroup;

  // variables for generating prompt
  prompt: string = '';
  currentPromptBank: string[] = [];

  // variables for generating combination prompts
  chosenCharacter: string;
  chosenSetting: string;
  chosenTheme: string;
  currentCombinationPromptBank: {
    character: string[];
    setting: string[];
    theme: string[];
  };

  constructor(
    private storyService: StoryService,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    public ts: TranslationService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    this.promptType = this.route.snapshot.params["type"];
    this.createForms();
  }

  async ngOnInit() {
    this.getPromptData();
  }

  /**
   * Get POS data from the database
   * Create a dictionary of pos types and array of coresponding word objects
   * e.x: {noun: [{1}, {2}, {3}, ...], verb: [{1}, {2}, {3}], ...}
   */
  getPromptData() {
    const headers = { Authorization: "Bearer " + this.auth.getToken() };
    this.http.get<any>( config.baseurl + "prompt/getPromptDataByTopic/" + this.promptType, { headers } ).subscribe({
      next: (data) => {
        this.data = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * Initialise forms for level selection and dialect selection
   */
  createForms() {
    this.levelForm = this.fb.group({
      level: ["jc"],
    });
    this.dialectForm = this.fb.group({
      dialect: ["munster"],
    });
  }

  /**
   * Filter the data to create a bank of prompts relfecting a chosen
   * level, dialect, combination values, etc.
   */
  async generatePromptBank() {
    this.currentPromptBank = [];

    if (this.promptType == "combination") {
      // create arrays for characters, settings, and themes for the selected level
      let filteredData = this.data.filter( (entry) => entry.prompt.level == this.levelForm.controls["level"].value );
      let characters = [];
      let settings = [];
      let themes = [];
      filteredData.forEach((entry) => {
        characters.push(entry.prompt.combinationData.character);
        settings.push(entry.prompt.combinationData.setting);
        themes.push(entry.prompt.combinationData.theme);
      });
      this.currentCombinationPromptBank = { character: characters, setting: settings, theme: themes, };
      this.getRandomCombinationPrompt();
    } else {
      // get prompts for the selected level or dialect
      if (this.promptType == "exam") {
        this.currentPromptBank = this.data.filter( (entry) => entry.prompt.level == this.levelForm.controls["level"].value );
      } else if (this.promptType == "proverb") {
        this.currentPromptBank = this.data.filter( (entry) => entry.prompt.dialect == this.dialectForm.controls["dialect"].value );
      } else {
        this.currentPromptBank = this.data;
      }
      this.getRandomPrompt();
    }
  }

  /**
   * Generate a random prompt from the prompt bank
   */
  getRandomPrompt() {
    this.prompt =
      this.data[this.randomNumber(this.currentPromptBank.length)]["prompt"][ "text" ];
  }

  /**
   * Generate a combination prompt from the story prompt bank with a random character, setting, and theme
   */
  getRandomCombinationPrompt() {
    this.chosenCharacter =
      this.currentCombinationPromptBank.character[ this.randomNumber(this.currentCombinationPromptBank.character.length) ];
    this.chosenSetting =
      this.currentCombinationPromptBank.setting[ this.randomNumber(this.currentCombinationPromptBank.setting.length) ];
    this.chosenTheme =
      this.currentCombinationPromptBank.theme[ this.randomNumber(this.currentCombinationPromptBank.theme.length) ];
    this.prompt = "Carachtar: " + this.chosenCharacter + "\n" + "Suíomh: " + this.chosenSetting + "\n" + "Téama: " + this.chosenTheme;
  }

  /**
   * Generate another random character, setting, or theme of a story prompt
   * @param promptVariable either 'character', 'setting', or 'theme'
   */
  changeCombinationPrompt(promptVariable: string) {
    if (promptVariable === "character") {
      this.chosenCharacter =
        this.currentCombinationPromptBank.character[ this.randomNumber(this.currentCombinationPromptBank.character.length) ];
    } else if (promptVariable === "setting") {
      this.chosenSetting =
        this.currentCombinationPromptBank.setting[ this.randomNumber(this.currentCombinationPromptBank.setting.length) ];
    } else {
      this.chosenTheme =
        this.currentCombinationPromptBank.theme[ this.randomNumber(this.currentCombinationPromptBank.theme.length) ];
    }
    this.prompt = "Carachtar: " + this.chosenCharacter + "\n" + "Suíomh: " + this.chosenSetting + "\n" + "Téama: " + this.chosenTheme;
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
          let dialect = "connemara";
          if (res[1] == this.ts.l.munster) dialect = "kerry";
          if (res[1] == this.ts.l.ulster) dialect = "donegal";
          this.storyService.saveStory( this.auth.getUserDetails()._id, res[0], new Date(), dialect, this.prompt, this.auth.getUserDetails().username, true );
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
