import { Component, OnInit, ViewChild, ElementRef, Input, HostListener, importProvidersFrom, ChangeDetectorRef } from "@angular/core";
import { SynthItem } from "app/core/models/synth-item";
import { SynthesisService, Voice, voices } from "app/core/services/synthesis.service";
import { TranslationService } from "app/core/services/translation.service";
import { SynthesisPlayerComponent } from "app/student/synthesis-player/synthesis-player.component";
import { ActivatedRoute, ChildActivationEnd, Router } from "@angular/router";
import { AuthenticationService } from "app/core/services/authentication.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

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
import { MatSelectModule } from "@angular/material/select";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

import { constructHTML } from '@phonlab-tcd/json2html';

import tippy, { hideAll, createSingleton } from 'tippy.js';

import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { InstructionsDialogComponent } from "../../dialogs/instructions-dialog/instructions-dialog.component";
import { StudentModule } from "app/student/student.module";
import { DictionaryDrawerComponent } from "app/student/dictionary-drawer/dictionary-drawer.component";

const dialectToVoiceIndex = new Map<string, number>([
  ["Connacht f", 0],
  ["Ulster f", 1],
  ["Connacht m", 2],
  ["Munster f", 3],
  //["Munster m", 4], // there is a problem with the male Munster voice (Colm)
]);

@Component({
  standalone: true,
  //providers: [importProvidersFrom(QuillModule.forRoot())],
  imports: [
    CommonModule,
    QuillModule,
    MatSelectModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatSnackBarModule,
    StudentModule
  ],
  selector: "app-dr-story-builder",
  templateUrl: "./dr-story-builder.component.html",
  styleUrls: ["./dr-story-builder.component.scss"], // Digital Reader Story Styling
  encapsulation: ViewEncapsulation.None // Without this line, non-angular html cannot be targetted for styling
})
export class DigitalReaderStoryBuilderComponent implements OnInit {

  @ViewChild('dictionary', { static: false }) dictionary!: DictionaryDrawerComponent;

  @Input() content:Element
  @Input() storyId:string
  @Input() startingWordId:string | null

  public forceTrustedHTML:SafeHtml;
  public currentSentence:Element | null = null;
  public currentWord:Element | null = null;

  public listOfAudios:any = []

  public audio:HTMLAudioElement;
  public timings:any[] = []
  public voiceSpeed = 1;
  //public speakerBaseSpeed = 6; // testing for Áine
  public speakerAlignmentConstant = .03; // testing resync of audio

  // below boolean is needed to meaningfully distinguish audio.ended and audio.paused
  public audioPaused:Boolean = false;

  public audioPlaying:Boolean = false;
  public playContinuously:Boolean = false;

  public functioningVoices = voices.slice(0, 4) // excluding Colm (male munster).
  
  public voiceIndex:number = 0; 
  public speaker = this.functioningVoices[this.voiceIndex]; // defaults to Sibéal nemo

  public clickTimeoutRef:NodeJS.Timeout | undefined = undefined;

  public pageContent:Element;
  public sideBar:Element;

  public matchingWordSentenceObjs:any;

  public alphabeticallySortedWordFreqs:Array<any> = [];
  public sortedWordFreqs:Array<any> = [];

  //public frequencyIndex:Array<any> = [];

  public sideBarDisplayType:string = 'grammar';
  public sideBarDisplaySort:string = 'numerical';

  public grammarHeading:string = '';

  dialogRef: MatDialogRef<unknown>;

  constructor(
    
    private auth: AuthenticationService,
    private synth: SynthesisService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public ts: TranslationService,
    protected sanitizer: DomSanitizer,
    private drStoryService: DigitalReaderStoryService,
    public snackbar:MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {

    this.forceTrustedHTML = this.sanitizer.bypassSecurityTrustHtml(this.content.innerHTML)

    this.pageContent = document.querySelector('.mainPage') as Element;
    this.sideBar = document.querySelector('.sideBar') as Element;

    console.log(dialectToVoiceIndex)
    for (let entry of dialectToVoiceIndex.entries()) {
      //const key = entry[0];
      const voiceIndex = entry[1];
      this.listOfAudios[voiceIndex] = [];
    }

    // only for testing
    const firstSentSpans = this.content?.querySelectorAll('.sentence')

    const allGeneratedAudio = await firstValueFrom(this.drStoryService.getSynthAudio(this.storyId));
    console.log(allGeneratedAudio);

    console.log(this.listOfAudios);
    this.sortGeneratedAudio(allGeneratedAudio, firstSentSpans);
    console.log(this.listOfAudios);

    let allAudioSynthesised = true;
    const numSentences = firstSentSpans.length;
    for (let entry of dialectToVoiceIndex.entries()) { // check if all sentences have been synthesised
      const voiceIndex = entry[1];
      if (this.listOfAudios[voiceIndex].length !== numSentences) {
        allAudioSynthesised = false;
      }
    }
    if (!allAudioSynthesised) {
      const dialectToVoiceIndexArr = Array.from(dialectToVoiceIndex.entries());
      if (dialectToVoiceIndexArr.length>1) {
        const firstVoiceIndex = dialectToVoiceIndexArr[0][1];
        const numSynthesisedSents = this.listOfAudios[firstVoiceIndex].length;
        // check if all speakers have the same no. of sentences synthesised,
        // in which case there is a problem with synthesising one or more sentences
        console.log(dialectToVoiceIndexArr);
        if (dialectToVoiceIndexArr.every( (entry) => {
          const voiceIndex = entry[1];
          console.log(voiceIndex);
          console.log(this.listOfAudios[voiceIndex].length);
          if (this.listOfAudios[voiceIndex].length!==numSynthesisedSents) return false;
          else return true;
        } )) {
          this.snackbar.open(this.ts.l.problem_with_synth, this.ts.l.okay, {duration: 4000});
        } else {
          this.snackbar.open(this.ts.l.synth_in_progress, this.ts.l.okay, {duration: 4000});
        }
      } else {
        this.snackbar.open(this.ts.l.synth_in_progress, this.ts.l.okay, {duration: 4000});
      }

      /*if ((...(dialectToVoiceIndex.entries())).every())
      for (let entry of dialectToVoiceIndex.entries()) {
        const voiceIndex = entry[1];
      }*/
        
    }

    if (this.startingWordId) {
      const startingWord = document.querySelector(`#word${this.startingWordId}`);
      if (startingWord) {
        this.updateCurrentWord(startingWord);
        //this.jumpToCurrentWord();
      }
    }

    tippy('.word', {
      role: 'lemma and tags tooltip',
      allowHTML: true,
      content: (reference) => {
        const lemma = reference.getAttribute('lemma');
        const tags:string = reference.getAttribute('tags');
        const parsedTags:any = this.drStoryService.parseGrammarTags(tags);
        const anchorText = reference.textContent;
        //const anchorLemma = reference.textContent;
        //return `<div class="tooltipContent"><div><p>Base word: ${lemma}</p><p>test: ${tags}</p><p>Info: ${parsedTags}</p></div></div>`;
        return `<div data-lemma="${lemma}" data-tags="${tags}" data-text="${anchorText}" class="grammarTooltipContent"><div><p>${this.ts.l.lemma}: <b>${lemma}</b></p><p>${parsedTags.class} <i>${parsedTags.attrs}</i></p></div></div>`;
      },
      //delay: [200, 50],
      delay: [300, 50], // delay before it shows/hides
      interactive: true,
      duration: [400, 100], // show/hide transition duration
      //arrow: false,
      theme: 'material',
      offset: [0,5],
      hideOnClick: false,
    })

    const unparsedWordFrequencies = (await firstValueFrom(this.drStoryService.getStoryWordFreqs()))[0].words;
    console.log(unparsedWordFrequencies);

    const unsortedWordFrequencies:Array<any> = []
    for (const wordFreq of unparsedWordFrequencies) {
      //console.log(wordFreq);
      const tag_lemma = wordFreq.tag_lemma.split('_', 2);
      unsortedWordFrequencies.push({
        tags: tag_lemma[0],
        lemma: tag_lemma[1],
        count: wordFreq.count
      });
    }
    console.log(unsortedWordFrequencies);

    this.alphabeticallySortedWordFreqs = unsortedWordFrequencies.slice();
    this.alphabeticallySortedWordFreqs.sort((a, b) => a.lemma.localeCompare(b.lemma));
    console.log(this.alphabeticallySortedWordFreqs);

    this.sortedWordFreqs = unsortedWordFrequencies.slice();
    this.sortedWordFreqs.sort((a, b) => b.count - a.count);
    console.log(this.sortedWordFreqs);

    //console.log(tmp);

    // const allWordSpans = this.content?.querySelectorAll('.word');

    // const allLemmaTagsCombo:Array<Array<string>> = [];
    // for (let i=0;i<allWordSpans.length;i++) {
    //   const wordSpan = allWordSpans.item(i);
    //   const lemma = wordSpan.getAttribute('lemma') as string;
    //   const tags = wordSpan.getAttribute('tags') as string;
    //   if (!allLemmaTagsCombo.includes([lemma,tags])) {
    //     allLemmaTagsCombo.push([lemma, tags])
    //   }
    // }
    // console.log(allLemmaTagsCombo);

    // for (let lemmaTagCombo of allLemmaTagsCombo) {
    //   const allWordOccurrences:Array<any> = await firstValueFrom(
    //     this.drStoryService.getMatchingWords(lemmaTagCombo[0], lemmaTagCombo[1])
    //   );
    //   const numOccurences = allWordOccurrences.length;
    //   console.log(numOccurences);
    //   console.log(allWordOccurrences);
    //   this.frequencyIndex.push(
    //     {
    //       num: numOccurences,
    //       lemma: lemmaTagCombo[0],
    //       tags: lemmaTagCombo[1]
    //     }
    //   );
      
    // }

    // for (let i=0;i<allWordSpans.length;i++) {
    //   const wordSpan = allWordSpans.item(i);
    // //for (let wordSpan of allWordSpans) {
    //   const lemma = wordSpan.getAttribute('lemma');
    //   const tags = wordSpan.getAttribute('tags');
    //   const allWordOccurrences:Array<any> = await firstValueFrom(
    //     this.drStoryService.getMatchingWords(lemma, tags)
    //   );
    //   console.log(allWordOccurrences);
    // }
    
  }

  sortGeneratedAudio(audioArr:Array<any>, sentenceSpans:NodeList) {
    //let tmpSortedAudio:[][] = [];
    for (let voiceIndex=0;voiceIndex<this.functioningVoices.length;voiceIndex++) {
      const voice = this.functioningVoices[voiceIndex];
      const speakerAudioWithPotentialGaps:Array<any> = audioArr.filter( (elem) => {
        //console.log(elem, voice.code)
        return elem.voice === voice.code;
      });
      console.log(speakerAudioWithPotentialGaps);
      for (let j=0;j<sentenceSpans.length;j++) {
        const sentenceSpan = sentenceSpans.item(j) as Element;
        //console.log(sentenceSpan)
        const sentId = this.drStoryService.parseSegId(sentenceSpan.getAttribute('id'), 'sentence');
        const matchingAudioObj = speakerAudioWithPotentialGaps.find( (elem) => {
          return elem.sentenceId === sentId;
        });
        if (matchingAudioObj) {
          this.listOfAudios[voiceIndex][sentId] = {audioUrl:matchingAudioObj.audioUrl, timing:matchingAudioObj.timing};
        } else { // if the audio has not yet been generated - start generating it.
          console.log(sentenceSpan.textContent, this.speaker.code, this.storyId);
          firstValueFrom(this.drStoryService.runTestQueue(
            sentenceSpan.textContent,
            voice.code, // needs to be for every speaker!
            'MP3',
            1,
            this.storyId,
            sentId));
        }
      }
    }
  }

  speakerExists(dialect:string, gender:string) {
    const speaker:string = dialect + ' ' + gender;
    return dialectToVoiceIndex.get(speaker) !== undefined;
  }

  speakerSelected(dialect:string, gender:string) {
    const speaker:string = dialect + ' ' + gender;
    const voiceIndex:number|undefined = dialectToVoiceIndex.get(speaker);
    if (voiceIndex!==undefined) {
      this.voiceIndex = voiceIndex;
      this.speaker = this.functioningVoices[this.voiceIndex];
    }
    if (this.audioPlaying) {
      this.playFromCurrentWord();
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
      console.log(prevSibling, prevSibling.textContent)
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

  getPreviousDisconnectedWord(word:Element) {

    let tmp = this.checkForPreviousSiblingSeg(word, 'word')//word.nextElementSibling;

    while (tmp) {
      console.log(tmp)
      if (this.disconnectedFromPreviousWord(tmp))
        return tmp;
      tmp = this.checkForPreviousSiblingSeg(tmp, 'word')
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

    const wordInd = this.getWordPositionIndex(word, childWordSpans)

    // for testing as ASR seems to split only on spaces.
    // **actual logic needed to be at the span Element level - see: disconnectedFromPreviousWord()
    //const sentenceText:string = this.recreateSentenceFromWord(childWordSpans.item(wordInd))
    //const numTimings = sentenceText.split(' ').length
    //console.log(numTimings)
    
    const timings = sentAudioObj.timing;
    const timingsArr = []

    let reSyncBuffer = 0;

    for (let i=0; i<timings.length; i++) {
      
      const timing = {};
      let start = 0 // if it is the first word
      const end = timings[i].end
      
      if (i>0) {
        start = timingsArr[i-1].end;
      }

      const length = end-start;

      timing['start'] = start;
      timing['end'] = end-reSyncBuffer;

      timingsArr.push(timing)
      reSyncBuffer+=length*this.speakerAlignmentConstant;
    }

    return timingsArr.slice(wordInd, timings.length);

  }

  // TODO : relocate to the story creation page
  synthRequest(text: string, speaker:Voice) {
    const audioObservable = firstValueFrom(this.synth.synthesiseText(
      text,
      speaker,
      //{ name: "Áine", gender: "female", shortCode: "anb", code: "ga_UL_anb_nemo", dialect: "ulster", algorithm: "nemo", },
      //{ name: "Síbéal", gender: "female", shortCode: "snc", code: "ga_CO_snc_nemo", dialect: "connacht", algorithm: "nemo", },
      false,
      'MP3',
      this.voiceSpeed)
    )
    console.log('request sent');
    return audioObservable
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

  checkForTooltipParent(node:Element) {
    if (node.classList.contains('tippy-content'))
      return node;
    let tmp = node;
    while (tmp.parentElement) {
      tmp = tmp.parentElement
      if (tmp.classList.contains('tippy-content'))
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

  checkForPreviousSiblingSeg(elem:Element, segType:string) {
    if (elem) {
      let tmp = elem.previousElementSibling;
      while (tmp) {
        //console.log(tmp)
        if (tmp.classList.contains(segType))
          return tmp
        tmp = tmp.previousElementSibling
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

  checkForPreviousSentence(sentSpan:Element) {
    const parentElem = sentSpan.parentElement
    let adjascentSection = parentElem.previousElementSibling
    console.log(adjascentSection)
    while (adjascentSection) {
      const sentences = Array.from(adjascentSection.querySelectorAll('.sentence')); // TODO : maybe factor out into function
      const firstSent = sentences[sentences.length-1]
      console.log(firstSent)
      //const nextSent = this.checkForNextSiblingSeg(firstSent, 'sentence')
      //console.log(nextSent)
      if (firstSent)
        return firstSent

      adjascentSection = adjascentSection.previousElementSibling 
    }
    return null;
  }

  playIndividualSentence(wordInSentence:Element) {
    this.currentSentence = this.checkForSegmentParent(wordInSentence.parentElement);
    const firstWordChild = this.currentSentence?.querySelector('.word');

    this.updateCurrentWord(firstWordChild);

    this.playContinuously=false;
    this.playFromCurrentWord();
  }

  playWordOnSeekStop() {
    // not convinced whether it should play automatically
    clearTimeout(this.clickTimeoutRef);
    this.pause(); // doesn't seem to stop audio from playing

    this.clickTimeoutRef = setTimeout( async () => {
      const audioObjPromise = this.synthRequest(this.currentWord.textContent, this.speaker);

      //this.currentWord?.dispatchEvent(new Event('mouseenter'));
      //hideAll();
      (this.currentWord as any)._tippy.show();

      setTimeout( (tooltipAnchor) => {
        console.log(tooltipAnchor)
        //tooltipAnchor.dispatchEvent(new Event('blur'));
        tooltipAnchor._tippy.hide();
      }, 3500, this.currentWord); // automatically rehide tooltip after 5 seconds

      this.clickTimeoutRef = setTimeout( async () => {
        const audioObj = await audioObjPromise;
        if (!this.audioPlaying) // auto-played audio is a lower priority than other audio
          this.playAudioObj(audioObj)
      }, 100) // start synthesising as it is likely the user is trying to play this word
    }, 400) // wait to start synthesising if the user is unlikely to stop on this word
    //
  }

  /*@HostListener('document:mouseenter', ['$event'])
  overrideHover(event:MouseEvent) {
    console.log(event);
  }*/

  @HostListener('document:keydown', ['$event'])
  overrideKeypresses(event:KeyboardEvent) {
    console.log(event);
    if ((event.type === 'keydown' && (['Space', 'ArrowRight', 'ArrowLeft', 'Enter'].includes(event.code)))) {
      event.preventDefault();
      if (event.code==='Space') {
        
        if (this.audioPlaying) {
          this.pause();
        } else if (this.audioPaused || this.currentWord!==null) {
          console.log(this.currentWord)
          this.playStory();
        }
      } if (['ArrowRight', 'ArrowLeft', 'Enter'].includes(event.code)) {
        
        // should also call this event when another word gets hovered
        //this.currentWord?.dispatchEvent(new Event('blur'));
        //hideAll();
        (this.currentWord as any)._tippy.hide();

        if (event.code==='ArrowRight') {

        this.pause();
        if (!event.ctrlKey) {
          console.log('seek right word')
          if (this.currentWord) {
            let nextWord:Element | null | undefined = this.getNextDisconnectedWord(this.currentWord);
            let parentSentence:Element | null = this.checkForSegmentParent(this.currentWord.parentElement);

            if (!nextWord) {
              
              if (!parentSentence) return
              
              let nextSent = this.checkForNextSiblingSeg(parentSentence, 'sentence');

              if (!nextSent) {
                nextSent = this.checkForNextSentence(parentSentence);
              }

              if (nextSent) {
                nextWord = nextSent?.querySelector('.word');
                parentSentence = nextSent;
              }
              
            }
            if (nextWord) {
              this.updateCurrentWord(nextWord);
              this.currentSentence = parentSentence;
              
              this.playWordOnSeekStop();
            }
          }
        } else {
          if (this.currentSentence) {
            //let parentSentence:Element | null = this.checkForSegmentParent(this.currentWord.parentElement);
            let nextSentence:Element | null = this.checkForNextSiblingSeg(this.currentSentence, 'sentence');

            if (!nextSentence)
              nextSentence = this.checkForNextSentence(this.currentSentence);
            
            if (nextSentence) {
              this.currentSentence = nextSentence;
              const firstWordChild = this.currentSentence?.querySelector('.word');

              this.updateCurrentWord(firstWordChild);

              this.playWordOnSeekStop();
            }
          } else {
            // TODO : go to first sentence of story
          }
        }
      } else if (event.code==='ArrowLeft') {

        this.pause();
        if (!event.ctrlKey) {
          console.log('seek left word')
          if (this.currentWord) {
            let previousWord:Element | null | undefined = this.getPreviousDisconnectedWord(this.currentWord);
            let parentSentence:Element | null = this.checkForSegmentParent(this.currentWord.parentElement);

            if (!previousWord) {
              
              if (!parentSentence) return
              
              let previousSent = this.checkForPreviousSiblingSeg(parentSentence, 'sentence');

              if (!previousSent) {
                previousSent = this.checkForPreviousSentence(parentSentence);
              }

              if (previousSent) {
                const previousSentWords = Array.from(previousSent?.querySelectorAll('.word'));
                previousWord = previousSentWords[previousSentWords.length-1];
                if (!this.disconnectedFromPreviousWord(previousWord) && previousSentWords.length>1)
                  previousWord = this.getPreviousDisconnectedWord(previousWord);
                parentSentence = previousSent;
              }
              
            }
            if (previousWord) {
              this.updateCurrentWord(previousWord);
              this.currentSentence = parentSentence;
              
              this.playWordOnSeekStop();
            }
          }
        } else {
          if (this.currentSentence) {
            let previousSent:Element | null = this.checkForPreviousSiblingSeg(this.currentSentence, 'sentence');
            let previousWord;

            if (!previousSent)
              previousSent = this.checkForPreviousSentence(this.currentSentence);
            
            if (previousSent) {
              this.currentSentence = previousSent;
              previousWord = this.currentSentence?.querySelector('.word');
            }

            if (previousWord) {
              this.updateCurrentWord(previousWord);
              this.playWordOnSeekStop();
            }
            
          }
        }
      } else if (event.code==='Enter') {
        if (this.currentWord) {
          console.log(event.ctrlKey)
          if (event.ctrlKey)
            this.playIndividualSentence(this.currentWord);
            //this.playFromCurrentWord();
          else {
            this.pause();
            this.playWord();
          }
        }
      }
      } 
    }
  }

  @HostListener('click', ['$event'])
  async checkSegmentClicked(event:PointerEvent) {

    console.log(event);

    const targetElem:Element = event.target as Element;
    
    const segment = this.checkForSegmentParent(targetElem)

    if (segment && segment.classList.contains('word')) {

      clearTimeout(this.clickTimeoutRef);

      this.pause();

      if (event.detail==2) { // double click
        console.log('double click!')
        this.playIndividualSentence(segment);
      } else {
        this.updateCurrentWord(segment)
        this.currentSentence = this.checkForSegmentParent(this.currentWord.parentElement);

        // audio starts generating here to avoid further delays with fetching the audio
        const audioObjPromise = this.synthRequest(this.currentWord.textContent, this.speaker);

        this.clickTimeoutRef = setTimeout( async () => {

            const audioObj = await audioObjPromise;
            this.playAudioObj(audioObj);
            //this.playWord();

          console.log(this.currentWord)
          console.log(this.currentSentence)
        }, 300); // 300ms is the delay before running the click function
      }
    } else {
      //this.closeSidenav(); // only for testing!
      hideAll();
      const tooltipParent = this.checkForTooltipParent(targetElem);
      const tooltip = tooltipParent?.firstElementChild;
      if (tooltip) {
        if (tooltip.classList.contains('grammarTooltipContent')) {
          const lemma = tooltip.getAttribute('data-lemma');
          const tags = tooltip.getAttribute('data-tags');
          const heading = tooltip.getAttribute('data-text');
          const storySentencesWithMatchingWords:Array<any> = await firstValueFrom(
            //this.drStoryService.getMatchingWords(tooltip.reference.getAttribute('lemma'), segment.getAttribute('tags'))
            this.drStoryService.getMatchingWords(lemma, tags)
          );
            
          const sentencesWithMatchingWords = []
          for (let storyGroup of storySentencesWithMatchingWords) {
            console.log(storyGroup)
            for (let sentenceObj of storyGroup.sentences) {
              
              const reformattedSentenceObj = {content: sentenceObj.sent, words: sentenceObj.words}
              console.log(reformattedSentenceObj);
              
              const reconstructedSentence = constructHTML(reformattedSentenceObj)

              reconstructedSentence.querySelectorAll('.word').forEach( (word:Element, index:number) => {
                if (index==0) reconstructedSentence.setAttribute('firstWordId', this.drStoryService.parseSegId(word.id, 'word'));
                word.removeAttribute('class'); // remove highlighting interactibility
                word.removeAttribute('id'); //
                //if (word.getAttribute('lemma')==lemma && word.getAttribute('tags')==tags) {
                if (word.getAttribute('lemma')==lemma) {
                  word.classList.add('currentWord');
                }
              })

              reconstructedSentence.setAttribute('drStoryId', sentenceObj.obj_id);
              reconstructedSentence.setAttribute('drStoryTitle', sentenceObj.title);
              reconstructedSentence.classList.add('matchingWordSentence');
              
              console.log(reconstructedSentence)
              sentencesWithMatchingWords.push(reconstructedSentence)
            }
          }
          console.log(sentencesWithMatchingWords)

          this.matchingWordSentenceObjs = sentencesWithMatchingWords;
          //this.updateCurrentWord();
          this.grammarHeading = heading;
          this.openSidenav();
        } else if (tooltip.classList.contains('storySwitchTooltip')) {
          const drStoryId = tooltip.getAttribute('data-drStoryId');
          const firstWordId = tooltip.getAttribute('data-firstWordId');
          console.log(drStoryId);
          if (drStoryId!=this.storyId)
            this.router.navigateByUrl(`dr-story-viewer?storyId=${drStoryId}&startingWordId=${firstWordId}`);
          else {
            const wordToJumpTo = document.querySelector(`#word${firstWordId}`);
            this.updateCurrentWord(wordToJumpTo);
          }
        }
      } else {
        if (!this.sideBar.contains(targetElem)) {
          this.closeSidenav(); // **unless the click is within the Sidenav
        }
      }
    } 

    
  }

  jumpToCurrentWord() {
    const topScreenOffset = 60;
    if (this.currentWord) {
      //(this.currentWord as HTMLElement).focus();
      const dimensions = this.currentWord?.getBoundingClientRect()
      if (dimensions) {
        if (
          dimensions.bottom > window.innerHeight ||
          dimensions.top - topScreenOffset < 0
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
          }, delay)
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
          setTimeout(() => this.seekNextWord(), 60) // added in the case of a very fast speaker (e.g Áine)
        }
      }
    }
  }

  /*parseSegId(id:string, _class:string) {
    return parseInt(id.replace(_class, ''));
  }*/

  async getCurrentAudioObject() {
    const sentId = this.drStoryService.parseSegId(this.currentSentence.getAttribute('id'), 'sentence')
    let audioObj = this.listOfAudios[this.voiceIndex][sentId];

    // if the audio was not ready when the story was loaded, check if it is ready now.
    /* TODO : implement fetching specific speaker-sentences from db in dr-story-service */
    if (!audioObj) {
      audioObj = await firstValueFrom(this.drStoryService.getSentenceAudio(this.storyId, sentId, this.speaker.code));
    }
    console.log(audioObj)

    // if the audio has not yet been created and, synthesise it and add it to the list.
    if (!audioObj) {
      audioObj = await this.synthRequest(this.currentSentence?.textContent, this.speaker);
      this.listOfAudios[this.voiceIndex][sentId] = audioObj;
    }

    return audioObj;
  }

  async playFromCurrentWord() {

    if (this.audio) this.pause(); // to avoid multiple audio instances at the same time
    clearTimeout(this.clickTimeoutRef);
    // clear/destroy current audio obj (?)

    this.audioPaused = false;

    const sentAudioObj = await this.getCurrentAudioObject();

    if (sentAudioObj) {

      this.timings = this.getWordTimings(this.currentWord, this.currentSentence, sentAudioObj)
      
      //const timing = this.timings.shift()
      const timing = this.timings[0]

      if (timing) {

        //const buffer = .05;
        //const start = Math.max(timing.start-buffer, 0);
        if (this.audioPaused) return;

        const start = timing.start
        
        const audio = document.createElement('audio')
        this.audio = audio;
        this.audio.src = sentAudioObj.audioUrl

        this.audio.ontimeupdate = () => {
          this.seekNextWord()
        }

        console.log(this.timings)

        //this.seekNextWord()

        this.audio.onended = async (event) => {

          this.audioPlaying = false;
          setTimeout( async () => {

            // TODO: delete the current audio element + listener (if needed (?))

            let nextSent = this.checkForNextSiblingSeg(this.currentSentence, 'sentence');
            if (!nextSent)
              nextSent = this.checkForNextSentence(this.currentSentence);
            if (nextSent) {
              this.currentSentence = nextSent;
              const firstWord = nextSent.querySelector('.word') // TODO : maybe factor out to function
              this.updateCurrentWord(firstWord);
              if (this.playContinuously) {
              
              console.log(nextSent)
              // if this section does not contain anymore sentences
              

                if (this.currentWord) {
                  if (!this.audioPaused && !this.audioPlaying) {
                    await this.playFromCurrentWord()
                  }
                }
              } else {
                //this.audioPaused = true;
              }
            } else {
              this.updateCurrentWord(null)
            }
        }, 400) // keep final word highlighted for a bit longer
        }

        this.audio.currentTime = start
        this.audio.play();
        this.audioPlaying = true;
      }
    }

  }

  playAudioObj(audioObj:any) {
    this.pause();
    const audio = document.createElement('audio')
    audio.src = audioObj.audioUrl;
    this.audio = audio;
    this.audio.play();
    //audio.remove();
  }

  async playWord() {
    this.playContinuously = false; // may not be necessary

    if (this.currentWord) {
      const audioObj = await this.synthRequest(this.currentWord.textContent, this.speaker);

      this.playAudioObj(audioObj);

    } 
  }

  // placeholder
  async play() {

  }

  // needs complete refactoring - the outer if statement can probably be done away with
  // different functions can be used for playing a sentence etc.
  async playStory() {

    if (!this.audioPaused) // if an individual sentence is being played, rather than the whole story
      this.playContinuously = true;
    
    if (!this.currentWord) {
      // below 2 lines really need to be refactored - should create a reference to the story root node
      // this.content is not enough as it does not reference the actual rendered elements
      this.currentSentence = document.querySelector('.storyContainer').querySelector('.sentence') // only for testing
      this.currentWord = this.currentSentence.querySelector('.word') // only for testing
      //
    } else if (!this.currentSentence) {
      this.currentSentence = this.checkForSegmentParent(this.currentWord.parentElement as Element);
    }
    //const sentAudioObj = await this.getCurrentAudioObject();
    //console.log(sentAudioObj)

    //this.timings = this.getWordTimings(this.currentWord, this.currentSentence, sentAudioObj)
    console.log(this.timings)
    this.setCurrentWord()
    //await this.playFromCurrentWord(sentAudioObj.audioUrl, true)
    await this.playFromCurrentWord()
  }

  pause() {
    if (this.audio) {
      this.audio.pause()
      this.audioPaused = true;
      this.audioPlaying = false;
    }
  }

  openSidenav() {
    this.setSideBarDisplayType('grammar'); // added to account for word frequencies option

    this.pageContent.classList.add('pushedContent');
    this.sideBar.classList.add('shownSideBar');
    //this.sideBar.innerHTML = '';
    const sideBarContent:Element = (this.sideBar.querySelector('#sideBarContent') as Element);
    sideBarContent.innerHTML = '';

    const heading = document.createElement('h2');
    heading.id = 'sideBarHeading'
    const body = document.createElement('div');
    body.id = 'sideBarBody'
    console.log(this.sideBar);
    console.log(heading, body)
    //heading.innerHTML = headingText;
    heading.innerHTML = this.grammarHeading;
    for (let sentence of this.matchingWordSentenceObjs) {
      body.append(document.createElement('br'));
      body.append(sentence);
      body.append(document.createElement('br'));
    }

    console.log(document.querySelectorAll('.matchingWordSentence'));
    
    //const singleton = createSingleton(tippyInstances, {delay: 1000});

    sideBarContent.append(document.createElement('br'));
    sideBarContent.append(heading);
    sideBarContent.append(document.createElement('hr'));
    sideBarContent.append(body);
    const tippyInstances = tippy('.matchingWordSentence', {
      allowHTML: true,
      content: (reference) => {
        return `<div class="storySwitchTooltip" data-firstWordId="${reference.getAttribute('firstWordId')}" data-drStoryId="${reference.getAttribute('drStoryId')}">Title: ${reference.getAttribute('drStoryTitle')}</div><div>click to go to story</div>`;
      },
      delay: [300, 50], // delay before it shows/hides
      interactive: true,
      duration: [400, 100], // show/hide transition duration
      theme: 'material',
      //arrow: false,
      offset: [0,5],
      hideOnClick: false,
    });
    //const singleton = createSingleton(tippyInstances);
  }

  closeSidenav() {
    this.pageContent.classList.remove('pushedContent');
    this.sideBar.classList.remove('shownSideBar')
  }

  setSideBarDisplayType(type:string) {
    this.sideBarDisplayType = type;
    if (this.sideBarDisplayType!='grammar') {
      const sideBarContent:Element = (this.sideBar.querySelector('#sideBarContent') as Element);
      sideBarContent.innerHTML = '';
      if (this.sideBarDisplayType=='dictionary') {
        this.cdr.detectChanges();
        console.log('here')
        console.log(this.dictionary)
        this.dictionary.wordLookedUp = this.grammarHeading;
        this.dictionary.lookupWord();
      }
    }
    
  }

  sideBarWordFreqSort(type:string) {
    this.sideBarDisplaySort = type;
  }

  openInstructionsPopup() {
    this.dialogRef = this.dialog.open(InstructionsDialogComponent, {
      data: {
        title: this.ts.l.dr_story_instructions_title,
        body: [
          this.ts.l.dr_story_controls_1,
          this.ts.l.dr_story_keyboard_nav_1,
          this.ts.l.dr_story_keyboard_nav_2,
          this.ts.l.dr_story_mouse_nav_1,
          this.ts.l.dr_story_mouse_nav_2,
          this.ts.l.dr_story_mouse_nav_3,
          this.ts.l.dr_story_mouse_nav_4
        ],
        //type: "create-dr-story",
        /*data: [
          //this.ts.l.enter_title,
          //this.dialectOptions,
          //[this.ts.l.title, this.ts.l.collections_default, this.ts.l.thumbnail, this.ts.l.make_public],
        ],*/
        cancelText: this.ts.l.closeSubmition,
      },
      width: "100vh",
    });
  }

}
