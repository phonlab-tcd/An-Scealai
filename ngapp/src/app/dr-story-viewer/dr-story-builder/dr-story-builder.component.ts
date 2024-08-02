import { Component, OnInit, ViewChild, ElementRef, Input, HostListener, importProvidersFrom } from "@angular/core";
import { SynthItem } from "app/core/models/synth-item";
import { SynthesisService, Voice } from "app/core/services/synthesis.service";
import { TranslationService } from "app/core/services/translation.service";
import { SynthesisPlayerComponent } from "app/student/synthesis-player/synthesis-player.component";
import { ActivatedRoute, ChildActivationEnd, Router } from "@angular/router";
import { AuthenticationService } from "app/core/services/authentication.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
/*import { ClassroomService } from "app/core/services/classroom.service";
import { MessageService } from "app/core/services/message.service";
import { RecordAudioService } from "app/core/services/record-audio.service";
import { DigitalReaderStoryService } from "app/core/services/dr-story.service";
import { SynthVoiceSelectComponent } from "app/synth-voice-select/synth-voice-select.component";
import { firstValueFrom } from "rxjs";
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BasicDialogComponent } from '../dialogs/basic-dialog/basic-dialog.component';
import { Message } from "app/core/models/message";*/
import { CommonModule } from "@angular/common";
/*import { SynthItemModule } from "app/synth-item/synth-item.module";
import { SynthVoiceSelectModule } from "app/synth-voice-select/synth-voice-select.module";
import { EngagementService } from "app/core/services/engagement.service";
import { EventType } from "app/core/models/event";*/

//import { constructHTML } from '@phonlab-tcd/json2html';
import { ViewEncapsulation } from '@angular/core';
import { DigitalReaderStoryService } from "app/core/services/dr-story.service";
import { firstValueFrom, Observable } from "rxjs";
import { QuillModule } from "ngx-quill";

@Component({
  standalone: true,
  //providers: [importProvidersFrom(QuillModule.forRoot())],
  imports: [
    CommonModule,
    QuillModule
  ],
  selector: "app-dr-story-builder",
  templateUrl: "./dr-story-builder.component.html",
  styleUrls: ["./dr-story-builder.component.scss"], // Digital Reader Story Styling
  encapsulation: ViewEncapsulation.None // Without this line, non-angular html can not be targetted for styling
})
export class DigitalReaderStoryBuilderComponent implements OnInit {
  
  @Input() type=''
  @Input() content:Element
  @Input() class:string
  @Input() id:string
  @Input() src:string
  @Input() lemma:string
  @Input() tags:string

  public forceTrustedHTML:SafeHtml;
  public currentSentence:Element | null = null;
  public currentWord:Element | null = null;
  public listOfAudios:any[] = []
  public audio:HTMLAudioElement;
  public timings:any[] = []

  constructor(
    
    private auth: AuthenticationService,
    private synth: SynthesisService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public ts: TranslationService,
    protected sanitizer: DomSanitizer,
    private drStoryService: DigitalReaderStoryService,
  ) {
    
    //this.audio = document.createElement('audio')

  }

  async ngOnInit() {
    //this.audioCreationTest()
    /*console.log(this.content.textContent)
    const audioObservable = firstValueFrom(this.synth.synthesiseText(
      this.content.textContent,
      { name: "Sibéal", gender: "female", shortCode: "snc", code: "ga_CO_snc_nemo", dialect: "connacht", algorithm: "nemo", },
      false,
      'MP3',
      1)
    ).then( (data) => {
      console.log(data)
    })*/

    this.forceTrustedHTML = this.sanitizer.bypassSecurityTrustHtml(this.content.innerHTML)

    const firstSentSpans = this.content?.querySelectorAll('.sentence')
    for (let i=0;i<3;i++) {
      const sent = firstSentSpans.item(i)
      this.synthRequest(sent?.textContent).then( (data) => {
        console.log(data)
        this.listOfAudios[i] = data // only for testing
        console.log(this.listOfAudios)
        //return data
      })
    }
    
  }

  getWordPositionIndex(word:Element, childWordSpans:NodeList) {

    for (let index=0; index<childWordSpans.length; index++) {
      let childWord = childWordSpans.item(index)
      if (word===childWord) {
        return index
      }
    }

    return -1;
  }

  // timings should not be applied to punctuation etc.
  disconnectedFromPreviousWord(word:Node) {

    const prevSibling = word.previousSibling;
    /*console.log(prevSibling?.textContent)
    console.log(prevSibling?.textContent?.charAt(prevSibling?.textContent.length-1))
    console.log(prevSibling?.textContent?.charAt(-1)==' ')
    console.log(prevSibling?.textContent?.charAt(-1)===' ')*/
    if (prevSibling) {
      if (prevSibling.textContent?.charAt(prevSibling?.textContent.length-1)===' ') {
        return true
      } else {
        return false;
      } 
    }

    return true;

  }

  getNextDisconnectedWord(word:Element) {

    let tmp = this.checkForNextSiblingSeg(word, 'word')//word.nextElementSibling;

    while (tmp) {
      console.log(tmp)
      if (this.disconnectedFromPreviousWord(tmp))
        return tmp;
      tmp = this.checkForNextSiblingSeg(tmp, 'word')
    }

    return null;

  }

  recreateSentenceFromWord(word:Node) {
    let text = '';
    let tmp = word;
    while (tmp) {
      text += tmp.textContent;
      tmp = tmp.nextSibling;
    }
    return text
  }

  /**
   * Find the timings of the specified word
   * @param {Object} res
   * @param {any} sentence : Object containing the sentence span element and its associated audio Object
   */
  getWordTimings(word:Element, sentenceSpan:Element, sentAudioObj:any) {
    //const sentenceSpan = sentence.sent;
    //const audioObj = sentence.audio;

    const childWordSpans = sentenceSpan.querySelectorAll('.word');

    //const childWordSpans = sentenceSpan.querySelectorAll('.word')
    const wordInd = this.getWordPositionIndex(word, childWordSpans)

    // for testing as ASR seems to split only on spaces.
    const sentenceText:string = this.recreateSentenceFromWord(childWordSpans.item(wordInd))
    const numTimings = sentenceText.split(' ').length
    console.log(numTimings)
    
    //let timings = {};

    /*for (let i=0;i<childWordSpans.length;i++) {
      const childWord = childWordSpans.item(i)
      if (word === childWord) {
        let start = 0 // if it is the first word
        const end = sentAudioObj.timing[i].end
        if (i!=0) {
          start = sentAudioObj.timing[i-1].end
        }
        timings['start'] = start;
        timings['end'] = end;
        return timings;
      }
    }*/
   const timings = sentAudioObj.timing;
   const timingsArr = []

   /*console.log(timings.length)
   console.log(childWordSpans.length)
   console.log(timings)
   console.log(childWordSpans)*/

   //const reSyncOffset = .03
   let reSyncBuffer = 0;

   for (let i=wordInd; i<numTimings; i++) {
      //const childWord = childWordSpans.item(i)
      const timing = {};
      let start = 0 // if it is the first word
      const end = timings[i].end
      if (i!=0 || wordInd!=0) { // if it is not the first word of the sentence
        start = timings[i-1].end
      }

      const length = end-start;
      //reSyncBuffer+=length*.1;
      reSyncBuffer+=length*.066;

      timing['start'] = start;
      //timing['end'] = Math.max(start+.000005, end-reSyncBuffer); // testing
      //timing['end'] = start-reSyncBuffer; // testing
      timing['end'] = end; // testing
      timing['end'] = end-reSyncBuffer; // testing
      // there may be something wrong with the timing alignment in the actual array - may have fixed it also
      timingsArr.push(timing)
   }

    console.log(timingsArr)
    return timingsArr;

  }

  // TODO : relocate to the story creation page
  synthRequest(text: string) {
    const audioObservable = firstValueFrom(this.synth.synthesiseText(
      text,
      { name: "Sibéal", gender: "female", shortCode: "snc", code: "ga_CO_snc_nemo", dialect: "connacht", algorithm: "nemo", },
      false,
      'MP3',
      1)
    )
    console.log('request sent');
    return audioObservable
  }

  // TODO : relocate to the story creation page
  audioCreationTest() {
    let synthesisableSegments = this.content.querySelectorAll('.sentence')

    let tmp = Array.from(synthesisableSegments)

    let i = 0;
    for (let j=20;j<tmp.length;j+=20) {
      for (let k=i;k<j;k++) {
        const seg = tmp[k].textContent

        this.listOfAudios[k] = (this.synthRequest(seg))
      }
      i = j
    }
    for (let k=i;k<tmp.length;k++) {
      const seg = tmp[k].textContent
      
      this.listOfAudios[k] = (this.synthRequest(seg))
    }
  }

  checkForSegmentParent(node:Element) {
    if (node.classList.contains('sentence') || node.classList.contains('word'))
      return node;
    let tmp = node;
    while (tmp.parentElement) {
      tmp = tmp.parentElement
      if (tmp.classList.contains('sentence') || tmp.classList.contains('word'))
        return tmp;
    }
    return null;
  }

  checkForNextSiblingSeg(elem:Element, segType:string) {
    if (elem) {
      let tmp = elem.nextElementSibling;
      while (tmp) {
        //console.log(tmp)
        if (tmp.classList.contains(segType))
          return tmp
        tmp = tmp.nextElementSibling
      }
    }
    return null;
  }

  checkForNextSentence(sentSpan:Element) {
    const parentElem = sentSpan.parentElement
    let adjascentSection = parentElem.nextElementSibling
    console.log(adjascentSection)
    while (adjascentSection) {
      const firstSent = adjascentSection.querySelector('.sentence') // TODO : maybe factor out into function
      console.log(firstSent)
      //const nextSent = this.checkForNextSiblingSeg(firstSent, 'sentence')
      //console.log(nextSent)
      if (firstSent)
        return firstSent

      adjascentSection = adjascentSection.nextElementSibling 
    }
    return null;
  }

  //@HostListener('document:click', ['$event.target'])
  @HostListener('click', ['$event.target'])
  async checkSegmentClicked(targetElem:Element) {
    //console.log(event)
    const segment = this.checkForSegmentParent(targetElem)
    if (segment && segment.classList.contains('word')) {
      this.updateCurrentWord(segment)
      //this.currentWord = segment;
      this.currentSentence = this.checkForSegmentParent(this.currentWord.parentElement)
      const storySentencesWithMatchingWords:Array<any> = await firstValueFrom(
        this.drStoryService.getMatchingWords(segment.getAttribute('lemma'), segment.getAttribute('tags'))
      )
      //console.log()
      const sentencesWithMatchingWords = []
      for (let storyGroup of storySentencesWithMatchingWords) {
        console.log(storyGroup)
        for (let sentence of storyGroup.sentences) {
          sentencesWithMatchingWords.push(sentence)
        }
      }
      console.log(sentencesWithMatchingWords)
      /*const audioObj = await firstValueFrom(this.synth.synthesiseText(
        segment.textContent,
        { name: "Sibéal", gender: "female", shortCode: "snc", code: "ga_CO_snc_nemo", dialect: "connacht", algorithm: "nemo", },
        true,
        'MP3',
        1))
      const tmp = document.createElement('audio');
      console.log(audioObj);
      tmp.src = audioObj.audioUrl;
      tmp.play();
      tmp.remove();*/
    } else if (segment && segment.classList.contains('sentence')) {
      this.currentWord = null;
    }

    console.log(this.currentWord)
    console.log(this.currentSentence)
  }


  /*playWord(audioSrc:string, timings:any){
    const buffer = .05;
    const start = Math.max(timings.start-buffer, 0);
    const end = timings.end;

    //const audio = document.createElement('audio')
    //if (audioSrc!= this.audio.src) this.audio.src = audioSrc
    const audio = document.createElement('audio')
    audio.src = audioSrc
    
    
    audio.currentTime = start
    audio.play();
  }*/

  setCurrentWord() {
    if (this.currentWord)
      this.currentWord.classList.add('currentWord')
  }

  updateCurrentWord(newWord:Element|null) {
    
    if (this.currentWord) this.currentWord.classList.remove('currentWord')
      //const nextWord = this.checkForNextSiblingWord(this.currentWord)
    this.currentWord = newWord;
    this.setCurrentWord()
    
  }

  seekNextWord() {
    if (this.timings.length>0) {
      if (this.audio.currentTime>this.timings[0].end) {
        this.timings.shift();
        const nextWord = this.getNextDisconnectedWord(this.currentWord)
        this.updateCurrentWord(nextWord)
        console.log(this.currentWord)
      }
    }
  }

  parseSegId(id:string, _class:string) {
    return parseInt(id.replace(_class, ''));
  }

  async getCurrentAudioObject() {
    const sentId = this.parseSegId(this.currentSentence.getAttribute('id'), 'sentence')
    let audioObj = this.listOfAudios[sentId];

    // if the audio has not yet been created, synthesise it and add it to the list.
    if (!audioObj) {
      audioObj = await this.synthRequest(this.currentSentence?.textContent);
      this.listOfAudios[sentId] = audioObj;
    }

    return audioObj;
  }

  async playFromCurrentWord(audioSrc:string, continuous=false) {
    
    //const timing = this.timings.shift()
    const timing = this.timings[0]

    if (timing) {

      //const buffer = .05;
      //const start = Math.max(timing.start-buffer, 0);
      const start = timing.start
      
      const audio = document.createElement('audio')
      this.audio = audio;
      this.audio.src = audioSrc

      this.audio.ontimeupdate = () => {
        this.seekNextWord()
      }

      console.log(this.timings)

      //this.seekNextWord()

      this.audio.onended = async (event) => {

        this.updateCurrentWord(null)

        // TODO: delete the current audio element + listener (if needed (?))

        if (continuous) {
          let nextSent = this.checkForNextSiblingSeg(this.currentSentence, 'sentence');
          console.log(nextSent)
          // if this section does not contain anymore sentences
          if (!nextSent)
            nextSent = this.checkForNextSentence(this.currentSentence);
          if (nextSent) {
            this.currentSentence = nextSent;
            this.currentWord = nextSent.querySelector('.word') // TODO : maybe factor out to function

            if (this.currentWord) {
              // TODO : factor out into function
              //const sentAudioObj = this.listOfAudios[parseInt(this.currentWord.getAttribute('sentid'))]
              const sentAudioObj = await this.getCurrentAudioObject();
              
              if (sentAudioObj) {
                this.timings = this.getWordTimings(this.currentWord, this.currentSentence, sentAudioObj)
                this.setCurrentWord()
                await this.playFromCurrentWord(sentAudioObj.audioUrl, true)
              }
            }
          }
        }
      }

      this.audio.currentTime = start
      this.audio.play();
    }

  }

  // needs complete refactoring - the outer if statement can probably be done away with
  // different functions can be used for playing a sentence etc.
  async play() {
    console.log(this.currentWord)
    console.log(this.currentSentence)
    if (this.currentWord) { // play from current word
      //const sentAudioObj = this.listOfAudios[parseInt(this.currentWord.getAttribute('sentid'))]
      const sentAudioObj = await this.getCurrentAudioObject();

      this.timings = this.getWordTimings(this.currentWord, this.currentSentence, sentAudioObj)
      console.log(this.timings)
      this.setCurrentWord()
      await this.playFromCurrentWord(sentAudioObj.audioUrl, true)
    } else if (this.currentSentence) { // play from sentence start

    } else { // play from beginning
      // below 2 lines really need to be refactored - should create a reference to the story root node
      // this.content is not enough as it does not reference the actual rendered elements
      this.currentSentence = document.querySelector('.storyContainer').querySelector('.sentence') // only for testing
      this.currentWord = this.currentSentence.querySelector('.word') // only for testing
      //
      
      const sentAudioObj = await this.getCurrentAudioObject();

      this.timings = this.getWordTimings(this.currentWord, this.currentSentence, sentAudioObj)
      console.log(this.timings)

      this.setCurrentWord()
      
      await this.playFromCurrentWord(sentAudioObj.audioUrl, true)
    }
  }

  pause() {
      this.audio.pause()
  }

}
