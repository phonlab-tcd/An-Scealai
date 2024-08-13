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
import { SynthesisService, Voice, voices } from 'app/core/services/synthesis.service';

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
  //drStory: DigitalReaderStory;
  dialogRef: MatDialogRef<unknown>;

  dialectOptions:Array<string>
  adminCollectionOptions:Array<string> = []
  defaultCollectionSelections:Object = {};
  storyState:string = '';

  @Output() isFirstDrStory = new EventEmitter<boolean>();

  constructor(
    public ts : TranslationService,
    public auth: AuthenticationService,
    public userService: UserService,
    public drStoryService: DigitalReaderStoryService,
    public http: HttpClient,
    private dialog: MatDialog,
    private synth: SynthesisService,
    private _ngZone: NgZone,) {
        this.dialectOptions = [this.ts.l.connacht, this.ts.l.munster, this.ts.l.ulster]
        //console.log(adminStoryCollectionOpts)
        
        console.log(this.ts.l)
        console.log(this.ts.l.adminStoryCollectionOpts)
        /*for (let option in this.ts.l.adminStoryCollectionOpts) {
          this.adminCollectionOptions.push(option);
          this.defaultCollectionSelections[option] = false;
        }*/

        for (let option of config.adminStoryCollectionOpts) {
          //if (this.ts.l[option]) {
          this.adminCollectionOptions.push(option)
          //}
          this.defaultCollectionSelections[option] = false;
        }
        /*this.adminCollectionOptions = [
          this.ts.l.leaving_cert_stories,
          this.ts.l.aesop_fables,
          this.ts.l.other_stories,
          this.ts.l.simple_versions_old_stories
        ]*/
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

    test() {
      console.log('input event fires anyway!')
    }
  
    splitSentence(event:InputEvent) {
      console.log(event)
      const target:HTMLInputElement = event.target as HTMLInputElement;

      if (event.inputType==="insertLineBreak") {
        event.preventDefault();
        const breakIndex:number = getSelection()?.anchorOffset;
        const fullTextContent:string = target.textContent;
        if (breakIndex > 0 && breakIndex < fullTextContent.length) {
          const textPreSplit:string = fullTextContent?.slice(0, breakIndex);
          const textPostSplit:string = fullTextContent?.slice(breakIndex, fullTextContent.length);

          console.log(textPreSplit);
          console.log(textPostSplit);

          const localContainer = target.parentElement as Element;
          const parentContainer = localContainer.parentElement as Element;

          target.textContent = textPostSplit;

          const newSentenceContainer = document.createElement('div');

          const mergeButton = document.createElement('button');
          mergeButton.className="sentenceMerger"
          mergeButton.textContent="merge" // TODO : change to use translation service

          const newNumberEl = document.createElement('b');
          const sentNumber = localContainer.getAttribute('sentNumber');
          newNumberEl.textContent = sentNumber + ' ';

          const newSentencePreview = document.createElement('span');
          newSentencePreview.textContent = textPreSplit;
          newSentencePreview.className = 'sentencePreview';
          newSentencePreview.contentEditable = "plaintext-only"
          newSentencePreview.spellcheck = false;
          //newSentencePreview.onbeforeinput = this.splitSentence;

          newSentencePreview.addEventListener('beforeinput', (event) => {
            this.splitSentence(event);
          })

          newSentenceContainer.setAttribute('sentNumber', sentNumber.toString())
          newSentenceContainer.append(mergeButton);
          newSentenceContainer.append(document.createElement('br'))
          newSentenceContainer.append(newNumberEl);
          newSentenceContainer.append(newSentencePreview);
          
          //parentContainer.insertBefore(newSentencePreview, target);
          parentContainer.insertBefore(newSentenceContainer, localContainer);

          console.log(localContainer);
          console.log(sentNumber);
          console.log(parseInt(sentNumber));
          this.updateSentenceNumbers(localContainer, parseInt(sentNumber)+1);

          // below was its own function, however was getting some weird errors
          /*let tmp = localContainer;
          let number = parseInt(sentNumber)+1;
          while (tmp) {
            tmp.setAttribute('sentNumber', number.toString());
            (tmp.firstChild as Element).textContent = number.toString() + ' ' // setting the number element
            number++;
            tmp = tmp.nextElementSibling;
          }*/

        }
      } else {
        console.log('disallowed!')
        event.preventDefault();
      }
    }

    /*test2(target:HTMLInputElement) {
      //(input)="this.style.height = ''; this.style.height = this.scrollHeight +'px'; console.log(this.style)"
      target.style.height = target.scrollHeight +'px';
    }*/

  async ngOnInit() {
    const user = this.auth.getUserDetails();
    if (!user) return;

    // get logged-in user details
    this.user = await firstValueFrom( this.userService.getUserById(user._id) );
    if (!this.user) return;

    console.log(this.user)
    console.log(this)

  }

  async convertDocxToHTML() {

    if (this.docxFile) {
        this.convertedHTMLDoc = await this.drStoryService.processUploadedFile(this.docxFile)

        if (this.convertedHTMLDoc instanceof Document) {
            console.log('file converted successfully!')
        } else {
            this.docxFile = null
            this.storyState = ''
        }
    }

  }

  // TODO : Migrate to use queuing API
  async synthesiseStory(htmlBody:Document, storyId:string) {

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
        /*.subscribe({
        next(response) {console.log(response.id)}
      });*/
      }
    }
  }

  async createNewStory() {
    this.storyState = ''

    console.log('creating dr-story...')
    this.isFirstDrStory.emit(this.drStories.length == 0);
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

    console.log(this.dialogRef)
    console.log(this.user.role)

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

          this.storyState = 'processing'
          console.log(this.storyState=='processing')
          console.log(this.storyState==='processing')

          await this.convertDocxToHTML()

          
          console.log(user)
          if (!user) {
              console.log("Can't save story, current user is null");
              this.storyState = ''
              return;
          }
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
