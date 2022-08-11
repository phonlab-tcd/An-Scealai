import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/translation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StoryService } from 'app/story.service';
import { AuthenticationService } from 'app/authentication.service';

@Component({
  selector: 'app-proverb-prompts',
  templateUrl: './proverb-prompts.component.html',
  styleUrls: ['./proverb-prompts.component.scss'],
})

export class ProverbPromptsComponent implements OnInit {
  data = {
    pp_munster: [
      "Is minic a bhíonn ciúin ciontach",
      "Tosnú maith leath na hoibre",
      "Níor tógadh an Róimh in aon ló"
    ], 
    pp_connacht: [
        "Is fada an bóthar nach bhfuil casadh ann",
        "Namhaid an cheird gan í a fhoghlaim",
        "Ní bhíonn in aon rud ach seal"
    ],
    pp_ulster: [
        "Bíonn blas ar an bheagán",
        "Cha raibh séasúr fliuch gann riamh",
        "An rud a scríobhas an púca, léann sé féin é"
    ]
  }

  currentPromptIndex: number;
  promptExists: boolean = false;
  userLevel: string;
  dialectForm: FormGroup;
  currentPromptBank: string[];
  newStoryForm: FormGroup;
  prompt: string;
  dialectPreferences: string[] = ["Gaeilge Mumha", "Gaeilge Chonnact", "Gaeilge Uladh"];
  randomDialectChoice: number;

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private storyService: StoryService,
    public ts: TranslationService,) 
    { this.ppCreateForm(); }

  //I belive the auth service and it's ngOnInit spotlight are redundant, will maybe remove later.
  ngOnInit(): void {
    console.log("Proverb prompts init...");
  }

  ppCreateForm() {
    this.dialectForm = this.fb.group({
      dialect: ["Gaeilge Mumha"]
    });
    this.newStoryForm = this.fb.group({
      title: ['', Validators.required],
      dialect: ['connemara']
    });
  }

  ppAddNewStory(title, dialect, text) {
    let date = new Date();
    let username = this.auth.getUserDetails().username;
    let studentId = this.auth.getUserDetails()._id;
    this.storyService.saveStory(studentId, title, date, dialect, text, username);
  }

  //selectedDialect don't work
  returnDialect(dialect: string) {
    if(dialect === "Gaeilge Mumha"){
      return this.data.pp_munster;
    } else if (dialect === "Gaeilge Chonnact"){
      return this.data.pp_connacht;
    } else {
      return this.data.pp_ulster;
    }
  }

  //For randomPrompt()
  currentPrompt() {
    let bank = this.dialectForm.controls['dialect'].value;
    if(bank === "Gaeilge Uladh"){
      this.currentPromptBank = this.data.pp_munster;
    } else if(bank === "Gaeilge Chonnact") {
      this.currentPromptBank = this.data.pp_connacht;
    } else {
      this.currentPromptBank = this.data.pp_ulster;
    }
  }

  //Try find a way to not have the arrays in ts service
  randomPrompt(promptArray: string[]) {
    this.promptExists = true;
    this.currentPromptIndex = Math.floor(Math.random() * promptArray.length);
    this.prompt = this.currentPromptBank[this.currentPromptIndex];
    return this.currentPromptIndex;
  }
}