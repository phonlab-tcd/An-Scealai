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

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthenticationService,
    private engagement: EngagementService,
    private ts: TranslationService,
  ) { }

  baseUrl: string = config.baseurl
  segmentableTags: string = 'p, h1, h2, h3, h4, h5, h6, li, th, td'

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
  async processUploadedFile(req: File) {
    
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

    // TODO : add html sanitisation !!*******
    // *CODE GOES HERE*

    // parse the stringified html as a html document
    const htmlParser = new DOMParser();
    const parsedDoc = htmlParser.parseFromString(convertedHtml, 'text/html')
    console.log(parsedDoc)

    // extract text chunks from html elements to send to sentence segmenter
    const sentenceTextChunks = await this.segmentText(parsedDoc)
    console.log(sentenceTextChunks)

    // reformat sentence segmenter output for use with the segmentation API
    const sentences:Array<Object> = this.reformatExtractedSentences(sentenceTextChunks)

    const words:Array<Object> = await this.tagSentences(sentenceTextChunks)

    const segmentedHtml = await firstValueFrom(
      this.http.post<string>(this.baseUrl + 'digitalReader/segment-html', 
        {text: convertedHtml, sentences: sentences, words: words}
      )
    )

    // for testing
    const parsedSegmentedDoc = htmlParser.parseFromString(segmentedHtml, 'text/html')
    /*console.log(parsedSegmentedDoc)

    document.body.innerHTML = parsedSegmentedDoc.body.innerHTML

    console.log(constructJSON(parsedSegmentedDoc.body))*/

    return parsedSegmentedDoc

    /*} catch (error) {
      alert(error.message)
    }*/
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
