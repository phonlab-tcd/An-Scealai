import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslationService } from 'app/core/services/translation.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

import { firstValueFrom } from "rxjs";
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

@Component({
  selector: 'app-digital-reader',
  templateUrl: './digital-reader.component.html',
  styleUrls: ['./digital-reader.component.scss']
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
    private dialog: MatDialog) {
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
            
          /*let dialects:Array<string> = [];
          console.log(res.dialects)
          for (const key in res.dialects) {
            console.log(key)
            console.log(res.dialects[key])
            if (res.dialects[key] === true)
                
                dialects.push(key)
          }*/

          /*console.log(Array.isArray(dialects) && dialects.length!==0)
          console.log(dialects)
          console.log(Array.isArray(dialects))
          console.log(dialects.length)*/
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
          
          if (this.convertedHTMLDoc) {
              //console.log(this.convertedHTMLDoc)
              const story = constructJSON(this.convertedHTMLDoc.body)

              console.log(story)

              this.drStoryService
                  //.saveDRStory(res.title, dialects, story, res.public)
                  .saveDRStory(res.title, collections, thumbnail, story, res.public)
                  .subscribe({
                  next: () => {
                      console.log('a response was received')
                      this.storyState = 'processed'
                  },
                  error: () => {
                      alert("Not able to create a new story");
                      this.storyState = ''
                  },
                  });
              }
          /*} else {
            //alert(this.ts.l.dialect_required)
            this.storyState = ''
          }*/
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
