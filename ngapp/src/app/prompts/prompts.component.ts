import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslationService } from "../translation.service";
import { StoryService } from "../story.service";
import { AuthenticationService } from "app/authentication.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { PROMPT_DATA } from "./prompt-data";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BasicDialogComponent } from "../dialogs/basic-dialog/basic-dialog.component";

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
  levelPreferences: string[] = ["sep_jc_choices", "sep_lcol_choices", "sep_lchl_choices"];
  dialectPreferences: string[] = ["munster", "connacht", "ulster"];
  levelForm: FormGroup;
  dialectForm: FormGroup;

  // variables for generating prompt
  promptExists: boolean = false;
  prompt: string;
  currentPromptBank: string[];

  // variables for generating story prompts
  chosenCharacter: string;
  chosenSetting: string;
  chosenTheme: string;
  currentPromptBankStory: {
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
    private dialog: MatDialog
  ) {
    this.promptType = this.route.snapshot.params["type"];
    this.data = PROMPT_DATA[this.promptType];
    this.createForms();
  }

  ngOnInit(): void {}

  /**
   * Initialise forms for level selection and dialect selection
   */
  createForms() {
    this.levelForm = this.fb.group({
      level: ["sep_jc_choices"],
    });
    this.dialectForm = this.fb.group({
      dialect: ["munster"],
    });
  }

  /**
   * Generate a word bank from the data based on type and preferences
   */
  currentPrompt() {
    if (this.promptType == "story") {
      this.currentPromptBankStory = this.data[this.levelForm.controls["level"].value];
      this.randomPromptStory(this.currentPromptBankStory);
      return;
    }

    if (this.promptType == "state-exam") {
      this.currentPromptBank = this.data[this.levelForm.controls["level"].value];
    } else if (this.promptType == "proverb") {
      this.currentPromptBank = this.data[this.dialectForm.controls["dialect"].value];
    } else {
      this.currentPromptBank = this.data;
    }
    this.randomPrompt();
  }

  /**
   * Generate a random prompt from the prompt bank
   */
  randomPrompt() {
    this.prompt = this.currentPromptBank[this.randomNumber(this.currentPromptBank.length)];
    this.promptExists = true;
  }

  /**
   * Generate a story prompt from the story prompt bank with a random character, setting, and theme
   * @param promptVariables story bank data listing prompt variables
   */
  randomPromptStory(promptVariables: {character: string[]; setting: string[]; theme: string[];}) {
    let promptLength = Object.keys(promptVariables).length;
    this.chosenCharacter = promptVariables.character[this.randomNumber(promptLength)];
    this.chosenSetting = promptVariables.setting[this.randomNumber(promptLength)];
    this.chosenTheme = promptVariables.theme[this.randomNumber(promptLength)];
    this.prompt =
      "[Carachtar: " + this.chosenCharacter +
      "] [Suíomhanna: " + this.chosenSetting +
      "] [Téama: " + this.chosenTheme + "]";
    this.promptExists = true;
  }

  /**
   * Generate another random character, setting, or theme of a story prompt
   * @param promptVariable either 'character', 'setting', or 'theme'
   */
  changeStoryPrompt(promptVariable: string) {
    if (promptVariable === "character") {
      this.chosenCharacter = this.currentPromptBankStory.character[
          this.randomNumber(this.currentPromptBankStory.character.length)
        ];
    } else if (promptVariable === "setting") {
      this.chosenSetting = this.currentPromptBankStory.setting[
          this.randomNumber(this.currentPromptBankStory.setting.length)
        ];
    } else {
      this.chosenTheme = this.currentPromptBankStory.theme[
          this.randomNumber(this.currentPromptBankStory.theme.length)
        ];
    }
    this.prompt =
      "[Carachtar: " + this.chosenCharacter +
      "] [Suíomhanna: " + this.chosenSetting +
      "] [Téama: " + this.chosenTheme + "]";
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
          this.storyService.saveStory(this.auth.getUserDetails()._id, res[0], new Date(), dialect, this.prompt, this.auth.getUserDetails().username, true);
        } else {
          alert(this.ts.l.title_required);
        }
      }
    });
  }
}
