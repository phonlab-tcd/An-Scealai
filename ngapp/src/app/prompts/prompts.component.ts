import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslationService } from '../translation.service';
import { StoryService } from '../story.service'
import { AuthenticationService } from 'app/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SynthesisService } from 'app/services/synthesis.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PROMPT_DATA } from './prompt-data';

@Component({
  selector: 'app-prompts',
  templateUrl: './prompts.component.html',
  styleUrls: ['./prompts.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class PromptsComponent implements OnInit {
  
  data: any;
  promptType:string;
  
  // options for prompt generation
  levelPreferences: string[] = ['sep_jc_choices', 'sep_lcol_choices', 'sep_lchl_choices'];
  proverbDialectPreferences: string[] = ["Gaeilge Mumha", "Gaeilge Chonnact", "Gaeilge Uladh"];
  dialectPreferences: string[] = ['munster', 'connacht', 'ulster'];

  // forms to store prompt preferences
  levelForm: FormGroup;
  dialectForm: FormGroup;
  newStoryForm: FormGroup;

  // for generating prompt
  promptExists: boolean = false;
  prompt: string;
  currentPromptBank: string[];

  // for generating story prompts
  chosenCharacter: string;
  chosenSetting: string;
  chosenTheme: string;
  currentPromptBankStory: { character: string[]; setting: string[]; theme: string[]; };
  
  constructor(
    private storyService: StoryService,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    public ts: TranslationService,
    private synth: SynthesisService,
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {
    this.promptType = this.route.snapshot.params['type'];
    this.createForms();
    this.data = PROMPT_DATA[this.promptType];
   }

  ngOnInit(): void {
  }

/**
 * Initialise forms for level selection, dialect selection, and new story creation
 */
  createForms() {
    this.levelForm = this.fb.group({
      level: ['sep_jc_choices']
    });
    this.dialectForm = this.fb.group({
      dialect: ['munster']
    });
    this.newStoryForm = this.fb.group({
      title: ['', Validators.required],
      dialect: ['connemara']
    });
  }

  /**
   * Create new story with params and save to DB
   * @param title story title
   * @param dialect story dialect
   * @param text text from generated prompt
   */
  addNewStory(title, dialect, text) {
    this.storyService.saveStory(this.auth.getUserDetails()._id, title, new Date(), dialect, text, this.auth.getUserDetails().username, true);
  }

  /**
   * Generate a word bank from the data based on dialect/level/other preferences
   */
  currentPrompt() {
    if (this.promptType == 'story') {
      let bankChoice = this.levelForm.controls['level'].value;
      this.currentPromptBankStory = this.data[bankChoice];
      this.randomPromptStory(this.currentPromptBankStory);
      return;
    }
    
    if (this.promptType == 'state-exam') {
      let bankChoice = this.levelForm.controls['level'].value;
      this.currentPromptBank = this.data[bankChoice];
    }
    else if (this.promptType == 'proverb') {
      let bankChoice = this.dialectForm.controls['dialect'].value;
      this.currentPromptBank = this.data[bankChoice];
    }
    else {
      this.currentPromptBank = this.data;
    }
    this.randomPrompt();
  }

  /**
   * Generate a random prompt from the prompt bank
   */
  randomPrompt() {
    this.promptExists = true;
    this.prompt = this.currentPromptBank[this.randomNumber(this.currentPromptBank.length)];
  }

  /**
   * Generate a story prompt from the story prompt bank from a random character, setting, and theme
   * @param promptVariables story bank data listing prompt variables
   */
  randomPromptStory(promptVariables: { character: string[]; setting: string[]; theme: string[]; }) {
    this.promptExists = true;
    let promptLength = Object.keys(promptVariables).length;
    this.chosenCharacter = promptVariables.character[this.randomNumber(promptLength)];
    this.chosenSetting = promptVariables.setting[this.randomNumber(promptLength)];
    this.chosenTheme = promptVariables.theme[this.randomNumber(promptLength)];
    this.prompt = 
    "[Carachtar: " + this.chosenCharacter + 
    "] [Suíomhanna: " + this.chosenSetting + 
    "] [Téama: " + this.chosenTheme + "]";
  }

  /**
   * Generate another random character, setting, or theme of a story prompt
   * @param promptVariable either 'character', 'setting', or 'theme'
   */
  changeStoryPrompt(promptVariable: string) {
    if(promptVariable === 'character'){
      this.chosenCharacter = this.currentPromptBankStory.character[this.randomNumber(this.currentPromptBankStory.character.length)];
    } else if (promptVariable === 'setting') {
      this.chosenSetting = this.currentPromptBankStory.setting[this.randomNumber(this.currentPromptBankStory.setting.length)];
    } else {
      this.chosenTheme = this.currentPromptBankStory.theme[this.randomNumber(this.currentPromptBankStory.theme.length)];
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
  randomNumber(arrayLength:number): number {
    return Math.floor(Math.random() * arrayLength);
  }


}