import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/core/services/translation.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

import { firstValueFrom } from "rxjs";
import { User } from "app/core/models/user";
import { UserService } from "app/core/services/user.service";
//import { createClient } from "@supabase/supabase-js"
//import { Story } from "app/core/models/story";

import { HttpClient } from "@angular/common/http";
//import { GrammarEngine } from 'lib/grammar-engine/grammar-engine';
//import { anGramadoir } from "lib/grammar-engine/checkers/an-gramadoir";
//import { CHECKBOXES, ERROR_TYPES, ErrorTag, GrammarChecker } from "lib/grammar-engine/types";
import { DigitalReaderStoryService } from "app/core/services/dr-story.service"

@Component({
  selector: 'app-digital-reader',
  templateUrl: './digital-reader.component.html',
  styleUrls: ['./digital-reader.component.scss']
})
export class DigitalReaderComponent implements OnInit {

  user: User;
  tableData: Array<Object>;
  htmlFolder: File | null = null;

  constructor(
    public ts : TranslationService,
    public auth: AuthenticationService,
    public userService: UserService,
    public drStoryService: DigitalReaderStoryService,
    public http: HttpClient) {

    }

  async ngOnInit() {
    const user = this.auth.getUserDetails();
    if (!user) return;

    // get logged-in user details
    this.user = await firstValueFrom( this.userService.getUserById(user._id) );
    if (!this.user) return;

    console.log(this.user)
    console.log(this)

    /*const supabaseUrl = "https://pdntukcptgktuzpynlsv.supabase.co"
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbnR1a2NwdGdrdHV6cHlubHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIwMzA4ODAsImV4cCI6MTk3NzYwNjg4MH0.YrMhL9v3722XQUjpVlkj98waPI6c6xJ57zdmk7HUu0c"

    const supabase = createClient(supabaseUrl, supabaseKey)

    await this.supabaseLogin(supabase)

    const response = await this.testQueryDB(supabase)

    console.log(response)

    this.tableData = response //for testing*/

    //this.getStory()

    const testInput = "scéal sách fada. Scéal le neart abairt. Scéal le carachtair escapable mar ' seo. scéal le \" seo chomh maith."
    console.log(testInput)

    this.drStoryService.tokenizeSentence(testInput);

    //this.drStoryService.testChildProcess();

    const segmentedSentences = await this.drStoryService.segmentText(document)

    console.log(segmentedSentences)

    //console.log(this.drStoryService.testChildProcess());



    // check text for grammar errors
      /*this.grammarEngine.check$(testInput).subscribe({
        next: (tag: ErrorTag) => {
          // show error highlighting if button on
          if (this.showErrorTags) {
            this.quillHighlighter.addTag(tag);
          }
        },
        error: function (err) {console.error("ERROR GETTING THE 'CHECK()' RES: ", err)},
        complete: () => {
          //if (!this.quillHighlighter) return;

          //save any grammar errors with associated sentences to DB
          //this.grammarEngine.saveErrorsWithSentences(this.story._id).then(console.log, console.error);
          //this.grammarLoaded = true;
        },
      })*/

  }
  

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
    this.htmlFolder = files.item(0)
    console.log(this.htmlFolder)
  }

  getHtmlDoc() {

  }

}
