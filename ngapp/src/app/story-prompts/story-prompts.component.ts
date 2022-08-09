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

  currentPromptIndex: number;
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

  sepAddNewStory(title, dialect, text) {
    let date = new Date();
    let username = this.auth.getUserDetails().username;
    let studentId = this.auth.getUserDetails()._id;
    this.storyService.saveStory(studentId, title, date, dialect, text, username);
  }

  returnLevel(level: string) {
    if(level === 'jc'){
      return this.dataHl;
    } else if (level == 'lcol'){
      return this.dataOl;
    } else {
      return this.dataJc;
    }
  }

  currentPrompt() {
    let bank = this.levelForm.controls['level'].value;
    if(bank === 'jc'){
      this.currentPromptBank = this.dataHl;
    } else if(bank === 'lcol') {
      this.currentPromptBank = this.dataOl;
    } else {
      this.currentPromptBank = this.dataJc;
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
