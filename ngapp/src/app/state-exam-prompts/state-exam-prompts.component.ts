import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/translation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StoryService } from 'app/story.service';
import { AuthenticationService } from 'app/authentication.service';

@Component({
  selector: 'app-state-exam-prompts',
  templateUrl: './state-exam-prompts.component.html',
  styleUrls: ['./state-exam-prompts.component.scss']
})
export class StateExamPromptsComponent implements OnInit {
  data = {
    sep_jc_choices: [
      "Nuair a chuala mo thuismitheoirí an scéal bhí siad ar buile liom… (2019)",
      "Eachtra ghreannmhar a tharla le linn turas scoile. (2019)",
      "Ní fhéadfainn é a chreidiúint nuair a chuala mé an scéal…   (2018)",
      "Eachtra a tharla ar mo shlí abhaile ón scoil. (2018)",
      "Ní raibh ach dhá nóiméad fágtha sa chluiche. Bhíomar chun deiridh.   Ansin tháinig an liathróid i mo threo…  (2017)",
      "An uair a chuaigh mé féin agus mo chara ar strae i gcathair Bhaile Átha Cliath. (2017)"
    ],
    sep_lcol_choices: [
      "Léigh mé an téacs ón stáisiún raidió. 'Tá an chéad duais sa chomórtas buaite agat.'   Níor chreid mé mo shúile (2021)",
      "Bhí mé féin agus mo chara amuigh ag rith. Go tobann, thit mo chara i laige … (2021)",
      "Dhúisigh mé i lár na hoíche. Bhí mé i leaba i mbarda ospidéil… (2020)",
      "Bhuail m'fhón póca. D'fhreagair mé an fón… (2020)",
      "Bhí mé féin agus mo chara san aerfort. Bhíomar ag súil go mór leis an turas go Páras. Chuir mé mo lámh i mo mhála. Ní raibh mo phas ná mo chuid airgid ann… (2019)",
      "Tháinig an oíche mhór. Bhí an seó tallainne ag tosú agus bhí mé ag dul ar an stáitse… (2019)"
    ],
    sep_lchl_choices: [
      "Crógacht. (2021)",
      "Ar scáth a chéile a mhaireann na daoine. (2021)",
      "Bíonn an fhírinne searbh. (2020)",
      "Suaimhneas. (2020)",
      "Faoiseamh. (2019)",
      "Ní thagann ciall roimh aois. (2019)"
    ]
  }
  
  currentPromptIndex: number;
  promptExists: boolean = false;
  userLevel: string;
  levelForm: FormGroup;
  currentPromptBank: string[];
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
    let createdWithPrompts = true;
    this.storyService.saveStoryPrompt(studentId, title, date, dialect, text, username, createdWithPrompts);
  }

  returnLevel(level: string) {
    if(level === 'jc'){
      return this.data.sep_jc_choices;
    } else if (level === 'lcol'){
      return this.data.sep_lcol_choices;
    } else {
      return this.data.sep_lchl_choices;
    }
  }

  currentPrompt() {
    let bank = this.levelForm.controls['level'].value;
    if(bank === 'jc'){
      this.currentPromptBank = this.data.sep_jc_choices;
    } else if(bank === 'lcol') {
      this.currentPromptBank = this.data.sep_lcol_choices;
    } else {
      this.currentPromptBank = this.data.sep_lchl_choices;
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
