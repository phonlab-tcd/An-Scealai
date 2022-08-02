import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/translation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StoryService } from 'app/story.service';
import { AuthenticationService } from 'app/authentication.service';

@Component({
  selector: 'app-proverb-prompts',
  templateUrl: './proverb-prompts.component.html',
  styleUrls: ['./proverb-prompts.component.scss']
})
export class ProverbPromptsComponent implements OnInit {
  currentPromptIndex: number;
  promptExists: boolean = false;
  userLevel: string;
  levelForm: FormGroup;
  currentPromptBank: string[];
  newStoryForm: FormGroup;
  prompt: string;
  dialectPreferences: string[] = ['connemara', 'donegal', 'kerry']

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private storyService: StoryService,
    public ts: TranslationService,) 
    { this.ppCreateForm(); }

  ngOnInit(): void {
    console.log("Proverb prompts init...");
  }

  ppCreateForm() {
    this.levelForm = this.fb.group({
      level: ['jc']
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


  currentPrompt() {
    let bank = this.levelForm.controls['level'].value;
    if(bank === 'jc'){
      this.currentPromptBank = this.ts.l.sep_jc_choices;
    } else if(bank === 'lcol') {
      this.currentPromptBank = this.ts.l.sep_lcol_choices;
    } else {
      this.currentPromptBank = this.ts.l.sep_lchl_choices;
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
