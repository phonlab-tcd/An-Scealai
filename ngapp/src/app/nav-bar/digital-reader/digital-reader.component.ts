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
import { BasicDialogComponent } from "../../dialogs/basic-dialog/basic-dialog.component";

import { constructJSON } from '@phonlab-tcd/html2json';

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
  drStory: DigitalReaderStory;
  dialogRef: MatDialogRef<unknown>;
  @Output() isFirstDrStory = new EventEmitter<boolean>();

  constructor(
    public ts : TranslationService,
    public auth: AuthenticationService,
    public userService: UserService,
    public drStoryService: DigitalReaderStoryService,
    public http: HttpClient,
    private dialog: MatDialog) {

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

    //only for testing
    if (this.docxFile) {
        this.convertedHTMLDoc = await this.drStoryService.processUploadedFile(this.docxFile)

        if (this.convertedHTMLDoc instanceof Document) {
            console.log('file converted successfully!')
        } else {
            alert('could not convert docx file')
        }
    }

  }

  async createNewStory() {

    console.log('creating dr-story...')
    this.isFirstDrStory.emit(this.drStories.length == 0);
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.story_details,
        type: "create-dr-story",
        data: [
          this.ts.l.enter_title,
          [{dialect: this.ts.l.connacht, ind: 1}, {dialect: this.ts.l.munster, ind: 2}, {dialect: this.ts.l.ulster, ind: 3}],
          [this.ts.l.title, this.ts.l.dialects],
        ],
        confirmText: this.ts.l.save_details,
        cancelText: this.ts.l.cancel,
      },
      width: "50vh",
    });

    this.dialogRef.afterClosed().subscribe(async (res: any) => {

      this.dialogRef = undefined;
      console.log(res)
      if (res) {
        
        if (res[0]) {
            console.log(res)
          if (res.length>1) {
            await this.convertDocxToHTML()

            let dialect = ["connemara"];
            if (!res[1]) dialect = []
            if (res[2]) dialect.push("kerry");
            if (res[3]) dialect.push("donegal");
            const user = this.auth.getUserDetails();
            console.log(user)
            if (!user) {
                console.log("Can't save story, current user is null");
                return;
            }
            
            if (this.convertedHTMLDoc) {
                const story = constructJSON(this.convertedHTMLDoc.body)

                console.log(story)

                this.drStoryService // maybe import RecursiveHtmlElem (?)
                    .saveDRStory(res[0], dialect, story, true) // [dialect] only for testing - single dialect for now
                    .subscribe({
                    next: () => {
                        console.log('a response was received')
                    },
                    error: () => {
                        alert("Not able to create a new story");
                    },
                    });
                }
          } else {
            alert(this.ts.l.dialect_required)
          }
        } else {
          alert(this.ts.l.title_required);
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
