import { Component, OnInit, ViewEncapsulation, Input, ElementRef, ViewChild } from '@angular/core';
import { TranslationService } from '../translation.service';
import { StoryService } from '../story.service'
import { AuthenticationService } from 'app/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SynthesisService, Voice, voices } from 'app/services/synthesis.service';
import { SynthItem } from 'app/synth-item';
import { SynthVoiceSelectComponent } from 'app/synth-voice-select/synth-voice-select.component';

@Component({
  selector: 'app-prompts',
  templateUrl: './prompts.component.html',
  styleUrls: ['./prompts.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class PromptsComponent implements OnInit {
  tempWordDatabase = {
    noun: [
      'an t-asal',
      'an t-ábhar',
      'an t-aerfort',
      'an t-ádh',
      'an t-am',
      'an t-amadán',
      'an t-airgead',
      'an t-amhrán',
      'an t-allas',
      'an t-árasán',
      'an t-áthas',
      'an bád',
      'an bord',
      'an botún',
      'an bóthar',
      'an bus',
      'an banc',
      'an béal',
      'an blaincéad',
      'an boladh',
      'an braon',
      'an brat',
      'an bréagán',
      'an broc',
      'an buicéad',
      'an buidéal',
      'an caisleán',
      'an capall',
      'an ceantar',
      'an clog',
      'an cnoc',
      'an crann',
      'an cupán',
      'an caladh',
      'an céad',
      'an cosán',
      'an captaen',
      'an camán',
      'an cat',
      'an ceol',
      'an ciorcal',
      'an ciseán',
      'an citeal',
      'an ciúnas',
      'an cogadh',
      'an coileach',
      'an coileán',
      'an colúr',
      'an corp',
      'an dán	',
      'an t-éan 	',
      'an fear	',
      'an gadhar',
      'an focal 	',
      'an gearán',
      'an t-inneall',
      'an t-óstán',
      'an peann',
      'an portach',
      'an poll',
      'an port',
      'an post',
      'an rothar',
      'an scannán	',
      'an Taoiseach',
      'an t-údar',
      'an Stáit	',
      'an tarbh	',
      'an scéal 	',
      'an tinteán	',
      'an sionnach 	',
      'an tóramh	',
      'an sliotar',
    ],
    verb: [
      'Abair',
      'Bain',
      'Béic',
      'Beir',
      'Bí',
      'Blais',
      'Bog',
      'Bris',
      'Bris',
      'Brúigh',
      'Buaigh',
      'Buail',
      'Caill',
      'Caith',
      'Can',
      'Cas',
      'Clois',
      'Cnag',
      'Creid',
      'Cuir',
      'Cum',
      'Déan',
      'Díol',
      'Dóigh',
      'Doirt',
      'Dreap',
      'Dún',
      'Éist',
      'Fág',
      'Faigh',
      'Fan',
      'Féach',
      'Feic',
      'Geall',
      'Gearr',
      'Glan',
      'Glaoigh',
      'Gluais',
      'Iarr',
      'Íoc',
      'Iompair',
      'Ith',
      'Labhair',
      'Las',
      'Leag',
      'Lean',
      'Léigh',
      'Léim',
      'Lig',
      'Líon',
      'Measc',
      'Mol',
      'Múch',
      'Ól',
      'Pioc',
      'Pioc',
      'Póg',
      'Preab',
      'Reoigh',
      'Rith',
      'Roinn',
      'Sábháil',
      'Scar',
      'Sciorr',
      'Scríobh',
      'Scrios',
      'Scuab',
      'seas',
      'séid',
      'Seinn',
      'seol',
      'Sín',
      'Siúl',
      'Sroich',
      'Suigh',
      'Tabhair',
      'Taifead',
      'Taispeáin',
      'Tar',
      'Téigh',
      'Teip',
      'Tiomáin',
      'Tit',
      'Tóg',
      'Tuig',
      'Aistrigh',
      'Ardaigh',
      'Athraigh',
      'Bagair',
      'Báigh',
      'Bailigh',
      'Bailigh',
      'Beannaigh',
      'Brostaigh',
      'Bunaigh',
      'Cabhraigh',
      'Ceangail',
      'Ceannaigh',
      'Ceartaigh',
      'Cinntigh',
      'Ciontaigh',
      'Codail',
      'Comhairligh',
      'Críochnaigh',
      'Cuardaigh',
      'Cuidigh',
      'Cuimil',
      'Deisigh',
      'Diúltaigh',
      'Éalaigh',
      'Éirigh',
      'Eitil',
      'Feabhsaigh',
      'Foghlaim',
      'Fostaigh',
      'Imigh',
      'Inis',
      'Iompaigh',
      'Léirigh',
      'Ordaigh',
      'Oscail',
      'Réitigh',
      'Roghnaigh',
      'Sleamhnaigh',
      'Smaoinigh',
      'Socraigh',
      'Taiste',
    ],
    adjective: [
      'beag',
      'mór',
      'maith',
      'dubh',
      'bán',
      'dearg',
      'buí',
      'bándearg',
      'glas',
      'uaine',
      'gorm',
      'ard',
      'íseal',
      'lán',
      'folamh',
      'ciúin',
      'cainteach',
      'costasach',
      'saor',
      'cliste',
      'dúr',
      'cumasach',
      'ceolmhar',
      'cneasta',
      'cineálta',
      'trodach',
      'maol',
      'gruaigeach',
      'saibhir',
      'bocht',
      'leathan ',
      'caol',
      'óg',
      'aosta',
      'greannmhar',
      'dáiríre',
      'maith ',
      'olc',
      'folamh',
      'fada',
      'gearr',
      'tirim',
      'fliuch',
      'grianmhar',
      'scamallach',
      'milis',
      'ceomhar',
      'searbh',
      'sean',
      'láidir',
      'lag',
      'stuama',
      'deas',
      'téagartha',
      'sásta',
      'míshásta',
      'dorcha',
      'geal',
      'fuar',
      'te',
      'dóite',
      'cróga',
      'leisciúil',
      'gnóthach',
      'fonnmhar',
      'glic',
      'gníomhach',
      'stadach',
      'béasach',
      'uaigneach',
      'buíoch',
      'dóchasach',
      'álainn',
      'uafásach',
      'amaideach',
      'aineola',
    ],
    pronoun: [
      'Mé',
      'Tú',
      'Sé',
      'Sí',
      'Sinn',
      'Sibh',
      'Siad',
      'Muid',
      'agam',
      'agat',
      'aige',
      'aici',
      'againn',
      'agaibh',
      'acu',
      'orm',
      'ort',
      'air',
      'uirthi',
      'orainn',
      'oraibh',
      'orthu',
      'asam',
      'asat',
      'as',
      'aisti',
      'asainn',
      'asaibh',
      'astu',
      'díom',
      'díot',
      'de',
      'di',
      'dínn',
      'díbh',
      'díobh',
      'dom',
      'duit',
      'dó',
      'di',
      'dúinn',
      'daoibh',
      'dóibh',
      'fúm',
      'fút',
      'faoi',
      'fúithi',
      'fúinn',
      'fúibh',
      'fúthu',
      'ionam',
      'ionat',
      'ann',
      'inti',
      'ionainn',
      'ionaibh',
      'iontu',
      'eadrainn',
      'eadraibh',
      'eatarthu',
      'liom',
      'leat',
      'leis',
      'léi',
      'linn',
      'libh',
      'leo',
      'uiam',
      'uait',
      'uaidh',
      'uaithi',
      'uainn',
      'uaibh',
      'uathu',
      'romham',
      'romhat',
      'roimhe',
      'roimpi',
      'romhainn',
      'romhaibh',
      'rompu',
      'tharam',
      'tharat',
      'thairis',
      'thairsti',
      'tharainn',
      'tharaibh',
      'tharstu',
    ],
    determiner: ['seo', 'a', 'cé', 'an'],
    article: ['an', 'na'],
    adverb: [
      'inniu',
      'inné',
      'amárach',
      'anois',
      'fadó',
      'i mbliana',
      'ar maidin',
      'anseo',
      'ansin',
      'thuaidh',
      'theas',
      'soir',
      'siar',
      'suas',
      'síos',
      'amach',
      'isteach',
      'go ciúin',
      'go héasca',
      'os ard',
      'os íseal',
      'in éineacht',
      'ar buile',
      'go',
      'gur',
      'ní',
      'níór',
      'nach ',
      'nár',
      'beagnach',
      'freisin',
      'ar an bpointe',
      'ar éigean',
      'dáiríre',
      'chomh maith',
      'ach oiread',
    ],
    adposition: ['le', 'sa'],
    conjunction: [
      'agus',
      'go',
      'ach',
    ],
    numeral: [
      'a haon 	',
      'an chéad	',
      'duine',
      'a dó	',
      'an dara	',
      'beirt',
      'a trí	',
      'an tríú	',
      'triúr',
      'a ceathair	',
      'an ceathrú	',
      'ceathrar',
      'a cúig	',
      'an cúigiú	',
      'cúigear',
      'a sé	',
      'an séú	',
      'seisear',
      'a seacht	',
      'an seachtú	',
      'seachtar',
      'a hocht	',
      'an t-ochtú	',
      'ochtar',
      'a naoi	',
      'an naoú	',
      'naonúr',
      'a deich	',
      'an deichiú	',
      'deichniúr',
    ]
  }

  WORD_PROMPT = 'Please choose a word type';
  givenWord = 'Please choose a word type';
  wordBank = [];
  arrayString = '';
  newStoryForm: FormGroup;
  bankHighlights: Observable<any>;
  indiceValues: { fromx: number; tox: number }[] = [];
  innerHTMLWordBank: string = '';
  bankHighlightsLoading: boolean = true;
  synthItem: SynthItem;
  wordTypes = Object.keys(this.tempWordDatabase);

  buttonsLoading: boolean = false;
  errorButtons: string[];

  constructor(
    private storyService: StoryService,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    public ts: TranslationService,
    private synth: SynthesisService,
  ) { this.posCreateForm(); }

  ngOnInit(): void {
    console.log(this.wordTypes);
    this.refresh();
  }

  // init() {
  //   //If the page is loaded with a 'text' as url parameter, load that text instead of using the ones listed here
  //   //Example: dictgloss.html?text={"name":"urltest","txt":"test/story.txt","wavs":["test/audio/wav/paragraph_1.wav","test/audio/wav/paragraph_2.wav"]}
  //   if (location.search !== "") {
  //     console.log("Loading text from location.search: " + location.search);

  //     var sp = new URLSearchParams(location.search)
  //     var text = JSON.parse(sp.get("text"))
  //     console.log(text);
  //     console.log("text.name: " + text.name);
  //   } else {
  //     console.log("Loading texts from " + this.arrayString);
  //   }
  // }

  @Input() text: string;
  @ViewChild('voiceSelect') voiceSelect: ElementRef<SynthVoiceSelectComponent>;

  selected: Voice;
  refresh(voice: Voice = undefined) {
    if(voice) this.selected = voice;
    this.synthItem.audioUrl = undefined;
    this.synthItem.dispose();
    this.synthItem = null;
    this.makeSynth();
    // setTimeout is just for juice (Neimhin Fri 28 Jan 2022 23:19:46)
    if(this.arrayString === "") return;
  }

  makeSynth(){
    this.synthItem = this.getSynthItem(this.arrayString);
    this.synthItem.text = "Play Prompt";
  }

  getSynthItem(line: string) {
    return new SynthItem(line, this.selected, this.synth);
  }

  posSynthRefresh() {
    if (this.synthItem?.dispose instanceof Function) this.synthItem.dispose();
    this.synthItem = new SynthItem(this.arrayString, this.newStoryForm.get('dialect').value, this.synth);
  }

  //Could perhaps use createForm() from the dashboard component instead
  posCreateForm() {
    this.newStoryForm = this.fb.group({
      title: ['', Validators.required],
      dialect: ['connemara']
    });
  }

  posAddNewStory(title, dialect, text) {
    let date = new Date();
    let username = this.auth.getUserDetails().username;
    let studentId = this.auth.getUserDetails()._id;
    let createdWithPrompts = true;
    //this.storyService.saveStoryPrompt(studentId, title, date, dialect, text, username, createdWithPrompts);
  }

  async selectWord(type: keyof typeof this.tempWordDatabase) {
    this.givenWord = this.randomWord(this.tempWordDatabase[type]);
  }

  posConfirmation(isConfirmed: Boolean) {
    if (isConfirmed && this.givenWord != this.WORD_PROMPT) {
      this.wordBank.push(this.givenWord);
      this.createWordBankString(this.wordBank);
      this.getBankHighlights();
      this.posSynthRefresh();
    } else {
      this.givenWord = this.WORD_PROMPT;
    }
  }

  //While this is loading the text should be shown unhighlighted.
  async getBankHighlights() {
    this.bankHighlightsLoading = true;
    //this.bankHighlights = this.gs.gramadoirDirectObservable(this.arrayString, 'ga');
    this.bankHighlights.subscribe(res => {
      console.log(res, '<SUBSCRIBE STRING>');
      this.indiceValues = res.map(element =>
        new Object(
          {
            fromx: Number(element.fromx),
            tox: Number(element.tox)
          }
        )
      )
      console.log(this.indiceValues, 'INDICEVALS');
      if (this.indiceValues.length !== 0) {
        let newStart: number = 0;
        let lastBitToAdd: number = 0;
        this.innerHTMLWordBank = '';
        for (var i = 0; i < this.indiceValues.length; i++) {
          let nonHighlightStart: number = newStart;
          let highlightStart: number = this.indiceValues[i].fromx;
          let highlightEnd: number = this.indiceValues[i].tox + 1;
          lastBitToAdd = highlightEnd;

          this.innerHTMLWordBank +=
            this.arrayString.slice(nonHighlightStart, highlightStart)
            + '<b class="highlight">' + this.arrayString.slice(highlightStart, highlightEnd) + '</b>';

          newStart = this.indiceValues[i].tox + 1;
        }
        this.innerHTMLWordBank += this.arrayString.slice(lastBitToAdd, this.arrayString.length);
      } else {
        this.innerHTMLWordBank = this.arrayString;
      }
      this.bankHighlightsLoading = false;
    });
  }

  createWordBankString(array: Array<string>) {
    let arrayString = '';
    if (array.length > 0) {
      for (var i = 0; i < array.length; i++) {
        arrayString += array[i];
        arrayString += ' ';
      }
      arrayString = arrayString.slice(0, -1) + '.';
      arrayString = arrayString.charAt(0).toUpperCase() + arrayString.slice(1);
      this.arrayString = arrayString;
    }
    this.makeSynth();
    return arrayString;
  }

  resetWordBank() {
    this.wordBank = [];
    this.indiceValues = [];
    this.createWordBankString(this.wordBank);
    this.getBankHighlights();
  }

  randomWord(wordList: Array<string>) {
    return wordList[Math.floor(Math.random() * wordList.length)];
  }

}