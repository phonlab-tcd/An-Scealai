import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/translation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StoryService } from 'app/story.service';
import { AuthenticationService } from 'app/authentication.service';

@Component({
  selector: 'app-lara-prompts',
  templateUrl: './lara-prompts.component.html',
  styleUrls: ['./lara-prompts.component.scss']
})
export class LaraPromptsComponent implements OnInit {
  data = [
    "Is ar oileán Thoraí a bhí a dhún ag Balor…",
    "Chaith Naomh Pádraig an lá sin i bhfochair Chaoilte, gur mhínigh sé soiscéal Nimhe dó…",
    "Colorado a bhí ar an tseanduine seo…",
    "An Druma Mór: Bean bhocht a bhí ina cónaí léi féin ba ea Beagaide…",
    "Mar a Baisteadh Fionn: Bhí rí ann fadó go raibh Éire faoina smacht aige…",
    "Fairceallach Fhinn Mhic Chumhaill: Lá dá raibh bhí Fionn agus na Fianna ag fiach…",
    "Pósadh ar an mBlascaod Mór: Nuair a bhídís chun pósadh san oileán fadó cleamhnaistí a dheintí…",
    "An seilide agus an míol mór: Baineann an scéal seo le seilidín glic…",
    "An Prionsa Beag: Nuair a bhí mé sé  bliana d’aois chonaic mé, uair amháin, pictiúr iontach i leabhar i dtaobh na foraoise darbh ainm ‘Scéalta fíora’…",
    "Cinnín Óir agus na Trí Bhéar: Lá amháin rinne Mamaí Béar leite…",
    "Na Trí Mhuicín: Bhí na trí mhuicín ina suí go moch ar maidin…",
    "Cochaillín Dearg: Bhí Cochaillín Dearg ina suí go moch ar maidin…",
    "An Píobaire Breac: I mbaile álainn Hamelin bhí gach duine sona sásta…",
    "An Lacha Bheag Ghránna: Bhí seacht n-uibhe sa nead ag Mamaí Lacha…",
    "Na Trí Ghabhar Chliste: ‘Tá ocras orm,’arsa Séimín, an gabhar beag…",
    "An Tornapa Mór Millteach: ‘Ó, céard seo?’ arsa an feirmeoir…"
  ]

  currentPromptIndex: number;
  promptExists: boolean = false;
  userLevel: string;
  dialectForm: FormGroup;
  newStoryForm: FormGroup;
  prompt: string;
  dialectPreferences: string[] = ["Gaeilge Mumha", "Gaeilge Chonnact", "Gaeilge Uladh"];
  dialectPreference: string;
  randomDialectChoice: number;

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
    let createdWithPrompts = true;
    this.storyService.saveStoryPrompt(studentId, title, date, dialect, text, username, createdWithPrompts);
  }

  //Try find a way to not have the arrays in ts service
  randomPrompt(promptArray: string[]) {
    this.promptExists = true;
    this.currentPromptIndex = Math.floor(Math.random() * promptArray.length);
    this.prompt = this.data[this.currentPromptIndex]; //Problem
    return this.currentPromptIndex;
  }
}
