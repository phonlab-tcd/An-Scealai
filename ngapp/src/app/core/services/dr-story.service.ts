import { Injectable } from '@angular/core';
//import { DigitalReaderStory } from 'app/core/models/dr-story';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Observable } from 'rxjs';
import { EngagementService } from 'app/core/services/engagement.service';
import { EventType } from 'app/core/models/event';
import { TranslationService } from 'app/core/services/translation.service';
import config from 'abairconfig';
import { firstValueFrom, tap } from 'rxjs';


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
  segmentableTags: string = 'p, h1, h2, h3, h4, h5, h6, li, title, th, td'

  async tokenizeSentence(input: string) {
    const sentences = await firstValueFrom(
      this.http.post<Array<string>>(this.baseUrl + 'nlp/sentenceTokenize', {text: input})
    )
    return sentences
  }

  /*async testChildProcess() {
    const out = await firstValueFrom(
      this.http.post<{id: string}>(this.baseUrl + 'digitalReader/convert', {text: 'test!\nrud eile\nrud eile'})
    )
    return out
  }*/

  //may need to parse from a string rather than a document
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
      const segmentedChunkSentences = await this.tokenizeSentence(chunk)
      //console.log('test')
      //console.log(segmentedChunkSentences)

      for (let i = 0; i < segmentedChunkSentences.length; i++) {
        const segmentedChunkSentence = segmentedChunkSentences[i];
        segmentedSentences.push(segmentedChunkSentence)
      }
    }

    return segmentedSentences
  }

  async testChildProcess() {
    const out = await firstValueFrom(
      this.http.post<string>(this.baseUrl + 'digitalReader/unzip', {body: 'test!\nrud eile\nrud eile'})
    )
    return out
  }

  async saveDRStory(title: string, date: Date, dialects: Array<string>, content: Object) {
    const drstoryObj = {
      title: title,
      dialects: dialects,
      //text: text,
      content: content,
      //author: author,
      //createdWithPrompts: createdWithPrompts,
      //activeRecording: null
    };
    console.log(drstoryObj);
    //this.engagement.addEvent(EventType['CREATE-DR-STORY'], {storyObject: drstoryObj});
    return this.http.post<{id: string}>(this.baseUrl + 'drStory/create', drstoryObj);
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
