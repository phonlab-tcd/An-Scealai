import { Component, OnInit, Output, EventEmitter, NgZone, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize}  from '@angular/cdk/text-field';
import { TranslationService } from 'app/core/services/translation.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

import { firstValueFrom, from, take } from "rxjs";
import { User } from "app/core/models/user";
import { UserService } from "app/core/services/user.service";
//import { createClient } from "@supabase/supabase-js"
//import { Story } from "app/core/models/story";
import { DigitalReaderStory } from "app/core/models/drStory";

import { HttpClient } from "@angular/common/http";
//import { GrammarEngine } from 'lib/grammar-engine/grammar-engine';
//import { anGramadoir } from "lib/grammar-engine/checkers/an-gramadoir";
//import { CHECKBOXES, ERROR_TYPES, ErrorTag, GrammarChecker } from "lib/grammar-engine/types";
import { DigitalReaderStoryService } from "app/core/services/dr-story.service"

import { MatDialog, MatDialogRef } from "@angular/material/dialog";
//import { BasicDialogComponent } from "../../dialogs/basic-dialog/basic-dialog.component";
import { DigitalReaderStoryCreationDialogComponent } from "../../dialogs/dr-story-creation-dialog/dr-story-creation-dialog.component";

import { constructJSON } from '@phonlab-tcd/html2json';
import { objectUtil } from 'zod';

import config from '../anScealaiStoryCollectionsConf'
import { SynthesisService, Voice, functioningVoices } from 'app/core/services/synthesis.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-digital-reader',
  templateUrl: './digital-reader.component.html',
  styleUrls: ['./digital-reader.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DigitalReaderComponent implements OnInit {

  drStories: DigitalReaderStory[] = []
  user: User;
  tableData: Array<Object>;
  docxFile: File | null = null;
  convertedHTMLDoc: Document | null = null;
  segmentedHTMLDoc: Document | null = null;
  storyOptions:any = {};
  //drStory: DigitalReaderStory;
  dialogRef: MatDialogRef<unknown>;

  //dialectOptions:Array<string>
  adminCollectionOptions:Array<string> = []
  defaultCollectionSelections:any = {};
  storyState:string = '';

  //@Output() isFirstDrStory = new EventEmitter<boolean>();

  constructor(
    public ts : TranslationService,
    public auth: AuthenticationService,
    public userService: UserService,
    public drStoryService: DigitalReaderStoryService,
    public http: HttpClient,
    private dialog: MatDialog,
    private synth: SynthesisService,
    private snackbar: MatSnackBar,) {
        //this.dialectOptions = [this.ts.l.connacht, this.ts.l.munster, this.ts.l.ulster]
        
        console.log(this.ts.l)
        console.log(this.ts.l.adminStoryCollectionOpts)

        for (let option of config.adminStoryCollectionOpts) {
          //if (this.ts.l[option]) {
          this.adminCollectionOptions.push(option)
          //}
          this.defaultCollectionSelections[option] = false;
        }
        
    }

  async ngOnInit() {
    const user = this.auth.getUserDetails();
    if (!user) return;

    // get logged-in user details
    this.user = await firstValueFrom( this.userService.getUserById(user._id) );
    if (!this.user) return;

    console.log(this.user)
    console.log(this)

    this.drStoryService.init();

  }

  updateSentenceNumbers(targetContainer:Element, startNumber:number) {
    let tmp = targetContainer;
    let number = startNumber;
    while (tmp) {
      tmp.setAttribute('sentNumber', number.toString());
      (tmp.querySelector('b') as Element).textContent = number.toString() + ' ' // setting the number element
      number++;
      tmp = tmp.nextElementSibling;
    }
  }

  /*test() {
    console.log('input event fires anyway!')
  }*/

  createMergeButton() {
    const mergeButton = document.createElement('button');
    mergeButton.className="sentenceMerger";
    mergeButton.textContent="▲ merge ▼"; // TODO : change to use translation service
    mergeButton.tabIndex = -1;
    mergeButton.addEventListener('click', (event) => {
      this.mergeSentences(event.target as Element);
    })
    return mergeButton;
  }

  createNumberEl(sentNumber:string) {
    const newNumberEl = document.createElement('b');
    //const sentNumber = localContainer.getAttribute('sentNumber');
    newNumberEl.textContent = sentNumber + ' ';
    return newNumberEl
  }

  createSentencePreview(textContent:string) {
    const newSentencePreview = document.createElement('span');
    newSentencePreview.textContent = textContent;
    newSentencePreview.className = 'sentencePreview';
    newSentencePreview.contentEditable = "plaintext-only"
    newSentencePreview.spellcheck = false;

    newSentencePreview.addEventListener('beforeinput', (event) => {
      this.splitSentence(event);
    })

    return newSentencePreview;
  }

  createSentencePreviewContainer(mergeButton:Element, newNumberEl:Element, newSentencePreview:Element, sentNumber:string) {
    const newSentenceContainer = document.createElement('div');
    newSentenceContainer.setAttribute('sentNumber', sentNumber)
    newSentenceContainer.append(mergeButton);
    newSentenceContainer.append(document.createElement('br'))
    newSentenceContainer.append(newNumberEl);
    newSentenceContainer.append(newSentencePreview);
    return newSentenceContainer;
  } 

  splitSentence(event:InputEvent) {
    
    const target:Element = event.target as Element;

    if (event.inputType==="insertLineBreak") {
      event.preventDefault();
      const breakIndex:number = getSelection()?.anchorOffset as number;
      const fullTextContent:string = target.textContent;
      if (breakIndex > 0 && breakIndex < fullTextContent.length) {
        const textPreSplit:string = fullTextContent?.slice(0, breakIndex);
        const textPostSplit:string = fullTextContent?.slice(breakIndex, fullTextContent.length);

        console.log(textPreSplit);
        console.log(textPostSplit);

        const localContainer = target.parentElement as Element;
        const parentContainer = localContainer.parentElement as Element;

        target.textContent = textPostSplit;

        const mergeButton = this.createMergeButton();

        const sentNumber:string = localContainer.getAttribute('sentNumber') as string;
        const newNumberEl = this.createNumberEl(sentNumber);

        // create new editable element containing the segment before the break
        const newSentencePreview = this.createSentencePreview(textPreSplit)

        const newSentenceContainer = this.createSentencePreviewContainer(mergeButton, newNumberEl, newSentencePreview, sentNumber);
        
        parentContainer.insertBefore(newSentenceContainer, localContainer);

        this.updateSentenceNumbers(localContainer, parseInt(sentNumber)+1);

      }
    } else {
      console.log('only return is allowed!')
      event.preventDefault();
    }
  }

  mergeSentences(target:Element) {
    const localContainer:Element = target.parentElement as Element;
    const currentSentence:Element = localContainer?.querySelector('.sentencePreview') as Element;

    const previousLocalContainer:Element = localContainer?.previousElementSibling as Element;

    if (previousLocalContainer) {
      const previousSentence:Element = previousLocalContainer.querySelector('.sentencePreview') as Element;
      const sentNumber:string = previousLocalContainer.getAttribute('sentNumber') as string;

      localContainer.remove();
      previousSentence.textContent = (previousSentence?.textContent as string) + (currentSentence?.textContent as string);

      this.updateSentenceNumbers(previousLocalContainer, parseInt(sentNumber));
    } 
  }

  async convertDocxToHTML() {

    if (this.docxFile) {
        this.convertedHTMLDoc = await this.drStoryService.processUploadedFileAndExtractSents(this.docxFile)

        if (this.convertedHTMLDoc instanceof Document) {
            console.log('file converted successfully!')
        } else {
            this.docxFile = null
            this.storyState = ''
        }
    }

  }

  synthesiseStory(storyId:string, sentenceSpans:NodeListOf<Element>) {
    
    for (let voice of functioningVoices) {
      
      for (let j=0;j<sentenceSpans.length;j++) {
        const sentenceSpan = sentenceSpans.item(j) as Element;
        
        const sentId = this.drStoryService.parseSegId(sentenceSpan.id, 'sentence');
        
        firstValueFrom(this.drStoryService.runTestQueue(
          sentenceSpan.textContent,
          voice.code,
          'MP3',
          1,
          storyId,
          sentId)
        );
      }
    }
  }

  // TODO : Migrate to use queuing API
  /*async synthesiseStory(htmlBody:Document, storyId:string) {

    //const parser = new DOMParser;

    //const html = parser.parseFromString(htmlString, 'text/html');
    //const html = this.convertedHTMLDoc?.body;

    const firstSentSpans = htmlBody?.querySelectorAll('.sentence')
    for (let i=0;i<firstSentSpans.length;i++) {
      const sent = firstSentSpans.item(i)
      const sentId:number = this.drStoryService.parseSegId(sent.getAttribute('id'), 'sentence');
      console.log(sentId, sent.getAttribute('id'))

      const sentText:string = sent.textContent;
      for (let voice of voices) {
        const audioPromise:Promise<any> = firstValueFrom(this.synth.synthesiseText(sentText, voice, false, undefined, 1));

        const audioObservable = from(audioPromise);

        //this.drStoryService.storeSynthAudio(storyId, sentId, audioPromise, voice.code)
        this.drStoryService.storeSynthAudio(storyId, sentId, audioObservable, voice.code)
      }
    }
  }*/

  async createNewStory() {
    this.storyState = ''

    console.log('creating dr-story...')
    //this.isFirstDrStory.emit(this.drStories.length == 0);
    this.dialogRef = this.dialog.open(DigitalReaderStoryCreationDialogComponent, {
      data: {
        title: this.ts.l.story_details,
        type: "create-dr-story",
        data: [
          this.ts.l.enter_title,
          //this.dialectOptions,
          this.adminCollectionOptions,
          [this.ts.l.title, this.ts.l.collections_default, this.ts.l.thumbnail, this.ts.l.make_public],
        ],
        collections: this.defaultCollectionSelections,
        userRole: this.user.role,
        confirmText: this.ts.l.save_details,
        cancelText: this.ts.l.cancel,
      },
      width: "80vh",
    });

    //console.log(this.dialogRef)
    //console.log(this.user.role)

    this.dialogRef.afterClosed().subscribe(async (res: any) => {

      this.dialogRef = undefined;
      console.log(res)
      if (res) {
        
        if (res.title) {
          console.log(res)
          
          let collections = []
          for (let key in res.collections) {
            if (res.collections[key] === true) {
              collections.push(key)
            }
          }

          const user = this.auth.getUserDetails();
          console.log(user)
          
          if (Array.isArray(collections) && collections.length===0 && user && user.role=='ADMIN')
            collections = ['other_stories']

          let thumbnail = ''
          if (res.thumbnail) thumbnail = res.thumbnail

          //if (Array.isArray(dialects) && dialects.length!==0) {

          this.storyState = 'converting'
          //console.log(this.storyState=='processing')
          //console.log(this.storyState==='processing')

          await this.convertDocxToHTML()

          this.storyState = 'converted'
          
          console.log(user)
          if (!user) {
              console.log("Can't save story, current user is null");
              this.storyState = ''
              return;
          }

          this.storyOptions = {
            title: res.title,
            collections: collections,
            thumbnail: thumbnail,
            //story: story,
            public: res.public
          }

          this.snackbar.open(this.ts.l.enter_to_split_message, this.ts.l.okay, {duration: 6000});

          /* Temporarily commented out for testing
          if (this.convertedHTMLDoc) {
              //console.log(this.convertedHTMLDoc)
              const story = constructJSON(this.convertedHTMLDoc.body)

              console.log(story)

              this.drStoryService
                  //.saveDRStory(res.title, dialects, story, res.public)
                  .saveDRStory(res.title, collections, thumbnail, story, res.public)
                  .subscribe({
                  next: (response) => {
                      console.log('a response was received')
                      this.storyState = 'processed'
                      this.synthesiseStory(this.convertedHTMLDoc, response.id);
                  },
                  error: () => {
                      alert("Not able to create a new story");
                      this.storyState = ''
                  },
                  });
            }*/
          //} else {
            //alert(this.ts.l.dialect_required)
            //this.storyState = ''
          //}
        } else {
          alert(this.ts.l.title_required);
          this.storyState = ''
        }
      }
    });
  }

  async confirmSentencesAndStoreStory() {

    console.log('gets to here!')

    const sentencePreviewContainer = document.querySelector('.sentContainer');
    const sentencePreviewSpans = sentencePreviewContainer?.querySelectorAll('.sentencePreview');

    this.storyState = 'processing'

    this.drStoryService.segmentedSentences = Array.from(
      sentencePreviewSpans as NodeListOf<Element>).map((elem) => {
        return {text: elem.textContent?.trim()};
    });

    console.log(this.drStoryService.segmentedSentences)

    // TODO : execute segmentation with modified sentences
    this.segmentedHTMLDoc = await this.drStoryService.getUploadedFileWords();

    console.log(this.segmentedHTMLDoc)
    console.log(this.storyOptions)

    if (this.segmentedHTMLDoc && this.storyOptions) {
      //console.log(this.convertedHTMLDoc)
      const story = constructJSON(this.segmentedHTMLDoc.body)

      console.log(story)

      this.drStoryService
          //.saveDRStory(res.title, dialects, story, res.public)
          .saveDRStory(this.storyOptions.title, this.storyOptions.collections, this.storyOptions.thumbnail, story, this.storyOptions.public)
          .subscribe({
          next: (response) => {
              console.log('a response was received')
              this.storyState = 'processed'
              //this.synthesiseStory(this.segmentedHTMLDoc, response.id);
              this.synthesiseStory(response.id, this.segmentedHTMLDoc?.querySelectorAll('.sentence'));
          },
          error: () => {
              alert("Not able to create a new story");
              this.storyState = ''
          },
          });
    }
  }

  /*async saveStory(debounceId: number | "modal", finishedWritingTime: Date) {
    const saveAttempt = new Date();
    this.mostRecentAttemptToSaveStory = saveAttempt;

    if (!this.drStory._id) {
      return window.alert("Cannot save story. The id is not known");
    }

    // get story html text without highlighting markup
    //const unhighlightedHtmlText = this.stripGramadoirAttributesFromHtml( clone(this.story.htmlText) );

    const updateData = {
      title: this.drStory.title,
      dialect: this.drStory.dialect,
      content: this.drStory.content,
      //htmlText: unhighlightedHtmlText,
    };

    //this.engagement.addSaveStoryEvent(this.story);

    // Save story to the DB
    try {
      await firstValueFrom( this.drStoryService.updateStory(updateData, this.drStory._id) );
      if (debounceId === this.saveStoryDebounceId) {
        this.storySaved = true;
      } else if (debounceId === "modal") {
        this.storySaved = true;
      }
    } catch (error) {
      window.alert("Error while trying to save story: " + (error as Error).message);
      throw error;
    }
    // Set story status to saved if dates match
    try {
      if (saveAttempt === this.mostRecentAttemptToSaveStory) {
        this.storySaved = true;
      }
    } catch (error) {
      window.alert("Error setting storySaved to true: " + (error as Error).message);
      throw error;
    }
    return;
  }*/

  async supabaseLogin(supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'dr_test@example.com',
      password: 'abair_digital_reader_test',
    })
  }

  async testQueryDB(supabase) {
    const { data, error } = await supabase
    .from('dr_stories')
    .select('id, name')
    return data
  }

  processUploadedFile(files: FileList) {
    // in the future could make it so that the file is not removed if the dialog is simply opened again
    this.docxFile = files.item(0)
    console.log(this.docxFile)
  }

}
