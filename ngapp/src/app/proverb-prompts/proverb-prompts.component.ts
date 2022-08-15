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
      "Níor tógadh an Róimh in aon ló",
      "Aithníonn ciaróg ciaróg eile",
      "Aithnítear cara i gcruatan",
      "An té nach bhfuil láidir ní foláir dó a bheith glic",
      "An rud is annamh is iontach",
      "Is ar mhaithe leis féin a dhéanann an cat crónán",
      "Bíonn an fhírinne searbh",
      "Bíonn blas ar an mbeagán",
      "Bíonn dhá insint ar gach scéal",
      "Cuir síoda ar ghabhar agus beidh sé ina ghabhar i gcónaí",
      "Dá fhad é an lá tagann an oíche",
      "Dá olc é Séamas is measa é ina éagmais",
      "Giorraíonn beirt bóthar",
      "De réir a chéile a thógtar na caisleáin",
      "I dtír na ndall, is rí é fear na leathshúile",
      "Is ait an mac an saol",
      "Is ag tuile is ag trá a chaitheann an taoide an lá",
      "Is binn béal ina thost",
      "Is fada an bóthar nach bhfuil casadh air",
      "Is fear an tsláinte ná na táinte",
      "Is geal leis an bhfiach dubh a ghearrcaigh féin",
      "Is glas iad na cnoic i bhfad uainn",
      "Is maith an scathán súil charad",
      "Is maith an Scéalaí an aimsir",
      "Is trom an t-ualach an t-aineolas",
      "Is trom an t-ualach an leisce",
      "Is minic a bhris béal duine a shórn",
      "Is í an chiall cheannaithe an chiall is fearr",
      "Múineann gá seift",
      "Nuair a bhíonn an cat amuigh bíonn na lucha ag súgradh",        
      "Ná tabhair breith ar an gcéad scéal",
      "Ní bhíonn in an ní ach seal",
      "Ní dhéanfadh an saol capall ráis d'asal",
      "Ní lia duine ná tuairim",
      "Ní mar a shíltear a bhítear",
      "Níl an tinteán mar do thinteán féin",
      "Ní neart go cur le chéile",
      "Ní bhíonn saoi gan locht",
      "Níl tuile dá mhéad nach dtránn",
      "Seachain fearg ó fhear na foighne",
      "Taithí a dhéanann an mháistreacht",
      "Tús maith leath na hoibre",
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
    let createdWithPrompts = true;
    this.storyService.saveStoryPrompt(studentId, title, date, dialect, text, username, createdWithPrompts);
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