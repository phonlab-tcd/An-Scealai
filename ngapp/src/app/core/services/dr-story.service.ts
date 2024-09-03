import { Injectable } from '@angular/core';
//import { DigitalReaderStory } from 'app/core/models/dr-story';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Observable, of } from 'rxjs';
import { EngagementService } from 'app/core/services/engagement.service';
import { EventType } from 'app/core/models/event';
import { TranslationService } from 'app/core/services/translation.service';
import config from 'abairconfig';
import { firstValueFrom, tap, catchError } from 'rxjs';

import { DigitalReaderStory } from 'app/core/models/drStory';
import { AudioEncoding } from './synthesis.service';

@Injectable({
  providedIn: 'root'
})
export class DigitalReaderStoryService {

  public segmentedSentences:Array<Object> | undefined;
  public convertedHtml:string;
  public htmlParser = new DOMParser();

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthenticationService,
    private engagement: EngagementService,
    private ts: TranslationService,
  ) { }

  baseUrl: string = config.baseurl
  segmentableTags: string = 'p, h1, h2, h3, h4, h5, h6, li, th, td'

  init() {
    this.segmentedSentences = undefined;
  }

  async tokenizeSentence(input: string) {
    const sentences = await firstValueFrom(
      this.http.post<Array<string>>(this.baseUrl + 'nlp/sentenceTokenize', {text: input})
    )
    return sentences
  }

  extractText(inputHtml: Document) {
    const textTags = inputHtml.querySelectorAll(this.segmentableTags)

    const textChunks = []
    for (let i = 0; i < textTags.length; i++) {
      textChunks.push(textTags[i].textContent)
    }
    
    return textChunks
  }

  async segmentText(document: Document) {

    const chunkedText = this.extractText(document)

    const segmentedSentences = []
    for (let chunk of chunkedText) {
      if (chunk!='') {
        const segmentedChunkSentences = await this.tokenizeSentence(chunk)

        for (let i = 0; i < segmentedChunkSentences.length; i++) {
          const segmentedChunkSentence = segmentedChunkSentences[i];
          segmentedSentences.push(segmentedChunkSentence)
        }

      }
    }

    return segmentedSentences
  }

  parseSegId(id:string, _class:string) {
    return parseInt(id.replace(_class, ''));
  }

  reformatExtractedSentences(sentences:Array<string>) {
    const reformattedSentences:Array<Object> = []
    for (let sentenceText of sentences) {
      reformattedSentences.push({
        text: sentenceText
      })
    }
    return reformattedSentences
  }

  tagSentence(sentence:string):Observable<any> {
    return this.http.get<any>(`https://api.abair.ie/v3/POSTagger/tag?text=${sentence}`)
  }

  async tagSentences(sentences:Array<string>) {
    const taggedWords:Array<Object> = []
    for (let sentenceText of sentences) {
      const taggedSentence = await firstValueFrom(this.tagSentence(sentenceText))
      for (let taggedWord of taggedSentence) {
        const taggedWordObj = {
          text: taggedWord['word'],
          pos: {
            lemma: taggedWord['lemma'],
            tags: taggedWord['tags']
          }
        }
        taggedWords.push(taggedWordObj)
      }
    }
    return taggedWords
  }

  // TODO : maybe factor out below function into multiple functions
  async processUploadedFileAndExtractSents(req: File) {
    
    // convert the uploaded file to html
    const formData = new FormData();
    formData.append('docx', req);

    //try {
    const convertedHtml = await firstValueFrom(
      this.http.post<string>(this.baseUrl + 'digitalReader/docx2html', formData)
    ).catch((err: HttpErrorResponse) => {
      alert(err.error)
      //alert(err)
      //throw new Error()
      return null;
    });
    
    if (!convertedHtml) return null
    this.convertedHtml = convertedHtml;

    // TODO : add html sanitisation !!*******
    // *CODE GOES HERE*

    // parse the stringified html as a html document
    const parsedDoc = this.htmlParser.parseFromString(convertedHtml, 'text/html')
    console.log(parsedDoc)

    // extract text chunks from html elements to send to sentence segmenter
    const sentenceTextChunks = await this.segmentText(parsedDoc)
    console.log(sentenceTextChunks)

    // reformat sentence segmenter output for use with the segmentation API
    const sentences:Array<Object> = this.reformatExtractedSentences(sentenceTextChunks)
    this.segmentedSentences = sentences;

    // potentially return the parsedDoc here
    return parsedDoc;

    /*const words:Array<Object> = await this.tagSentences(sentenceTextChunks)

    const segmentedHtml = await firstValueFrom(
      this.http.post<string>(this.baseUrl + 'digitalReader/segment-html', 
        {text: convertedHtml, sentences: sentences, words: words}
      )
    )

    // for testing
    const parsedSegmentedDoc = this.htmlParser.parseFromString(segmentedHtml, 'text/html')

    return parsedSegmentedDoc*/
  }

  async getUploadedFileWords() {
    if (this.segmentedSentences && this.convertedHtml) {
      const words:Array<Object> = await this.tagSentences(this.segmentedSentences.map((elem:any) => {
        return elem.text;
      }))

      const segmentedHtml = await firstValueFrom(
        this.http.post<string>(this.baseUrl + 'digitalReader/segment-html', 
          {text: this.convertedHtml, sentences: this.segmentedSentences, words: words}
        )
      )

      // for testing
      const parsedSegmentedDoc = this.htmlParser.parseFromString(segmentedHtml, 'text/html')

      return parsedSegmentedDoc

    }
    return null;
  }

  parseNumber(tagsArr:string[]) {
    let outputNumber = '';
    let number = tagsArr.shift();

    if (number == 'Sg') outputNumber += ', sg.';
    else if (number == 'Pl') outputNumber += ', pl.';
    else if (number == 'Weak') {
      outputNumber += ', weak';
      number = tagsArr.shift();
      if (number == 'Pl') outputNumber += ', pl.';
      else if (number == 'Sg') outputNumber += ', sg.';
      else outputNumber += `, ${number}`;
    }
    else tagsArr.push(number);
    //else outputNumber += `, ${number}`;

    return outputNumber;
  }

  parseMutation(tagsArr:string[]) {
    let outputMutation = '';
    const mutation:string = tagsArr.shift() as string;

    if (mutation == 'Len') outputMutation += ', séimhithe';
    else if (mutation == 'Ecl') outputMutation += ', uraithe';
    else if (mutation == 'DefArt' || mutation == 'Def') outputMutation += ', def.';
    else if (mutation == 'Art') outputMutation += ', article';
    else tagsArr.push(mutation);
    //else outputMutation += ` (${mutation})`;

    return outputMutation;
  }

  parseCase(tagsArr:string[]) {
    let outputCase = '';
    const wordCase = tagsArr.shift();

    if (wordCase == 'Com') outputCase += ', com.';
    else if (wordCase == 'Gen') outputCase += ', gen.';
    else tagsArr.unshift(wordCase); // sometimes the wrong attribute may be being parsed

    return outputCase;
  }

  parseGender(tagsArr:string[]) {
    let outputGender = '';
    const gender = tagsArr.shift();

    if (gender == 'Masc') outputGender += ', m';
    else if (gender == 'Fem') outputGender += ', f';
    else tagsArr.unshift(gender);

    return outputGender;
  }

  parseTense(tagsArr:string[]) {
    let outputTense = '';
    const tense:string = tagsArr.shift();

    if (tense === 'Cond') outputTense += ', conditional';
    else if (tense === 'Pres') outputTense += ', present';
    else if (tense === 'Past') outputTense += ', past';
    else if (tense === 'Cop') outputTense += ', copula';
    else outputTense += ` ${tense}`;

    return outputTense;
  }

  parseAdjForm(tagsArr:string[]) {
    let outputForm = '';
    const form:string = tagsArr.shift();

    if (form === 'Base') outputForm += ', base';
    else if (form === 'Comp') outputForm += ', comparative';
    else tagsArr.unshift(form); // sometimes the wrong attribute may be being parsed

    return outputForm;
  }

  parseClauseType(tagsArr:string[]) {
    let outputType = '';
    const form:string = tagsArr.shift();

    if (form === 'Subord') outputType += ', subordinate';
    else if (form === 'Coord') outputType += ', coordinate';
    else if (form === 'Dep') outputType += ', dependant';
    else tagsArr.unshift(form); // sometimes the wrong attribute may be being parsed

    return outputType;
  }

  parseNumberType(tagsArr:string[]) {
    let outputType = '';
    const form:string = tagsArr.shift();

    if (form === 'Ord') outputType += ', ordinal';
    else if (form === 'Card') outputType += ', cardinal';
    else if (form === 'Pers') outputType += ', personal';
    else tagsArr.unshift(form); // sometimes the wrong attribute may be being parsed

    return outputType;
  }

  parsePronounType(tagsArr:string[]) { // prepositional etc.
    let outputType = '';
    const form:string = tagsArr.shift();

    if (form === 'Pers') outputType += ', personal';
    else if (form === 'Prep') outputType += ', prep.';
    else tagsArr.unshift(form); // sometimes the wrong attribute may be being parsed

    return outputType;
  }

  parsePrepositionType(tagsArr:string[]) { // prepositional etc.
    let outputType = '';
    const type:string = tagsArr.shift();

    if (type === 'Poss') outputType += ', possesive';
    else if (type === 'Cmpd') outputType += ', compound';
    else if (type === 'Simp') outputType += ', simple';
    else if (type === 'Emph') outputType += ', emphatic pronoun';
    else if (type === 'Rel') outputType += ', relative';
    else if (type === 'Obj') outputType += ', object';
    else if (type === 'Deg') outputType += ', degree';
    else if (type == 'DefArt' || type == 'Def') outputType += ', def.';
    else if (type == 'Art') outputType += ', article';
    else tagsArr.unshift(type); // sometimes the wrong attribute may be being parsed

    return outputType;
  }

  parseVerbTransitivity(tagsArr:string[]) { // prepositional etc.
    let outputTransitivity = '';
    const transitivity:string = tagsArr.shift();

    if (transitivity == 'VTI') outputTransitivity += ', trans./intrans.';
    else if (transitivity == 'VI') outputTransitivity += ', intransitive';
    else if (transitivity == 'VT') outputTransitivity += ', transitive';
    else tagsArr.unshift();
    //else if (transitivity == 'VD') outputTransitivity += ' (transitive)';
    //else if (transitivity == 'VF') outputTransitivity += ' (transitive)';

    return outputTransitivity;
  }

  removeExtraVerbInfo(tagsArr:string[]) {
    const transitivity:string = tagsArr.shift();
    if (transitivity != 'VD' && transitivity != 'VF' && transitivity != 'Vow') tagsArr.unshift(transitivity);
  }

  parseVerbAutonomy(tagsArr:string[]) { // prepositional etc.
    let outputAutonomy = '';
    const autonomy:string = tagsArr.shift();

    if (autonomy == 'Auto') outputAutonomy += ', autonomous';
    else tagsArr.unshift(autonomy);

    return outputAutonomy;
  }

  parseRole(tagsArr:string[]) { // prepositional etc.
    let outputRole = '';
    const role:string = tagsArr.shift();

    if (role == 'Sbj') outputRole += ', subj.';
    else if (role == 'Obj') outputRole += ', obj.';
    else tagsArr.unshift(role);

    return outputRole;
  }

  parseVerbType(tagsArr:string[]) {
    let outputType = '';
    let form:string = tagsArr.shift();

    if (form === 'PresInd') outputType += ', pres.';
    else if (form === 'PastInd') outputType += ', past';
    else if (form === 'PastIndDep') outputType += ', past dep.';
    else if (form === 'PastImp') outputType += ', past imperf.';
    else if (form === 'FutInd') outputType += ', future';
    else if (form === 'Cond') outputType += ', cond.';
    else if (form === 'PresSubj') outputType += ', pres. subj.';
    else if (form === 'PastSubj') outputType += ', past subj.';
    else if (form === 'Imper') outputType += ', imperative';
    else tagsArr.unshift(form); // sometimes the wrong attribute may be being parsed

    form = tagsArr.shift();
    if (form === 'Dep')
      outputType += ' dep.';
    else
      tagsArr.unshift(form);

    return outputType;
  }

  parseVerbalType(tagsArr:string[]) {
    let outputType = '';
    const form:string = tagsArr.shift();

    if (form === 'Noun') outputType += ', Noun';
    else if (form === 'Adj') outputType += ', Adjective';
    else tagsArr.unshift(form); // sometimes the wrong attribute may be being parsed

    return outputType;
  }

  parseParticleType(tagsArr:string[]) {
    let outputType = '';
    const form:string = tagsArr.shift();

    if (form === 'Vb') outputType += ', verbal';
    else if (form === 'Inf') outputType += ', infinitive';
    else tagsArr.unshift(form); // sometimes the wrong attribute may be being parsed

    return outputType;
  }

  parsePerson(tagsArr:string[]) {
    let outputPerson = '';
    const form:string = tagsArr.shift();

    if (form === '1P') outputPerson += ', 1st pers.';
    else if (form === '2P') outputPerson += ', 2nd pers.';
    else if (form === '3P') outputPerson += ', 3rd pers.';
    else tagsArr.unshift(form); // sometimes the wrong attribute may be being parsed

    return outputPerson;
  }

  parseParticleRelativity(tagsArr:string[]) {
    let outputType = '';
    let form:string = tagsArr.shift();

    if (form === 'Rel') {
      outputType += ', rel.';
      form = tagsArr.shift();
      if (form === 'Direct') outputType += ', direct';
      else if (form === 'Indirect') outputType += ', indirect';
      else if (form === 'Subj') outputType += ', subjunctive';
      else outputType += ')';
    }
    else if (form === 'Direct') outputType += ', direct';
    else if (form === 'Indirect') outputType += ', indirect';
    else if (form === 'Subj') outputType += ', subjunctive';
    else if (form === 'Cmpl') outputType += ', complementiser';
    else if (form === 'Ad') outputType += ', adverbial';
    else if (form === 'Nm') outputType += ', numeral';
    else if (form === 'Comp') outputType += ', comparative';
    else if (form === 'Pat') outputType += ', patrononmical';
    else if (form === 'Voc') outputType += ', vocative';
    else if (form === 'Deg') outputType += ', degree';
    else if (form === 'Cp') outputType += ', copular';
    else tagsArr.unshift(form); // sometimes the wrong attribute may be being parsed

    return outputType;
  }

  parseDeterminerType(tagsArr:string[]) {
    let outputType = '';
    const type:string = tagsArr.shift();

    if (type === 'Dem') outputType += ', demonstrative';
    else if (type === 'Poss') outputType += ', possessive';
    else if (type === 'Qty') {
      const type:string = tagsArr.shift();
      if (type === 'Idf') outputType += ', indef. quantifier';
      else if (type === 'Def') outputType += ', def. quantifier';
    }
    else if (type === 'Idf') outputType += ', indef. quantifier';
    else if (type === 'Def') outputType += ', def. quantifier';
    else tagsArr.unshift(type); // sometimes the wrong attribute may be being parsed

    return outputType;

  }

  parseNeg(tagsArr:string[]) {
    let outputType = '';
    const neg:string = tagsArr.shift();

    if (neg === 'Neg') outputType += ', neg.';
    else tagsArr.unshift(neg);

    return outputType
  }

  parseAdverbType(tagsArr:string[]) {
    let outputType = '';
    const type:string = tagsArr.shift();

    if (type === 'Gn') outputType += ', general';
    else if (type === 'Its') outputType += ', intensifier';
    else if (type === 'Dir') outputType += ', directional';
    else if (type === 'Q') outputType += ', interrogative';
    else if (type === 'Loc') outputType += ', locative';
    else if (type === 'Temp') outputType += ', temporal';
    else if (type === 'NegQ') outputType += ', neg. interrogative';
    else if (type === 'Rel') outputType += ', relative';
    else if (type === 'RelInd') outputType += ', rel. indir.';
    else if (type === 'Pro') outputType += ', pronominal';
    else tagsArr.unshift(type);

    return outputType
  }

  parseGrammarTags(tags:string) {
    if (tags === '') return {class: '?', attrs: ''};

    let tagsArr = tags.split(' ');
    let isGuess = false;
    let isProperNoun = false;
    let isSubstantive = false;
    let outputClass = '';

    let wordClass = tagsArr.shift();
    if (wordClass === 'Guess') {
      isGuess = true;
      wordClass = tagsArr.shift();
    }
    if (wordClass === 'Prop') {
      isProperNoun = true;
      wordClass = tagsArr.shift();
    }
    if (wordClass === 'Subst') {
      //outputClass += 'Substantive ';
      isSubstantive = true;
      wordClass = tagsArr.shift();
    }

    let attributes = '';

    if (wordClass === 'Noun') {

      if (isProperNoun)
        outputClass += 'Proper ';

      if (isSubstantive)
        outputClass += 'Noun-like';
      else
        outputClass += 'Noun';

      if (!isSubstantive) {
        attributes += this.parseGender(tagsArr);
        attributes += this.parseCase(tagsArr);
        if (tagsArr.length>0) attributes += this.parseNumber(tagsArr);
      } else {
        
        attributes += this.parseNumber(tagsArr);
        if (tagsArr.length>0) {
          const potentialPartitive:string = tagsArr.shift();
          if (potentialPartitive == 'Part') {
            attributes += ', particle';
          }
          else tagsArr.unshift(potentialPartitive);
        }
        
        if (tagsArr.length>0) attributes += this.parseAdjForm(tagsArr);
      }

      if (tagsArr.length>0) {
        attributes += this.parseMutation(tagsArr);
      }

    } else if (wordClass === 'Part') {

      outputClass += 'Particle';
      attributes += this.parseParticleType(tagsArr);
      if (tagsArr.length > 0)attributes += this.parseNeg(tagsArr);
      if (tagsArr.length > 0) attributes += this.parseParticleRelativity(tagsArr);
      if (tagsArr.length > 0) {
        const pronominalOrTense = tagsArr.shift();
        if (pronominalOrTense === 'Pro') attributes += ', pronominal';
        else {
          tagsArr.unshift(pronominalOrTense);
          attributes += this.parseNeg(tagsArr);
          attributes += this.parseTense(tagsArr);
        }
      }

    } else if (wordClass === 'Adj') {

      outputClass += 'Adjective';

      attributes += this.parseAdjForm(tagsArr);

      if (tagsArr.length>0) attributes += this.parseGender(tagsArr);
      if (tagsArr.length>0) attributes += this.parseCase(tagsArr);
      if (tagsArr.length>0) attributes += this.parseNumber(tagsArr);
      if (tagsArr.length>0) attributes += this.parseMutation(tagsArr);

    } else if (wordClass === 'Verb') {

      outputClass += wordClass;
      attributes += this.parseVerbTransitivity(tagsArr);
      this.removeExtraVerbInfo(tagsArr);
      attributes += this.parseVerbType(tagsArr);
      attributes += this.parseVerbAutonomy(tagsArr);
      //if (tagsArr.length > 0) outputString += this.parseRole(tagsArr);
      if (tagsArr.length > 0) attributes += this.parsePerson(tagsArr);
      if (tagsArr.length > 0) attributes += this.parseNumber(tagsArr);
      if (tagsArr.length > 0) attributes += this.parseMutation(tagsArr);

    } else if (wordClass === 'Adv') {

      outputClass += 'Adverb';
      attributes += this.parseAdverbType(tagsArr);

    }else if (wordClass === 'Pron') {

      outputClass += 'Pronoun';
      attributes += this.parsePronounType(tagsArr);
      attributes += this.parsePerson(tagsArr);
      attributes += this.parseNumber(tagsArr);
      attributes += this.parseGender(tagsArr);
      if (tagsArr.length > 0) attributes += this.parseRole(tagsArr);

    } else if (wordClass === 'Verbal') {

      outputClass += wordClass;
      attributes += this.parseVerbalType(tagsArr);
      attributes += this.parseVerbTransitivity(tagsArr);
      if (tagsArr.length>0) attributes += this.parseMutation(tagsArr);

    } else if (wordClass === 'Det') {

      outputClass += 'Determiner';

      attributes += this.parseDeterminerType(tagsArr);
      if (tagsArr.length > 0) attributes += this.parsePerson(tagsArr);
      if (tagsArr.length > 0) attributes += this.parseNumber(tagsArr);
      if (tagsArr.length > 0) attributes += this.parseGender(tagsArr);
      

    } else if (wordClass === 'Num') {

      outputClass += 'Number';

      attributes += this.parseNumberType(tagsArr);
      if (tagsArr.length > 0) attributes += this.parseMutation(tagsArr);

    } else if (wordClass === 'Prep') {

      outputClass += 'Preposition';
      attributes += this.parsePrepositionType(tagsArr);
      //if (tagsArr.length > 0) attributes += this.parseMutation(tagsArr); // Article etc.
      if (tagsArr.length > 0) attributes += this.parsePerson(tagsArr);
      if (tagsArr.length > 0) attributes += this.parseNumber(tagsArr);
      if (tagsArr.length > 0) attributes += this.parseGender(tagsArr);
      if (tagsArr.length > 0) attributes += this.parseMutation(tagsArr);
      

    } else if (wordClass === 'Punct') {

      outputClass += 'Punctuation';
      tagsArr = []; // extra punctuation information is not necessary

    } else if (wordClass === 'Cop') {

      outputClass += 'Copula';
      attributes += this.parseTense(tagsArr);
      if (tagsArr.length > 0) attributes += this.parseClauseType(tagsArr);
      if (tagsArr.length > 0) this.removeExtraVerbInfo(tagsArr);
      if (tagsArr.length > 0) attributes += this.parseAdverbType(tagsArr);

    } else if (wordClass === 'Conj') {
      outputClass += 'Conjunction';

      attributes += this.parseClauseType(tagsArr);
      if (tagsArr.length > 0) attributes += this.parseTense(tagsArr);

    } else if (wordClass === 'Art') {

      outputClass += 'Article';
      attributes += this.parseCase(tagsArr);
      attributes += this.parseNumber(tagsArr);
      attributes += this.parseMutation(tagsArr); // definite
      if (tagsArr.length>0) attributes += this.parseGender(tagsArr);

    } else if (wordClass === 'Itj') {

      outputClass += 'Interjection';

    }else if (wordClass === 'Foreign') {

      outputClass += wordClass;

    }

    // failsafe so as not to lose any info
    if (tagsArr) {
      if (attributes == '') {
        attributes += wordClass;
      }
      for (let i=0; i<tagsArr.length; i++) {
        const tag = tagsArr[i];
        if (i!=0 || attributes !== '') attributes += ', '
        attributes += tag;
      }
    }

    if (attributes!='') attributes = '(' + attributes.slice(2,attributes.length) + ')';

    if (isGuess) attributes += ' ?';
    
    //return outputClass + ' ' + attributes;
    return {class: outputClass, attrs: attributes};
  }

  saveDRStory(title: string, /*dialects: Array<string>*/collections: Array<string>, thumbnail:string, story: Object, isPublic: Boolean) {
    const drStoryObj = {
      title: title,
      collections: collections,
      thumbnail: thumbnail,
      story: story,
      public: isPublic,
    };
    console.log('here!')
    console.log(drStoryObj.thumbnail);
    this.engagement.addEvent(EventType['CREATE-DR-STORY'], {storyObject: drStoryObj});
    return this.http.post<{id: string}>(this.baseUrl + 'drStory/create', drStoryObj);
  }

  storeSynthAudio(drStoryId: string, sentId: number, /*audioPromise:Promise<any>*/audioObservable:Observable<any>, voiceCode:string) {
    
    let idObj:Observable<{id:string}> = of();

    audioObservable.subscribe(
      response => {
        console.log(response)

        const drSentenceAudioObj = {
          drStoryId: drStoryId,
          sentId: sentId,
          voice: voiceCode,
          audioUrl: response.audioUrl,
          audioTiming: response.timing
        }

        console.log(drSentenceAudioObj)

        idObj = this.http.post<{id: string}>(this.baseUrl + 'drStory/storeSynthAudio', drSentenceAudioObj)

        console.log(idObj)

        idObj.subscribe(
          (data) => {console.log(data)}
        )
      }
    )

    /*audioObservable.subscribe(
      response => {
        const drSentenceAudioObj = {
          drStoryId: drStoryId,
          sentId: sentId,
          voice: voiceCode,
          audioUrl: response.audioUrl,
          timing: response.timing
        };
        idObj = this.http.post<{id: string}>(this.baseUrl + 'drStory/storeSynthAudio', drSentenceAudioObj)
      }
    )*/

    /*console.log(audioPromise);
    audioPromise.then(
      (response) => {
        console.log('gets to here!')
        const drSentenceAudioObj = {
          drStoryId: drStoryId,
          sentId: sentId,
          voice: voiceCode,
          audioUrl: response.audioUrl,
          timing: response.timing
        };
        idObj = this.http.post<{id: string}>(this.baseUrl + 'drStory/storeSynthAudio', drSentenceAudioObj)
      }
    )*/

    return idObj;
  }

  getSynthAudio(drStoryId:string) {
    return this.http.get<DigitalReaderStory[]>(this.baseUrl + 'drStory/allAudio/' + drStoryId);
  }

  getDRStoriesByOwner(owner: string) : Observable<DigitalReaderStory[]>  {
    return this.http.get<DigitalReaderStory[]>(this.baseUrl + 'drStory/owner/' + owner);
  }

  getDRStoriesForLoggedInUser(): Observable<DigitalReaderStory[]> {
    const userDetails = this.auth.getUserDetails();
    if(!userDetails) {
      return new Observable(subscriber=>{
        subscriber.next([]);
        subscriber.complete();
      });
    }
    return this.getDRStoriesByOwner(userDetails._id);
  }

  // get all of the Digital Reader stories that have been signed off by An Scéalaí
  // this amounts to all stories that were created by admins
  getAllAnScealaiVerifiedDRStories(): Observable<DigitalReaderStory[]> {
    return this.http.get<DigitalReaderStory[]>(this.baseUrl + 'drStory/verified');
  }

  getAnScealaiVerifiedCollection(collectionName:string): Observable<DigitalReaderStory[]> {
    return this.http.get<DigitalReaderStory[]>(this.baseUrl + 'drStory/verified/' + collectionName);
  }

  // get all of the publicly available Digital Reader stories
  getAllPublicDRStories(): Observable<DigitalReaderStory[]> {
    return this.http.get<DigitalReaderStory[]>(this.baseUrl + 'drStory/public');
  }

  getPublicDRStoryById(id: string): Observable<DigitalReaderStory[]> {
    return this.http.get<DigitalReaderStory[]>(this.baseUrl + 'drStory/publicOrOwned/' + id);
  }

  getMatchingWords(lemma: string | null, tags: string | null): Observable<any[]> {
    return this.http.post<any[]>(this.baseUrl + 'drStory/getMatchingWords/', {lemma:lemma, tags:tags});
  }

  getSentenceAudio(drStoryId:string, sentId:number, voiceCode:string) {

    const reqBody = {
      drStoryId: drStoryId,
      sentenceId: sentId,
      voice: voiceCode
    }

    return this.http.post<any[]>(this.baseUrl + 'drStory/sentenceAudio', reqBody);
  }

  deleteDRStory(drStoryId:string) {

    return this.http.get<any[]>(this.baseUrl + 'drStory/delete/' + drStoryId);
  }

  runTestQueue(
    textInput: string,
    voiceCode:string,
    audioEncoding:AudioEncoding,
    speed:number,
    drStoryId:string,
    sentenceId:number) {
  //runTestQueue(input: string) {

    return this.http.post<Array<string>>(this.baseUrl + 'drStory/testQueue', /*{text:input}*/
      {
        textInput: textInput,
        voiceCode: voiceCode,
        audioEncoding: audioEncoding,
        speed: speed,
        drStoryId: drStoryId,
        sentenceId: sentenceId
      }
    );
  }

  /*
  createDRStory(title: string, date: Date, dialects: Array<string>, htmlText: string, author: string) {
    const drstoryObj = {
      title: title,
      dialects: dialects,
      //text: text,
      htmlText: htmlText,
      author: author,
      //createdWithPrompts: createdWithPrompts,
      //activeRecording: null
    };
    console.log(drstoryObj);
    this.engagement.addEvent(EventType['CREATE-DR-STORY'], {storyObject: drstoryObj});
    return this.http.post<{id: string}>(this.baseUrl + 'create', drstoryObj);
  }

  getDRStoriesFor(author : string): Observable<DigitalReaderStory[]> {
    return this.http.get<DigitalReaderStory[]>(this.baseUrl + author);
  }

  getDRStoriesByOwner(owner: string) : Observable<DigitalReaderStory[]>  {
    return this.http.get<DigitalReaderStory[]>(this.baseUrl + 'owner/' + owner);
  }

  getDRStory(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + 'withId/' + id);
  }
  
  getDRStoriesByDate(studentId:string, startDate:string, endDate:string) : Observable<any> {
    return this.http.post(this.baseUrl + "getStoriesByDate/" + studentId, {startDate:startDate, endDate:endDate});
  }

  getDRStoriesForLoggedInUser(): Observable<DigitalReaderStory[]> {
    const userDetails = this.auth.getUserDetails();
    if(!userDetails) {
      return new Observable(subscriber=>{
        subscriber.next([]);
        subscriber.complete();
      });
    }
    return this.getDRStoriesByOwner(userDetails._id);
  }

  saveStory(title: string, date: Date, dialect: string, text: string, author: string, createdWithPrompts: boolean) {
    const storyObj = {
      title: title,
      dialect: dialect,
      text: text,
      htmlText: text,
      author: author,
      createdWithPrompts: createdWithPrompts,
      activeRecording: null
    };
    console.log(storyObj);
    this.engagement.addEvent(EventType['CREATE-STORY'], {storyObject: storyObj});
    return this.http.post<{id: string}>(this.baseUrl + 'create', storyObj);
  }

  getStoriesFor(author : string): Observable<Story[]> {
    return this.http.get<Story[]>(this.baseUrl + author);
  }

  getStoriesByOwner(owner: string) : Observable<Story[]>  {
    return this.http.get<Story[]>(this.baseUrl + 'owner/' + owner);
  }

  getStory(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + 'withId/' + id);
  }
  
  getStoriesByDate(studentId:string, startDate:string, endDate:string) : Observable<any> {
    return this.http.post(this.baseUrl + "getStoriesByDate/" + studentId, {startDate:startDate, endDate:endDate});
  }

  getStoriesForLoggedInUser(): Observable<Story[]> {
    const userDetails = this.auth.getUserDetails();
    if(!userDetails) {
      return new Observable(subscriber=>{
        subscriber.next([]);
        subscriber.complete();
      });
    }
    return this.getStoriesByOwner(userDetails._id);
  }

  updateStoryTitleAndDialect(story: Story, title:string, dialect:any): Observable<any> {
    let updatedStory = story;
    if (title) updatedStory.title = title;
    
    if (dialect == this.ts.l.connacht) updatedStory.dialect = 'connemara';
    if (dialect == this.ts.l.munster) updatedStory.dialect = 'kerry';
    if (dialect == this.ts.l.ulster) updatedStory.dialect = 'donegal';
    
    console.log(updatedStory);

    return this.http.post(this.baseUrl + 'update/' + story._id, updatedStory);
  }

  updateTitle(storyId: string, title:string): Observable<any> {
    return this.http.post(this.baseUrl + 'updateTitle/' + storyId, {title});
  }
  
  getStoriesForClassroom(owner: string, date = 'empty'): Observable<any> {
    return this.http.get(this.baseUrl + "getStoriesForClassroom/" + owner + "/" + date);
  }

  getNumberOfStories(owner: string, date = 'empty'): Observable<any> {
    return this.http.get(this.baseUrl + "getNumberOfStories/" + owner + "/" + date);
  }

  updateStory(updateData: any, id: string): Observable<any> {
    return this.http.post(
      this.baseUrl + 'update/' + id,
      updateData);
  }

  deleteStory(id: string) {
    return this.http.get(this.baseUrl + 'delete/' + id);
  }
  
  deleteAllStories(id: string) {
    return this.http.get(this.baseUrl + 'deleteAllStories/' + id);
  }

  updateFeedbackStatus(id: string, feedbackMarkup: string, hasComments: boolean) : Observable<any> {
    return this.http.post(this.baseUrl + "updateFeedbackStatus/" + id, {feedbackMarkup: feedbackMarkup, hasComments: hasComments});
  }

  updateFeedbackMarkup(id: string, feedbackMarkup: string) : Observable<any> {
    return this.http.post(this.baseUrl + "updateFeedbackMarkup/" + id, {feedbackMarkup: feedbackMarkup});
  }

  getFeedback(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + "feedback/" + id);
  }

  viewFeedback(id: string) : Observable<any> {
    return this.http.post(this.baseUrl + "viewFeedback/" + id, {});
  }

  getFeedbackAudio(id: string) : Observable<any> {
    return this.http.get(this.baseUrl + "feedbackAudio/" + id, {responseType: "blob"});
  }

  addFeedbackAudio(id: string, audioBlob: Blob) : Observable<any>{
    let formData = new FormData();
    formData.append('audio', audioBlob);
    return this.http.post(this.baseUrl + "addFeedbackAudio/" + id, formData);
  }

  synthesise(id: string): Observable<any> {
    return this.http.get(this.baseUrl + 'synthesise/' + id);
  }

  synthesiseObject(storyObject: Story): Observable<any> {
    return this.http.post(this.baseUrl + 'synthesiseObject/', {story: storyObject});
  }

  updateActiveRecording(storyId: string, recordingId: string): Observable<any> {
    return this.http.post(this.baseUrl + 'updateActiveRecording/' + storyId + '/', {activeRecording: recordingId});
  }
  
  averageWordCount(studentId:string, startDate:string, endDate:string) : Observable<any> {
    return this.http.post(this.baseUrl + "averageWordCount/" + studentId, {startDate:startDate, endDate:endDate});
  }
  
  countGrammarErrors(studentId:string) : Observable<any> {
    return this.http.get(this.baseUrl + "countGrammarErrors/" + studentId);
  }

  getStoryStats() : Observable<any> {
    return this.http.get(this.baseUrl + "getStoryStats/allDB");
  }*/
}
