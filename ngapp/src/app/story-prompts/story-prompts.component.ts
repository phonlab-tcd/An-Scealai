import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/translation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StoryService } from 'app/story.service';
import { AuthenticationService } from 'app/authentication.service';

@Component({
  selector: 'app-story-prompts',
  templateUrl: './story-prompts.component.html',
  styleUrls: ['./story-prompts.component.scss']
})

export class StoryPromptsComponent implements OnInit {
  dataHl = {
    character: ['Síobhaire', 'Tuismitheoir buartha', 'Cúléisteoir', 'Piocaire Póca'],
    setting: ['Reilig', 'Seanfhoirgnemah', 'Ardaitheoir Sáinnithe', 'Seomra Ranga'],
    theme: ['Madra ar Iarraidh', 'Botún ar léarscáil', 'Scéál grinn... a théann ró-fhada', 'Geallúint nár comhlíonadh'],
  }

  dataOl = {
    character: ['Comharsa chantalach', 'Feighlí leanaí', 'Tiománaí leoraí'],
    setting: ['Forhalla óstáin', 'Taobh an chnoic', 'An mórbhealach'],
    theme: ['Tine sa chistin', 'Fón goidte', 'Gearán a éiríonn an-dáiríre'],
  }

  dataJc = {
    character: ['Duine Cáiliúil', 'Fear Crosta', 'Aintín atá as a Meabhair'],
    setting: ['An Gairdín Cúl', 'Lár na Cathrach', 'Cúl an bhus'],
    theme: ['Pléisiúr Dé', 'Nathair Nimhe ag Imeacht Thart sa Cheantar', 'Iarnóin deas Suimhneach'],
  }

  chosenCharacter: string;
  chosenSetting: string;
  chosenTheme: string;

  currentPromptIndex: number[];
  promptExists: boolean = false;
  userLevel: string;
  levelForm: FormGroup;
  currentPromptBank: { character: string[]; setting: string[]; theme: string[]; };
  newStoryForm: FormGroup;
  prompt: string;
  levelPreferences: string[] = ['jc', 'lcol', 'lchl'];
  dialectPreferences: string[] = ['connemara', 'donegal', 'kerry']

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private storyService: StoryService,
    public ts: TranslationService,
  ) { this.sepCreateForm(); }

  ngOnInit(): void {
    console.log("State exam prompts init");
    console.log(this.promptExists);
  }

  sepCreateForm() {
    this.levelForm = this.fb.group({
      level: ['jc']
    });
    this.newStoryForm = this.fb.group({
      title: ['', Validators.required],
      dialect: ['connemara']
    });
  }

  spAddNewStory(title, dialect, text) {
    let date = new Date();
    let username = this.auth.getUserDetails().username;
    let studentId = this.auth.getUserDetails()._id;
    this.storyService.saveStory(studentId, title, date, dialect, text, username);
  }

  //Redundant?
  returnLevel(level: string) {
    if(level === 'jc'){
      return this.dataJc;
    } else if (level == 'lcol'){
      return this.dataOl;
    } else {
      return this.dataHl;
    }
  }

  currentPrompt() {
    let bank = this.levelForm.controls['level'].value;
    if(bank === 'jc'){
      this.currentPromptBank = this.dataJc;
    } else if(bank === 'lcol') {
      this.currentPromptBank = this.dataOl;
    } else {
      this.currentPromptBank = this.dataHl;
    }
  }

  randomPrompt(promptArray: { character: string[]; setting: string[]; theme: string[]; }) {
    this.promptExists = true;
    this.currentPromptIndex = [];
    for(let i = 0; i < 3; i++){
      this.currentPromptIndex.push(Math.floor(Math.random() * Object.keys(promptArray).length));
    }
    
    this.chosenCharacter = promptArray.character[this.currentPromptIndex[0]];
    this.chosenSetting = promptArray.setting[this.currentPromptIndex[1]];
    this.chosenTheme = promptArray.theme[this.currentPromptIndex[2]];
    this.prompt = "[Carachtar: " + this.chosenCharacter + 
    "] [Suíomhanna: " + this.chosenSetting + 
    "] [Téama: " + this.chosenTheme + "]";
  }
}
