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
  public voiceSpeed = 1;
  //public speakerBaseSpeed = 6; // testing for Áine
  public speakerAlignmentConstant = .03; // testing for Áine

  // below boolean is needed to meaningfully distinguish audio.ended and audio.paused
  public audioPaused:Boolean = false;

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
    console.log(this.content)

    // only for testing
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

    let numNonWords = 0;
    for (let index=0; index<childWordSpans.length; index++) {
      let childWord = childWordSpans.item(index)
      if (word===childWord) {
        return index-numNonWords;
      }
      if (!this.disconnectedFromPreviousWord(childWord)) {
        numNonWords++;
      }
    }

    return -1;
  }

  // timings should not be applied to punctuation etc.
  disconnectedFromPreviousWord(word:Node) {

    const prevSibling = word.previousSibling;
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

    const childWordSpans = sentenceSpan.querySelectorAll('.word');

    //const childWordSpans = sentenceSpan.querySelectorAll('.word')
    const wordInd = this.getWordPositionIndex(word, childWordSpans)

    // for testing as ASR seems to split only on spaces.
    const sentenceText:string = this.recreateSentenceFromWord(childWordSpans.item(wordInd))
    const numTimings = sentenceText.split(' ').length
    console.log(numTimings)
    console.log(wordInd)
    
    const timings = sentAudioObj.timing;
    const tmp = [];
    const timingsArr = []

    console.log(timings)

    //const reSyncOffset = .03
    let reSyncBuffer = 0;

    //for (let i=wordInd; i<timings.length; i++) {
      for (let i=0; i<timings.length; i++) {
        //const childWord = childWordSpans.item(i)
        const timing = {};
        let start = 0 // if it is the first word
        const end = timings[i].end
        //if (i!=0 || wordInd!=0) { // if it is not the first word of the sentence
        //if (i!=0 && i>wordInd) { // if it is not the first word of the sentence
        if (i>0) {
          //start = timings[i-1].end
          //console.log(timingsArr.length, timingsArr[i-1]);
          //start = timings[i-1].end;
          start = tmp[i-1].end;
        }

        const length = end-start;
        //reSyncBuffer+=length*.1;

        timing['start'] = start;
        timing['end'] = end-reSyncBuffer; // testing
        //timing['end'] = end; // testing

        // there may be something wrong with the timing alignment in the actual array - may have fixed it also
        //if (i>=wordInd)
        tmp.push(timing)

        //reSyncBuffer+=length*.09; // should not apply to the first word
        //const modifier = .033*(1 + (1-this.voiceSpeed))*(this.speakerBaseSpeed); // should not apply to the first word
        //console.log(modifier)
        //reSyncBuffer+=length*Math.min(modifier, .9);
        reSyncBuffer+=length*this.speakerAlignmentConstant;
    }

    console.log(tmp)
    return tmp.slice(wordInd, timings.length);

  }

  // TODO : relocate to the story creation page
  synthRequest(text: string) {
    const audioObservable = firstValueFrom(this.synth.synthesiseText(
      text,
      { name: "Áine", gender: "female", shortCode: "anb", code: "ga_UL_anb_nemo", dialect: "ulster", algorithm: "nemo", },
      //{ name: "Síbéal", gender: "female", shortCode: "snc", code: "ga_CO_snc_nemo", dialect: "connacht", algorithm: "nemo", },
      false,
      'MP3',
      this.voiceSpeed)
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

      this.pause();
      //only for testing
      this.playWord();
    }/* else if (segment && segment.classList.contains('sentence')) {
      this.currentWord = null;
    }*/

    console.log(this.currentWord)
    console.log(this.currentSentence)
  }

  jumpToCurrentWord() {
    const topScreenOffset = 60;
    if (this.currentWord) {
      //(this.currentWord as HTMLElement).focus();
      const dimensions = this.currentWord?.getBoundingClientRect()
      if (dimensions) {
        if (
          dimensions.top > window.innerHeight ||
          dimensions.bottom - topScreenOffset < 0
          //&& document.activeElement!==this.currentWord
        ) {
          this.currentWord?.scrollIntoView({ behavior: "smooth"});
        }
      }
    }
  }

  setCurrentWord() {
    if (this.currentWord) {
      this.currentWord.classList.add('currentWord')
      this.jumpToCurrentWord();
    }
  }

  updateCurrentWord(newWord:Element|null, delay=0) {
    
    if (this.currentWord) {
      if (this.currentWord!==newWord) {
        if (delay>0){
          const prevWord = this.currentWord
          setTimeout( () => { // to keep a trail of word highlights for a short time
            prevWord.classList.remove('currentWord')
            console.log(prevWord?.textContent, 'highlight removed')
          }
          , delay)
        } else {
          this.currentWord.classList.remove('currentWord')
        }
      }
    }
      //const nextWord = this.checkForNextSiblingWord(this.currentWord)
    this.currentWord = newWord;
    this.setCurrentWord()
    
  }

  seekNextWord() {
    if (this.timings.length>0 && !this.audioPaused) {
      if (this.audio.currentTime>this.timings[0].end) {
        this.timings.shift();
        const nextWord = this.getNextDisconnectedWord(this.currentWord)
        // this.audioPaused is repeated in an attempt to mitigate any issues regarding asynchronisation
        if (!this.audioPaused) {
          this.updateCurrentWord(nextWord, 200)
          setTimeout(
            () => this.seekNextWord() // added in the case of a very fast speaker (e.g Áine)
          , 60)//30)
        }
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

    if (this.audio) this.pause(); // to avoid multiple audio instances at the same time
    this.audioPaused = false;
    
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

        setTimeout( async () => {

          // TODO: delete the current audio element + listener (if needed (?))

          if (continuous) {
            let nextSent = this.checkForNextSiblingSeg(this.currentSentence, 'sentence');
            console.log(nextSent)
            // if this section does not contain anymore sentences
            if (!nextSent)
              nextSent = this.checkForNextSentence(this.currentSentence);
            if (nextSent) {
              this.currentSentence = nextSent;
              const firstWord = nextSent.querySelector('.word') // TODO : maybe factor out to function
              this.updateCurrentWord(firstWord);

              if (this.currentWord) {
                // TODO : factor out into function
                //const sentAudioObj = this.listOfAudios[parseInt(this.currentWord.getAttribute('sentid'))]
                const sentAudioObj = await this.getCurrentAudioObject();
                
                
                console.log(this.audio)
                console.log(this.audio.paused)
                console.log(this.audio.ended)
                //if (sentAudioObj && (this.audio && (!this.audio.paused || this.audio.ended))) {
                if (sentAudioObj && !this.audioPaused) {
                  this.timings = this.getWordTimings(this.currentWord, this.currentSentence, sentAudioObj)
                  //this.setCurrentWord()
                  await this.playFromCurrentWord(sentAudioObj.audioUrl, true)
                }
              }
            }
          } else {
            this.updateCurrentWord(null)
          }
      }, 400) // keep final word highlighted for a bit longer
      }

      this.audio.currentTime = start
      this.audio.play();
    }

  }

  async playWord() {
    if (this.currentWord) {
      const audioObj = await this.synthRequest(this.currentWord.textContent);

      const audio = document.createElement('audio')
      audio.src = audioObj.audioUrl;
      audio.play();
      /*if (this.currentSentence) {
        const childWordSpans = this.currentSentence.querySelectorAll('.word');
        //const wordInd = this.getWordPositionIndex(this.currentWord, childWordSpans);

        const sentAudioObj = await this.getCurrentAudioObject();

        this.timings = this.getWordTimings(this.currentWord, this.currentSentence, sentAudioObj);
        //console.log(wordInd);
        console.log(this.timings);

        const timing = this.timings[0];

        // word audio object is independant from main audio object
        const audio = document.createElement('audio')
        audio.src = sentAudioObj.audioUrl;

        //const buffer = (timing.end-timing.start)*0.01;
        const buffer = 0;

        const start = Math.max(timing.start-buffer, 0);
        //const end = Math.min(timing.end+buffer, (audio.duration-start));
        const end = timing.end+buffer;

        console.log(timing.start, timing.end)
        console.log(start, end)

        audio.currentTime = start;
        audio.play();

        setTimeout(() => {
          audio.pause();
          console.log('pause!')
        }, (end-start)*1000);
      }*/

    } 
  }

  // placeholder
  async play() {

  }

  // needs complete refactoring - the outer if statement can probably be done away with
  // different functions can be used for playing a sentence etc.
  async playStory() {
    console.log(this.currentWord)
    console.log(this.currentSentence)
    if (!this.currentWord) {
      // below 2 lines really need to be refactored - should create a reference to the story root node
      // this.content is not enough as it does not reference the actual rendered elements
      this.currentSentence = document.querySelector('.storyContainer').querySelector('.sentence') // only for testing
      this.currentWord = this.currentSentence.querySelector('.word') // only for testing
      //
    }
    const sentAudioObj = await this.getCurrentAudioObject();
    console.log(sentAudioObj)

    this.timings = this.getWordTimings(this.currentWord, this.currentSentence, sentAudioObj)
    console.log(this.timings)
    this.setCurrentWord()
    await this.playFromCurrentWord(sentAudioObj.audioUrl, true)
  }

  /*async playNextSent() {
    if (this.currentSentence) {
      const nextSent = this.checkForNextSentence(this.currentSentence);
      this.currentSentence = nextSent;
    } else {
      this.currentSentence = document.querySelector('.storyContainer').querySelector('.sentence') // only for testing
    }

    if (this.currentSentence) {
      
      const firstWord = this.currentSentence.querySelector('.word'); // only for testing

      const sentAudioObj = await this.getCurrentAudioObject();
      if (sentAudioObj && !this.audioPaused) {
        this.timings = this.getWordTimings(this.currentWord, this.currentSentence, sentAudioObj)
        this.updateCurrentWord(firstWord)
        await this.playFromCurrentWord(sentAudioObj.audioUrl, false)
      }
    }
  }*/

  pause() {
    this.audio.pause()
    this.audioPaused = true;
  }

}
