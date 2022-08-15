import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/translation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StoryService } from 'app/story.service';
import { AuthenticationService } from 'app/authentication.service';

@Component({
  selector: 'app-general-prompts',
  templateUrl: './general-prompts.component.html',
  styleUrls: ['./general-prompts.component.scss']
})
export class GeneralPromptsComponent implements OnInit {
  data = [
    "Múchadh na soilse agus ní raibh torann ar bith le cloisteáil…",
    "Bhí an stoirm ag éirí agus d'oscail an spéir…",
    "Níor tháinig lá chomh breá leis riamh i gcuimhne na ndaoine. Bhíomar díreach réidh le dul amach an doras…",
    "Mo bhreithlá a bhí ann ach ní dúirt aon duine aon rud liom. Bhí an teach dorcha agus mé ag dul isteach an doras…",
    "Bhíomar go léir ar bís sa bhus agus sinn ar ár slí go dtí an ceolchoirm mór…",
    "Bhí mé ag fanacht leis an mbus nuair a chonaic mé chugam an bhean seo…",
    "Thug mé cuireadh do chúpla cara teacht go dtí mo chóisir ach scaip an scéal agus…",
    "Bhí mo thicéad ar an bhfón agam agus mé ar an mbealach go dtí an t-aerfort…",
    "Bhíomar ag tnúth leis an gcluiche ar feadh i bhfad. Ansin bhí sé réidh le tosú…",
    "Bhí leisce orm an chéad oíche ag dul síos go dtí an club nua liom féin…",
    "Bhí mo chairde go léir ag coinneáil amach uaim. Is ar éigin a bheannaigh siad dom…",
    "Bhí mé reidh chun dul go dtí an scrúdú nuair a thit mé síos an staighre…",
    "Bhí airgead agam agus bhí mé le dul ag siopadóireacht le mo chara i lár an bhaile…",
    "Chuaigh mé ag rothaíocht trí na cosáin sa choill liom féin…",
    "Bhí mé chun tosú sa scoil nua is gan aithne agam ar dhuine ar bith a bhí san áit…",
    "Bhí lár na cathrach dubh le daoine an lá seo agus bhí gach duine ar bís…",
    "Ní raibh aon dul as agam ach an fhírinne lom a insint…",
    "Bhí sé fós ina gheimhreadh ach bhí an tráthnona go deas agus bheartaíos turas a dhéanamh ar mo rothar…",
    "Nach orm a bhí an ríméid agus mé ag dul amach as an siopa le mo ghluaisrothar nua…",
    "Bheartaigh ceathrar againn go rachaimis ag campáil don deireadh seachtaine…",
    "Bhí leisce orm ag dul ar an gcúrsa Gaeltachta liom féin ach…",
    "Is ag dul abhaile ón scoil a bhí mé nuair a thainig mé ar an timpiste…",
    "Bhí mé cinnte go raibh mo fhón i mo phóca agam ach…",
    "Bhí an samhradh ba fhearr riamh agam ach anois bhí sé ag teacht chun deiridh…",
    "Ní raibh mé ag tnúth leis an Nollaig ach ní mar a shíltear a bhítear…",
    "Ní raibh mé ar laethanta saoire thar lear ó bhí mé i mo pháiste beag. Bheadh sé difriúil an uair seo…",
    "Ní raibh fonn oibre ar aon duine eile sa rang ach bhí mise ag iarraidh mo dhícheall a dhéanamh…",
    "Aithríodh mo shaol bun os cionn ar fad nuair a tháinig cailín nua isteach sa scoil…",
    "Bhí me ag réiteach do mo chéad cheacht tiomána agus is mé a bhí neirbhíseach…",
    "B'fhearr liomsa an lá a chaitheamh sa bhaile ag léamh liom féin ach cuireadh brú orm dul amach le cúpla cara…",
    "Ní dhéanfaidh mé dearmad go brách ar an lá a d'éalaigh an tíogar ón sorcas…",
    "Bhí oíche go maidin le bheith againn ach ní raibh a fhios againn gur i stáisiún na nGardaí a chaithfimis an chuid is mó di….",
    "Bheartaíomar cóisir a eagrú dár gcara dá breithlá ach bhí sé deacair an plean a choimeád ina rún…",
    "Thug mé airgead do bhean a bhí ag lorg déirce ar thaobh na sráide agus thosaigh sí ag caint liom…",
    "Bhraith mé ní ba shona ná riamh nuair a bhí an dianghlasáil againn. Ní raibh orm bualadh le haon duine…",
    "Tháinig col ceathrar liom abhaile as Meiriceá. Bhí ormsa an ceantar ina bhfuilimid a thaispeáint dó…",
    "Ní dhéanfaidh mé dearmad ar an lá a chaith mé ag thabhairt aire do pháistí na gcomharsan…",
    "Ba lá mór é nuair a bhí an scoil againne ag imirt sa chluiche ceannais …",
    "An lá a cuireadh an príomhoide faoi ghlas san íoslann sa scoil.",
    "Bhí an t-ádh ormsa an lá a bhuail an gluaisrothar isteach trí dhoras na scoile…",
  ]
  
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
    public ts: TranslationService,
  ) { this.gpCreateForm(); }

  ngOnInit(): void {
    console.log("General prompts init");
  }

  gpCreateForm() {
    this.newStoryForm = this.fb.group({
      title: ['', Validators.required],
      dialect: ['connemara']
    });
  }

  gpAddNewStory(title, dialect, text) {
    let date = new Date();
    let username = this.auth.getUserDetails().username;
    let studentId = this.auth.getUserDetails()._id;
    let createdWithPrompts = true;
    this.storyService.saveStoryPrompt(studentId, title, date, dialect, text, username, createdWithPrompts);
  }

  randomPrompt(promptArray: string[]) {
    this.promptExists = true;
    this.currentPromptIndex = Math.floor(Math.random() * promptArray.length);
    this.prompt = promptArray[this.currentPromptIndex];
    return this.currentPromptIndex;
  }
}
